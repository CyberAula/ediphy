import glob from 'glob';

const plugins = getPluginProvider();

function getPluginProvider() {
    let files = glob.sync("plugins/*/package.json");
    console.log(files);
    let final_object = {};
    for(let packageit in files) {
        let json = stub.returns(require.requireActual("../" + files[packageit]));
        let dependencies = json.dependencies;
        var config = json.config;
        if(dependencies) {
            Object.keys(dependencies).map(function(e) {
                if(config && config.aliases && config.aliases[e]) {
                    final_object[config.aliases[e]] = e;
                } else {
                    final_object[toCamelCase(e)] = e;
                }
            });
        }
    }
    return final_object;
}

describe('test is well formed', ()=>{
    test('does_get_plugin', ()=>{
        expect(plugins).toBeDefined();
    });
});
