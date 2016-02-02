Dali.Plugin = function(descendant){
    var state;

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
                if(needsConfigModal) {
                    var initialState;
                    if (descendant.getInitialState) {
                        initialState = descendant.getInitialState();
                    }
                    initialState = defaultFor(initialState, {});

                    this.openConfigModal(false, initialState);
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
                if(!toolbar[i].callback && !toolbar[i].autoManaged) {
                    toolbar[i].callback = this.update.bind(this);
                }
            }
            return toolbar;
        },
        openConfigModal: function(isUpdating, oldState){
            state = oldState;
            Dali.API.openConfig(this.getConfig().name, isUpdating).then(function (div) {
                if(descendant.getConfigTemplate) {
                    div.innerHTML = descendant.getConfigTemplate(oldState);
                }else {
                    //change descendant for this
                    if(descendant.getConfig().needsConfigModal)
                        console.error(descendant.getConfig().name + " has not defined getConfigTemplate method");
                }
            })
        },
        updateTextChanges: function(text){
            state.text = text;
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
                    isUpdating
                );
            }
        },
        update: function(oldState, name, value){
            state = oldState;
            if(descendant.updateState)
                descendant.updateState(name, value);
            this.render(true);
        },
        setState: function(key, value){
            state[key] = value;
        }
    };
    Object.keys(descendant).map(function(id) {
        if(id !== 'init' &&
            id !== 'getConfig' &&
            id !== 'getToolbar' &&
            id !== 'getInitialState' &&
            id !== 'updateState' &&
            id !== 'getConfigTemplate' &&
            id !== 'getRenderTemplate'){
            plugin[id] = descendant[id];
        }
    });

    return plugin;
};