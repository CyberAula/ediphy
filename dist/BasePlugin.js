Dali.Plugin = function () {
    var descendant, state, id, initialParams;

    var defaultFor = function (arg, value, warn) {
        if (typeof arg !== 'undefined') {
            return arg;
        }

        if (warn) {
            console.warn(warn);
        }
        return value
    };

    var assignPluginContainerIds = function (json) {
        if (json.child) {
            for (var i = 0; i < json.child.length; i++) {
                assignPluginContainerIds(json.child[i]);
            }
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
                    json.attr['plugin-data-height'] = state['__pluginContainerIds'][key].height;
                }
            }
        }
    }

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
                    id !== 'getConfigTemplate' &&
                    id !== 'getRenderTemplate') {
                    plugin[id] = descendant[id];
                }
            });
        },
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
            if (descendant.init) {
                descendant.init();
            }
        },
        getConfig: function () {
            var name, category, callback, needsConfigModal, needsTextEdition, icon, aspectRatioButtonConfig;
            if (descendant.getConfig) {
                name = descendant.getConfig().name;
                category = descendant.getConfig().category;
                icon = descendant.getConfig().icon;
                needsConfigModal = descendant.getConfig().needsConfigModal;
                needsTextEdition = descendant.getConfig().needsTextEdition;
                aspectRatioButtonConfig = descendant.getConfig().aspectRatioButtonConfig;
            }

            name = defaultFor(name, 'PluginName', "Plugin name not assigned");
            category = defaultFor(category, 'text', "Plugin category not assigned");
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsTextEdition = defaultFor(needsTextEdition, false);
            icon = defaultFor(icon, 'fa-cogs', "Plugin icon not assigned");

            if(aspectRatioButtonConfig){
                aspectRatioButtonConfig.name = defaultFor(aspectRatioButtonConfig.name, "Aspect Ratio");
                aspectRatioButtonConfig.location = defaultFor(aspectRatioButtonConfig.location, ["other", "extra"], "Aspect ratio button location not defined");
                if(!Array.isArray(aspectRatioButtonConfig.location) || aspectRatioButtonConfig.location.length < 2 || aspectRatioButtonConfig.location.length > 3){
                    console.error("Aspect ratio button location malformed");
                }
                aspectRatioButtonConfig.defaultValue = defaultFor(aspectRatioButtonConfig.defaultValue, "unchecked");
            }

            callback = function (initParams) {
                state = {};
                if (descendant.getInitialState) {
                    state = descendant.getInitialState();
                }
                if(needsTextEdition){
                    if(!state["__text"]){
                        state["__text"] = "Text goes here";
                    }
                    if(!descendant.getRenderTemplate){
                        descendant.getRenderTemplate = function(state){
                            return state.__text;
                        }
                    }
                }
                initialParams = initParams;
                if (needsConfigModal) {
                    this.openConfigModal(false, state);
                } else {
                    this.render(false);
                }
            }.bind(this);

            return {
                name: name,
                category: category,
                callback: callback,
                needsConfigModal: needsConfigModal,
                needsTextEdition: needsTextEdition,
                aspectRatioButtonConfig: aspectRatioButtonConfig,
                icon: icon
            };
        },
        getToolbar: function () {
            var toolbar;
            if (descendant.getToolbar)
                toolbar = descendant.getToolbar();
            toolbar = defaultFor(toolbar, {});

            for (var tabKey in toolbar) {
                toolbar[tabKey].__name = defaultFor(toolbar[tabKey].__name, tabKey);
                var accordions = defaultFor(toolbar[tabKey].accordions, {}, "Property accordions in tab '" + tabKey + "' not found");
                toolbar[tabKey].accordions = accordions;
                for (var accordionKey in accordions) {
                    accordions[accordionKey].__name = defaultFor(accordions[accordionKey].__name, accordionKey, "Property __name in accordion '" + accordionKey + "' not found");
                    var buttons = defaultFor(accordions[accordionKey].buttons, {}, "Property buttons in accordion '" + accordionKey + "' not found");
                    accordions[accordionKey].buttons = buttons;
                    for (var buttonKey in buttons) {
                        var button = buttons[buttonKey];
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
        openConfigModal: function (isUpdating, oldState, sender) {
            state = oldState;
            id = sender;

            if (!descendant.getConfigTemplate) {
                if (this.getConfig().needsConfigModal) {
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
                }
            } else {
                Dali.API.openConfig(this.getConfig().name, isUpdating).then(function (div) {
                    div.innerHTML = descendant.getConfigTemplate(oldState).replace(/[$]dali[$]/g, "Dali.Plugins.get('" + this.getConfig().name + "')");
                }.bind(this));
            }
        },
        forceUpdate: function(oldState, sender){
            state = oldState;
            id = sender;
            this.render(true);
        },
        render: function (isUpdating) {
            if (!descendant.getRenderTemplate) {
                console.error(this.getConfig().name + " has not defined getRenderTemplate method");
            } else {
                var jsonTemplate = html2json(descendant.getRenderTemplate(state));
                assignPluginContainerIds(jsonTemplate);
                Dali.API.renderPlugin(
                    jsonTemplate,
                    this.getToolbar(),
                    this.getConfig(),
                    state,
                    isUpdating,
                    {
                        id: id,
                        parent: initialParams.parent,
                        container: initialParams.container
                    },
                    {
                        position: initialParams.position,
                        row: initialParams.row,
                        col: initialParams.col
                    }
                );
            }
        },
        update: function (oldState, name, value, sender) {
            state = oldState;
            id = sender;
            if (descendant.handleToolbar) {
                descendant.handleToolbar(name, value);
            }
            this.render(true);
        },
        setState: function (key, value) {
            state[key] = value;
        },
        getState: function () {
            return state;
        },
        registerExtraFunction: function() { }
    };

    return plugin;
};