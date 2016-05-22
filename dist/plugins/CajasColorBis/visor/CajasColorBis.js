Dali.Visor.Plugins["CajasColorBis"] = function (){
    return {
        getRenderTemplate: function (state) {
            var template = "<div class='cajascolor'>";
            var disp = 'block';//none

            if(state.image){
                template += "<div style='min-height: 1px; height: 20vw'><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
            }

            var rounded = '';
            if(state.rounded){
                rounded = ' rounded';
            }

            if(state.wayHorizontal){
                template += "<div class='tabla_colores'><div class='fila_colores'>";
                var width = 100 / state.nBoxes;
                var bloqId = '';
                for( var i = 0; i<state.nBoxes; i++){
                    bloqId = 'bloque'+i;
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'  onclick='$dali$.showDiv("+i+")' style='height: 3em; width: " + width + "%'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    if(i !== (state.nBoxes -1)){
                        template += "<div class='sep'></div>";
                    }
                }
                 template += "</div></div>"

                for( var i = 0; i<state.nBoxes; i++){
                      template += "<div id='bloque"+i+"' class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                      if(i==0){
                        disp = 'none';
                      }
                }

            }else{
                var bloqId = '';
                for( var i = 0; i<state.nBoxes; i++){
                     bloqId = 'bloque'+i;;
                    template += "<div class='tabla_colores'><div class='fila_colores'>";
                    template += "<div class='celda_colores "+state.colors[i]+" "+rounded+"'   onclick='$dali$.showDiv("+i+")' style='height: 3em'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    template += "</div></div>"
                    template += "<div id='bloque"+i+"' class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                       if(i==0){
                        disp = 'none';
                      } 
                }
            }

            template += "</div>"

            return template;
        },
        showDiv: function(idDiv)
        {
            alert(idDiv);
        }
    }
}
