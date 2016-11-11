var fs = require("fs");
var JSZip = require("jszip");

function ZipBundlePlugin(){
  this.startTime = Date.now();
}

ZipBundlePlugin.prototype.apply = function(compiler){
  compiler.plugin("after-emit",function(compilation, callback){

    fs.readFile("dist/lib/visor/dist.zip", function(err, data) {
        if (err) throw err;
        var jszip = new JSZip();
        jszip.loadAsync(data).then(function (zip) {
            fs.readFile("dist/visor-bundle.js", function(err, data) {
              zip.remove("js/visor-bundle.js");
            zip.file("js/visor-bundle.js", data);
            zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
          .pipe(fs.createWriteStream("dist/lib/visor/dist.zip"))
          .on('finish', function () {
              // JSZip generates a readable stream with a "end" event,
              // but is piped here in a writable stream which emits a "finish" event.
              console.log("TASK: dist.zip updated.");
              callback();
          });
        });
        });
    });

  });

  compiler.plugin("after-emit",function(compilation, callback){
    fs.readFile("dist/lib/scorm/scorm.zip", function(err, data) {
      if (err) throw err;
      var jszip = new JSZip();
      jszip.loadAsync(data).then(function (zip) {
          fs.readFile("dist/visor-bundle.js", function(err, data) {
            zip.remove("js/visor-bundle.js");
          zip.file("js/visor-bundle.js", data);
          zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream("dist/lib/scorm/scorm.zip"))
        .on('finish', function () {
            // JSZip generates a readable stream with a "end" event,
            // but is piped here in a writable stream which emits a "finish" event.
            console.log("TASK: scorm.zip updated.");
            callback();
        });
      });
      });
    });
  });
}

module.exports = ZipBundlePlugin;
