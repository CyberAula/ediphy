var Dali = {};
Dali.Visor = {};
Dali.API = (function(){
    return {
        addMenuButton: function(json){
            Dali.API.Private.emit(Dali.API.Private.events.addMenuButton, json);
        },
        openConfig: function(name, isUpdating){
            var promise = new Promise(function(resolve, reject){
                Dali.API.Private.listenAnswer(Dali.API.Private.events.openConfig, resolve);
            });
            Dali.API.Private.emit(Dali.API.Private.events.openConfig, {name: name, isUpdating: isUpdating});
            return promise;
        },
        renderPlugin: function(html, toolbar, config, state, isUpdating, ids, initialParams){
            Dali.API.Private.emit(Dali.API.Private.events.render, {content: html, toolbar: toolbar, config: config, state: state, isUpdating: isUpdating, ids: ids, initialParams: initialParams});
        }
    }
})();

Dali.API.Private = (function(){
    var answerCallback;
    return {
        events: {
            addMenuButton: {
                emit: 'addMenuButton'
            },
            render: {
                emit: 'render'
            },
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back'
            },
            getPluginsInCurrentView: {
                emit: 'getPluginsInCurrentView',
                answer: 'getPluginsInCurrentView_back'
            }
        },
        emit: function(name, params) {
            var event = new CustomEvent(name.emit, {'detail': params});
            window.dispatchEvent(event);
        },
        listenEmission: function(event, callback){
            window.addEventListener(event.emit, callback);
        },
        answer: function(name, params){
            var event = new CustomEvent(name.answer, {'detail': params});
            window.dispatchEvent(event);
        },
        listenAnswer: function(event, resolve){
            answerCallback = this.cleanupAndResolve.bind(this, event, resolve);
            window.addEventListener(event.answer, answerCallback);
        },
        cleanupAndResolve: function(event, resolve, customEvent){
            window.removeEventListener(event.answer, answerCallback);
            resolve(customEvent.detail);
        }
    }
})();