/* eslint-disable */

export default function WAPP(IframeMessenger, handler) {

    let _createWAPPMessage = function(method, params, destination, destinationId, mode) {
        let data = {};
        data.method = method;
        data.params = params;
        return IframeMessenger.createMessage("WAPP", data, destination, destinationId, mode);
    };

    let _createWAPPResponseMessage = function(method, params, WAPPMessage) {
        return _createWAPPMessage(method, params, WAPPMessage.origin, WAPPMessage.originId, WAPPMessage.mode);
    };

    let _validateWAPPMessage = function(VEMessage, params) {
        if(!IframeMessenger.validateIframeMessage(VEMessage)) {
            return false;
        }
        if(typeof VEMessage.data !== "object") {
            return false;
        }
        if(typeof VEMessage.data.method !== "string") {
            return false;
        }
        return true;
    };

    // ///////////////////
    // WAPP Message Processor
    // ///////////////////

    let processWAPPMessage = function(WAPPMessage) {
        let data = WAPPMessage.data;

        switch(data.method) {
        case "getUser":
            let params = { username: window.user, logged: false/* V.User.isLogged()*/ };
            IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method, params, WAPPMessage));
            break;
        case "setScore":
            let score = data.params;
            // V.Object.Webapp.Handler.onSetScore(score,WAPPMessage.origin);
            handler.onSetScore(score, WAPPMessage.origin);
            IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method, score, WAPPMessage));
            break;
        case "setProgress":
            let progress = data.params;
            // V.Object.Webapp.Handler.onSetProgress(progress,WAPPMessage.origin);
            IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method, progress, WAPPMessage));
            break;
        case "setSuccessStatus":
            var status = data.params;
            // V.Object.Webapp.Handler.onSetSuccessStatus(status,WAPPMessage.origin);
            IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method, status, WAPPMessage));
            break;
        case "setCompletionStatus":
            var status = data.params;
            // V.Object.Webapp.Handler.onSetCompletionStatus(status,WAPPMessage.origin);
            IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method, status, WAPPMessage));
            break;
        case "getAuthToken":
            /* V.Object.Webapp.Handler.getAuthToken(function(token){
                    IframeMessenger.sendIframeMessage(_createWAPPResponseMessage(data.method,token,WAPPMessage));
                });*/
            break;
        case "notifyTrackerAction":
            let action = data.params;
            if(typeof action.params !== "object") {
                action.params = {};
            }
            action.params.wapp = WAPPMessage.origin;
            break;
        default:
            break;
        }
    };

    this.processWAPPMessage = processWAPPMessage;

}
/* eslint-enable  */
