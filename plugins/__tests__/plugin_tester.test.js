import fs from 'fs';
import glob from 'glob';
import BasePlugin from '../../core/editor/base_plugin';
let PJV = require('package-json-validator').PJV;

describe('plugins package.json is well formed', ()=>{
    const plugins = glob.sync("plugins/*/package.json");

    plugins.forEach((element) => {
        test('JSON ' + element + ' is well formed', ()=>{
            expect(PJV.validate(fs.readFileSync(element, 'utf8'), "npm").valid).toBeTruthy();
        });
    });
});

describe('plugins are correctly formed', ()=>{

    const plugin_folders = glob.sync("plugins/*", { ignore: ["plugins/__tests__", "plugins/plugin_dependencies_loader.js"] });

    plugin_folders.forEach((plugin)=>{

        test(plugin.split("plugins/")[1] + ' main file exist', ()=>{
            let main_file = fs.readFileSync(plugin + "/" + plugin.split("plugins/")[1] + ".js", 'utf8');
            expect(main_file).toBeTruthy();
        });

        test(plugin.split("plugins/")[1] + 'plugin can be imported', ()=>{
            let baseplugin = new BasePlugin();
            let current_plugin = require.requireActual("./../../" + plugin + "/" + plugin.split("plugins/")[1])[plugin.split("plugins/")[1]](baseplugin);

            expect(current_plugin).toBeDefined();
            expect(current_plugin).toHaveProperty('getConfig');
            expect(current_plugin).toHaveProperty('getToolbar');
        });

        test(plugin.split("plugins/")[1] + 'plugin has visor', ()=>{
            // let baseplugin = new BasePlugin();
            // let current_plugin  = require.requireActual("./../../" + plugin + "/visor/" + plugin.split("plugins/")[1])[plugin.split("plugins/")[1]](baseplugin);

        });

    });
});
