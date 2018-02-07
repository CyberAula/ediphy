import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas", customSize = 0) {
    // change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let parent = document.getElementById(idParent);
    let canvas = document.getElementById(idEl);

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */
    if (customSize === 0) {
        canvas.style.height = "100%";
        canvas.style.width = "100%";
        if(window.canvasRatio === undefined) {
            window.canvasRatio = ratio; // https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
        } else {
            ratio = window.canvasRatio;
        }
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        canvas.style.marginTop = 0 + 'px';
        if (w > ratio * h) {
            canvas.style.width = (ratio * h) + "px";
        } else if (h > w / ratio) {
            let newHeight = w / ratio;
            canvas.style.height = newHeight + "px";
            if (parent/* && parent.offsetHeight - newHeight > 0*/) {
                canvas.style.marginTop = ((parent.offsetHeight - canvas.offsetHeight) / 2 - 5) + 'px';
            }
        }
    } else {
        canvas.style.height = customSize.height + 'px';
        canvas.style.width = customSize.width + 'px';
    }
}

export function toggleFullScreen(element) {
    if(!element) {
        element = document.documentElement;
    }

    if (isFullScreenOn()) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    else if (!element.fullscreenElement && // alternative standard method
        !element.mozFullScreenElement && !element.webkitFullscreenElement && !element.msFullscreenElement) { // current working methods
        if (element.requestFullscreen) {
            element.requestFullscreen();
            document.body.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
            document.body.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
            document.body.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            document.body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }

    }

}

export function isFullScreenOn() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

export function fullScreenListener(callback, set) {
    if (set) {
        document.addEventListener('webkitfullscreenchange', callback);
        document.addEventListener('mozfullscreenchange', callback);
        document.addEventListener('fullscreenchange', callback);
        document.addEventListener('MSFullscreenChange', callback);
    } else {
        document.removeEventListener('webkitfullscreenchange', callback);
        document.removeEventListener('mozfullscreenchange', callback);
        document.removeEventListener('fullscreenchange', callback);
        document.removeEventListener('MSFullscreenChange', callback);
    }
}

/**
 * Calculate if a click was released on top of any element of a kind
 * Example: Check if plugin was dropped on top of another plugin. Check in which sortable it was dropped, etc.
 * @param releaseClick Element where the click was released
 * @param name Prefix of the className of the parent we are looking for
 * @returns {*}
 */
export function releaseClick(releaseClickEl, name) {
    if (releaseClickEl && releaseClickEl.getAttribute) {
    // Get element that has been clicked
        let release = releaseClickEl.getAttribute('id') || "noid";
        let counter = 7;
        // Check recursively the parent of the element clicked to check if any of them has the name that we are looking for
        while (release && release.indexOf(name) === -1 && counter > 0 && releaseClickEl.parentNode) {
            releaseClickEl = releaseClickEl.parentNode;
            if (releaseClickEl && releaseClickEl.getAttribute) {
                release = releaseClickEl.getAttribute('id') || "noid";
            } else {
                counter = 0;
                break;
            }
            counter--;
        }
        if (counter > 0 && release && release.indexOf(name) !== -1) {
            let partialID = release.split(name);
            if (partialID && partialID.length > 0) {
                return partialID[1];

            }

        }
    }
    return undefined;
}

export function instanceExists(name) {
    let isCV = $('#containedCanvas').css('display') !== 'none';
    let alreadyOne = false;
    let query = (isCV ? '#containedCanvas' : '#canvas') + ' .wholebox';
    $(query).each((ind, el)=>{
        if (el.getAttribute('name') === name) {
            alreadyOne = true; return;
        }
    });

    return alreadyOne;
}

export function scrollElement(node, options) {
    let cfg = options || { duration: 300, centerIfNeeded: true, easing: 'easeInOut' };
    if (node) {
        scrollIntoViewIfNeeded(node, cfg);
    }
}
