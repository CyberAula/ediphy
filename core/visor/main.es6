import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import Ediphy from '../editor/main';
import Plugins from './plugins';
import { ID_PREFIX_SECTION } from '../../common/constants';

const visor_template = require("../../dist/lib/visor/index.ejs");

let getDistinctName = function(name, namesUsed) {
    namesUsed[name] = namesUsed[name] + 1;
    return name + namesUsed[name];
};

let titleModifier = function(name) {
    if(name.indexOf("\:") !== -1) {
        name = name.split("\:")[0];
    }
    return name;
};

let parseEJS = function(path, page, state, fromScorm) {
    state.fromScorm = fromScorm;
    if (page !== 0 && state.navItemsById[page]) {
        if (Object.keys(state.navItemsById[page].extraFiles).length !== 0) {
            let extraFileBox = Object.keys(state.navItemsById[state.navItemSelected].extraFiles)[0];
            let extraFileContainer = state.pluginToolbarsById[extraFileBox];
            return (visor_template({
                visor_bundle_path: Ediphy.Config.visor_bundle,
                state: state,
            }));
        }
    }

    state.fromScorm = fromScorm;
    return (visor_template({
        visor_bundle_path: Ediphy.Config.visor_bundle,
        state: state,
    }));
};

export default {
    Plugins: Plugins(),
    exports: function(state) {
        let nav_names_used = {};
        let xhr = new XMLHttpRequest();
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(evt) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {

                    JSZipUtils.getBinaryContent(Ediphy.Config.visor_zip, function(err, data) {
                        if (err) {
                            throw err; // or handle err
                        }
                        JSZip.loadAsync(data).then(function(zip) {
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

                                    var inner = parseEJS(Ediphy.Config.visor_ejs, page, state);
                                    zip.file("dist/" + name + ".html", inner);
                                    zip.file("js/visor-bundle.js", xhr.response);
                                });
                            */
                            let page = 0;
                            if (state.navItemsIds && state.navItemsIds.length > 0) {
                                if(!Ediphy.Config.sections_have_content) {
                                    let i;
                                    for (i = 0; i < state.navItemsIds.length; i++) {
                                        if (state.navItemsIds[i].indexOf('se-') === -1) {
                                            page = state.navItemsIds[i];
                                            break;
                                        }
                                    }
                                } else {
                                    page = state.navItemsIds[0];
                                }
                            }
                            state.navItemSelected = page;
                            let content = parseEJS(Ediphy.Config.visor_ejs, page, state, false);
                            zip.file(Ediphy.Config.dist_index, content);
                            zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);

                            return zip;
                        }).then(function(zip) {
                            return zip.generateAsync({ type: "blob" });
                        }).then(function(blob) {
                            FileSaver.saveAs(blob, "ediphyvisor.zip");
                        });
                    });

                }
            }
        };
        xhr.send();

    },
    exportPage: function(state) {
        if (Object.keys(state.navItemsById[state.navItemSelected].extraFiles).length !== 0) {
            let extraFileBox = Object.keys(state.navItemsById[state.navItemSelected].extraFiles)[0];
            let extraFileContainer = state.pluginToolbarsById[extraFileBox];
            state.fromScorm = false;
            return (visor_template({
                visor_bundle_path: Ediphy.Config.visor_bundle,
                state: state,
            }));
        }
        return visor_template({
            state: state,
            visor_bundle_path: Ediphy.Config.visor_bundle,
            fromScorm: false,
        });
    },
    exportScorm: function(state) {
        let zip_title;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        xhr.onreadystatechange = function(evt) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {

                    JSZipUtils.getBinaryContent(Ediphy.Config.scorm_zip, function(err, data) {
                        if (err) {
                            throw err; // or handle err
                        }
                        JSZip.loadAsync(data).then(function(zip) {
                            let navs = state.navItemsById;
                            let navsIds = state.navItemsIds;
                            // var sections = [];
                            /* state.navItemsIds.map(function (page) {
                                if(navs[page].hidden){
                                    return;
                                }

                                if ( !Ediphy.Config.sections_have_content && (page.indexOf(ID_PREFIX_SECTION) !== -1)){
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
                                var inner = parseEJS(Ediphy.Config.visor_ejs, page, state, true);
                                //zip.file(path + nombre + ".html", inner);
                            });*/
                            // zip.file("index.html", Ediphy.Scorm.getIndex(navs));
                            zip.file("imsmanifest.xml", Ediphy.Scorm.createSPAimsManifest(navsIds, navs, state.globalConfig));
                            let page = 0;
                            if (state.navItemsIds && state.navItemsIds.length > 0) {
                                if(!Ediphy.Config.sections_have_content) {
                                    let i;
                                    for (i = 0; i < state.navItemsIds.length; i++) {
                                        if (state.navItemsIds[i].indexOf('se-') === -1) {
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
                            let content = parseEJS(Ediphy.Config.visor_ejs, page, state, true);
                            zip.file(Ediphy.Config.dist_index, content);
                            zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);
                            zip_title = state.globalConfig.title;

                            return zip;
                        }).then(function(zip) {
                            return zip.generateAsync({ type: "blob" });
                        }).then(function(blob) {
                            FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + ".zip");
                        });
                    });
                }
            }
        };
        xhr.send();
    },
    exportSeparateScorm: function(state) {
        let zip_title;
        JSZipUtils.getBinaryContent(Ediphy.Config.scorm_zip, function(err, data) {
            if (err) {
                throw err; // or handle err
            }
            JSZip.loadAsync(data).then(function(zip) {
                let navs = state.navItemsById;
                // var sections = [];
                state.navItemsIds.map(function(page) {
                    if(navs[page].hidden) {
                        return;
                    }

                    if (!Ediphy.Config.sections_have_content && (page.indexOf(ID_PREFIX_SECTION) !== -1)) {
                        return;
                    }

                    let nombre = navs[page].id.replace(/\-/g, "\_");
                    let unit;
                    if(typeof navs[page].unitNumber === "undefined") {
                        unit = "blank";
                    } else {
                        unit = navs[page].unitNumber;
                    }
                    let path = "unit" + unit + "/";

                    // sections.push(path + nombre);
                    if(Object.keys(navs[page].extraFiles).length !== 0) {
                        for(let boxKey in navs[page].extraFiles) {
                            $.ajax({
                                url: navs[page].extraFiles[boxKey],
                                async: false,
                                success: function(response, status, xhr) {
                                    zip.file(path + nombre + "_ejer.xml", xhr.responseText);
                                    state.pluginToolbarsById[boxKey].state.__xml_path = nombre + "_ejer.xml";
                                    state.pluginToolbarsById[boxKey].state.isScorm = true;
                                },
                                error: function(xhr, status) {
                                    // eslint-disable-next-line no-console
                                    console.error("Error while downloading XML file");
                                },
                            });
                        }
                    }
                    let inner = parseEJS(Ediphy.Config.visor_ejs, page, state, true);
                    zip.file(path + nombre + ".html", inner);
                });
                zip.file("index.html", Ediphy.Scorm.getIndex(navs));
                zip.file("imsmanifest.xml", Ediphy.Scorm.createOldimsManifest(state.globalConfig.title, navs));
                zip_title = state.globalConfig.title;

                return zip;
            }).then(function(zip) {
                return zip.generateAsync({ type: "blob" });
            }).then(function(blob) {
                FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + ".zip");
            });
        });
    },
};
