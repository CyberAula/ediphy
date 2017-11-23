import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import { isContainedView, isSlide, isSortableBox } from '../../../common/utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../common/constants';
import { ADD_BOX } from '../../../common/actions';

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
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            if(this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1) { // focus.indexOf('tituloCurso') === -1 &&
                    event.preventDefault();
                    let copyData = { box: this.props.boxes[this.props.boxSelected], toolbar: this.props.toolbars[this.props.boxSelected] };
                    event.clipboardData.setData("text/plain", JSON.stringify(copyData));
                }
            }
            // console.log(event.clipboardData.getData("text"));
        }
    }

    cutListener(event) {
        this.copyListener(event);
        let box = this.props.boxes[this.props.boxSelected];
        // TODO CKEditor errors fix
        this.props.onBoxDeleted(box.id, box.parent, box.container);
    }

    pasteListener(event) {
        let focus = document.activeElement.className;
        if (event.clipboardData) {
            // Check if copied data is plugin
            let data = "";
            try {
                let clipboardData = event.clipboardData.getData("text");
                data = JSON.parse(clipboardData);
            } catch(err) {
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
                    if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1) {
                    // Paste plugin
                        event.preventDefault();
                        // TODO Drag with Ctrl key held
                        this.props.onBoxPasted(ids,
                            this.transformBox(data.box, ids, isTargetSlide, data.box.resizable),
                            this.transformToolbar(data.toolbar, ids, isTargetSlide, data.box.resizable));

                    // Inside a text box (CKEditor or input)
                    } else {
                        // event.preventDefault();
                    }

                // Copied data is not an EditorBox
                } else if (focus.indexOf('form-control') === -1 && focus.indexOf('cke_editable') === -1) {
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
                        noImage = this.retrieveImageFromClipboardAsBase64(event, (url)=>{
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
                        initialParams.text = event.clipboardData.getData("text/html") || event.clipboardData.getData("text");
                        Ediphy.Plugins.get("BasicText").getConfig().callback(initialParams, ADD_BOX);
                        console.log(data);
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
            position: isTargetSlide ? { type: "absolute", x: randomPositionGenerator(20, 40), y: randomPositionGenerator(20, 40) } : { type: box.position.type, x: "0%", y: "0%" },
            resizable: isTargetSlide,
            row: 0,
            col: 0,
        });
        return newBox;

    }

    transformToolbar(toolbar, ids, isTargetSlide, isOriginSlide) {
        let newToolbar = Object.assign({}, toolbar, { id: ids.id });
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
        console.log(newToolbar);
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
        return(null);
    }

    // TODO link with VISH
    retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat) {
        if(pasteEvent.clipboardData === false) {
            if(typeof(callback) === "function") {
                callback(undefined);
            }
        }
        let items = pasteEvent.clipboardData.items;
        if(items === undefined) {
            if(typeof(callback) === "function") {
                callback(undefined);
            }
        }
        let noImage = false;
        for (let i = 0; i < items.length; i++) {
            // Skip content if not image
            if (items[i].type.indexOf("image") !== -1) {
                // Retrieve image on clipboard as blob
                let blob = items[i].getAsFile();
                // Create an abstract canvas and get context
                let mycanvas = document.createElement("canvas");
                let ctx = mycanvas.getContext('2d');
                // Create an image
                let img = new Image();
                // Once the image loads, render the img on the canvas
                img.onload = function() {
                    // Update dimensions of the canvas with the dimensions of the image
                    mycanvas.width = this.width;
                    mycanvas.height = this.height;

                    // Draw the image
                    ctx.drawImage(img, 0, 0);

                    // Execute callback with the base64 URI of the image
                    if (typeof(callback) === "function") {
                        callback(mycanvas.toDataURL(
                            (imageFormat || "image/png")
                        ));
                    }
                };
                // Crossbrowser support for URL
                let URLObj = window.URL || window.webkitURL;
                // Creates a DOMString containing a URL representing the object given in the parameter
                // namely the original Blob
                img.src = URLObj.createObjectURL(blob);
            } else if (i === items.length - 1 && noImage === false) {
                noImage = true;
            }
        }
        return noImage;
    }
    // May be needed in the future
    retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
        if(pasteEvent.clipboardData === false) {
            if(typeof(callback) === "function") {
                callback(undefined);
            }
        }

        let items = pasteEvent.clipboardData.items;

        if(items === undefined) {
            if(typeof(callback) === "function") {
                callback(undefined);
            }
        }

        for (let i = 0; i < items.length; i++) {
            // Skip content if not image
            if (items[i].type.indexOf("image") !== -1) {
                // Retrieve image on clipboard as blob
                let blob = items[i].getAsFile();

                if(typeof(callback) === "function") {
                    callback(blob);
                }
            }
        }
    }

}

function randomPositionGenerator(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2) + "%";

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

