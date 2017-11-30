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
