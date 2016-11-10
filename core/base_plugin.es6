import Dali from './main';
import ReactDOM from 'react-dom';

export default function () {
    var descendant, state, id, initialParams;

    var defaultFor = function (arg, value, warn) {
        if (typeof arg !== 'undefined') {
            return arg;
        }

        if (warn) {
            console.warn(warn);
        }
        return value;
    };

    var assignPluginContainerIds = function (json) {
        if (json.child) {
            for (var i = 0; i < json.child.length; i++) {
                assignPluginContainerIds(json.child[i]);
            }
        }
        if (json.tag && json.tag === "plugin") {
            if (!state.__pluginContainerIds) {
                state.__pluginContainerIds = {};
            }
            var key = json.attr['plugin-data-key'];
            if (!key) {
                console.error(json.tag + " has not defined plugin-data-key");
            } else {
                if (state.__pluginContainerIds[key]) {
                    json.attr['plugin-data-id'] = state.__pluginContainerIds[key].id;
                    json.attr['plugin-data-display-name'] = state.__pluginContainerIds[key].name;
                    json.attr['plugin-data-height'] = state.__pluginContainerIds[key].height;
                }
            }
        }
    };

    var plugin = {
        create: function (obj) {
            descendant = obj;

            Object.keys(descendant).map(function (id) {
                if (id !== 'init' &&
                id !== 'getConfig' &&
                id !== 'getToolbar' &&
                id !== 'getSections' &&
                id !== 'getInitialState' &&
                id !== 'handleToolbar' &&
                id !== 'afterRender' &&
                id !== 'getConfigTemplate' &&
                id !== 'getRenderTemplate' &&
                id !== 'getLocales') {
                    plugin[id] = descendant[id];
                }
            });
        },
        init: function () {
            if (descendant.init) {
                descendant.init();
            }
        },
        getLocales: function () {
            try {
                let currentLanguage = Dali.i18n.language;
                let texts = require('./../plugins/' + this.getConfig().name + "/locales/" + currentLanguage);
                Dali.i18n.addResourceBundle(currentLanguage, 'translation', texts, true, false);
            } catch (e) {
            }
        },
        getConfig: function () {
            var name, displayName, category, callback, needsConfigModal, needsTextEdition, extraTextConfig,
            needsXMLEdition, icon, aspectRatioButtonConfig, isRich, flavor;
            if (descendant.getConfig) {
                let cfg = descendant.getConfig();
                name = cfg.name;
                displayName = cfg.displayName;
                category = cfg.category;
                icon = cfg.icon;
                isRich = cfg.isRich;
                flavor = cfg.flavor;
                needsConfigModal = cfg.needsConfigModal;
                needsTextEdition = cfg.needsTextEdition;
                extraTextConfig = cfg.extraTextConfig;
                needsXMLEdition = cfg.needsXMLEdition;
                aspectRatioButtonConfig = cfg.aspectRatioButtonConfig;
            }

            name = defaultFor(name, 'PluginName', "Plugin name not assigned");
            displayName = defaultFor(displayName, 'Plugin', "Plugin displayName not assigned");
            category = defaultFor(category, 'text', "Plugin category not assigned");
            icon = defaultFor(icon, 'fa-cogs', "Plugin icon not assigned");
            isRich = defaultFor(isRich, false);
            flavor = defaultFor(flavor, 'plain');
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsTextEdition = defaultFor(needsTextEdition, false);
            needsXMLEdition = defaultFor(needsXMLEdition, false);

            if (aspectRatioButtonConfig) {
                aspectRatioButtonConfig.name = Dali.i18n.t("Aspect_ratio");
                aspectRatioButtonConfig.location = defaultFor(aspectRatioButtonConfig.location, ["main", "__extra"], "Aspect ratio button location not defined");
                if (!Array.isArray(aspectRatioButtonConfig.location) || aspectRatioButtonConfig.location.length < 2 || aspectRatioButtonConfig.location.length > 3) {
                    console.error("Aspect ratio button location malformed");
                }
                aspectRatioButtonConfig.defaultValue = defaultFor(aspectRatioButtonConfig.defaultValue, "unchecked");
            }

            callback = function (initParams, reason) {
                state = {};
                if (descendant.getInitialState) {
                    state = descendant.getInitialState();
                }
                if (needsTextEdition) {
                    if (!state.__text) {
                        state.__text = Dali.i18n.t("text_here");
                    }
                    if (!descendant.getRenderTemplate) {
                        descendant.getRenderTemplate = function (state) {
                            return state.__text;
                        };
                    }
                }
                if (needsXMLEdition) {
                    if (!state.__xml) {
                        state.__xml = null;
                    }
                }
                if(isRich){
                    if(!state.__marks){
                        state.__marks = {};
                    }
                }
                initialParams = initParams;
                if(descendant.getConfig().initialWidth){
                    initialParams.width = descendant.getConfig().initialWidth;
                }
                if (needsConfigModal) {
                    this.openConfigModal(reason, state);
                } else {
                    this.render(reason);
                }
            }.bind(this);

            return {
                name: name,
                displayName: displayName,
                category: category,
                callback: callback,
                needsConfigModal: needsConfigModal,
                needsTextEdition: needsTextEdition,
                extraTextConfig: extraTextConfig,
                needsXMLEdition: needsXMLEdition,
                aspectRatioButtonConfig: aspectRatioButtonConfig,
                icon: icon,
                isRich: isRich,
                flavor: flavor
            };
        },
        getToolbar: function () {
            var toolbar;
            if (descendant.getToolbar) {
                toolbar = descendant.getToolbar();
            }
            toolbar = defaultFor(toolbar, {});

            for (var tabKey in toolbar) {
                toolbar[tabKey].__name = defaultFor(toolbar[tabKey].__name, tabKey);
                var accordions = defaultFor(toolbar[tabKey].accordions, {}, "Property accordions in tab '" + tabKey + "' not found");
                toolbar[tabKey].accordions = accordions;
                for (var accordionKey in accordions) {
                    var button;
                    accordions[accordionKey].__name = defaultFor(accordions[accordionKey].__name, accordionKey, "Property __name in accordion '" + accordionKey + "' not found");
                    var buttons = defaultFor(accordions[accordionKey].buttons, {}, "Property buttons in accordion '" + accordionKey + "' not found");
                    accordions[accordionKey].buttons = buttons;
                    for (var buttonKey in buttons) {
                        button = buttons[buttonKey];
                        button.__name = defaultFor(button.__name, buttonKey, "Property __name in button '" + buttonKey + "' not found");
                        button.autoManaged = defaultFor(button.autoManaged, true);
                        if (!button.callback && !button.autoManaged) {
                            button.callback = this.update.bind(this);
                        }
                    }
                    if (accordions[accordionKey].accordions || accordions[accordionKey].order) {
                        var accordions2 = defaultFor(accordions[accordionKey].accordions, {}, "Property accordions in accordion '" + accordionKey + "' not found");
                        accordions[accordionKey].accordions = accordions2;
                        accordions[accordionKey].order = defaultFor(accordions[accordionKey].order, [], "Property order in accordion '" + accordionKey + "' not found");
                        if (accordions[accordionKey].order.length !== (Object.keys(buttons).length + Object.keys(accordions2).length)) {
                            console.warn("Accordion '%s' in tab '%s' malformed. Order property length differs from expected", accordionKey, tabKey);
                        }
                        for (var accordionKey2 in accordions2) {
                            accordions2[accordionKey2].__name = defaultFor(accordions2[accordionKey2].__name, accordionKey2, "Property __name in accordion '" + accordionKey2 + "' not found");
                            buttons = defaultFor(accordions2[accordionKey2].buttons, {}, "Property buttons in accordion '" + accordionKey2 + "' not found");
                            accordions2[accordionKey2].buttons = buttons;
                            for (buttonKey in buttons) {
                                button = buttons[buttonKey];
                                button.__name = defaultFor(button.__name, buttonKey, "Property __name in button '" + buttonKey + "' not found");
                                button.autoManaged = defaultFor(button.autoManaged, true);
                                if (!button.callback && !button.autoManaged) {
                                    button.callback = this.update.bind(this);
                                }
                            }
                        }
                    }
                }
            }
            return toolbar;
        },
        openConfigModal: function (reason, oldState, sender) {
            state = oldState;
            id = sender;

            if (!descendant.getConfigTemplate) {
                if (this.getConfig().needsConfigModal) {
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
                }
            } else {
                Dali.API.openConfig(this.getConfig().name).then(function (div) {
                    if(this.getConfig().flavor !== 'react'){
                        div.innerHTML = descendant.getConfigTemplate(oldState).replace(/[$]dali[$]/g, "Dali.Plugins.get('" + this.getConfig().name + "')");
                    } else {
                        ReactDOM.render(descendant.getConfigTemplate(oldState), div);
                    }
                }.bind(this));
            }
        },
        forceUpdate: function (oldState, sender, reason) {
            state = oldState;
            id = sender;
            this.render(reason);
        },
        render: function (reason) {
            // Posible reasons:
            // ADD_BOX,
            // ADD_RICH_MARK,
            // EDIT_RICH_MARK,
            // DELETE_RICH_MARK,
            // UPDATE_TOOLBAR,
            // UPDATE_BOX,
            // RESIZE_SORTABLE_CONTAINER,
            // EDIT_PLUGIN_TEXT,
            // UPDATE_NAV_ITEM_EXTRA_FILES

            if (!descendant.getRenderTemplate) {
                console.error(this.getConfig().name + " has not defined getRenderTemplate method");
            } else {
                var template = descendant.getRenderTemplate(state);
                if(this.getConfig().flavor !== "react") {
                    template = html2json(template);
                    assignPluginContainerIds(template);
                }
                Dali.API.renderPlugin(
                    template,
                    this.getToolbar(),
                    this.getConfig(),
                    state,
                    {
                        id: id,
                        parent: initialParams.parent,
                        container: initialParams.container
                    },
                    {
                        position: initialParams.position,
                        row: initialParams.row,
                        col: initialParams.col,
                        width: initialParams.width,
                        isDefaultPlugin: defaultFor(initialParams.isDefaultPlugin, false)
                    },
                    reason
                );
            }
        },
        afterRender: function (element, oldState) {
            state = oldState;
            if (descendant.afterRender) {
                descendant.afterRender(element, oldState);
            }
        },
        update: function (oldState, name, value, sender, reason) {
            state = oldState;
            id = sender;
            if (descendant.handleToolbar) {
                descendant.handleToolbar(name, value);
            }
            this.render(reason);
        },
        setState: function (key, value) {
            state[key] = value;
        },
        getState: function () {
            return state;
        },
        registerExtraFunction: function () {
        }
    };

    return plugin;
}
