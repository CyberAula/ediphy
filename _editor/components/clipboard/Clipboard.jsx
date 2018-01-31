import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import Alert from '../common/alert/Alert';
import { isContainedView, isSlide, isBox, isSortableBox, isView } from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER, ID_PREFIX_RICH_MARK } from '../../../common/constants';
import { ADD_BOX } from '../../../common/actions';
import { randomPositionGenerator, retrieveImageFromClipboardAsBase64, getCKEDITORAdaptedContent } from './clipboard.utils';
import i18n from 'i18next';
/** *
 * Component for managing the clipboard
 */
export default class Clipboard extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
        this.copyListener = this.copyListener.bind(this);
        this.pasteListener = this.pasteListener.bind(this);
        this.cutListener = this.cutListener.bind(this);
    }

    /**
     * After component mounts
     * Sets listener
     */

    copyListener(event) {
        let activeElement = document.activeElement;
        let focus = activeElement.className;
        if (event.clipboardData) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1 && activeElement.tagName !== 'TEXTAREA') { // focus.indexOf('tituloCurso') === -1 &&
                    event.preventDefault();
                    let box = this.props.boxes[this.props.boxSelected];
                    let toolbar = this.props.toolbars[this.props.boxSelected];
                    let childBoxes = {};
                    let childToolbars = {};
                    if (box.sortableContainers) {
                        for (let sc in box.sortableContainers) {
                            for (let b in box.sortableContainers[sc].children) {
                                let bid = box.sortableContainers[sc].children[b];
                                childBoxes[bid] = this.props.boxes[bid];
                                childToolbars[bid] = this.props.toolbars[bid];
                            }
                        }
                    }
                    let copyData = { box, toolbar, childBoxes, childToolbars };
                    event.clipboardData.setData("text/plain", JSON.stringify(copyData));
                    return true;
                }
            }
        }
        return false;
    }

    cutListener(event) {
        let fromPlugin = this.copyListener(event);
        if (fromPlugin) {
            let box = this.props.boxes[this.props.boxSelected];
            this.props.onBoxDeleted(box.id, box.parent, box.container);
        }

    }

    pasteListener(event) {
        let activeElement = document.activeElement;
        let focus = activeElement.className;
        if (event.clipboardData) {
            // Check if copied data is plugin
            let data = "";
            try {
                let clipboardData = event.clipboardData.getData("text");
                data = JSON.parse(clipboardData);
            } catch (err) {
                // eslint-disable-next-line no-console
                console.log(err);
            }

            let page = isContainedView(this.props.containedViewSelected) ?
                this.props.containedViews[this.props.containedViewSelected] :
                (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
            if (page) {
                let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                let id = ID_PREFIX_BOX + Date.now();
                let isTargetSlide = isSlide(page.type);
                let parent = isTargetSlide ? page.id : page.boxes[0];
                let container = isTargetSlide ? 0 : containerId;
                let ids = { id, parent, container };

                // Copied data is an EditorBox
                if (data && data.box && data.toolbar) {
                    // Focus is outside a text box
                    if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1 && activeElement.tagName !== 'TEXTAREA') {
                        // Paste plugin
                        event.preventDefault();
                        event.stopPropagation();
                        // TODO Drag with Ctrl key held
                        let pluginName = data.toolbar.config.name;
                        let limitToOneInstance = data.toolbar.config.limitToOneInstance;

                        if (limitToOneInstance) {
                            let same = Object.keys(this.props.boxes).filter((key)=>{
                                return (this.props.boxes[key].parent === parent && this.props.toolbars[key].config.name === pluginName);
                            });
                            if (same.length > 0) {
                                let alert = (<Alert className="pageModal"
                                    show
                                    hasHeader
                                    backdrop={false}
                                    title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px' }}>warning</i>{ i18n.t("messages.alert") }</span> }
                                    closeButton onClose={()=>{this.setState({ alert: null });}}>
                                    <span> {i18n.t('messages.instance_limit')} </span>
                                </Alert>);
                                this.setState({ alert: alert }); return;
                            }
                        }

                        let transformedBox = this.transformBox(data.box, ids, isTargetSlide, data.box.resizable);
                        let transformedToolbar = this.transformToolbar(data.toolbar, ids, isTargetSlide, data.box.resizable);
                        let transformedChildren = {};
                        if (data.childBoxes && data.childToolbars) {
                            for (let bid in transformedBox.newIds) {
                                let idsChild = { id: transformedBox.newIds[bid], parent: ids.id, container: data.childBoxes[bid].container };
                                let transformedBoxChild = this.transformBox(data.childBoxes[bid], idsChild, false, false);
                                let transformedToolbarChild = this.transformToolbar(data.childToolbars[bid], idsChild, false, false);
                                transformedChildren[transformedBox.newIds[bid]] = { box: transformedBoxChild.newBox, toolbar: transformedToolbarChild };
                            }
                        }
                        this.props.onBoxPasted(ids, transformedBox.newBox, transformedToolbar, transformedChildren);

                        // Inside a text box (CKEditor or input)

                    } else {
                        // Let normal paste work
                        // event.preventDefault();
                    }

                // Copied data is not an EditorBox
                } else if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1 && activeElement !== 'TEXTAREA') {
                    event.preventDefault();
                    let imageBlob;
                    let initialParams = {
                        parent: parent, //
                        container: container,
                        position: isTargetSlide ? {
                            type: "absolute",
                            x: randomPositionGenerator(20, 40),
                            y: randomPositionGenerator(20, 40),
                        } : { type: 'relative', x: "0%", y: "0%" },
                    };
                    // If it is an image
                    let noImage = true;
                    try {
                        noImage = retrieveImageFromClipboardAsBase64(event, (url) => {
                            if (url) {
                                initialParams.url = url; // URLObj.createObjectURL(imageBlob);
                                Ediphy.Plugins.get("BasicImage").getConfig().callback(initialParams, ADD_BOX);
                                return;
                            }
                        }
                            , false);
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(err);
                    }
                    if (noImage) {
                        initialParams.text = getCKEDITORAdaptedContent(event.clipboardData.getData("text/html") || event.clipboardData.getData("text/plain"));

                        Ediphy.Plugins.get("BasicText").getConfig().callback(initialParams, ADD_BOX);
                    }
                }
            }
        }
    }

    transformBox(box, ids, isTargetSlide, isOriginSlide) {
        let newIds = {};
        let newContainerBoxes = {};
        if (box.sortableContainers) {
            newContainerBoxes = JSON.parse(JSON.stringify(box.sortableContainers));
            for (let sc in newContainerBoxes) {
                for (let b in newContainerBoxes[sc].children) {
                    let newID = newContainerBoxes[sc].children[b] + Date.now();
                    newIds[newContainerBoxes[sc].children[b]] = newID;
                    newContainerBoxes[sc].children[b] = newID;
                }
            }
        }
        let newBox = Object.assign({}, box, {
            container: ids.container,
            id: ids.id,
            parent: ids.parent,
            position: isTargetSlide ? {
                type: "absolute",
                x: randomPositionGenerator(20, 40),
                y: randomPositionGenerator(20, 40),
            } : { type: "relative", x: "0%", y: "0%" },
            resizable: isTargetSlide,
            row: 0,
            col: 0,
            level: isBox(ids.parent) ? 1 : 0,
            sortableContainers: newContainerBoxes,
            containedViews: box.containedViews.filter(cv=> this.props.containedViews[cv]),
        });
        return { newBox, newIds };

    }

    transformToolbar(toolbar, ids, isTargetSlide, isOriginSlide) {
        let newToolbar = Object.assign({}, toolbar, { id: ids.id });
        if (newToolbar.state && newToolbar.state.__marks) {
            let newMarks = {};
            for (let mark in newToolbar.state.__marks) {
                let newId = mark + "_1";
                if (newToolbar.state.__marks[mark].connection) {
                    if ((isContainedView(newToolbar.state.__marks[mark].connection) &&
                    this.props.containedViews[newToolbar.state.__marks[mark].connection]) ||
                        (isView(newToolbar.state.__marks[mark].connection) &&
                        this.props.navItems[newToolbar.state.__marks[mark].connection]) ||
                        newToolbar.state.__marks[mark].connetMode === 'external') {
                        newMarks[newId] = Object.assign({}, newToolbar.state.__marks[mark], { id: newId });
                    }
                }
            }
            newToolbar.state.__marks = newMarks;
        }
        if (isTargetSlide !== isOriginSlide) {
            let config = Ediphy.Plugins.get(newToolbar.config.name).getConfig();
            if (isTargetSlide) {
                newToolbar.controls.main.accordions.__sortable.buttons.__width.units = "%";
                newToolbar.controls.main.accordions.__sortable.buttons.__width.value =
                newToolbar.controls.main.accordions.__sortable.buttons.__width.displayValue = parseFloat(config.initialWidthSlide);
                newToolbar.controls.main.accordions.__sortable.buttons.__height.units = "%";
                newToolbar.controls.main.accordions.__sortable.buttons.__height.value =
                newToolbar.controls.main.accordions.__sortable.buttons.__height.displayValue = parseFloat(config.initialHeightSlide);
            } else {
                newToolbar.controls.main.accordions.__sortable.buttons.__height.value =
                newToolbar.controls.main.accordions.__sortable.buttons.__height.displayValue = parseFloat(config.initialHeight);
                newToolbar.controls.main.accordions.__sortable.buttons.__height.units = config.initialHeight.indexOf('px') !== -1 ? "px" : "%";
                newToolbar.controls.main.accordions.__sortable.buttons.__width.value =
                newToolbar.controls.main.accordions.__sortable.buttons.__width.displayValue = parseFloat(config.initialWidth);
                newToolbar.controls.main.accordions.__sortable.buttons.__width.units = config.initialWidth.indexOf('px') !== -1 ? "px" : "%";
            }
        }
        return newToolbar;

    }

    componentDidMount() {
        document.addEventListener('copy', this.copyListener);
        document.addEventListener('paste', this.pasteListener);
        document.addEventListener('cut', this.cutListener);
    }

    /**
     * Before component unmounts
     * Unsets listener
     */
    componentWillUnmount() {
        document.removeEventListener('copy', this.copyListener);
        document.removeEventListener('paste', this.pasteListener);
        document.removeEventListener('cut', this.cutListener);
    }

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        return this.state.alert;
    }

}
Clipboard.propTypes = {
    /**
     * Paste box function
     */
    onBoxPasted: PropTypes.func.isRequired,
    /**
     * Delete box function
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
      * Selected box
      */
    boxSelected: PropTypes.any,
    /**
      * Object that contains the toolbars
      */
    toolbars: PropTypes.object,
    /**
      * Object that contains the boxes
      */
    boxes: PropTypes.object,
    /**
   * View selected
   */
    navItemSelected: PropTypes.any,
    /**
   * Contained view selected
   */
    containedViewSelected: PropTypes.any,
    /**
   * Object that contains all the views
   */
    navItems: PropTypes.object,
    /**
   * Object that contains all the contained views
   */
    containedViews: PropTypes.any,
};

