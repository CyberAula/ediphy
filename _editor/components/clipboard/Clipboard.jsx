import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import Alert from '../common/alert/Alert';
import { isContainedView, isSlide, isBox, isSortableBox, isView } from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER, ID_PREFIX_RICH_MARK } from '../../../common/constants';
import { ADD_BOX } from '../../../common/actions';
import { randomPositionGenerator, retrieveImageFromClipboardAsBase64, getCKEDITORAdaptedContent } from './clipboard.utils';
import i18n from 'i18next';
import { instanceExists } from '../../../common/common_tools';
/**
 * Component for managing the clipboard
 */
export default class Clipboard extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
        this.copyListener = this.copyListener.bind(this);
        this.pasteListener = this.pasteListener.bind(this);
        this.cutListener = this.cutListener.bind(this);
        this.pasteBox = this.pasteBox.bind(this);
        this.copyData = this.copyData.bind(this);
        this.duplicateBox = this.duplicateBox.bind(this);
        this.duplicateListener = this.duplicateListener.bind(this);
        this.currentPage = this.currentPage.bind(this);
    }

    /**
     * Extracts necessary information for clipboard/duplicating
     */
    copyData() {
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
        return { box, toolbar, childBoxes, childToolbars };
    }
    /**
     * Copy action listener
     * @param event
     */
    copyListener(event) {
        let activeElement = document.activeElement;
        if (event.clipboardData) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                if (!this.containsCKEDitorText(activeElement)) {
                    event.preventDefault();
                    event.clipboardData.setData("text/plain", JSON.stringify(this.copyData()));
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Cut action listener
     */
    cutListener(event) {
        let fromPlugin = this.copyListener(event);
        if (fromPlugin) {
            let box = this.props.boxes[this.props.boxSelected];
            this.props.onBoxDeleted(box.id, box.parent, box.container);
        }
    }
    /**
     * Calculates current page (nav or cv)
     */
    currentPage() {
        return isContainedView(this.props.containedViewSelected) ?
            this.props.containedViews[this.props.containedViewSelected] :
            (this.props.navItemSelected !== 0 ? this.props.navItems[this.props.navItemSelected] : null);
    }

    /**
     * Duplicates box
     */
    duplicateBox() {
        let data = this.copyData();
        let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
        let id = ID_PREFIX_BOX + Date.now();
        let page = this.currentPage();

        let isTargetSlide = isSlide(page.type);
        let parent = isTargetSlide ? page.id : page.boxes[0];

        let container = isTargetSlide ? 0 : containerId;

        if (this.props.boxSelected && this.props.boxes[this.props.boxSelected] && isBox(this.props.boxSelected)) {
            parent = this.props.boxes[this.props.boxSelected].parent;
            container = this.props.boxes[this.props.boxSelected].container;
            isTargetSlide = container === 0;
        }
        let ids = { id, parent, container };
        this.pasteBox(data, ids, isTargetSlide);
    }

    /**
     * Duplicate action listener
     */
    duplicateListener(event) {
        let key = event.keyCode ? event.keyCode : event.which;
        if ((key === 69) && event.ctrlKey && event.altKey && isBox(this.props.boxSelected)) {
            event.preventDefault();
            event.stopPropagation();
            this.duplicateBox();
        } else if (key === 86 && event.ctrlKey && event.shiftKey) {
            this.pasteListener(event, true);
        }
    }

    /**
     * Pastes box
     */
    pasteBox(data, ids, isTargetSlide) {
        let pluginName = data.toolbar.config.name;
        let limitToOneInstance = data.toolbar.config.limitToOneInstance;
        let alertMsg = (msg) => { return (<Alert className="pageModal" key="alert" show hasHeader backdrop={false}
            title={ <span><i className="material-icons alert-warning" >warning</i>{ i18n.t("messages.alert") }</span> }
            closeButton onClose={()=>{this.setState({ alert: null });}}>
            <span> {msg} </span>
        </Alert>);

        };
        // Forbid plugins inside plugins inside plugins (only 1 level allowed)
        if (isBox(ids.parent) && (!data.childBoxes || Object.keys(data.childBoxes).length > 0)) {
            this.setState({ alert: alertMsg(i18n.t('messages.depth_limit')) }); return;
        }
        if (limitToOneInstance && instanceExists(data.toolbar.config.name)) {
            this.setState({ alert: alertMsg(i18n.t('messages.instance_limit')) });
            return;
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

    }

    /**
     * Calculates if the current focused element in the DOM is a text area. If it is we do not want to paste the box.
     */
    containsCKEDitorText(activeElement) {
        let focus = activeElement.classList;
        return (focus.contains('form-control') || focus.contains('cke_editable') || focus.contains('textAreaStyle') || activeElement.tagName === 'TEXTAREA');
    }

    /**
     * Paste action listener
     */
    pasteListener(event, overrideShiftKey) {
        if (event.shiftKey && !overrideShiftKey) {
            return;
        }
        let activeElement = document.activeElement;

        if (event.clipboardData) {
            // Check if copied data is plugin
            let data = "";
            try {
                let clipboardData = event.clipboardData.getData("text");
                data = JSON.parse(clipboardData);
            } catch (err) {
                // eslint-disable-next-line no-console
                // console.log(err);
            }

            let page = this.currentPage();
            if (page) {
                let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                let id = ID_PREFIX_BOX + Date.now();
                let isTargetSlide = isSlide(page.type);
                let parent = isTargetSlide ? page.id : page.boxes[0];
                let row = 0;
                let col = 0;
                let container = isTargetSlide ? 0 : containerId;

                if (this.props.boxSelected && this.props.boxes[this.props.boxSelected] && isBox(this.props.boxSelected)) {
                    parent = this.props.boxes[this.props.boxSelected].parent;
                    container = this.props.boxes[this.props.boxSelected].container;
                    isTargetSlide = container === 0;
                    row = this.props.boxes[this.props.boxSelected].row;
                    col = this.props.boxes[this.props.boxSelected].col;
                }

                let ids = { id, parent, container, row, col };
                // Copied data is an EditorBox
                if (data && data.box && data.toolbar) {
                    // Focus is outside a text box
                    if (!this.containsCKEDitorText(activeElement)) {
                        // Paste plugin
                        event.preventDefault();
                        event.stopPropagation();
                        // TODO Drag with Ctrl key held
                        this.pasteBox(data, ids, isTargetSlide);
                        // Scroll into pasted element
                        let createdBox = document.getElementById('box-' + ids.id);
                        if (createdBox) {
                            if (/chrome/i.test(navigator.userAgent)) {
                                createdBox.scrollIntoViewIfNeeded();
                            }
                            createdBox.scrollIntoView();
                        }
                    } else {
                        // Inside a text box (CKEditor or input)
                        // Let normal paste work
                        // event.preventDefault();
                    }

                // Copied data is not an EditorBox
                } else if (!this.containsCKEDitorText(activeElement)) {
                    event.preventDefault();
                    let imageBlob;
                    let initialParams = {
                        parent: parent, //
                        container: container,
                        row: row,
                        col: col,
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

    /**
     * Modifies pasted box so it adapts to its new parent
     */
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
            row: ids.row || 0,
            col: ids.col || 0,
            level: isBox(ids.parent) ? 1 : 0,
            sortableContainers: newContainerBoxes,
            containedViews: box.containedViews.filter(cv=> this.props.containedViews[cv]),
        });
        return { newBox, newIds };

    }

    /**
     * Modifies pasted toolbar so it adapts to its new parent
     */
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

    /**
     * After component mounts
     * Sets listeners
     */
    componentDidMount() {
        document.addEventListener('copy', this.copyListener);
        document.addEventListener('paste', this.pasteListener);
        document.addEventListener('cut', this.cutListener);
        document.addEventListener('keyup', this.duplicateListener);
    }

    /**
     * Before component unmounts
     * Unsets listeners
     */
    componentWillUnmount() {
        document.removeEventListener('copy', this.copyListener);
        document.removeEventListener('paste', this.pasteListener);
        document.removeEventListener('cut', this.cutListener);
        document.removeEventListener('keyup', this.duplicateListener);
    }

    /**
     * Renders React Component
     */
    render() {
        let props = {
            onClick: this.duplicateBox,
        };
        let childrenWithProps = React.Children.map(this.props.children, function(child) {
            if (React.isValidElement(child) && child.props.name === "duplicate") {
                return React.cloneElement(child, props);
            }
            return child;
        });
        return [this.state.alert, ...(childrenWithProps || []),

        ];
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

