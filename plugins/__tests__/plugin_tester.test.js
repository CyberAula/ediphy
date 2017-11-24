import glob from 'glob';

const plugins = getPluginJSONs();

function getPluginJSONs() {
    return glob.sync("plugins/*/package.json");
}

describe('test is well formed', ()=>{
    test('does_get_plugin', ()=>{
        console.log(plugins);
        expect(plugins).toBeDefined();
    });
});
