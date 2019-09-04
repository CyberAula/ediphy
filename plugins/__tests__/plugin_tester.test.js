import configFile from './../../core/config';
import fs from 'fs';
import glob from 'glob';
import { shallow } from 'enzyme';
import BasePlugin from '../../core/editor/base_plugin';
import BasePluginVisor from '../../core/visor/base_plugin';
import { ID_PREFIX_BOX } from '../../common/constants';
let PJV = require('package-json-validator').PJV;
const id_box = ID_PREFIX_BOX + 1;
const mock_props = { "exercises": { "correctAnswer": [] }, id: id_box, pluginToolbars: {} };

describe('plugins package.json is well formed', ()=>{

    beforeEach(jest.resetModules);
    const plugins = glob.sync("plugins/*/package.json");

    plugins.forEach((element) => {
        test('JSON ' + element + ' is well formed', ()=>{
            expect(PJV.validate(fs.readFileSync(element, 'utf8'), "npm").valid).toBeTruthy();
        });
    });
});

let plugin_folders = glob.sync("plugins/*", { ignore: ["plugins/__tests__", "plugins/plugin_dependencies_loader.js"] });
const pluginList = configFile.pluginList;
plugin_folders = plugin_folders.filter((element) => pluginList.includes(element.split("plugins/")[1]));

plugin_folders.forEach((plugin)=>{

    describe('plugin main file is correctly formed', ()=> {
        beforeEach(jest.resetModules);
        global.Ediphy = jest.fn({});
        global.Ediphy.i18n = jest.fn({});
        global.Ediphy.i18n.t = jest.fn(()=>"translation");

        // test(plugin.split("plugins/")[1] + ' main file exist', () => {
        //     let main_file = fs.readFileSync(plugin + "/" + plugin.split("plugins/")[1] + ".js", 'utf8');
        //     expect(main_file).toBeTruthy();
        // });

        let baseplugin = new BasePlugin();
        let current_plugin = jest.requireActual("./../../" + plugin + "/" + plugin.split("plugins/")[1])[plugin.split("plugins/")[1]](baseplugin);

        test(plugin.split("plugins/")[1] + 'plugin can be imported', () => {
            expect(current_plugin).toBeDefined();
            expect(current_plugin).toHaveProperty('getConfig');
            expect(current_plugin).toHaveProperty('getToolbar');
        });

        test(plugin.split("plugins/")[1] + ' getConfig correctly formed', () => {
            let config = current_plugin.getConfig();
            expect(config.name).toBeDefined();
        });

        if (current_plugin.hasOwnProperty('getInitialState')) {
            test(plugin.split("plugins/")[1] + 'plugin has initialState and is valid', () => {
                expect(current_plugin.getInitialState()).toBeTruthy();
            });
        }

        if (current_plugin.hasOwnProperty('getRenderTemplate')) {
            test(plugin.split("plugins/")[1] + 'plugin has getRenderTemplate and is valid', () => {
                const pluginRender = shallow(current_plugin.getRenderTemplate(current_plugin.getInitialState(), mock_props));
                expect(pluginRender).toBeTruthy();
            });
        }

        if (current_plugin.hasOwnProperty('getConfigTemplate')) {
            test(plugin.split("plugins/")[1] + 'plugin has getConfigTemplate and is valid', () => {
                expect(current_plugin.getConfigTemplate(id_box, current_plugin.getInitialState(), ()=>{}, {})).toBeTruthy();
            });
        }

        if (current_plugin.hasOwnProperty('afterRender')) {
            test(plugin.split("plugins/")[1] + 'plugin has afterRender and is valid', () => {
                expect(current_plugin.afterRender()).toBeTruthy();
            });
        }

        if (current_plugin.hasOwnProperty('init')) {
            test(plugin.split("plugins/")[1] + 'plugin has init and is valid', () => {
                expect(current_plugin.init).toBeTruthy();
            });
        }
    });

    describe('plugin visor file is correctly formed', ()=> {
        beforeEach(jest.resetModules);
        global.Ediphy = jest.fn({});
        global.Ediphy.i18n = jest.fn({});
        global.Ediphy.i18n.t = jest.fn(()=>"translation");

        if(fs.existsSync("./" + plugin + "/visor/" + plugin.split("plugins/")[1] + ".js")) {
            let basepluginvisor = new BasePluginVisor();
            let current_plugin = jest.requireActual("./../../" + plugin + "/visor/" + plugin.split("plugins/")[1])[plugin.split("plugins/")[1]](basepluginvisor);

            test(plugin.split("plugins/")[1] + 'plugin visor can be imported', () => {
                expect(current_plugin).toBeDefined();
                expect(current_plugin).toHaveProperty('getRenderTemplate');
            });
        }
    });

    describe('plugin has locales files correctly formed', ()=> {
        beforeEach(jest.resetModules);
        global.Ediphy = jest.fn({});
        global.Ediphy.i18n = jest.fn({});
        global.Ediphy.i18n.t = jest.fn(() => "translation");

        test('Testing English language ' + plugin + ' locales', ()=>{
            let locales = jest.requireActual("./../../" + plugin + "/locales/" + "en");
            expect(locales).toBeDefined();
        });

        test('Testing Spanish language ' + plugin + ' locales', ()=>{
            let locales = jest.requireActual("./../../" + plugin + "/locales/" + "es");
            expect(locales).toBeDefined();
        });
    });

});
