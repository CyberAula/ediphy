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
            Dali.API.Private.emit(Dali.API.Private.events.openConfig, {name});
            return promise;
        },
        renderPlugin: function(html, toolbar, config, state, isUpdating){
            Dali.API.Private.emit(Dali.API.Private.events.render, {content: html, toolbar, config, state, isUpdating});
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
                maxTimesSubscribed: 1,
                timesSubscribed: 0
            },
            render: {
                emit: 'render',
                answer: 'render_back',
                maxTimesSubscribed: 2,
                timesSubscribed: 0
            },
            openConfig: {
                emit: 'openConfig',
                answer: 'openConfig_back',
                maxTimesSubscribed: 1,
                timesSubscribed: 0
            }
        },
        emit: function(name, params) {
            var event = new CustomEvent(name.emit, {'detail': params});
            window.dispatchEvent(event);
        },
        listenEmission: function(event, callback){
            if(event.timesSubscribed < event.maxTimesSubscribed){
                window.addEventListener(event.emit, callback);
                event.timesSubscribed++;
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