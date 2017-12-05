/**
 * HELPER FUNCTIONS FOR THE CLIPBOARD
 *
 */

/**
 * Async function for retrieving an image from the clipboard
 * @param pasteEvent Paste event captured
 * @param callback Callback function for when finishing parsing the image
 * @param imageFormat Resulting image format
 * @returns {boolean} True if there is images in the clipboard. False otherwise
 */
export function retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat) {
    // TODO link with VISH
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

/**
 * Retrives image from clipboard as blob. Not used as for now but it may be needed in the future
 * @param pasteEvent Paste event captured
 * @param callback Callback function for when finishing parsing the image
 */
export function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
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

/**
 * Generates a random percentage between the given numbers
 * @param min Min percentage
 * @param max Max percentage
 * @returns {string} Generated value. Ex: 50.02%
 */
export function randomPositionGenerator(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2) + "%";

}

/**
 * Adapt the text from the clipboard to HTML that the CKEditor recognizes
 * @param data Clipboard data in HTML or plain text
 * @returns {string} Resulting CKEditor content
 */
export function getCKEDITORAdaptedContent(data) {
    // Parse HTML version
    // let filter = new CKEDITOR.filter( 'p b' ),
    // Parse the HTML string to pseudo-DOM structure.
    let fragment = CKEDITOR.htmlParser.fragment.fromHtml(data);
    let writer = new CKEDITOR.htmlParser.basicWriter();

    fragment.writeHtml(writer);
    return encodeURI(writer.getHtml());
    /* return encodeURI(
     decodeURI(
     CKEDITOR.tools.htmlEncode(data)
     )
     );
     */
    // Plain text version
    // return (event.clipboardData.getData("text/plain"));
}

/**
 * Modifies the pasted box
 * @param box Box object
 * @param ids {id,container, parent}
 * @param isTargetSlide Whether it is being pasted in a slide
 * @param isOriginSlide Whether it was copied from a slide
 * @returns {*}
 */
export function transformBox(box, ids, isTargetSlide, isOriginSlide, position) {
    let newBox = Object.assign({}, box, {
        container: ids.container,
        id: ids.id,
        parent: ids.parent,
        position: isTargetSlide ? {
            type: "absolute",
            x: position && position.x ? position.x : randomPositionGenerator(20, 40),
            y: position && position.y ? position.y : randomPositionGenerator(20, 40),
        } : { type: "relative", x: "0%", y: "0%" },
        resizable: isTargetSlide,
        row: 0,
        col: 0,
        containedViews: box.containedViews.filter(cv=> this.props.containedViews[cv]),
    });
    return newBox;
}

/**
 * Modifies the toolbar of the pasted box
 * @param toolbar Toolbar object
 * @param ids {id,container, parent}
 * @param isTargetSlide Whether it is being pasted in a slide
 * @param isOriginSlide Whether it was copied from a slide
 * @returns {*}
 */
export function transformToolbar(toolbar, ids, isTargetSlide, isOriginSlide) {
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
