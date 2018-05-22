import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import Ediphy from '../editor/main';
import Plugins from './plugins';
import { ID_PREFIX_SECTION } from '../../common/constants';
import { escapeRegExp } from '../../common/utils';

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
                reason: fromScorm ? "scorm" : "html",
            }));
        }
    }

    state.fromScorm = fromScorm;
    return (visor_template({
        visor_bundle_path: Ediphy.Config.visor_bundle,
        state: state,
        reason: fromScorm ? "scorm" : "html",
    }));
};

export default {
    Plugins: Plugins(),
    exportsHTML: function(state, callback, selfContained) {
        let nav_names_used = {};
        let xhr = new XMLHttpRequest();
        let zip_title = state.globalConfig.title || "Ediphy";
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        try{
            xhr.onreadystatechange = function(evt) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        JSZipUtils.getBinaryContent(Ediphy.Config.visor_zip, function(err, data) {
                            if (err) {
                                callback(1);
                                throw err; // or handle err
                                return;

                            }
                            JSZip.loadAsync(data).then(function(zip) {

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
                                let filesUploaded = Object.values(state.filesUploaded);
                                let strState = JSON.stringify(state);
                                let usedNames = [];
                                if (selfContained) {
                                    for (let f in state.filesUploaded) {
                                        let file = state.filesUploaded[f];
                                        let r = new RegExp(escapeRegExp(file.url), "g");
                                        let name = file.name;
                                        if (usedNames.indexOf(name) > -1) {
                                            name = name = Date.now() + '_' + name;
                                        }
                                        usedNames.push(name);
                                        strState = strState.replace(r, '../images/' + name);
                                    }
                                }

                                let content = parseEJS(Ediphy.Config.visor_ejs, page, JSON.parse(strState), false);
                                zip.file(Ediphy.Config.dist_index, content);
                                zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);
                                zip.file("ediphy.edi", strState);
                                Ediphy.Visor.includeImage(zip, Object.values(state.filesUploaded), usedNames, (zip) => {
                                    zip.generateAsync({ type: "blob" }).then(function(blob) {
                                        // FileSaver.saveAs(blob, "ediphyvisor.zip");
                                        FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + "_HTML.zip");
                                        callback();
                                    });
                                });
                            });
                        });

                    } else {
                        callback('error');
                    }
                }
            };
            xhr.send();
        } catch (e) {
            callback(e);
        }

    },
    includeImage(zip, filesUploaded, usedNames, callback) {
        if(filesUploaded.length > 0) {
            let file = filesUploaded.pop();
            let name = usedNames.pop();
            JSZipUtils.getBinaryContent(file.url, (err, data) => {
                if(err) {
                    throw err; // or handle the error
                }

                zip.file('images/' + name, data, { binary: true });
                Ediphy.Visor.includeImage(zip, filesUploaded, usedNames, callback);
            });
        } else {
            callback(zip);
        }
    },
    exportPage: function(state) {
        if (Object.keys(state.navItemsById[state.navItemSelected].extraFiles).length !== 0) {
            let extraFileBox = Object.keys(state.navItemsById[state.navItemSelected].extraFiles)[0];
            let extraFileContainer = state.pluginToolbarsById[extraFileBox];
            state.fromScorm = false;
            return (visor_template({
                visor_bundle_path: Ediphy.Config.visor_bundle,
                state: state,
                reason: "preview",
            }));
        }
        return visor_template({
            state: state,
            visor_bundle_path: Ediphy.Config.visor_bundle,
            fromScorm: false,
            reason: "preview",
        });
    },
    exportScorm: function(state, is2004, callback, selfContained) {
        let zip_title;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        try {
            xhr.onreadystatechange = function(evt) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        JSZipUtils.getBinaryContent(is2004 ? Ediphy.Config.scorm_zip_2004 : Ediphy.Config.scorm_zip_12,
                            function(err, data) {
                                if (err) {
                                    callback(1);
                                    throw err; // or handle err
                                    return;

                                }
                                JSZip.loadAsync(data).then(function(zip) {
                                    let navs = state.navItemsById;
                                    let navsIds = state.navItemsIds;
                                    zip.file("imsmanifest.xml",
                                        Ediphy.Scorm.createSPAimsManifest(state.exercises, navs, state.globalConfig, is2004));

                                    let page = 0;
                                    if (state.navItemsIds && state.navItemsIds.length > 0) {
                                        if (!Ediphy.Config.sections_have_content) {
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
                                    let filesUploaded = Object.values(state.filesUploaded);
                                    let strState = JSON.stringify(state);
                                    let usedNames = [];
                                    if (selfContained) {
                                        for (let f in state.filesUploaded) {
                                            let file = state.filesUploaded[f];
                                            let r = new RegExp(escapeRegExp(file.url), "g");
                                            let name = file.name;
                                            if (usedNames.indexOf(name) > -1) {
                                                name = Date.now() + '_' + name;
                                            }
                                            usedNames.push(name);
                                            strState = strState.replace(r, '../images/' + name);
                                        }
                                    }
                                    zip.file("ediphy.edi", strState);
                                    let content = parseEJS(Ediphy.Config.visor_ejs, page, JSON.parse(strState), true);
                                    zip.file(Ediphy.Config.dist_index, content);
                                    zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);
                                    zip_title = state.globalConfig.title;
                                    Ediphy.Visor.includeImage(zip, filesUploaded, usedNames, (zip) => {

                                        zip.generateAsync({ type: "blob" }).then(function(blob) {
                                            // FileSaver.saveAs(blob, "ediphyvisor.zip");
                                            FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + (is2004 ? "_2004" : "_1.2") + ".zip");
                                            callback();
                                        });
                                    });
                                }).catch(e=>{callback(e);});
                            });
                    } else {
                        callback(xhr.status);
                    }
                }
            };
            xhr.send();
        } catch (e) {
            callback(e);
        }
    },
};
