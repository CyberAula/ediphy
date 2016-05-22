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
            return [
                {
                    name: 'nBoxes',
                    humanName: 'Number of boxes',
                    type: 'number',
                    value: 2,
                    max: 8,
                    min: 1,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Number'
                },
                   {
                    name: 'wayHorizontal',
                    humanName: 'WayHorizontal',
                    type: 'number',
                    value: 0,
                    max: 1,
                    min: 0,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'WayHorizontal'
                },
                   {
                    name: 'image',
                    humanName: 'Image',
                    type: 'number',
                    value: 0,
                    max: 1,
                    min: 0,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Image'
                }
                ,
                   {
                    name: 'rounded',
                    humanName: 'rounded',
                    type: 'number',
                    value: 0,
                    max: 1,
                    min: 0,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Rounded'
                }
            ]
        },
        getSections: function(){
            return [
                {
                    tab: 'Main', 
                    accordion: ['Number','WayHorizontal','Image','Rounded']
                },
                {
                    tab: 'Other', 
                    accordion: ['Extra']
                }
            ];
        },
        getInitialState: function(){//el color de las cajas es el capa_{colors[i]}
            return {nBoxes: 2, colors: ['azulverdoso', 'azulpuro'], wayHorizontal: true, image: true, rounded: false};
        },
        getRenderTemplate: function(state){
            var template = "<div className='cajascolor'>";

            if(state.image){
                template += "<div style='min-height: 1px; height: 20vw'><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
            }

            var rounded = '';
            if(state.rounded){
                rounded = ' rounded';
            }

            if(state.wayHorizontal){
                template += "<div className='tabla_colores'><div className='fila_colores'>";
                var width = 100 / state.nBoxes;
                for( var i = 0; i<state.nBoxes; i++){
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'  onclick='$dali$.click()' style='height: 3em; width: " + width + "%'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    if(i !== (state.nBoxes -1)){
                        template += "<div className='sep'></div>";
                    }
                }
                 template += "</div></div>"

                for( var i = 0; i<state.nBoxes; i++){
                      template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px'><plugin plugin-data-key='box" + i + "' /></div>";
                }

            }else{
                for( var i = 0; i<state.nBoxes; i++){
                    template += "<div className='tabla_colores'><div className='fila_colores'>";
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'   onclick='$dali$.click()' style='height: 3em'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    template += "</div></div>"
                    template += "<div class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px'><plugin plugin-data-key='box" + i + "' /></div>";
                }
            }

            template += "</div>"

            return template;
        },
        handleToolbar: function(name, value){

            switch(name){
                case 'nBoxes':
                    if(value > base.getState().nBoxes){
                        base.setState('colors', base.getState().colors.concat(['azul']));
                    }else if(value < base.getState().nBoxes){
                        var newColors = base.getState().colors;
                        newColors.pop();
                        base.setState('colors', newColors);
                    }
                    base.setState(name, value);
                    break;
                case 'wayHorizontal':
                case 'image':
                case 'rounded':
                    base.setState(name, !!value);
                    break;
                default:

            }
         
        },
        click: function(key){
            alert(key);

            /*function showDiv(_div){
    _div.fadeTo('slow',1, function() {});
}
function hideDiv(_div){
    _div.fadeTo('slow',0, function() {
        $(this).empty();
        $(this).remove();
    });
}
*/
        }
    }
}