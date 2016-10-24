import Dali from './../main';
import BasePlugin from './base_plugin';

export default function () {
    var pluginInstancesList = {};
    return {
        get: function (name) {
            return pluginInstancesList[name];
        },
        getAll: function () {
            return pluginInstancesList;
        },
        add: function (name) {
            let basePlugin = new BasePlugin();
            Dali.Visor.Plugins[name] = require('./../../plugins/' + name + '/' + name)[name](basePlugin);
            try {
                Dali.Visor.Plugins[name] = require('./../../plugins/' + name + '/visor/' + name)[name](basePlugin);
            } catch (e) {
            }

            basePlugin.create(Dali.Visor.Plugins[name]);
            basePlugin.init();
            pluginInstancesList[name] = basePlugin;
        }
    };
}