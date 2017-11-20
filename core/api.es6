import Ediphy from './editor/main';

export function api() {
    return {
        addMenuButtons: function(json) {
            Ediphy.API_Private.emit(Ediphy.API_Private.events.addMenuButtons, json);
        },
        configModalNeedsUpdate: function() {
            Ediphy.API_Private.emit(Ediphy.API_Private.events.configModalNeedsUpdate, {});
        },
        openConfig: function(name, reason) {
            let promise = new Promise(function(resolve) {
                Ediphy.API_Private.listenAnswer(Ediphy.API_Private.events.openConfig, resolve);
            });
            Ediphy.API_Private.emit(Ediphy.API_Private.events.openConfig, { name: name, reason: reason });
            return promise;
        },
        editRichMark: function(box, mark, value) {
            Ediphy.API_Private.emit(Ediphy.API_Private.events.editRichMark, { box: box, id: mark, value: value });
        },
        markTriggered: function(id, value, stateElement) {
            Ediphy.API_Private.emit(Ediphy.API_Private.events.markTriggered, { id, value, stateElement });
        },
        changeView: function(id) {
            Ediphy.API_Private.emit(Ediphy.API_Private.events.changeView, { id: id });
        },
        renderPlugin: function(html, toolbar, config, state, ids, initialParams, reason) {
            if(!reason) {
                console.warn("No reason given");
            }
            Ediphy.API_Private.emit(Ediphy.API_Private.events.render, {
                content: html,
                toolbar: toolbar,
                config: config,
                state: state,
                ids: ids,
                initialParams: initialParams,
                reason: reason,
            });
        },
    };
}

export function api_private() {
    let answerCallback;
    return {
        events: {
            addMenuButtons: {
                emit: 'addMenuButtons',
            },
            render: {
                emit: 'render',
            },
            markTriggered: {
                emit: 'markTriggered',
                answer: 'markTriggered_back',
            },
            editRichMark: {
                emit: 'editRichMark',
            },
            changeView: {
                emit: 'changeView',
            },
            configModalNeedsUpdate: {
                emit: 'needsUpdate',
            },
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back',
            },
            getPluginsInView: {
                emit: 'getPluginsInView',
                answer: 'getPluginsInView_back',
            },
        },
        emit: function(name, params) {
            let event = new CustomEvent(name.emit, { 'detail': params });
            window.dispatchEvent(event);
        },
        listenEmission: function(event, callback) {
            window.addEventListener(event.emit, callback);
        },
        answer: function(name, params) {
            let event = new CustomEvent(name.answer, { 'detail': params });
            window.dispatchEvent(event);
        },
        listenAnswer: function(event, resolve) {
            answerCallback = this.cleanupAndResolve.bind(this, event, resolve);
            window.addEventListener(event.answer, answerCallback);
        },
        cleanupAndResolve: function(event, resolve, customEvent) {
            window.removeEventListener(event.answer, answerCallback);
            resolve(customEvent.detail);
        },
        cleanListener: function(event) {
            window.removeEventListener(event.emit);
        },
    };
}
