Dali.Plugins = (function () {
    var pluginInstancesList = {};
    var plugins = [
        'BasicImage',
        'BasicText',
        'BasicVideo',
        'Youtube',
        'Webpage',
        'CajasColor',
        'CajasColorBis',
        'Container',
        'ListaNumerada',
        'RelacionaAll'
    ];

    var loadPluginFile = function (name) {
        var promise = new Promise(function (resolve) {
            $.ajax({
                url: ("plugins/" + name + "/" + name + ".js"),
                dataType: 'script',
                success: function () { // callback for successful completion
                    $.ajax({
                        url: ("plugins/" + name + "/visor/" + name + ".js"),
                        dataType: 'script',
                        complete: function () {
                            Dali.Visor.Plugins.add(name);
                        }
                    });
                },
                complete: function(xhr, status){
                    if(status === "success") {
                        resolve(name);
                    }else{
                        resolve();
                    }
                }
            });
        });
        return promise;
    };

    return {
        get: function (name) {
            return pluginInstancesList[name];
        },
        getAll: function () {
            return pluginInstancesList;
        },
        getPluginsInCurrentView: function (getAliasedPugins) {
            return this.getPluginsInView(null, getAliasedPugins);
        },
        getPluginsInView: function (view, getAliasedPugins) {
            var promise = new Promise(function (resolve) {
                Dali.API.Private.listenAnswer(Dali.API.Private.events.getPluginsInView, resolve);
            });
            Dali.API.Private.emit(Dali.API.Private.events.getPluginsInView, {view, getAliasedPugins});

            return promise;
        },
        loadAllAsync: function () {
            var promises = [];
            plugins.map(function (id, index) {
                promises.push(loadPluginFile(id));
                promises[index].then(function (name) {
                    if(name) {
                        var plugin = new Dali.Plugin();
                        plugin.create(Dali.Plugins[name](plugin));
                        pluginInstancesList[name] = plugin;
                    }
                });
            });
            return Promise.all(promises);
        }
    }
})();

Dali.Visor.Plugins = (function () {
    var pluginInstancesList = {};
    return {
        get: function (name) {
            return pluginInstancesList[name];
        },
        getAll: function () {
            return pluginInstancesList;
        },
        add: function (name) {
            var basePlugin = new Dali.Visor.Plugin();
            var plugin;
            if (Dali.Visor.Plugins[name]) {
                plugin = Dali.Visor.Plugins[name](basePlugin);
            } else {
                plugin = Dali.Plugins[name](basePlugin);
            }
            basePlugin.create(plugin);
            basePlugin.init();
            pluginInstancesList[name] = basePlugin;
        }
    }
})();