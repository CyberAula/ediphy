
// TODO link with VISH
export function retrieveImageFromClipboardAsBase64(pasteEvent, callback, imageFormat) {
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

export function randomPositionGenerator(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2) + "%";

}

