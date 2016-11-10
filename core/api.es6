import Dali from './main';

export function api() {
    return {
        addMenuButtons: function (json) {
            Dali.API_Private.emit(Dali.API_Private.events.addMenuButtons, json);
        },
        openConfig: function (name, reason) {
            var promise = new Promise(function (resolve) {
                Dali.API_Private.listenAnswer(Dali.API_Private.events.openConfig, resolve);
            });
            Dali.API_Private.emit(Dali.API_Private.events.openConfig, {name: name, reason: reason});
            return promise;
        },
        renderPlugin: function (html, toolbar, config, state, ids, initialParams, reason) {
            if(!reason){
                console.warn("No reason given");
            }
            Dali.API_Private.emit(Dali.API_Private.events.render, {
                content: html,
                toolbar: toolbar,
                config: config,
                state: state,
                ids: ids,
                initialParams: initialParams,
                reason: reason
            });
        }
    };
}

export function api_private() {
    var answerCallback;
    return {
        events: {
            addMenuButtons: {
                emit: 'addMenuButtons'
            },
            render: {
                emit: 'render'
            },
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back'
            },
            getPluginsInView: {
                emit: 'getPluginsInView',
                answer: 'getPluginsInView_back'
            }
        },
        emit: function (name, params) {
            var event = new CustomEvent(name.emit, {'detail': params});
            window.dispatchEvent(event);
        },
        listenEmission: function (event, callback) {
            window.addEventListener(event.emit, callback);
        },
        answer: function (name, params) {
            var event = new CustomEvent(name.answer, {'detail': params});
            window.dispatchEvent(event);
        },
        listenAnswer: function (event, resolve) {
            answerCallback = this.cleanupAndResolve.bind(this, event, resolve);
            window.addEventListener(event.answer, answerCallback);
        },
        cleanupAndResolve: function (event, resolve, customEvent) {
            window.removeEventListener(event.answer, answerCallback);
            resolve(customEvent.detail);
        }
    };
}