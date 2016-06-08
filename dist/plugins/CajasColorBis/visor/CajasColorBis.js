Dali.Visor.Plugins["CajasColorBis"] = function (){
    return {
        getRenderTemplate: function (state) {
            var template = "<div class='cajascolor' style='width: 100%; height: 100%'>";
            var disp = 'none';//noneblock

            if(state.image){
                template += "<div  style='height: 20%; max-height: 100px;'><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
            }

            var rounded = '';
            if(state.rounded == 'checked'){
                rounded = ' rounded';
            }

            if(state.wayHorizontal){
                template += "<div class='tabla_colores'><div class='fila_colores'>";
                var width = 100 / state.nBoxes;
                var bloqId = '';
                for( var i = 0; i<state.nBoxes; i++){
                    bloqId = 'bloque'+i;
                    template += "<div data-nboxes=\""+state.nBoxes+"\" data-iddiv=\""+i+"\" class='celda_colores "+state.colors[i]+" "+rounded+"'  onClick='$dali$.showDiv()' style='max-height:50px; height: 10%; width: " + width + "%'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    if(i !== (state.nBoxes -1)){
                        template += "<div class='sep'></div>";
                    }
                }
                 template += "</div></div>"

                for( var i = 0; i<state.nBoxes; i++){
                      template += "<div id='bloque"+i+"' class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }
                 template += "</div>"

            }else{
                var bloqId = '';
                for( var i = 0; i<state.nBoxes; i++){
                     bloqId = 'bloque'+i;;
                    template += "<div class='tabla_colores'><div class='fila_colores'>";
                    template += "<div data-nboxes=\""+state.nBoxes+"\" data-iddiv=\""+i+"\" class='celda_colores "+state.colors[i]+" "+rounded+"' onClick='$dali$.showDiv()' style='height: 3em'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText' /></div>";
                    template += "</div></div>"
                    template += "<div id='bloque"+i+"' class='bloque_colores capa_"+state.colors[i]+" "+rounded+"'  style='min-height: 80px; height: 1px; display:"+disp+"'><plugin plugin-data-key='box" + i + "' /></div>";
                }
            }

            template += "</div>"

            return template;
        },
        showDiv: function(e)
        {
        var nBoxes = e.target.getAttribute("data-nboxes");
        var idDiv =  e.target.getAttribute("data-iddiv");
            var idD = '';
            for (var i = 0; i < nBoxes; i++) {
                idD = '#bloque'+i;
                if(idDiv != i){
                    $(idD).fadeOut("slow");
                }else{
                    $(idD).fadeToggle("slow");  
                }
            }
      
        }
    }
}
