Dali.Visor.Plugin = function (descendant) {

    var parseJson = function (json, state, hasVisorTemplate, name) {
        if (json.child) {
            for (var i = 0; i < json.child.length; i++) {
                if (json.child[i].tag && json.child[i].tag === "plugin") {
                    var height = state['__pluginContainerIds'][json.child[i].attr['plugin-data-key']].height;
                    height = !isNaN(height) ? height + "px" : height;
                    json.child[i].attr["plugin-data-height"] = height;
                    if (!json.attr) {
                        json.attr = {
                            style: {height: height}
                        }
                    } else {
                        if (!json.attr.style) {
                            json.attr.style = {height: height}
                        } else {
                            json.attr.style.height = height;
                        }
                    }
                    if (json.attr.style.minHeight) {
                        delete json.attr.style.minHeight;
                    }
                }

                parseJson(json.child[i], state, hasVisorTemplate, name);
            }
        }
        if (name && json.attr) {
            Object.keys(json.attr).forEach(function(key) {
                if (typeof json.attr[key] === "string" && json.attr[key].indexOf("$dali$") !== -1) {
                    var fnName = json.attr[key].replace(/[$]dali[$][.]/g, "").replace(/[(].*[)]/g, "");
                    json.attr[key] = hasVisorTemplate ? Dali.Visor.Plugins.get(name)[fnName] : Dali.Plugins.get(name)[fnName];
                }
            });
        }
        if (!name && json.attr && json.attr["className"]) {
            json.attr["class"] = json.attr["className"];
            delete json.attr["className"];
        }
        if (json.tag && json.tag === "plugin") {
            if (!state['__pluginContainerIds']) {
                state['__pluginContainerIds'] = {};
            }
            var key = json.attr['plugin-data-key'];
            if (!key) {
                console.error(json.tag + " has not defined plugin-data-key");
            } else {
                if (state['__pluginContainerIds'][key]) {
                    json.attr['plugin-data-id'] = state['__pluginContainerIds'][key].id;
                }
            }
        }
    }

    var plugin = {
        export: function(state, name, hasChildren){
            var plugin, template, hasVisorTemplate;

            if (!Dali.Visor.Plugins[name]) {
                plugin = Dali.Plugins[name]();
                hasVisorTemplate = false;
            } else {
                plugin = Dali.Visor.Plugins[name]();
                hasVisorTemplate = true;
            }
            if (!plugin.getRenderTemplate) {
                if (state.__text) {
                    template = state.__text.replace(/[$]dali[$][.]/g, "");
                } else {
                    template = "<div></div>";
                    console.error("Plugin %s has not defined getRenderTemplate", name);
                }
            } else {
                template = plugin.getRenderTemplate(state).replace(/[$]dali[$][.]/g, "");
            }
            if (template.indexOf("pointer-events") !== -1) {
                template = template.replace(/pointer-events:[\s'"]+none[\s'"]+/g, "");
            }

            var scripts = "";
            Object.keys(plugin).map(function (fn) {
                if (fn !== 'init' &&
                    fn !== 'getConfig' &&
                    fn !== 'getToolbar' &&
                    fn !== 'getSections' &&
                    fn !== 'getInitialState' &&
                    fn !== 'handleToolbar' &&
                    fn !== 'getConfigTemplate' &&
                    fn !== 'getRenderTemplate') {
                    scripts += (scripts.length === 0 ? "<script type='text/javascript'>" : "") + plugin[fn].toString().replace("function", "function " + fn).replace(/\n/g, "").replace(/[ ]+/g, " ");
                }
            });
            if (scripts.length !== 0) {
                scripts += "</script>";
            }

            var firstTag = template.substring(0, template.indexOf(">") + 1);
            template = template.substring(template.indexOf(">") + 1);
            var result = firstTag + scripts + template;
            if (!hasChildren) {
                return result;
            }
            var json = html2json(result);
            parseJson(json, state, hasVisorTemplate);
            return json;
        },
        render: function(state, name){
            var json, plugin, hasVisorTemplate;

            if (!Dali.Visor.Plugins[name]) {
                plugin = Dali.Plugins[name]();
                hasVisorTemplate = false;
            } else {
                plugin = Dali.Visor.Plugins[name]();
                hasVisorTemplate = true;
            }
            if (!plugin.getRenderTemplate) {
                if (state.__text) {
                    json = html2json(state.__text);
                } else {
                    json = html2json("<div></div>");
                    console.error("Plugin %s has not defined getRenderTemplate", name);
                }
            } else {
                json = html2json(plugin.getRenderTemplate(state));
            }
            parseJson(json, state, hasVisorTemplate, name);
            return json;
        },
        callExtraFunction: function (alias, fnAlias) {
            var element = $.find("[data-alias='" + alias + "']");
            if (element && extraFunctions && extraFunctions[fnAlias]) {
                extraFunctions[fnAlias].bind(element[0])();
            }
        }
    }

    Object.keys(descendant).map(function (id) {
        if (id !== 'init' &&
            id !== 'getConfig' &&
            id !== 'getToolbar' &&
            id !== 'getSections' &&
            id !== 'getInitialState' &&
            id !== 'handleToolbar' &&
            id !== 'getConfigTemplate' &&
            id !== 'getRenderTemplate') {
            plugin[id] = descendant[id];
        }
    });

    return plugin;
};
