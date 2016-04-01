var alltheboxes = {};

var DaliVisor = {


    exports: function(state){
        
        var cont = document.getElementById("colRight")
        var filename="download.html"
        var header= DaliVisor.getHeader();
        var tail = DaliVisor.getTail();
        var dataToDownload = header + cont.innerHTML + tail;
        

        JSZipUtils.getBinaryContent('/dist.zip', function(err, data) {
         
            if(err) {
                throw err; // or handle err
            }

            var zip = new JSZip(data);
            zip.file("index.html", dataToDownload);

             
            var navs = state.present.navItemsById;
            alltheboxes =  state.present.boxesById;
            boxes=alltheboxes;
            state.present.navItemsIds.map(page => {
                var nombre = navs[page].name;
                var tipo = navs[page].type;
                

                var inner = header+' <div class="outter" style="padding-top:0px;">';

                if (tipo == 'document' || tipo =="section"){
                    inner += '<div id="maincontent" class="slide doc" style="visibility: visible;" >'
                }
                 if (tipo == 'slide'){
                    inner += '<div id="maincontent" class="slide sli" style="visibility: visible;" >'
                }

                inner+= '<div style="visibility: visible;" class="caja">'

                var today = new Date();

                var strDate = 'd-m-Y'
                 .replace('d', today.getDate())
                 .replace('m', today.getMonth()+1)
                 .replace('Y', today.getFullYear());
             
                var padre = navs[navs[page].parent].name || 'Section 0'
                var patt = /([0-9]+((\.[0-9]+)+)?)/  //Detecta número de sección. Ej. Section (2.3.4.2)
                var sectiontitle = patt.exec(padre)? patt.exec(padre)[0]:'0' 
                   //nombre.match(/\d+/)[0] 
                inner +=  '<div class="cab"> '
                   +'\n <div class="cabtabla_numero">'+sectiontitle +'</div>'
                   +'\n <div class="tit_ud_cap">'
                   +'\n <h1>' + 'Título Curso'+' - '+strDate+'</h1>'
                   +'\n <h2>'+'Título Unidad' +'</h2>'
            
                   +'\n </div>'
                   +'\n <div class="cabtabla_lapiz">'
                   +'\n <img src="images/ico_alumno.gif" alt="Alumno"><div id="alumno"> Alumno</div>'
                   +'\n </div>'
                   +'\n  <div class="clear"></div></div>'
                   +'\n <div class="contenido">'
                   +'\n <h3>'+padre+'</h3>' 
                   +'\n <h4>'+nombre+'</h4>' 
                   +'\n <div class="boxes" style="position:relative;">'
                // inner +=  '<div class="cab"> <h1>'+ nombre+'</h1></div><div class="contenido">';
                navs[page].boxes.map( box=> {
                    if (boxes[box].parent == page){
                        inner += DaliVisor.parseBox(boxes[box])

                    }


                });
                inner+='</div></div></div>'+tail
                zip.file(nombre+".html", inner);
            });
            var content = zip.generate({type:"blob"});
            saveAs(content, "example.zip");

        });

           
       /* 
          var blob = new Blob([dataToDownload], {type: "text/plain;charset=utf-8"});
          saveAs(blob, filename);

        */      
    },
    getHeader:function(){

        var header = ' <!DOCTYPE html>'
            +'\n<html lang="en" style="height: 100%">'
            +'\n<head>'
            +'\n<meta charset="UTF-8">'
            +'\n<title>Dali - POC</title>'
            +'\n<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">'
            +'\n<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">'
            +'\n<link rel="stylesheet" href="css/style.css">'
            +'\n<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet" type="text/css">'
            +'\n<link rel="stylesheet" href="css/textStyles.css">'
            +'\n<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>'
            +'\n<script src="lib/jquery-ui.min.js"></script>'
            +'\n<script src="lib/jquery.ui.touch-punch.min.js"></script>'
            +'\n<script src="lib/api.js"></script>'
            +'\n<script src="lib/ckeditor/ckeditor.js"></script>'
            +'\n<script src="BasePlugin.js"></script>'
            +'\n<script src="plugins.json"></script>'
            +'\n<script src="lib/visor/visor.js"></script>'
            +'\n<body  style="margin: 0px; height: 100%">'
            +'\n<div style="height:100%;" id="editor">'
            +'\n<div style="height:100%;" id="root" style="height: 100%">'
            +'\n<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>'
        return header;
    },
    getTail:function(){
        var tail='</div></div>'
            +'\n<script type="text/javascript">'
            +'\n'
            +'\n$(document).ready(function(){'
            +'\n Dali.Plugins.loadAllAsync().then(values => {'
            +'\n values.map((id, index) =>{'
            +'\n    Dali.Plugins.get(id).init();'
            +'\n  })'
            +'\n});'
            +'\n})' 
            +'\n</script>'
            +'\n</body>'
            +'\n</html>'
        return tail;
    },

    parseBox:function(box){

        var width = box.width[box.width.length -1]=='%' ? box.width : box.width+'px';
        var height = box.height? (box.height[box.height.length -1]=='%' ? box.height : box.height+'px'):'auto';
        var code = '\n<div style="width:'+ width+'; height:'+height+'; position: absolute; top: '+box.position.y+'px; left: '+box.position.x+'px; " >'
        if (box.id[1]!='s'){
            code+=box.content
        }

        box.children.map(b=>{
            var nn = b; 
            if (box.id[1]='s') nn= b.replace('sc-','bo-');// Cambiar sc por bo en sortables
            var alturadiv = alltheboxes[nn].height
            var height2 = alturadiv? (alturadiv[alturadiv.length -1]=='%' ? alturadiv : alturadiv+'px'):'auto';
            code+= '<div style="width:100%;position:relative;height:'+height2+';display:block;">' +DaliVisor.parseBox(alltheboxes[nn])+'</div>';
        });
        code+= '</div>'
        return code;

    },
    addDependencies:function(index){

         alert(2)
 
        
    }

























}