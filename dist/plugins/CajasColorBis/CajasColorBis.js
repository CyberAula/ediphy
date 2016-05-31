Dali.Plugins["CajasColorBis"] = function (base){
    return{
        getConfig: function(){
            return {
                name: 'CajasColorBis',
                category: 'text',
                icon: 'fa-object-ungroup'
            }
        },
        getToolbar: function(){
            console.log(base.getState());

            var toolBar = {
                main: {
                    __name: "Main",
                    accordions:{
                        pepe: {
                            __name: "sub",
                            buttons: {},
                            accordions:{
                                juan:{
                                    __name: "bravo",
                                    buttons:{
                                        __name: "subAcr",
                                        type: 'number',
                                        value: 2,
                                        max: 8,
                                        min: 1,
                                        autoManaged: false
                                    }
                                }
                            }   
                        },
                        number: {
                            __name: "Number",
                            buttons:{
                                nBoxes:{
                                    __name: "Number of boxes",
                                    type: 'number',
                                    value: 2,
                                    max: 8,
                                    min: 1,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: "Estilo CajasColor",
                            buttons:{
                                wayHorizontal:{
                                    __name: "Dirección",
                                    type: 'number',
                                    value: 1,
                                    max: 1,
                                    min: 0,
                                    autoManaged: false
                                },
                                image:{
                                    __name: "Imagen",
                                    type: 'number',
                                    value: 1,
                                    max: 1,
                                    min: 0,
                                    autoManaged: false 
                                },
                                rounded:{
                                    __name: "Redondeado",
                                    type: 'number',
                                    value: 0,
                                    max: 1,
                                    min: 0,
                                    autoManaged: false 
                                }
                            }
                        }
                    }
                }
            }
            /*var StyleCajas = {}
            StyleCajas.__name = "Estilo de los botones";
            var buttonsSC = {};
            var objAux;
*/
           toolBar.main.accordions.buttonStyle = {__name: "Estilo botones", buttons: {}};
           for(var i = 0; i < base.getState().nBoxes; i++){
                toolBar.main.accordions.buttonStyle.buttons["box" + i] = {
                    __name: "caja" + i,
                    type: "text",
                    value: "aa",
                     isAttribute: true,
                     autoManaged: false 
                }
           }
console.log(toolBar);
            return toolBar;
        },
        getInitialState: function(){//el color de las cajas es el capa_{colors[i]}
            return {nBoxes: 2, colors: ['azulverdoso', 'azulpuro'], wayHorizontal: true, image: true, rounded: false};
        },
        getRenderTemplate: function(state){
            var template = "<div class='cajascolor'>";
            var disp = 'block';
            if(state.image){
                template += "<div style='height: 100%'><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
            }

            var rounded = '';
            if(state.rounded){
                rounded = ' rounded';
            }

            if(state.wayHorizontal){
                template += "<div class='tabla_colores'><div class='fila_colores'>";
                var width = 100 / state.nBoxes;
                for( var i = 0; i<state.nBoxes; i++){
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'  onclick='$dali$.click()' style='height: 3em; width: " + width + "%'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    if(i !== (state.nBoxes -1)){
                        template += "<div class='sep'></div>";
                    }
                }
                 template += "</div></div>"

                for( var i = 0; i<state.nBoxes; i++){
                       template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }

            }else{
                for( var i = 0; i<state.nBoxes; i++){
                    template += "<div class='tabla_colores'><div class='fila_colores'>";
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'   onclick='$dali$.click()' style='height: 3em'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    template += "</div></div>"
                      template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }
            }

            template += "</div>"

            return template;
        },
        handleToolbar: function(name, value){
            console.log(value);
            switch(name){
                case 'nBoxes':

                    var diff = value - base.getState().nBoxes;
                    diff = Math.abs(diff);

                    if(value > base.getState().nBoxes){
                        do{
                            base.setState('colors', base.getState().colors.concat(['azul']));
                            diff--;
                        }while(diff > 0)
                    }else if(value < base.getState().nBoxes){
                        var newColors = base.getState().colors;
                        
                          do{
                            newColors.pop();
                            base.setState('colors', newColors);
                            diff--;
                        }while(diff > 0)

                    }
                    base.setState(name, value);
                    break;
                case 'wayHorizontal':
                case 'image':
                case 'rounded':
                    base.setState(name, !!value);
                    break;
                case /box/.test(name):
                    console.log(name);
                    var idB = parseInt(name.slice(4));
                    var newColors = base.getState().colors;
                    newColors[idB] = value;
                    console.log(newColors);
                    console.log(value);
                    base.setState('colors', newColors);
                    break;
                        
                default:
                console.log(name);

            }
         
        },
        click: function(key){
            alert(key);


        }
    }
}