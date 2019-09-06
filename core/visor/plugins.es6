import Ediphy from '../editor/main';
import BasePlugin from './basePlugin';

export default function() {
    let pluginInstancesList = {};
    return {
        get: function(name) {
            return pluginInstancesList[name];
        },
        getAll: function() {
            return pluginInstancesList;
        },
        add: function(name) {
            let basePlugin = new BasePlugin();
            Ediphy.Visor.Plugins[name] = require('./../../plugins/' + name + '/' + name)[name](basePlugin);
            let config = Ediphy.Visor.Plugins[name].getConfig();
            try {
                Ediphy.Visor.Plugins[name] = require('./../../plugins/' + name + '/visor/' + name)[name](basePlugin);
            } catch (e) {
            }
            Ediphy.Visor.Plugins[name].getConfig = () => { return config; };

            basePlugin.create(Ediphy.Visor.Plugins[name]);
            basePlugin.init();
            basePlugin.getConfig = () => { return config; };
            basePlugin.getLocales();
            // basePlugin.init();
            pluginInstancesList[name] = basePlugin;
        },
    };
}
