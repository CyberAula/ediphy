var Dali = {};
Dali.Visor = {};

Dali.Visor.Plugins = (function(){
    var pluginList = {};

    return{
        get: function(name){
            return pluginList[name];
        },
        getAll: function(){
            return pluginList;
        },
        add: function(name, success){
            if(success) {
                pluginList[name] = new Dali.Visor.Plugin(Dali.Visor.Plugins[name]());
            }else{
                pluginList[name] = new Dali.Visor.Plugin(Dali.Plugins[name]());
            }
        }
    }
})();

Dali.Plugins = (function(){
    var pluginList = {};

    var loadPluginFile = function(name){
        var promise = new Promise(function(resolve) {
            $.ajax({
                url: ("plugins/" + name + "/" + name + ".js"),
                dataType: 'script',
                success: function() { // callback for successful completion
                    resolve(name);
                    $.ajax({
                        url: ("plugins/" + name + "/visor/" + name + ".js"),
                        dataType: 'script',
                        success: function(){
                            Dali.Visor.Plugins.add(name, true);
                        },
                        error: function(){
                            Dali.Visor.Plugins.add(name, false);
                        }
                    });
                }
            });
        });

        return promise;
    };

    var pluginFactory = function(name){
        var plugin = new Dali.Plugin();
        plugin.create(Dali.Plugins[name](plugin));
        return plugin;
    }

    return {
        get: function(name){
            return pluginList[name];
        },
        getAll: function(){
            return pluginList;
        },
        getPluginsInCurrentView: function(){
            var promise = new Promise(function(resolve){
                Dali.API.Private.listenAnswer(resolve, Dali.API.Private.events.getPluginsInCurrentView);
            });
            Dali.API.Private.emit(Dali.API.Private.events.getPluginsInCurrentView);

            return promise;
        },
        loadAllAsync: function() {
            var promises = [];
            plugins.map(function (id, index) {
                promises.push(loadPluginFile(id));
                promises[index].then(function (name) {
                    pluginList[name] = pluginFactory(name);
                });
            });
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