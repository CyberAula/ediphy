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
    }

    return {
        get: function(name){
            return pluginList[name];
        },
        loadAllAsync: function(){
            if(!pluginList) {
                pluginList = {};
                var promises = [];
                plugins.map(function (id, index) {
                    promises.push(loadPluginFile(id));
                    promises[index].then(function(value){
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
        openConfig: function(name){
            var promise = new Promise(function(resolve, reject){
                Dali.API.Private.listenAnswer(resolve, Dali.API.Private.events.openConfig);
            });
            Dali.API.Private.emit(Dali.API.Private.events.openConfig, name);
            return promise;
        },
        renderPlugin: function(html, toolbar){
            Dali.API.Private.emit(Dali.API.Private.events.render, {content: html, toolbar: toolbar});
        }
    }
})();

Dali.API.Private = (function(){

    var answerCallback;

    var configContainer;

    return {
        events: {
            addMenuButton: {
                emit: 'addMenuButton',
                subscribed: false
            },
            render: {
                emit: 'render',
                answer: 'render_back',
                subscribed: false
            },
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back',
                subscribed: false
            }
        },
        emit: function(name, params) {
            var event = new CustomEvent(name.emit, {'detail': params});
            window.dispatchEvent(event);
        },
        listenEmission: function(event, callback){
            if(!event.subscribed){
                window.addEventListener(event.emit, callback);
                event.subscribed = true;
            }
        },
        answer: function(name, params){
            var event = new CustomEvent(name.answer, {'detail': params});
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