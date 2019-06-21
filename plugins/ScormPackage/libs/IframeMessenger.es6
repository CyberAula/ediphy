import WAPPc from './WAPP';
/* eslint-disable */

export default function IframeMessenger(handler, options) {
    // Constants
    let VALID_TYPES = ["PROTOCOL", "VE", "WAPP"];

    // Status
    let _initialized = false;
    let _connected = false;
    let _origin = "?";
    let _originId = "?";
    let WAPP = new WAPPc(this, handler);

    let init = function(config) {
        if (_initialized) {
            return;
        }
        _initialized = true;

        try {
            _origin = window.location.href;
        } catch (e) {
        }
        _originId = _generateOriginId();

        if (window.addEventListener) {
            window.addEventListener("message", _onIframeMessageReceived, false);
        } else if (window.attachEvent) {
            window.attachEvent("message", _onIframeMessageReceived);
        }

        // V.EventsNotifier.registerCallback(V.Constant.Event.onSendIframeMessage, sendIframeMessage);
    };

    let sendIframeMessage = function(iframeMessage) {
        if ((_initialized) && (_connected) && (validateIframeMessage(iframeMessage))) {
            _sendMessage(iframeMessage);
        }
    };

    let _sendMessage = function(iframeMessage) {
        let parsedIframeMessage = JSON.parse(iframeMessage);

        switch (parsedIframeMessage.mode) {
        case "EXTERNAL":
            window.parent.postMessage(iframeMessage, '*');
            break;
        case "INTERNAL":
            $("iframe[src='" + parsedIframeMessage.destination + "']").each(function(index, iframe) {
                _sendMessageToIframe(iframeMessage, iframe);
            });
            break;
        default:
            return;
        }
    };

    let _sendMessageToIframe = function(iframeMessage, iframe) {
        if ((iframe) && (iframe.contentWindow)) {
            iframe.contentWindow.postMessage(iframeMessage, '*');
        }
    };

    let _onIframeMessageReceived = function(wrapperedIframeMessage) {
        if (_validateWrapperedIframeMessage(wrapperedIframeMessage)) {
            let iframeMessage = JSON.parse(wrapperedIframeMessage.data);

            if ((iframeMessage.destination != _origin) && (iframeMessage.destination !== "*")) {
                return;
            }

            if ((typeof iframeMessage.destinationId !== "undefined") && (iframeMessage.destinationId != _originId)) {
                return;
            }

            if (iframeMessage.type !== "VE") {
                // Do not process own messages
                if ((iframeMessage.origin === _origin) && (iframeMessage.originId === _originId)) {
                    return false;
                }
            }

            switch (iframeMessage.type) {
            case "PROTOCOL":
                return _onProtocolMessage(iframeMessage);
            case "VE":
                // Process own messages only when default events are disabled.
                let processSelfMessages = false; // V.Status.isPreventDefaultMode();
                if ((processSelfMessages === false) && (iframeMessage.origin === _origin) && (iframeMessage.originId === _originId)) {
                    return false;
                }
                return true; // V.Messenger.VE.processVEMessage(iframeMessage);
            case "WAPP":
                return WAPP.processWAPPMessage(iframeMessage);
            default:
                return;
            }
        }
    };

    // /////////////
    // Messages
    // /////////////

    function IframeMessage(type, data, destination, destinationId, mode) {
        this.IframeMessage = true;
        this.mode = mode || "EXTERNAL";
        this.type = type || _type;
        this.data = data || {};
        this.origin = _origin;
        this.originId = _originId;
        this.destination = destination || "*";
        if (destinationId) {
            this.destinationId = destinationId;
        }
    }

    let createMessage = function(type, data, destination, destinationId, mode) {
        let iframeMessage = new IframeMessage(type, data, destination, destinationId, mode);
        return JSON.stringify(iframeMessage);
    };

    let _validateWrapperedIframeMessage = function(wrapperedIframeMessage) {
        if ((typeof wrapperedIframeMessage !== "object") || (typeof wrapperedIframeMessage.data !== "string")) {
            return false;
        }
        return validateIframeMessage(wrapperedIframeMessage.data);
    };

    let validateIframeMessage = function(_iframeMessage) {
        try {
            _iframeMessage = JSON.parse(_iframeMessage);
            if ((_iframeMessage.IframeMessage !== true) || (VALID_TYPES.indexOf(_iframeMessage.type) == -1)) {
                return false;
            }
        } catch (e) {
            return false;
        }

        return true;
    };

    let _generateOriginId = function() {
        let timestamp = ((new Date()).getTime()).toString();
        let random = (parseInt(Math.random() * 1000000)).toString();
        return parseInt(timestamp.substr(timestamp.length - 7, timestamp.length - 1) + random);
    };

    // ////////////
    // Protocol
    // ////////////

    let _onProtocolMessage = function(protocolMessage) {
        if (protocolMessage.data) {
            switch (protocolMessage.data.message) {
            case "onIframeMessengerHello":
                let helloMessage = protocolMessage;

                // Reply Hello message
                if (helloMessage.origin != "?") {
                    _connected = true;

                    // if (V.Editing) {
                    //     V.Editor.Object.Webapp.Handler.onWAPPConnected(helloMessage.origin, helloMessage.originId);
                    // } else {
                    //     V.Object.Webapp.Handler.onWAPPConnected(helloMessage.origin, helloMessage.originId);
                    // }

                    helloMessage.destination = helloMessage.origin;
                    helloMessage.destinationId = helloMessage.originId;
                    helloMessage.origin = _origin;
                    helloMessage.originId = _originId;
                    _sendMessage(JSON.stringify(helloMessage));
                }

                break;
            case "enablePreventDefault":
                // V.Status.setPreventDefaultMode(true);
                break;
            case "disablePreventDefault":
                // V.Status.setPreventDefaultMode(false);
                break;
            default:
                break;
            }
        }
    };

    this.init = init;
    this.createMessage = createMessage;
    this.validateIframeMessage = validateIframeMessage;
    this.sendIframeMessage = sendIframeMessage;

}
/* eslint-enable */
