import Dali from './main';
import BasePlugin from './base_plugin';
import BasePluginVisor from './visor/base_plugin';

export default function () {
    var pluginInstancesList = {};

    return {
        get: function (name) {
            return pluginInstancesList[name];
        },
        getAll: function () {
            return pluginInstancesList;
        },
        getPluginsInCurrentView: function (getAliasedPlugins) {
            return this.getPluginsInView(null, getAliasedPlugins);
        },
        getPluginsInView: function (view, getAliasedPlugins) {
            var promise = new Promise(function (resolve) {
                Dali.API_Private.listenAnswer(Dali.API_Private.events.getPluginsInView, resolve);
            });
            Dali.API_Private.emit(Dali.API_Private.events.getPluginsInView, {view, getAliasedPlugins});

            return promise;
        },
        loadAll: function () {
            let pluginConfigs = [];

            Dali.Config.pluginList.map(id => {
                try {
                    let plugin = new BasePlugin();
                    Dali.Plugins[id] = require('./../plugins/' + id + '/' + id)[id](plugin);
                    plugin.create(Dali.Plugins[id]);
                    plugin.init();
                    plugin.getLocales();
                    pluginInstancesList[id] = plugin;
                    pluginConfigs.push(plugin.getConfig());

                    Dali.Visor.Plugins.add(id);
                } catch (e) {
                }
            });

            Dali.API.addMenuButtons(pluginConfigs);
        }
    };
}