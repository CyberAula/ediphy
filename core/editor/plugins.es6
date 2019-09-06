import Ediphy from './main';
import BasePlugin from './basePlugin';
import { extensions } from '../../common/constants';
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

            Ediphy.Config.pluginFileMap = {};
            (extensions).map(ext=>{
                Ediphy.Config.pluginFileMap[ext] = {};
            });
            Ediphy.Config.pluginList.map(id => {
                try {
                    let plugin = new BasePlugin();
                    Ediphy.Plugins[id] = require('./../../plugins/' + id + '/' + id)[id](plugin);

                    plugin.create(Ediphy.Plugins[id]);
                    plugin.init();
                    plugin.getLocales();
                    pluginInstancesList[id] = plugin;
                    let config = plugin.getConfig();
                    if (config.createFromLibrary) {
                        let lib = config.createFromLibrary;
                        let mime = 'all';
                        let key = 'url';
                        if(lib instanceof Array) {
                            mime = lib[0] || mime;
                            key = lib[1] || key;
                        }
                        let allowedExtensions = (extensions).filter(ext=>{ return mime.match(ext);});
                        allowedExtensions.map(ext => {
                            Ediphy.Config.pluginFileMap[ext][id] = key;
                        }
                        );

                    }
                    pluginConfigs.push(config);
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
