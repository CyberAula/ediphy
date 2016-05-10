Dali.Visor.Plugin = function(descendant){

    var parseJson = function(json, state, name){
        if(json.child){
            for(var i = 0; i < json.child.length; i++){
                parseJson(json.child[i], state, name);
            }
        }
        if(name && json.attr){
            Object.keys(json.attr).forEach(key => {
                if(typeof json.attr[key] === "string" && json.attr[key].indexOf("$dali$") !== -1) {
                    var fnName = json.attr[key].replace(/[$]dali[$][.]/g, "").replace(/[(].*[)]/g, "");
                    json.attr[key] = Dali.Plugins.get(name)[fnName];
                }
            });
        }
        if(json.tag && json.tag === "plugin"){
            if(!state['pluginContainerIds']){
                state['pluginContainerIds'] = {};
            }
            var key = json.attr['plugin-data-key'];
            if(!key){
                console.error(json.tag + " has not defined plugin-data-key");
            }else{
                if(state['pluginContainerIds'][key]){
                    json.attr['plugin-data-id'] = state['pluginContainerIds'][key];
                }
            }
        }
    }

    var plugin = {
        export(state, name, hasChildren){
            var plugin, template;
            if(!Dali.Visor.Plugins[name]) {
                plugin = Dali.Plugins[name]();
                template = plugin.getRenderTemplate(state).replace(/[$]dali[$][.]/g, "");
            } else {
                plugin = Dali.Visor.Plugins[name]();
                template = plugin.getRenderTemplate(state).replace(/[$]dali[$][.]/g, "");
            }
            if(template.indexOf("pointer-events") !== -1){
                template = template.replace(/pointer-events:[\s'"]+none[\s'"]+/g, "");
            }

            var scripts = "";
            Object.keys(plugin).map(function (fn) {
                if(fn !== 'init' &&
                    fn !== 'getConfig' &&
                    fn !== 'getToolbar' &&
                    fn !== 'getSections' &&
                    fn !== 'getInitialState' &&
                    fn !== 'handleToolbar' &&
                    fn !== 'getConfigTemplate' &&
                    fn !== 'getRenderTemplate'){
                    scripts += (scripts.length === 0 ? "<script type='text/javascript'>" : "") + plugin[fn].toString().replace("function", "function " + fn).replace(/\n/g, "").replace(/[ ]+/g, " ");
                }
            });
            if(scripts.length !== 0){
                scripts += "</script>";
            }

            var firstTag = template.substring(0, template.indexOf(">") + 1);
            template = template.substring(template.indexOf(">") + 1);
            var result = firstTag + scripts + template;
            if(!hasChildren) {
                return result;
            }
            var json = html2json(result);
            parseJson(json, state);
            return json;
        },
        render(state, name){
            var json;
            if(!Dali.Visor.Plugins[name]) {
                json = html2json(Dali.Plugins[name]().getRenderTemplate(state));
            }
            else{
                json = html2json(Dali.Visor.Plugins[name]().getRenderTemplate(state));
            }
            parseJson(json, state, name);
            return json;
        },
        callExtraFunction: function(alias, fnAlias) {
            var element = $.find("[data-alias='" + alias + "']");
            if (element && extraFunctions && extraFunctions[fnAlias]) {
                extraFunctions[fnAlias].bind(element[0])();
            }
        }
    }

    Object.keys(descendant).map(function(id) {
        if(id !== 'init' &&
            id !== 'getConfig' &&
            id !== 'getToolbar' &&
            id !== 'getSections' &&
            id !== 'getInitialState' &&
            id !== 'handleToolbar' &&
            id !== 'getConfigTemplate' &&
            id !== 'getRenderTemplate'){
            plugin[id] = descendant[id];
        }
    });

    return plugin;
};
