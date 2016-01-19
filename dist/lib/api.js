var Dali = {};

Dali.API = (function(){
    return {
        openConfig: function(json){
            var promise = new Promise(function(resolve, reject){
                Dali.API.Private.listenAnswer(resolve, Dali.API.Private.events.openConfig);
            });
            Dali.API.Private.emit(Dali.API.Private.events.openConfig, json);
            return promise;
        }
    }
})();

Dali.API.Private = (function(){

    var answerCallback;

    var configContainer;

    return {
        events: {
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back'
            }
        },
        emit: function(name, params) {
            var event = new CustomEvent(name.emit, {'detail': params});
            window.dispatchEvent(event);
        },
        listenEmission: function(event, callback){
            window.addEventListener(event.emit, callback);
        },
        answer: function(name){
            var event = new Event(name.answer);
            window.dispatchEvent(event);
        },
        listenAnswer: function(resolve, event){
            answerCallback = this.cleanupAndResolve.bind(this, resolve, event);
            window.addEventListener(event.answer, answerCallback);
        },
        cleanupAndResolve: function(resolve, event){
            window.removeEventListener(event.answer, answerCallback);

            resolve(configContainer);
        },

        setConfigContainer: function(container){
            configContainer = container;
        }
    }
})();