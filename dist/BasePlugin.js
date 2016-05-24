Dali.Plugin = function(){
    var descendant, state, id, initialParams;
    var extraFunctions = {};

    var defaultFor = function(arg, value) {
        return typeof arg !== 'undefined' ? arg : value;
    };

    var assignPluginContainerIds = function(json){
        if(json.child){
            for(var i = 0; i < json.child.length; i++){
                assignPluginContainerIds(json.child[i]);
            }
        }
        if(json.tag && json.tag === "plugin"){
            if(!state['__pluginContainerIds']){
                state['__pluginContainerIds'] = {};
            }
            var key = json.attr['plugin-data-key'];
            if(!key){
                console.error(json.tag + " has not defined plugin-data-key");
            }else{
                if(state['__pluginContainerIds'][key]){
                    json.attr['plugin-data-id'] = state['__pluginContainerIds'][key];
                }
            }
        }
    }

    var plugin = {
        create: function(obj){
            descendant = obj;

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
        },
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
            if(descendant.init) {
                descendant.init();
            }
        },
        getConfig: function(){
            var name, category, callback, needsConfigModal, needsTextEdition, icon;
            if(descendant.getConfig){
                name = descendant.getConfig().name;
                category = descendant.getConfig().category;
                icon = descendant.getConfig().icon;
                needsConfigModal = descendant.getConfig().needsConfigModal;
                needsTextEdition = descendant.getConfig().needsTextEdition;
            }

            name = defaultFor(name, 'PluginName');
            category = defaultFor(category, 'text');
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsTextEdition = defaultFor(needsTextEdition, false);
            icon = defaultFor(icon, 'fa-cogs');

            callback = function (initParams) {
                if (descendant.getInitialState) {
                    state = descendant.getInitialState();
                }
                state = defaultFor(state, {});
                initialParams = initParams;
                if(needsConfigModal) {
                    this.openConfigModal(false, state);
                }else {
                    this.render(false);
                }
            }.bind(this);

            return {
                name: name,
                category: category,
                callback: callback,
                needsConfigModal: needsConfigModal,
                needsTextEdition: needsTextEdition,
                icon: icon
            };
        },
        getToolbar: function(){
            var toolbar;
            if(descendant.getToolbar)
                toolbar = descendant.getToolbar();
            toolbar = defaultFor(toolbar, {});

            for(var tabKey in toolbar){
                for(var accordionKey in toolbar[tabKey].accordions){
                    for(var buttonKey in toolbar[tabKey].accordions[accordionKey].buttons){
                        var button = toolbar[tabKey].accordions[accordionKey].buttons[buttonKey];
                        button.autoManaged = defaultFor(button.autoManaged, true);
                        if(!button.callback && !button.autoManaged) {
                            button.callback = this.update.bind(this);
                        }
                    }
                }
            }
            return toolbar;
        },
        openConfigModal: function(isUpdating, oldState, sender){
            state = oldState;
            id = sender;

            if(!descendant.getConfigTemplate) {
                if(this.getConfig().needsConfigModal) {
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
                }
            }else {
                Dali.API.openConfig(this.getConfig().name, isUpdating).then(function (div) {
                    div.innerHTML = descendant.getConfigTemplate(oldState).replace(/[$]dali[$]/g, "Dali.Plugins.get('" + this.getConfig().name + "')");
                }.bind(this));
            }
        },
        updateTextChanges: function(text, sender){
            state.text = text;
            id = sender;
            this.render(true);
        },
        render: function(isUpdating){
            if(!descendant.getRenderTemplate){
                console.error(this.getConfig.name + " has not defined getRenderTemplate method");
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
        update: function(oldState, name, value, sender){
            state = oldState;
            id = sender;
            if(descendant.handleToolbar)
                descendant.handleToolbar(name, value);
            this.render(true);
        },
        setState: function(key, value) {
            state[key] = value;
        },
        getState: function(){
            return state;
        },
        registerExtraFunction: function(fn, alias){
            if(!alias){
                Object.keys(descendant).forEach(function(prop) {
                    if(descendant[prop] === fn){
                        alias = prop;
                    }
                });
            }
            extraFunctions[alias] = fn;
        },
        getExtraFunctions: function(){
            return Object.keys(extraFunctions);
        }
    };

    return plugin;
};