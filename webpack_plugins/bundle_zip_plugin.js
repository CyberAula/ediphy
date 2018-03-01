let fs = require("fs");
let nodePath = require("path");
let JSZip = require("jszip");
let async = require("async");
let dir = require('node-dir');
let UglifyJS = require('uglify-js');

let visor_zip = new JSZip();
let scorm_2004_zip = new JSZip();
let scorm_12_zip = new JSZip();

function ZipBundlePlugin() {
    this.startTime = Date.now();
}

function purgeRoot(str) {
    return str.replace("dist\/", "");
}

ZipBundlePlugin.prototype.apply = function(compiler) {

    /* Visor ZIP generation */
    compiler.plugin("after-emit", function(compilation, callback) {

        async.series([
            function(callback) {
                let path = "./dist/css/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/css/ does not exist!");
                        callback(null, "css");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                                visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "css");
                            });
                        });
                    }
                });
            },
            function(callback) {
                let path = "./dist/js/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/js/ does not exist!");
                        callback(null, "js");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                                visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "js");
                            });
                        });
                    }
                });
            },
            function(callback) {
                let path = "./dist/images/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/images/ does not exist!");
                        callback(null, "images");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                                visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "images");
                            });
                        });
                    }
                });
            },
            function(callback) {
                let path = "./dist/src/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/src/ does not exist!");
                        callback(null, "src");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                                if(process.argv.indexOf('-p') !== -1 && elem.indexOf(".js") !== -1 && !(elem.indexOf("parseXML.js") !== -1 || elem.indexOf("jsLoader.js") !== -1)) {
                                    visor_zip.file(purgeRoot(elem), UglifyJS.minify("./" + elem).code);
                                    scorm_2004_zip.file(purgeRoot(elem), UglifyJS.minify("./" + elem).code);
                                    scorm_2004_zip.file(purgeRoot(elem), UglifyJS.minify("./" + elem).code);
                                    scorm_12_zip.file(purgeRoot(elem), UglifyJS.minify("./" + elem).code);
                                } else {
                                    visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                    scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                    scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                }
                                call();
                            }, function(err, results) {
                                callback(null, "src");
                            });
                        });
                    }
                });
            },
            function(callback) {
                let path = "./dist/js/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/js/ does not exist!");
                        callback(null, "js");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            filelist.splice(filelist.indexOf("dist/js/visor-bundle.js.map"), 1);
                            async.each(filelist, function(elem, call) {
                                visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "js");
                            });
                        });
                    }
                });
            },
            function(callback) {
                let path = "./dist/exercises/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/exercises/ does not exist!");
                        callback(null, "exercises");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                                visor_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_2004_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                scorm_12_zip.file(purgeRoot(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "exercises");
                            });
                        });
                    }
                });
            },

            function(callback) {
                let path = "./dist/lib/scorm/manifest_files_12/";
                fs.stat(path, function(err, stats) {
                    if(err) {
                        console.error("/dist/lib/scorm/manifest_files_12/ does not exist!");
                        callback(null, "manifest_files_12");
                    }else{
                        dir.files(path, function(err, filelist) {
                            if (err) {throw err;}
                            async.each(filelist, function(elem, call) {
                              scorm_12_zip.file(nodePath.basename(elem), fs.readFileSync("./" + elem));
                                call();
                            }, function(err, results) {
                                callback(null, "manifest_files_12");
                            });
                        });
                    }
                });
            },
          function(callback) {
            let path = "./dist/lib/scorm/manifest_files_2004/";
            fs.stat(path, function(err, stats) {
              if(err) {
                console.error("/dist/lib/scorm/manifest_files_2004/ does not exist!");
                callback(null, "manifest_files_2004");
              }else{
                dir.files(path, function(err, filelist) {
                  if (err) {throw err;}
                  async.each(filelist, function(elem, call) {
                    scorm_2004_zip.file(nodePath.basename(elem), fs.readFileSync("./" + elem));
                    call();
                  }, function(err, results) {
                    callback(null, "manifest_files_2004");
                  });
                });
              }
            });
          },
            // Write visor
            function(callback) {
                visor_zip.generateAsync({ type: "nodebuffer" }).then(function(content) {
                    fs.writeFile("./dist/lib/visor/dist.zip", content, function(err) {});
                    console.log("Ended dist.zip bundle");
                    callback();

                });
            },
          // Write scorm 2004
          function(callback) {
            scorm_2004_zip.generateAsync({ type: "nodebuffer" }).then(function(content) {
              fs.writeFile("./dist/lib/scorm/scorm2004.zip", content, function(err) {});
              console.log("Ended scorm2004.zip bundle");
              callback();
            });
          },
            // Write scorm 1.2
            function(callback) {
              scorm_12_zip.generateAsync({ type: "nodebuffer" }).then(function(content) {
                    fs.writeFile("./dist/lib/scorm/scorm1.2.zip", content, function(err) {});
                    console.log("Ended scorm1.2.zip bundle");
                    callback();
                });
            }], function(err, results) {
            callback();
        }
        );

    });
};

module.exports = ZipBundlePlugin;
