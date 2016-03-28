var DaliVisor = {
   
    exports: function(state){
        
        var cont = document.getElementById("colRight")
        var filename="download.html"
        var dataToDownload = DaliVisor.getHeader() + cont.innerHTML + DaliVisor.getTail();
        

            JSZipUtils.getBinaryContent('/dist.zip', function(err, data) {
         
              if(err) {
                throw err; // or handle err
              }

              var zip = new JSZip(data);
              zip.file("index.html", dataToDownload);

             
              var navs = state.present.navItemsById;
              
              state.present.navItemsIds.map(page => {
                zip.file(navs[page].name+".html", dataToDownload);
             

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
            +'<html lang="en" style="height: 100%">'
            +'<head>'
            +'<meta charset="UTF-8">'
            +'<title>Dali - POC</title>'
            +'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">'
            +'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">'
            +'<link rel="stylesheet" href="css/style.css">'
            +'<link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet" type="text/css">'
            +'<link rel="stylesheet" href="css/textStyles.css">'
            +'<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>'
            +'<script src="lib/jquery-ui.min.js"></script>'
            +'<script src="lib/jquery.ui.touch-punch.min.js"></script>'
            +'<script src="lib/api.js"></script>'
            +'<script src="lib/ckeditor/ckeditor.js"></script>'
            +'<script src="BasePlugin.js"></script>'
            +'<script src="plugins.json"></script>'
            +'<script src="lib/visor/visor.js"></script>'
            +'<body  style="margin: 0px; height: 100%">'
            +'<div id="editor">'
            +'<div id="root" style="height: 100%">'
            +'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>'
        return header;
    },
    getTail:function(){
        var tail='</div>'
            +'<script type="text/javascript">'
            +''
            +'$(document).ready(function(){'
            +' Dali.Plugins.loadAllAsync().then(values => {'
            +' values.map((id, index) =>{'
            +'    Dali.Plugins.get(id).init();'
            +'  })'
            +'});'
            +'})' 
            +'</script>'
            +'</body>'
            +'</html>'
        return tail
    },
    addDependencies:function(index){

         alert(2)
     
            /*var zip = new JSZip();


            var packageFileTree = {};
            var filesSources = [];
            
            var ConstantFiles = ["css/textStyles.css"]
                filesSources.push(ConstantFiles[0]);
            filesSources = uniqFileSources;

            fileSourcesCounter = 0;
            fileSourcesLength = filesSources.length;

            for(var i=0; i<filesSources.length; i++){
                var splitValue = filesSources[i].split("/");
                var splitLength = splitValue.length;
                var currentFolder = packageFileTree;
                for(var j=0; j<splitLength; j++){
                    if(j!=(splitLength-1)){
                        //Folder
                        if(typeof currentFolder[splitValue[j]] == "undefined"){
                            currentFolder[splitValue[j]] = {};
                        }
                        currentFolder = currentFolder[splitValue[j]];
                    } else {
                        currentFolder[splitValue[j]] = splitValue[j];
                    }
                }
            };*/
        
    }

























}