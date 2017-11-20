import Ediphy from './main';
import BasePlugin from './base_plugin';

export default function() {
    let pluginInstancesList = {};

    return {
        get: function(name) {
            return pluginInstancesList[name];
        },
        getAll: function() {
            return pluginInstancesList;
        },
        getPluginsInCurrentView: function(getAliasedPlugins) {
            return this.getPluginsInView(null, getAliasedPlugins);
        },
        getPluginsInView: function(view, getAliasedPlugins) {
            let promise = new Promise(function(resolve) {
                Ediphy.API_Private.listenAnswer(Ediphy.API_Private.events.getPluginsInView, resolve);
            });
            Ediphy.API_Private.emit(Ediphy.API_Private.events.getPluginsInView, { view, getAliasedPlugins });

            return promise;
        },
        loadAll: function() {
            let pluginConfigs = [];

            Ediphy.Config.pluginList.map(id => {
                try {
                    let plugin = new BasePlugin();
                    Ediphy.Plugins[id] = require('./../../plugins/' + id + '/' + id)[id](plugin);
                    plugin.create(Ediphy.Plugins[id]);
                    plugin.init();
                    plugin.getLocales();
                    pluginInstancesList[id] = plugin;
                    pluginConfigs.push(plugin.getConfig());
                    plugin.getConfig().callback({}, 'INIT');

                    Ediphy.Visor.Plugins.add(id);
                } catch (e) {
                }
            });

            Ediphy.API.addMenuButtons(pluginConfigs);
        },
    };
}
