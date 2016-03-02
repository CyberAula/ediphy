var DaliVisor = {
   
    exports: function(){
        var cont = document.getElementById("maincontent")
        var filename="download.html"
        var dataToDownload = cont.innerHTML;
          var blob = new Blob([dataToDownload], {type: "text/plain;charset=utf-8"});
          saveAs(blob, filename);
         
    }
    ,
    alertt:function(){
    	alert(2)
    }
}