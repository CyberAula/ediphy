var fs = require("fs");
var JSZip = require("jszip");

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
			});
		});
    });
});

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
			});
		});
    });
});

/*

var AdmZip = require('adm-zip');
 
var dist = new AdmZip("./dist/lib/visor/dist.zip");
dist.deleteFile("js/visor-bundle.js")
dist.addLocalFile("./dist/visor-bundle.js", "js/visor-bundle.js");
dist.writeZip("./dist/lib/visor/dist.zip");

var scorm = new AdmZip("./dist/lib/scorm/scorm.zip");
scorm.deleteFile("js/visor-bundle.js")
scorm.addLocalFile("./dist/visor-bundle.js", "js/visor-bundle.js");
scorm.writeZip("./dist/lib/scorm/scorm.zip");
*/