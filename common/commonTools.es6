import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import {
    addDefaultContainerPlugins, addDefaultContainerPluginsReact,
    parsePluginContainers, parsePluginContainersReact,
} from './pluginsInsidePlugins';
import { ID_PREFIX_BOX } from './constants';
let html2json = require('html2json').html2json;
import i18n from 'i18next';

export function fontString() {
    // let canvas = document.getElementById('canvas');
    let fontArray = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    // let fonts_length = fontArray.map((number) => number + '/' + (Math.round(number / (window.innerWidth * 0.01) * 100) / 100) + 'vw');
    let fonts_length = fontArray.map((number) => number + '/' + (number / 14) + 'em');
    let fontsString = fonts_length.join(";");
    return fontsString;
}

export function changeFontBase(width = 900) {
    const DEFAULT_FONT_BASE = 14;
    const DEFAULT_WIDTH_BASE = 1100;
    let calculatedFontSize = DEFAULT_FONT_BASE * parseFloat(width) / DEFAULT_WIDTH_BASE;
    window.FONT_BASE = calculatedFontSize;
    // $('.boxStyle').css("font-size", calculatedFontSize + "px");
    return calculatedFontSize;
}
export function aspectRatio(ratioparam, idEl = "airlayer", idParent = "canvas", customSize = 0, fromVisor = false) {
    // change ratio to the global ratio store in the app
    let ratio = ratioparam;
    let canvas = document.getElementById(idParent);
    let parent = document.getElementById(idEl);

    let height = canvas ? canvas.style.height : 0;
    let width = canvas ? canvas.style.width : 0;
    let marginTop = canvas ? canvas.style.marginTop : 0;
    let marginBottom = canvas ? canvas.style.marginBottom : 0;

    /* this is to avoid get values from react flow when using event listeners that do not exist in react
     * get the values from window.object */
    if(canvas) {
        if (customSize === 0) {
            height = fromVisor ? canvas.offsetHeight : canvas.offsetHeight - 66;
            width = fromVisor ? canvas.offsetWidth : canvas.offsetWidth - 36;
            if (window.canvasRatio === undefined) {
                window.canvasRatio = ratio; // https://stackoverflow.com/questions/19014250/reactjs-rerender-on-browser-resize
            } else {
                ratio = window.canvasRatio;
            }
            let w = fromVisor ? canvas.offsetWidth : canvas.offsetWidth - 36;
            let h = fromVisor ? canvas.offsetHeight : canvas.offsetHeight - 66;
            marginTop = 0 + 'px';

            if (w > ratio * h) {
                width = (ratio * h) + "px";
                height = h + "px";

            } else if (h > w / ratio) {
                let newHeight = w / ratio;
                height = newHeight + "px";
                width = w + "px";
                if (parent) {
                    marginTop = ((h - newHeight) / 2) + 'px';
                }
            }
        } else if (fromVisor) {

            let customRatio = customSize.width / customSize.height;

            if (customRatio > ratio) {
                width = canvas.offsetWidth + 'px';
                height = canvas.offsetWidth / customRatio + 'px';
            }
            else {
                height = canvas.offsetHeight + 'px';
                width = canvas.offsetHeight * customRatio + 'px';
            }
        }
        else if (customSize.width > fromVisor ? canvas.offsetWidth : (canvas.offsetWidth - 36)) {

            height = (customSize.height) + 'px';
            width = (customSize.width) + 'px';
            marginTop = ((canvas.offsetHeight - (fromVisor ? 0 : 66) - customSize.height) / 2 - 1);
            marginTop = marginTop > 0 ? marginTop : 0;
            marginTop += 'px';
        } else {
            height = customSize.height + 'px';
            width = customSize.width + 'px';
            marginTop = canvas ? ((canvas.offsetHeight - (fromVisor ? 0 : 66) - customSize.height) / 2 - 1) : 0;
            marginTop = marginTop > 0 ? marginTop : 0;
            marginTop += 'px';
        // marginBottom = '10px';
        }
    }
    return { width, height, marginTop, marginBottom };
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
export function releaseClick(releaseClickEl, name, isComplex) {
    let isComp = isComplex;
    if (releaseClickEl && releaseClickEl.getAttribute) {
    // Get element that has been clicked
        let release = releaseClickEl.getAttribute('id') || "noid";
        let counter = 12;
        // Check recursively the parent of the element clicked to check if any of them has the name that we are looking for
        while (release && release.indexOf(name) === -1 && counter > 0 && releaseClickEl.parentNode) {
            releaseClickEl = releaseClickEl.parentNode;
            if (releaseClickEl && releaseClickEl.getAttribute) {
                release = releaseClickEl.getAttribute('id') || "noid";
                if(release.indexOf(name) !== -1 && releaseClickEl.parentNode && isComp) {
                    isComp = false;
                    releaseClickEl = releaseClickEl.parentNode;
                    release = releaseClickEl.getAttribute('id') || "noid";
                }
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
            alreadyOne = true;
            return;
        }
    });

    return alreadyOne;
}

export function scrollElement(node, options) {
    let cfg = options || { duration: 300, centerIfNeeded: true, easing: 'easeInOut' };
    if (node) {
        let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));

        if (!isSafari) {
            scrollIntoViewIfNeeded(node, cfg);
        }
    }
}

export function findBox(id) {
    return document.getElementById('box-' + id);
}

export function letterFromNumber(ind) {
    if (!isNaN(ind)) {
        const abc = 'abcdefghijklmnopqrstuvwxyz';
        return abc[ind % abc.length];
    }
    return ind;
}

export function createBox(ids, name, slide, addBox, boxes, styleCustom = {}) {
    let apiPlugin = Ediphy.Plugins.get(name);
    if (!apiPlugin) {
        return;
    }
    let { initialParams, template, config, toolbar, state } = apiPlugin.getInitialParams({ ...ids, slide });
    let styles = {};
    try {
        if (toolbar.main?.accordions?.style) {
            Object.keys(toolbar.main.accordions.style.buttons).map((e) => {
                styles[e] = toolbar.main.accordions.style.buttons[e].value;
            });
        }
        styles = { ...styles, ...styleCustom };
    } catch(e) {
        // eslint-disable-next-line no-console
        console.error(e);
    }

    let newBoxes = [];
    let newPluginState = {};
    if (state.__pluginContainerIds) {
        if (config.flavor !== "react") {
            addDefaultContainerPlugins(ids, template, boxes, newBoxes);
            parsePluginContainers(template, newPluginState);
        } else {

            addDefaultContainerPluginsReact(ids, template, boxes, newBoxes);
            parsePluginContainersReact(template, newPluginState);

        }
        state.__pluginContainerIds = newPluginState;
    }

    addBox({ ...ids, config: apiPlugin.getConfig() }, true, slide, template, styles, state, undefined, initialParams);

    let basePrefix = ID_PREFIX_BOX + Date.now();

    newBoxes.map((box, ind) => {
        box.ids.id = basePrefix + '_' + ind;
        if (box.ids && ids.exercises) {
            if (box.ids.container === 'sc-Question') {
                box.ids.initialState = { __text: ids.exercises.question || box.ids.initialState };
            }

            let ans = box.ids.container.match(/sc-Answer(\d+)/);
            if(ans && ans.length > 1 && !isNaN(ans[1])) {
                box.ids.initialState = { __text: ids.exercises.answers[ans[1]] || box.ids.initialState };
            }
            if (box.ids.container === 'sc-Feedback') {
                box.ids.initialState = { __text: ids.exercises.feedback || box.ids.initialState };
            }
        }
        createBox(box.ids, box.name, false, addBox, boxes);

    });
    setTimeout(()=>{
        let boxCreated = findBox(ids.id);
        scrollElement(boxCreated);
    }, 40);

}

export function blurCKEditor(id, callback) {
    if (CKEDITOR.instances[id]) {
        CKEDITOR.instances[id].focusManager.blur(true);
        let data = CKEDITOR.instances[id].getData();
        if (data.length === 0) {
            data = '<p>' + i18n.t("text_here") + '</p>';
            CKEDITOR.instances[id].setData((data));
        }
        callback(encodeURI(data), html2json(encodeURI(data)));
        let airlayer = document.getElementsByClassName("airlayer");
        if (airlayer && airlayer.length > 0 && airlayer.forEach) {
            airlayer.forEach(al=>al.focus());
        } else {
            document.body.focus();
        }

    }
}

export function getRandomColor() {
    return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`;
}

function rgbtoHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) {return "00";}
    n = Math.max(0, Math.min(n, 255));
    let num = "0123456789ABCDEF".charAt((n - n % 16) / 16)
    + "0123456789ABCDEF".charAt(n % 16);
    return num;
}

export function toColor(rgba) {
    let regex = /rgba\((\d+),(\d+),(\d+),(.+)\)/;
    let oldColor = regex.exec(rgba);
    if (oldColor && oldColor.length > 0) {
        let newColor = '#' + rgbtoHex(oldColor[1]) + rgbtoHex(oldColor[2]) + rgbtoHex(oldColor[3]);
        return { newColor: newColor, alpha: oldColor[4] * 100 };
    }
    return { newColor: rgba, alpha: 100 };
}

export function translateLicense(license) {
    let dict = {
        "public": "Public Domain",
        "cc-by": "CreativeCommons BY",
        "cc-by-sa": "CreativeCommons BY-SA",
        "cc-by-nd": "CreativeCommons BY-ND",
        "cc-by-nc": "CreativeCommons BY-NC",
        "cc-by-nc-sa": "CreativeCommons BY-NC-SA",
        "cc-by-nc-nd": "CreativeCommons BY-NC-ND" };

    return dict[license];
}

export function setRgbaAlpha(color, alpha = 0.15) {
    if (color) {
        if (color.charAt(0) === "#") {
            let cutHex = color.substring(1, 7);
            let r = parseInt(cutHex.substring(0, 2), 16);
            let g = parseInt(cutHex.substring(2, 4), 16);
            let b = parseInt(cutHex.substring(4, 6), 16);
            color = 'rgba(' + r + ',' + g + ',' + b + ',0.25)';
        }
        return color.replace(/[\d\.]+\)$/g, alpha.toString() + ")");
    }
    return 'rgba(0, 173, 156, 0.25)';
}

export function convertSecondsToHMS(time) {
    // eslint-disable-next-line no-bitwise
    let hrs = ~~(time / 3600);
    // eslint-disable-next-line no-bitwise
    let mins = ~~((time % 3600) / 60);
    let secs = Math.round(time % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if(secs === 60) {
        secs = 0;
        mins += 1;
    }

    if(mins === 60) {
        hrs += 1;
    }

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;

    return ret;
}

export function convertHMStoSeconds(time) {
    let a = time.split(':');
    let finalValue;
    if (a.length === 2) {
        finalValue = (+a[0]) * 60 + (+a[1]);
    } else {
        finalValue = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    }
    return finalValue;
}

export function pad(str) {
    str = str.toString();
    return str.length < 2 ? "0" + str : str;
}
