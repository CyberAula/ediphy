Dali.Plugin = function(descendant){
    var state;
    var id;
    var extraFunctions = {};

    var defaultFor = function(arg, value) {
        return typeof arg !== 'undefined' ? arg : value;
    };

    var plugin = {
        init: function () {
            Dali.API.addMenuButton(this.getConfig());
            if(descendant.init) {
                descendant.init();
            }
        },
        getConfig: function(){
            var name, category, callback, needsConfigModal, needsTextEdition;
            if(descendant.getConfig){
                name = descendant.getConfig().name;
                category = descendant.getConfig().category;
                needsConfigModal = descendant.getConfig().needsConfigModal;
                needsTextEdition = descendant.getConfig().needsTextEdition;
            }

            name = defaultFor(name, 'Plugin name');
            category = defaultFor(category, 'text');
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsTextEdition = defaultFor(needsTextEdition, false);

            callback = function () {
                if (descendant.getInitialState) {
                    state = descendant.getInitialState();
                }
                state = defaultFor(state, {});

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
                needsTextEdition: needsTextEdition
            };
        },
        getToolbar: function(){
            var toolbar;
            if(descendant.getToolbar)
                toolbar = descendant.getToolbar();
            toolbar = defaultFor(toolbar, []);

            /*
             name: 'opacity',
             humanName: 'Opacity',
             type: 'number',
             units: 'em',
             value: 1,
             min: 0,
             max: 1,
             step: 0.1,
             autoManaged: true,
             callback: this.changeBorderSize.bind(this),
             isAttribute: true
             */
            for(var i = 0; i < toolbar.length; i++){
                toolbar[i].autoManaged = defaultFor(toolbar[i].autoManaged, true);
                if(!toolbar[i].callback && !toolbar[i].autoManaged) {
                    toolbar[i].callback = this.update.bind(this);
                }
            }
            return toolbar;
        },
        openConfigModal: function(isUpdating, oldState, sender){
            state = oldState;
            id = sender;

            if(!descendant.getConfigTemplate) {
                if(this.getConfig().needsConfigModal)
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
            }else {
                Dali.API.openConfig(this.getConfig().name, isUpdating).then(function (div) {
                    div.innerHTML = descendant.getConfigTemplate(oldState);
                });
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
                Dali.API.renderPlugin(
                    descendant.getRenderTemplate(state),
                    this.getToolbar(),
                    this.getConfig(),
                    state,
                    isUpdating,
                    id
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
                Object.keys(descendant).forEach(prop =>{
                    if(descendant[prop] === fn){
                        alias = prop;
                    }
                });
            }
            extraFunctions[alias] = fn;
        },
        getExtraFunctions: function(){
            return Object.keys(extraFunctions);
        },
        callExtraFunction: function(alias, fnAlias) {
            var element = $.find("[data-alias='" + alias + "']");
            if (element) {
                extraFunctions[fnAlias].bind(element[0])();
            }
        }
    };
    Object.keys(descendant).map(function(id) {
        if(id !== 'init' &&
            id !== 'getConfig' &&
            id !== 'getToolbar' &&
            id !== 'getInitialState' &&
            id !== 'handleToolbar' &&
            id !== 'getConfigTemplate' &&
            id !== 'getRenderTemplate'){
            plugin[id] = descendant[id];
        }
    });

    return plugin;
};