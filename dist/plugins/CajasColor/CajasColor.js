Dali.Plugins["CajasColor"] = function (base){
    return{
        getConfig: function(){
            return {
                name: 'CajasColor',
                category: 'text',
                icon: 'fa-object-ungroup'
            }
        },
        getToolbar: function(){
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        number: {
                            __name: "Number",
                            buttons: {
                                nBoxes: {
                                    __name: 'Number of boxes',
                                    type: 'number',
                                    value: 2,
                                    max: 8,
                                    min: 1,
                                    autoManaged: false
                                }
                            }
                        }
                    }
                },
                other: {
                    __name: "Other",
                    accordions: {
                        extra: {
                            __name: "Extra",
                            buttons: {}
                        }
                    }
                }
            }
        },
        getInitialState: function(){
            return {nBoxes: 2, colors: ['red', '#f87060']};
        },
        getRenderTemplate: function(state){
            var template = "<div style='width: 100%; height: 100%'>";
            var width = 100 / state.nBoxes;
            for(var i = 0; i < state.nBoxes; i++){
                template += "<div onclick='$dali$.click()' style='background-color: " + state.colors[i] + "; height: 100%; width: " + width + "%; float: left'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
            }

            template += "</div><div>";
            for(var i = 0; i < state.nBoxes; i++){
                //If min-height is set but height is not, will not work properly. Hackfix: height = 1px
                template += "<div style='background-color: " + state.colors[i] + "; min-height: 80px; height: 1px'><plugin plugin-data-key='box" + i + "' /></div>";
            }
            template += "</div>";
            return template;
        },
        handleToolbar: function(name, value){
            if(name === 'nBoxes'){
                if(value > base.getState().nBoxes){
                    base.setState('colors', base.getState().colors.concat(['blue']));
                }else if(value < base.getState().nBoxes){
                    base.setState('colors', base.getState().colors.slice(0, base.getState().colors.length()));
                }
                base.setState(name, value);
            }
        },
        click: function(key){
            alert(key);
        }
    }
}