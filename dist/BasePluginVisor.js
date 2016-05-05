Dali.Plugin.Visor = function(state, extraFunctions, descendant){
    var plugin = {
        getRenderTemplate(state){
            if(descendant.getRenderTemplate){
                
            }
        },
        callExtraFunction: function(alias, fnAlias) {
            var element = $.find("[data-alias='" + alias + "']");
            if (element && extraFunctions && extraFunctions[fnAlias]) {
                extraFunctions[fnAlias].bind(element[0])();
            }
        }
    }

    Object.keys(descendant).map(function(id) {
        if(id !== 'getRenderTemplate'){
            plugin[id] = descendant[id];
        }
    });

    return plugin;
};
