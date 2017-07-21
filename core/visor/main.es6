import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import Dali from './../main';
import Plugins from './plugins';
import {ID_PREFIX_SECTION} from './../../constants';

var getDistinctName = function(name, namesUsed){
    namesUsed[name] = namesUsed[name] + 1;
    return name + namesUsed[name];
};

var titleModifier = function(name){
    if(name.indexOf("\:") !== -1){
        name = name.split("\:")[0];
    }
    return name;
};

var parseEJS = function (path, page, state, fromScorm) {
    state.fromScorm = fromScorm;
    if (page !== 0 && state.navItemsById[page]){
        if (Object.keys(state.navItemsById[page].extraFiles).length !== 0){
            let extraFileBox = Object.keys(state.navItemsById[state.navItemSelected].extraFiles)[0];
            let extraFileContainer = state.toolbarsById[extraFileBox];
            return (new EJS({url: path + "_exercise.ejs"}).render({
                state: state,
                relativePath: "../",
                daliDocumentsPath: "css/",
            }));
        }
    }
    
    state.fromScorm = fromScorm;
    return (new EJS({url: path + ".ejs"}).render({
        state: state,
        relativePath: "../",
        fromScorm: fromScorm
    }));
};

export default {
    Plugins: Plugins(),
    exports: function (state) {
        var nav_names_used = {};
        var xhr = new XMLHttpRequest();
        xhr.open('GET', Dali.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(evt) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
 
                    JSZipUtils.getBinaryContent(Dali.Config.visor_zip, function (err, data) {
                        if (err) {
                            throw err; // or handle err
                        }
                        JSZip.loadAsync(data).then(function (zip) {
                            /* var navs = state.navItemsById;

                                state.navItemsIds.map(function (page) {
                                    if(navs[page].hidden){
                                        return;
                                    }
                                    if(page.indexOf(ID_PREFIX_SECTION) !== -1){
                                        return;
                                    }
                                    var name = navs[page].name;

                                    if( nav_names_used[name] === undefined ){
                                        nav_names_used[name] = 0;
                                    } else {
                                        name = getDistinctName(name, nav_names_used);
                                    }


                                    var inner = parseEJS(Dali.Config.visor_ejs, page, state);
                                    zip.file("dist/" + name + ".html", inner);
                                    zip.file("js/visor-bundle.js", xhr.response);
                                });
                            */
                            var page = 0;
                            if (state.navItemsIds && state.navItemsIds.length > 0) {                                
                                if(!Dali.Config.sections_have_content) {
                                    var i;
                                    for (i = 0; i < state.navItemsIds.length; i++) {
                                        if (state.navItemsIds[i].indexOf('se-') === -1){
                                            page = state.navItemsIds[i];
                                            break;
                                        }
                                    }
                                } else {
                                    page = state.navItemsIds[0];
                                }
                            }    
                            state.navItemSelected = page;
                            var content = parseEJS(Dali.Config.visor_ejs, page, state, false);
                            zip.file( Dali.Config.dist_index, content);
                            zip.file( Dali.Config.dist_visor_bundle, xhr.response);

                           
                            return zip;
                        }).then(function (zip) {
                            return zip.generateAsync({type: "blob"});
                        }).then(function (blob) {
                            FileSaver.saveAs(blob, "dalivisor.zip");
                        });
                    });    



                }
            }
        };
        xhr.send();




    },
    exportPage: function (state) {
        if (Object.keys(state.navItemsById[state.navItemSelected].extraFiles).length !== 0){
            let extraFileBox = Object.keys(state.navItemsById[state.navItemSelected].extraFiles)[0];
            let extraFileContainer = state.toolbarsById[extraFileBox];
            state.fromScorm = false;
            return (new EJS({url: Dali.Config.visor_ejs + "_exercise.ejs"}).render({
                state: state,
                relativePath: "../",
                daliDocumentsPath: "css/",
            }));
        }
        return new EJS({url: Dali.Config.visor_ejs + ".ejs"}).render({
            state: state,
            relativePath: "/",
            fromScorm: false
        });
    },
    exportScorm: function (state) {
        var zip_title;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', Dali.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(evt) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
        
                    JSZipUtils.getBinaryContent(Dali.Config.scorm_zip, function (err, data) {
                        if (err) {
                            throw err; // or handle err
                        }
                        JSZip.loadAsync(data).then(function (zip) {
                            var navs = state.navItemsById;
                            var navsIds = state.navItemsIds;
                            //var sections = [];
                           /* state.navItemsIds.map(function (page) {
                                if(navs[page].hidden){
                                    return;
                                }

                                if ( !Dali.Config.sections_have_content && (page.indexOf(ID_PREFIX_SECTION) !== -1)){
                                    return;
                                }

                                var nombre = navs[page].id.replace(/\-/g,"\_");
                                var unit;
                                if(typeof navs[page].unitNumber === "undefined"){
                                    unit = "blank";
                                } else {
                                    unit = navs[page].unitNumber;
                                }
                                var path = "unit" + unit + "/";

                                //sections.push(path + nombre);
                                if(Object.keys(navs[page].extraFiles).length !== 0){
                                    for(var boxKey in navs[page].extraFiles){
                                        $.ajax({
                                            url: navs[page].extraFiles[boxKey],
                                            async: false,
                                            success: function (response, status, aj) {
                                                zip.file(path + nombre + "_ejer.xml", aj.responseText);
                                                state.toolbarsById[boxKey].state.__xml_path = nombre + "_ejer.xml";
                                                state.toolbarsById[boxKey].state.isScorm = true;
                                            },
                                            error: function (aj, status) {
                                                console.error("Error while downloading XML file");
                                            }
                                        });
                                    }
                                }
                                var inner = parseEJS(Dali.Config.visor_ejs, page, state, true);
                                //zip.file(path + nombre + ".html", inner);
                            });*/
                            //zip.file("index.html", Dali.Scorm.getIndex(navs));
                            zip.file("imsmanifest.xml", Dali.Scorm.createSPAimsManifest(navsIds, navs, state.globalConfig));
                            var page = 0;
                            if (state.navItemsIds && state.navItemsIds.length > 0) {                                
                                if(!Dali.Config.sections_have_content) {
                                    var i;
                                    for (i = 0; i < state.navItemsIds.length; i++) {
                                        if (state.navItemsIds[i].indexOf('se-') === -1){
                                            page = state.navItemsIds[i];
                                            break;
                                        }
                                    }
                                } else {
                                    page = state.navItemsIds[0];
                                }
                            }    
                            state.fromScorm = true;
                            state.navItemSelected = page;
                            var content = parseEJS(Dali.Config.visor_ejs, page, state, true);
                            zip.file( Dali.Config.dist_index, content);
                            zip.file( Dali.Config.dist_visor_bundle, xhr.response);
                            zip_title = state.globalConfig.title;

                            return zip;
                        }).then(function (zip) {
                            return zip.generateAsync({type: "blob"});
                        }).then(function (blob) {
                            FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g,'') + Math.round(+new Date()/1000) +".zip");
                        });
                    });
                }
            }
        };
        xhr.send();
    },
    exportSeparateScorm: function (state) {
        var zip_title;
        JSZipUtils.getBinaryContent(Dali.Config.scorm_zip, function (err, data) {
            if (err) {
                throw err; // or handle err
            }
            JSZip.loadAsync(data).then(function (zip) {
                var navs = state.navItemsById;
                //var sections = [];
                state.navItemsIds.map(function (page) {
                    if(navs[page].hidden){
                        return;
                    }

                    if ( !Dali.Config.sections_have_content && (page.indexOf(ID_PREFIX_SECTION) !== -1)){
                        return;
                    }

                    var nombre = navs[page].id.replace(/\-/g,"\_");
                    var unit;
                    if(typeof navs[page].unitNumber === "undefined"){
                        unit = "blank";
                    } else {
                        unit = navs[page].unitNumber;
                    }
                    var path = "unit" + unit + "/";
                    
                    //sections.push(path + nombre);
                    if(Object.keys(navs[page].extraFiles).length !== 0){
                        for(var boxKey in navs[page].extraFiles){
                            $.ajax({
                                url: navs[page].extraFiles[boxKey],
                                async: false,
                                success: function (response, status, xhr) {
                                    zip.file(path + nombre + "_ejer.xml", xhr.responseText);
                                    state.toolbarsById[boxKey].state.__xml_path = nombre + "_ejer.xml";
                                    state.toolbarsById[boxKey].state.isScorm = true;
                                },
                                error: function (xhr, status) {
                                    console.error("Error while downloading XML file");
                                }
                            });
                        }
                    }
                    var inner = parseEJS(Dali.Config.visor_ejs, page, state, true);
                    zip.file(path + nombre + ".html", inner);
                });
                zip.file("index.html", Dali.Scorm.getIndex(navs));
                zip.file("imsmanifest.xml", Dali.Scorm.createOldimsManifest(state.globalConfig.title, navs));
                zip_title = state.globalConfig.title;

                return zip;
            }).then(function (zip) {
                return zip.generateAsync({type: "blob"});
            }).then(function (blob) {
                FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g,'') + Math.round(+new Date()/1000) +".zip");
            });
        });
    }
};
