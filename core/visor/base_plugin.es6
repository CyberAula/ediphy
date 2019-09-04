import Ediphy from '../editor/main';
import { correctArrayUnordered, correctNumericInput, correctTextInput } from './correction_functions';
let html2json = require('html2json').html2json;

export default function() {
    let descendant;
    let parseJson = function(json, state, hasVisorTemplate) {
        if (json.child) {
            for (let i = 0; i < json.child.length; i++) {
                if (json.child[i].tag && json.child[i].tag === "plugin") {
                    let height = state.__pluginContainerIds[json.child[i].attr['plugin-data-key']].height;
                    height = !isNaN(height) ? height + "px" : height;
                    json.child[i].attr["plugin-data-height"] = height;
                    if (!json.attr) {
                        json.attr = {
                            style: { height: height },
                        };
                    } else if (!json.attr.style) {
                        json.attr.style = { height: height };
                    } else {
                        json.attr.style.height = height;
                    }
                    if (json.attr.style.minHeight) {
                        delete json.attr.style.minHeight;
                    }
                }

                parseJson(json.child[i], state, hasVisorTemplate);
            }
        }
        if (json.attr && json.attr.className) {
            json.attr.class = json.attr.className;
            delete json.attr.className;
        }
        if (json.tag && json.tag === "plugin") {
            if (!state.__pluginContainerIds) {
                state.__pluginContainerIds = {};
            }
            let key = json.attr['plugin-data-key'];
            if (!key) {
                // eslint-disable-next-line no-console
                console.error(json.tag + " has not defined plugin-data-key");
            } else if (state.__pluginContainerIds[key]) {
                json.attr['plugin-data-id'] = state.__pluginContainerIds[key].id;
            }
        }
    };

    let plugin = {
        create: function(obj) {
            descendant = obj;

            Object.keys(descendant).map(function(id) {
                if (id !== 'init' &&
                    id !== 'getConfig' &&
                    id !== 'getToolbar' &&
                    id !== 'getInitialState' &&
                    id !== 'afterRender' &&
                    id !== 'getConfigTemplate' &&
                    id !== 'getRenderTemplate') {
                    plugin[id] = descendant[id];
                }
            });
            if (!plugin.checkAnswer) {
                plugin.checkAnswer = function(current, correct, state) {
                    if (current instanceof Array && correct instanceof Array) {
                        return correctArrayUnordered(current, correct, state.allowPartialScore, state.nBoxes || Math.max(correct.length, current.length));
                    }

                    if (typeof(current) === 'string' && typeof(correct) === 'string' && state.characters !== undefined) {
                        return correctTextInput(current, correct, !state.characters);
                    }

                    if (typeof(current) === 'number' && typeof(correct) === 'number') {
                        return correctNumericInput(current, correct, state.precision);
                    }

                    return JSON.stringify(current) === JSON.stringify(correct);
                };
            }
        },
        init: function() {
            if (descendant.init) {
                descendant.init();
            }
        },
        export: function(state, name, hasChildren, id = "") {
            let pluginObj, template, hasVisorTemplate;

            if (!Ediphy.Visor.Plugins[name]) {
                pluginObj = Ediphy.Plugins[name];
                hasVisorTemplate = false;
            } else {
                pluginObj = Ediphy.Visor.Plugins[name];
                hasVisorTemplate = true;
            }
            if (!pluginObj.getRenderTemplate) {
                if (state.__text) {
                    template = state.__text;
                } else {
                    template = "<div></div>";
                    // eslint-disable-next-line no-console
                    console.error("Plugin %s has not defined getRenderTemplate", name);
                }
            } else {
                template = pluginObj.getRenderTemplate(state);
            }

            let regexp = new RegExp(/[$]ediphy[$][.][\w\s]+[(]([^)]*)/g);
            let match = regexp.exec(template);
            let matches = [];

            while (match !== null) {
                matches.push(match);
                match = regexp.exec(template);
            }
            matches.map(function(matchNew) {
                if (matchNew[1].length === 0) {
                    // no traducir pasar directamente la función pasarle directamenete Ediphy.Visor.Plugins[match[0]].function(event,props,)
                    template = template.replace(matchNew[0], matchNew[0] + "event, \"" + id + "\""); // template.replace(match[0], match[0] + "event, this, __getPlugin(this)");
                } else {
                    template = template.replace(matchNew[0], matchNew[0].replace(matchNew[1], "event, \"" + id + "\"")); // template.replace(match[0], match[0].replace(match[1], "event, this, __getPlugin(this)"));
                }
                template = template.replace(/[$]ediphy[$][.]/, "Ediphy.Visor.Plugins." + name + ".");
            });

            if (template.indexOf("pointer-events") !== -1) {
                template = template.replace(/pointer-events:[\s'"]+none[\s'"]+/g, "");
            }

            /* if (!hasChildren) {
                return template;
            }*/
            let json = html2json(template);
            parseJson(json, state, hasVisorTemplate);
            return json;
        },
        /* registerExtraFunction: function(fn, alias) {
            if (!alias) {
                Object.keys(descendant).forEach(function(prop) {
                    if (descendant[prop] === fn) {
                        alias = prop;
                    }
                });
            }
            extraFunctions[alias] = fn;
        },
        getExtraFunctions: function() {
            return Object.keys(extraFunctions);
        },*/
        getLocales: function() {
            try {
                let currentLanguage = Ediphy.i18n.language;
                let texts = require('./../../plugins/' + this.getConfig().name + "/locales/" + currentLanguage);
                Ediphy.i18n.addResourceBundle(currentLanguage, 'translation', texts, true, false);
            } catch (e) {
            }
        },
        /* callExtraFunction: function(alias, fnAlias) {
            let element = $.find("[data-alias='" + alias + "']");
            if (element && extraFunctions && extraFunctions[fnAlias]) {
                extraFunctions[fnAlias](element[0]);
            }
        },*/
        afterRender: function(element, oldState) {
            if (descendant.afterRender) {
                descendant.afterRender(element, oldState);
            }
        },
    };

    return plugin;
}
