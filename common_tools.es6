
export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas") {

    // change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let parent = document.getElementById(idParent);
    let canvas = document.getElementById(idEl);
    canvas.style.height = "100%";
    canvas.style.width = "100%";

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */

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

}

export function requestFullScreen(element) {
    // Supports most browsers and their versions.
    /* jshint ignore:start */

    let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }

    if(!element) {
        element = document.body;
    }

    /* jshint ignore:end */

}

export function exitFullScreen(element) {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.exitFullscreen) {
        document.msExitFullscreen();
    } else if (document.exitFullscreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    /* jshint ignore:start */

    let requestMethod = element.exitFullscreen || element.webkitExitFullscreen || element.mozCancelFullScreen || element.msExitFullscreen;
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        let wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }

    if(!element) {
        element = document.body;
    }

    /* jshint ignore:end */
}

export function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

export function isFullScreenOn() {
    console.log(document.fullscreenElement, document.mozFullScreenElement, document.webkitFullscreenElement, document.msFullscreenElement);

    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}
