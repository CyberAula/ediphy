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
                        general: {
                            __name: "General",
                            buttons:{
                                 nBoxes:{
                                    __name: "Number of boxes",
                                    type: 'number',
                                    value: 2,
                                    max: 8,
                                    min: 1,
                                    autoManaged: false
                                },
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
                        }//,
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
                __name: 'caja'+i,
                                    type: 'select',
                                    value: 'verdeoscuro',
                                    options: ['verdeoscuro', 'cyan', 'granate', 'naranja', 'rojo', 'azul', 'marron', 'rojizo', 'azulpuro', 'azulverdoso', 'violeta', 'marronvivo','gris','amarillo'],
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
            var template = "<div class='cajascolor' style='width: 100%; height: 100%'>";
            var disp = 'block';
            if(state.image){
                template += "<div style='height: 20%; max-height: 100px;' ><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
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
                       template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 25%  !important; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }

            }else{
                for( var i = 0; i<state.nBoxes; i++){
                    template += "<div class='tabla_colores'><div class='fila_colores'>";
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'   onclick='$dali$.click()' style='height: 3em'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    template += "</div></div>"
                      template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 25% !important; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }
            }

            template += "</div></div>"

            return template;
        },
        handleToolbar: function(name, value){

            if( /box/.test(name) ){
                    console.log(name);
                    console.log('hello');
                    console.log(name.slice(0));
                    console.log(name.slice(1));
                    console.log(name.slice(2));
                    console.log(name.slice(3));
                    var idB = name.slice(3);
                    console.log(idB);
                    var newColors = base.getState().colors;
                    newColors[idB] = value;
                    console.log("newColors");
                    console.log(newColors);
                    console.log(value);
                    base.setState('colors', newColors);
                    console.log(base.getState().colors);
            }else if( name == 'nBoxes' ){
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
            }else if( name == 'wayHorizontal' || name == 'image' || name == 'rounded'){
                base.setState(name, !!value);
            }else{
                console.log("no hizo nada");
            }

         
        },
        click: function(key){
            alert(key);


        }
    }
}