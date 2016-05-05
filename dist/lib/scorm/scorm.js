

var DaliScorm = {


    exports: function(state){
        
        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());

        JSZipUtils.getBinaryContent('/lib/scorm/scorm.zip', function(err, data) {
         
            if(err) {
                throw err; // or handle err
            }

            var zip = new JSZip(data);
            var navs = state.present.navItemsById;
            var sections = []
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
                sections.push(nombre)
  
                zip.file(nombre+".html", inner);
            });

           



            var content = zip.generate({type:"blob"});
            saveAs(content, "scorm.zip");

        });

           
          
    } 



}