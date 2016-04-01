

var DaliVisor = {


    exports: function(state){
        
        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());

        JSZipUtils.getBinaryContent('/dist.zip', function(err, data) {
         
            if(err) {
                throw err; // or handle err
            }

            var zip = new JSZip(data);
            var navs = state.present.navItemsById;
            state.present.navItemsIds.map(page => {

                var inner = new EJS({url: '/lib/visor/index.ejs'}).render({
                 page: page, 
                 navs: navs,                
                 boxesById: state.present.boxesById, 
                 boxes: state.present.boxes, 
                 toolbarsById: state.present.toolbarsById,
                 strDate: strDate
                });

                var nombre = navs[page].name;
  
                zip.file(nombre+".html", inner);
            });
            var content = zip.generate({type:"blob"});
            saveAs(content, "example.zip");

        });

           
          
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

    }























}