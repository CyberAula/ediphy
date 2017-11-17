import Ediphy from '../editor/main';
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
        add: function(name) {
            let basePlugin = new BasePlugin();
            Ediphy.Visor.Plugins[name] = require('./../../plugins/' + name + '/' + name)[name](basePlugin);
            try {
                Ediphy.Visor.Plugins[name] = require('./../../plugins/' + name + '/visor/' + name)[name](basePlugin);
            } catch (e) {
            }

            basePlugin.create(Ediphy.Visor.Plugins[name]);
            basePlugin.init();
            pluginInstancesList[name] = basePlugin;
        },
    };
}
