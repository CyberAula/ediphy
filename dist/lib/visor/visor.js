var DaliVisor = {
    exports: function(state){
        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());

        JSZipUtils.getBinaryContent('/lib/visor/dist.zip', function(err, data) {
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
                zip.file(nombre + ".html", inner);
            });
            var content = zip.generate({type:"blob"});
            saveAs(content, "dalivisor.zip");
        });
    }
}