var fs = require("fs");
var JSZip = require("jszip");
var async = require("async");
var dir = require('node-dir');
var UglifyJS = require('uglify-js');

var visor_zip = new JSZip();
var scorm_zip = new JSZip();

function ZipBundlePlugin(){
  this.startTime = Date.now();
}

function purgeRoot(str){
  return str.replace("dist\/","");
}


ZipBundlePlugin.prototype.apply = function(compiler){

  /* Visor ZIP generation */
  compiler.plugin("after-emit",function(compilation, callback){

    async.series([
        function(callback){
          var path = "./dist/css/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/css/ does not exist!");
              callback(null, "css");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                    visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                    scorm_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "css");
                  });
              });
            }
          });
        },
        function(callback){
          var path = "./dist/images/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/images/ does not exist!");
              callback(null, "images");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                    visor_zip.file(purgeRoot(elem), fs.readFileSync("./" +elem));
                    scorm_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "images");
                  });
              });
            }
          });
        },
        function(callback){
          var path = "./dist/src/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/src/ does not exist!");
              callback(null, "src");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                     if(process.argv.indexOf('-p') !== -1 && elem.indexOf(".js") !== -1){
                      visor_zip.file(purgeRoot(elem), UglifyJS.minify("./" +elem).code);
                      scorm_zip.file(purgeRoot(elem), UglifyJS.minify("./" +elem).code);
                    } else {
                      visor_zip.file(purgeRoot(elem), fs.readFileSync("./" +elem));
                      scorm_zip.file(purgeRoot(elem), fs.readFileSync("./" +elem));
                    }
                    call();
                  }, function(err,results){
                    callback(null, "src");
                  });
              });
            }
          });
        },
        function(callback){
            var path = "./dist/js/";
            fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/js/ does not exist!");
              callback(null, "js");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  filelist.splice(filelist.indexOf("dist/js/visor-bundle.js.map"),1);
                  async.each(filelist, function(elem,call){
                    visor_zip.file(purgeRoot(elem), fs.readFileSync("./" +elem));
                    scorm_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "js");
                  });
              });
            }
          });
        },
        function(callback){
          var path = "./dist/exercises/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/exercises/ does not exist!");
              callback(null, "exercises");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                    visor_zip.file(purgeRoot(elem), fs.readFileSync("./" +elem));
                    scorm_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "exercises");
                  });
              });
            }
          });
        },
        function(callback){
          var path = "./dist/lib/scorm/scorm/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("./dist/lib/scorm/scorm/ does not exist!");
              callback(null, "scorm");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                    scorm_zip.file(elem.replace("dist\/lib\/scorm\/",""), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "scorm");
                  });
              });
            }
          });
        },
        function(callback){
          var path = "./dist/lib/scorm/manifest_files/";
          fs.stat(path, function(err, stats) {
            if(err){
              console.log("/dist/manifest_files/ does not exist!");
              callback(null, "manifest_files");
            }else{
              dir.files(path, function(err, filelist) {
                  if (err) throw err;
                  async.each(filelist, function(elem,call){
                    scorm_zip.file(elem.replace("dist\/lib\/scorm\/manifest_files/",""), fs.readFileSync("./" + elem));
                    call();
                  }, function(err,results){
                    callback(null, "manifest_files");
                  });
              });
            }
          });
        },
        //Write visor
        function(callback){
           visor_zip.generateAsync({type:"nodebuffer"}).then(function (content) {
              fs.writeFile("./dist/lib/visor/dist.zip", content, function(err){});
              console.log("Ended dist.zip bundle");
              callback();
          
          });
        },
        //Write scorm
        function(callback){
           scorm_zip.generateAsync({type:"nodebuffer"}).then(function (content) {
              fs.writeFile("./dist/lib/scorm/scorm.zip", content, function(err){});
              console.log("Ended scorm.zip bundle");
              callback();
          });
        }],function(err,results){
          callback();
        }
      );

  });
}

module.exports = ZipBundlePlugin;
