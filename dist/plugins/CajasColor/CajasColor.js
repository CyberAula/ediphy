Dali.Plugins["CajasColor"] = function (base){
    return{
        init: function(){
            base.registerExtraFunction(this.clicky);
        },
        getConfig: function(){
            return {
                name: 'CajasColor',
                category: 'text',
                icon: 'fa-object-ungroup'
            }
        },
        getToolbar: function(){
            let toolbar = {
                main: {
                    __name: "Main",
                    accordions: {
                        boxes: {
                            __name: "Boxes",
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
                                },
                                color: {
                                    __name: "Color",
                                    buttons: {
                                        color: {
                                            __name: "Box color",
                                            type: "color",
                                            value: "#ff0000"
                                        }
                                    }
                                }
                            },
                            buttons: {
                                allEqual: {
                                    __name: 'All equal',
                                    type: 'checkbox',
                                    value: 'unchecked'
                                     
                                },
                                radios: {
                                    __name: 'Type',
                                    type: 'radio',
                                    value: 'first',
                                    options: ['first','second','third']
                                }
                            },
                            order: ["number", "allEqual", "color", "radios"]
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
            for(let i = 0; i < base.getState().nBoxes; i++) {
                toolbar.main.accordions.boxes.buttons["box" + i] = {
                    __name: "Caja " + i,
                    type: "text",
                    value: "hola"
                }
                toolbar.main.accordions.boxes.order.push("box" + i);
            }

            return toolbar;
        },
        getInitialState: function(){
            return {nBoxes: 2, colors: ['red', '#f87060']};
        },
        getRenderTemplate: function(state){
            var template = "<div style='width: 100%; height: 100%'>";
            var width = 100 / state.nBoxes;
            for(var i = 0; i < state.nBoxes; i++){
                template += "<div onclick='$dali$.clicky()' style='background-color: " + state.colors[i] + "; height: 100%; width: " + width + "%; float: left'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' " + (i % 2 === 0 ? "plugin-data-resizable plugin-data-initialHeight='200px'" : "") + " /></div>";
            }

            template += "</div><div>";
            for(var i = 0; i < state.nBoxes; i++){
                //If min-height is set but height is not, will not work properly. Hackfix: height = 1px
                template += "<div style='background-color: " + state.colors[i] + "; min-height: 80px; height: 1px'><plugin plugin-data-key='box" + i + "' plugin-data-resizable /></div>";
            }
            template += "</div>";
            return template;
        },
        handleToolbar: function(name, value){
            if(name === 'nBoxes'){
                if(value > base.getState().nBoxes){
                    base.setState('colors', base.getState().colors.concat(['blue']));
                }else if(value < base.getState().nBoxes){
                    base.setState('colors', base.getState().colors.slice(0, base.getState().colors.length - 1));
                }
                base.setState(name, value);
            }
        },
        clicky: function(event, element, parent){
            console.log([event, element, parent]);
        }
    }
}