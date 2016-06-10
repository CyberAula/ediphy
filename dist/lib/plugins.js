Dali.Plugins = (function () {
    var pluginInstancesList = {};
    var plugins = [
        'BasicImage',
        'BasicText',
        'BasicVideo',
        'Youtube',
        'Webpage',
        'BasicPills',
        'BasicQuizConnect',
        'CajasColor',
        'CajasColorBis',
        'Container'
    ];

    var loadPluginFile = function (name) {
        var promise = new Promise(function (resolve) {
            $.ajax({
                url: ("plugins/" + name + "/" + name + ".js"),
                dataType: 'script',
                success: function () { // callback for successful completion
                    resolve(name);
                    $.ajax({
                        url: ("plugins/" + name + "/visor/" + name + ".js"),
                        dataType: 'script',
                        complete: function () {
                            Dali.Visor.Plugins.add(name);
                        }
                    });
                }
            });
        });
        return promise;
    };

    var pluginFactory = function (name) {
        var plugin = new Dali.Plugin();
        plugin.create(Dali.Plugins[name](plugin));
        return plugin;
    }

    return {
        get: function (name) {
            return pluginInstancesList[name];
        },
        getAll: function () {
            return pluginInstancesList;
        },
        getPluginsInCurrentView: function (getAliasedPugins) {
            return getPluginsInView(null, getAliasedPugins);
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
                    pluginInstancesList[name] = pluginFactory(name);
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
            if (Dali.Visor.Plugins[name]) {
                pluginInstancesList[name] = new Dali.Visor.Plugin(Dali.Visor.Plugins[name]());
            } else {
                pluginInstancesList[name] = new Dali.Visor.Plugin(Dali.Plugins[name]());
            }
        }
    }
})();