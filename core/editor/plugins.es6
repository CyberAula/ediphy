import Ediphy from './main';
import BasePlugin from './base_plugin';

export default function() {
    let pluginInstancesList = {};
    let pluginConfigs = [];
    return {
        get: function(name) {
            return pluginInstancesList[name];
        },
        getAll: function() {
            return pluginInstancesList;
        },
        loadAll: function() {

            Ediphy.Config.pluginList.map(id => {
                try {
                    let plugin = new BasePlugin();
                    Ediphy.Plugins[id] = require('./../../plugins/' + id + '/' + id)[id](plugin);
                    plugin.create(Ediphy.Plugins[id]);
                    plugin.init();
                    plugin.getLocales();
                    pluginInstancesList[id] = plugin;
                    pluginConfigs.push(plugin.getConfig());
                    // plugin.getConfig().callback({}, 'INIT');

                    Ediphy.Visor.Plugins.add(id);
                } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                }
            });
        },
        getPluginConfigs: function() {
            return pluginConfigs;
        },
    };
}
