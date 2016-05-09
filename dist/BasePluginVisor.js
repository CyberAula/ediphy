Dali.Visor.Plugin = function(descendant){
    var plugin = {
        renderAsText(state, name){
            var plugin;
            if(!Dali.Visor.Plugins[name]) {
                plugin = Dali.Plugins[name]().getRenderTemplate(state);
            }else {
                plugin = Dali.Visor.Plugins[name];
            }

            var template = plugin.getRenderTemplate(state);
            if(template.indexOf("pointer-events") !== -1){
                template = template.replace(/pointer-events:[\s'"]+none[\s'"]+/g, "");
            }

            var scripts = "<script type='text/javascript'>";
            Object.keys(plugin).map(function (fn) {
                if(fn !== 'init' &&
                    fn !== 'getConfig' &&
                    fn !== 'getToolbar' &&
                    fn !== 'getSections' &&
                    fn !== 'getInitialState' &&
                    fn !== 'handleToolbar' &&
                    fn !== 'getConfigTemplate' &&
                    fn !== 'getRenderTemplate'){
                    scripts += plugin[fn].toString().replace("function", "function " + fn).replace(/\n/g, "").replace(/[ ]+/g, " ");
                }
            });
            scripts += "</script>";

            var firstTag = template.substring(0, template.indexOf(">") + 1);
            template = template.substring(template.indexOf(">") + 1);

            return firstTag + scripts + template;
        },
        renderAsComponent(state, name){
            if(!Dali.Visor.Plugins[name]) {
                return html2json(Dali.Plugins[name]().getRenderTemplate(state));
            }
            return html2json(Dali.Visor.Plugins[name]().getRenderTemplate(state));
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
