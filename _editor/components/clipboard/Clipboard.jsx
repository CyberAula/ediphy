import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isContainedView, isSlide, isSortableBox, isView } from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER, ID_PREFIX_RICH_MARK } from '../../../common/constants';
import { ADD_BOX } from '../../../common/actions';
import { randomPositionGenerator, retrieveImageFromClipboardAsBase64, getCKEDITORAdaptedContent } from './clipboard.utils';

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
                    let copyData = {
                        box: this.props.boxes[this.props.boxSelected],
                        toolbar: this.props.toolbars[this.props.boxSelected],
                    };
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
            // TODO CKEditor errors fix
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
                        // TODO Drag with Ctrl key held
                        // TODO Limit one instance plugin
                        this.props.onBoxPasted(ids,
                            this.transformBox(data.box, ids, isTargetSlide, data.box.resizable),
                            this.transformToolbar(data.toolbar, ids, isTargetSlide, data.box.resizable));

                        // Inside a text box (CKEditor or input)
                    } else {
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
                            console.log(url);
                            if (url) {
                                initialParams.url = url; // URLObj.createObjectURL(imageBlob);
                                Ediphy.Plugins.get("BasicImage").getConfig().callback(initialParams, ADD_BOX);
                                return;
                            }
                        }
                            , false);
                    } catch (err) {
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
        let newBox = Object.assign({}, box, {
            container: ids.container,
            id: ids.id,
            parent: ids.parent,
            position: isTargetSlide ? {
                type: "absolute",
                x: randomPositionGenerator(20, 40),
                y: randomPositionGenerator(20, 40),
            } : { type: box.position.type, x: "0%", y: "0%" },
            resizable: isTargetSlide,
            row: 0,
            col: 0,
            containedViews: box.containedViews.filter(cv=> this.props.containedViews[cv]),
        });
        return newBox;

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
                        // TODO Check if all the links to pages still exist since the time the box was copied

                    }

                }
            }
            newToolbar.state.__marks = newMarks;
            console.log(newToolbar.state.__marks);
        }
        if (isTargetSlide !== isOriginSlide) {
            // TODO Default width & height instead of 20%
            if (isTargetSlide) {
                if (newToolbar.controls.main.accordions.__sortable.buttons.__width.units === 'px') {
                    newToolbar.controls.main.accordions.__sortable.buttons.__width.units = "%";
                    newToolbar.controls.main.accordions.__sortable.buttons.__width.value = "20";
                }
                if (newToolbar.controls.main.accordions.__sortable.buttons.__height.units === 'px') {
                    newToolbar.controls.main.accordions.__sortable.buttons.__height.units = "%";
                    newToolbar.controls.main.accordions.__sortable.buttons.__height.value = "20";
                }
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
        return (null);
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

