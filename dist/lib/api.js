var Dali = {};

Dali.Plugins = (function(){
    var pluginList;
    var loadPluginFile = function(name){
        var promise = new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            var url = "plugins/" + name + "/" + name + ".js";
            script.src = url;

            script.addEventListener('load', function() {
                resolve(name);
            }, false);

            document.head.appendChild(script);
        });

        return promise;
    };

    return {
        get: function(name){
            return pluginList[name];
        },
        getCurrentPlugins: function(){
            var promise = new Promise(function(resolve, reject){
                Dali.API.Private.listenAnswer(resolve, Dali.API.Private.events.getCurrentPluginsList);
            });
            Dali.API.Private.emit(Dali.API.Private.events.getCurrentPluginsList);

            return promise;
        },
        loadAllAsync: function() {
            if (!pluginList) {
                pluginList = {};
                var promises = [];
                plugins.map(function (id, index) {
                    promises.push(loadPluginFile(id));
                    promises[index].then(function (value) {
                        pluginList[id] = window[id];
                    });
                });
            }
            return Promise.all(promises);
        }
    }
})();

Dali.API = (function(){
    return {
        addMenuButton: function(json){
            Dali.API.Private.emit(Dali.API.Private.events.addMenuButton, json);
        },
        openConfig: function(name, isUpdating){
            var promise = new Promise(function(resolve, reject){
                Dali.API.Private.listenAnswer(resolve, Dali.API.Private.events.openConfig);
            });
            Dali.API.Private.emit(Dali.API.Private.events.openConfig, {name: name, isUpdating: isUpdating});
            return promise;
        },
        renderPlugin: function(html, toolbar, config, sections, state, isUpdating, ids, initialParams){
            Dali.API.Private.emit(Dali.API.Private.events.render, {content: html, toolbar: toolbar, config: config, sections:sections, state: state, isUpdating: isUpdating, ids: ids, initialParams: initialParams});
        }
    }
})();

Dali.API.Private = (function(){

    var answerCallback;
    var configContainer;

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
            getCurrentPluginsList: {
                emit: 'getCurrentPluginsList',
                answer: 'getCurrentPluginsList_back'
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
        listenAnswer: function(resolve, event){
            answerCallback = this.cleanupAndResolve.bind(this, resolve, event);
            window.addEventListener(event.answer, answerCallback);
        },
        cleanupAndResolve: function(resolve, event, customEvent){
            window.removeEventListener(event.answer, answerCallback);
            resolve(customEvent.detail);
        }
    }
})();