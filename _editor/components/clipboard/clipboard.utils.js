/**
 * HELPER FUNCTIONS FOR THE CLIPBOARD
 *
 */

/**
 * Async function for retrieving an image from the clipboard
 * @param pasteEvent Paste event captured
 * @param uploadFunction
 * @param callback Callback function for when finishing parsing the image
 * @returns {boolean} True if there is images in the clipboard. False otherwise
 */
export function retrieveImageFromClipboardAsBase64(pasteEvent, uploadFunction, callback) {
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
            // let mycanvas = document.createElement("canvas");
            // let ctx = mycanvas.getContext('2d');
            // Create an image
            // let img = new Image();
            // Once the image loads, render the img on the canvas

            if(typeof(uploadFunction) === "function") {
                uploadFunction(blob, [], (url=>{
                    if (typeof(callback) === "function") {
                        callback(url);
                    }})
                );
            }
            /* img.onload = function() {
                // Update dimensions of the canvas with the dimensions of the image
                mycanvas.width = this.width;
                mycanvas.height = this.height;

                // Draw the image
                ctx.drawImage(img, 0, 0);
                let image = mycanvas.toDataURL(
                  (imageFormat || "image/png")
                );
                // Execute callback with the base64 URI of the image
              if(typeof(uploadFunction) === "function") {
                uploadFunction(blob,[], (url=>{
                  if (typeof(callback) === "function") {
                    callback(url);
                  }})
                );
              }
            };
            // Crossbrowser support for URL
            let URLObj = window.URL || window.webkitURL;
            // Creates a DOMString containing a URL representing the object given in the parameter
            // namely the original Blob
            img.src = URLObj.createObjectURL(blob);*/
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
 * @returns {string} Resulting CKEditor content
 * @param str
 * @param p1
 */

function replacerPt(str, p1) {
    return "" + Math.round(p1 * 2 / 21 * 1000) / 1000 + "em";
}
function replacerPx(str, p1) {
    return "" + Math.round(p1 / 14 * 1000) / 1000 + "em";
}

export function getCKEDITORAdaptedContent(data) {
    // Parse HTML version
    // let filter = new CKEDITOR.filter( 'p b' ),
    // Parse the HTML string to pseudo-DOM structure.
    let fragment = CKEDITOR.htmlParser.fragment.fromHtml(data);
    let writer = new CKEDITOR.htmlParser.basicWriter();

    fragment.writeHtml(writer);
    let parsedHTML = writer.getHtml();

    // parsedHTML = parsedHTML.replace(/([1-9]\d*(\.\d+)?)px/gim, replacerPx)
    // parsedHTML = parsedHTML.replace(/([1-9]\d*(\.\d+)?)pt/gim, replacerPt)

    parsedHTML = parsedHTML.replace(/style=\"(.*;)*\"/gim, function(str, p1) {
        let styled = (p1.replace(/([0-9]\d*(\.\d+)?)pt/gim, replacerPt));
        styled = styled.replace(/([0-9]\d*(\.\d+)?)px/gim, replacerPx);
        return "style=\"" + styled + "\"";
    });
    parsedHTML = parsedHTML.replace(/<style>(.*;)*<\/style>/gim, function(str, p1) {
        let styled = (p1.replace(/([0-9]\d*(\.\d+)?)pt/gim, replacerPt));
        styled = styled.replace(/([0-9]\d*(\.\d+)?)px/gim, replacerPx);
        return "<style>" + styled + "</style>";
    });
    return encodeURI(parsedHTML);
    /* return encodeURI(
     decodeURI(
     CKEDITOR.tools.htmlEncode(data)
     )
     );
     */
    // Plain text version
    // return (event.clipboardData.getData("text/plain"));
}

export function isURL(str) {
    if (!str) {
        return false;
    }
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}

export function copyText(text) {
    // Create the textarea input to hold our text.
    try {
        const element = document.createElement('textarea');
        element.value = text instanceof Object ? JSON.stringify(text) : text;
        // Add it to the document so that it can be focused.
        document.body.appendChild(element);
        // Focus on the element so that it can be copied.
        element.focus();
        element.setSelectionRange(0, element.value.length);
        // Execute the copy command.
        document.execCommand('copy');
        // Remove the element to keep the document clear.
        document.body.removeChild(element);
        return true;
    } catch (e) {
        return false;
    }

}
