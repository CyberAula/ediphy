import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import Ediphy from '../editor/main';
import Plugins from './plugins';
import { escapeRegExp } from '../../common/utils';
import { generateStyles, getThemeImages } from "../../common/themes/theme_loader";
import { getThemeBackgrounds } from "../../common/themes/background_loader";

const visor_template = require("../../dist/lib/visor/index.ejs");

let parseEJS = function(path, page, state, fromScorm) {
    state.fromScorm = fromScorm;
    if (page !== 0 && state.navItemsById[page]) {
        if (Object.keys(state.navItemsById[page].extraFiles).length !== 0) {
            return (visor_template({
                visor_bundle_path: Ediphy.Config.visor_bundle_zip || Ediphy.Config.visor_bundle,
                state: state,
                reason: fromScorm ? "scorm" : "html",
            }));
        }
    }

    state.fromScorm = fromScorm;
    return (visor_template({
        visor_bundle_path: Ediphy.Config.visor_bundle_zip || Ediphy.Config.visor_bundle,
        state: state,
        reason: fromScorm ? "scorm" : "html",
    }));
};

export default {
    Plugins: Plugins(),
    exportsHTML: function(state, callback, selfContained) {
        let xhr = new XMLHttpRequest();
        let zip_title = state.globalConfig.title || "Ediphy";
        let theme = Ediphy.Visor.getThemesUsed(state);
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        try{
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        JSZipUtils.getBinaryContent(Ediphy.Config.visor_zip, function(err, data) {
                            if (err) {
                                callback(1);
                                throw err; // or handle err

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
                                let strState = Ediphy.Visor.stateToHttps(state);
                                let usedNames = [];
                                if (selfContained) {
                                    let index = 0;
                                    for (let f in state.filesUploaded) {
                                        let file = state.filesUploaded[f];
                                        let r = new RegExp(escapeRegExp(file.url), "g");
                                        let name = "ediphy_" + index + "_" + file.name;
                                        if (usedNames.indexOf(name) > -1) {
                                            name = Date.now() + '_' + name;
                                        }
                                        usedNames.push(name);
                                        strState = strState.replace(r, '../images/' + name);
                                        index++;
                                    }
                                }
                                generateStyles(theme)
                                    .then(css => {
                                        let content = parseEJS(Ediphy.Config.visor_ejs, page, { ...JSON.parse(strState), id: window.ediphy_editor_params ? window.ediphy_editor_params.ediphy_resource_id : null, platform: getPlatform() }, false);
                                        zip.file(Ediphy.Config.dist_index, content);
                                        zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);
                                        zip.file("ediphy.edi", strState);
                                        zip.file("dist/theme.css", css);
                                        Ediphy.Visor.includeThemesResources(zip, theme, zipTheme => {
                                            Ediphy.Visor.includeImage(zipTheme, selfContained ? filesUploaded : [], usedNames, (zipFile) => {
                                                zipFile.generateAsync({ type: "blob" }).then(function(blob) {
                                                    // FileSaver.saveAs(blob, "ediphyvisor.zip");
                                                    FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + "_HTML.zip");
                                                    callback();
                                                });
                                            });
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
    includeThemesResources(zip, themes, callback) {
        let paths = [];
        for (let theme of themes) {
            let themeImages = getThemeImages(theme);
            Object.keys(themeImages).map(template => {
                Object.values(themeImages[template]).map(img => {
                    return !Number.isInteger(img) && img !== '' && paths.push(`dist/themes/${theme}/${img}`);
                });
            });

            let themeBackgrounds = getThemeBackgrounds(theme);
            Object.keys(themeBackgrounds).map(ar => {
                themeBackgrounds[ar].map(background => {
                    if (background.includes('url')) {
                        background = background.replace('url(.', 'dist');
                        background = background.replace(')', '');
                        paths.push(background);
                    }
                });
            });
        }
        Ediphy.Visor.includeThemeImages(zip, paths, callback);
    },
    getThemesUsed(state) {
        let theme = state.styleConfig && state.styleConfig.hasOwnProperty('theme') ? [state.styleConfig.theme] : ['default'];
        Object.keys(state.viewToolbarsById).map((id) => {
            let viewToolbar = state.viewToolbarsById[id];
            if(viewToolbar.hasOwnProperty('theme') && !theme.includes(viewToolbar.theme)) {
                theme.push(viewToolbar.theme);
            }
        });
        return theme;
    },
    stateToHttps(state) {
        let strState = JSON.stringify({ ...state, export: true });
        strState = strState.replace(/http:\/\/vishubcode.org/g, 'https://vishubcode.org');
        strState = strState.replace(/http:\/\/vishub.org/g, 'https://vishub.org');
        strState = strState.replace(/http:\/\/educainternet.es/g, 'https://educainternet.es');
        // strState = strState.replace(/url\(\/themes/g, '/url\(..\/themes');
        return strState;
    },
    includeThemeImages(zip, images, callback) {
        if(images.length > 0) {
            let img = images.pop();
            let path = img.replace('dist', './');
            JSZipUtils.getBinaryContent(path, (e, data) => {
                if(e) {
                    Ediphy.Visor.includeThemeImages(zip, images, callback);
                }
                zip.file(img, data, { binary: true });
                Ediphy.Visor.includeThemeImages(zip, images, callback);
            });
        } else {
            callback(zip);
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
        if (state.navItemSelected && Object.keys(state.navItemsById[state.navItemSelected].extraFiles).length !== 0) {
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
        let theme = Ediphy.Visor.getThemesUsed(state);
        xhr.open('GET', Ediphy.Config.visor_bundle, true);
        xhr.responseType = "arraybuffer";
        try {
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                        JSZipUtils.getBinaryContent(is2004 ? Ediphy.Config.scorm_zip_2004 : Ediphy.Config.scorm_zip_12,
                            function(err, data) {
                                if (err) {
                                    callback(1);
                                    throw err; // or handle err

                                }
                                JSZip.loadAsync(data).then(function(zip) {
                                    let navs = state.navItemsById;
                                    zip.file("imsmanifest.xml",
                                        Ediphy.Scorm.createSPAimsManifest(state.exercises, navs, {
                                            ...state.globalConfig,
                                            status: state.status,
                                        }, is2004));

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
                                    let strState = Ediphy.Visor.stateToHttps(state);
                                    let usedNames = [];
                                    if (selfContained) {
                                        let index = 0;
                                        for (let f in state.filesUploaded) {
                                            let file = state.filesUploaded[f];
                                            let r = new RegExp(escapeRegExp(file.url), "g");
                                            let name = "ediphy_" + index + "_" + file.name;

                                            if (usedNames.indexOf(name) > -1) {
                                                name = Date.now() + '_' + name;
                                            }
                                            usedNames.push(name);
                                            strState = strState.replace(r, '../images/' + name);
                                            index++;
                                        }
                                    }
                                    generateStyles(theme)
                                        .then(css => {
                                            zip.file("ediphy.edi", strState);
                                            let content = parseEJS(Ediphy.Config.visor_ejs, page, {
                                                ...JSON.parse(strState),
                                                id: window.ediphy_editor_params ? window.ediphy_editor_params.ediphy_resource_id : null,
                                                platform: getPlatform(),
                                            }, true);
                                            zip.file(Ediphy.Config.dist_index, content);
                                            zip.file(Ediphy.Config.dist_visor_bundle, xhr.response);
                                            zip.file("dist/theme.css", css);
                                            zip_title = state.globalConfig.title || 'Ediphy';
                                            Ediphy.Visor.includeThemesResources(zip, theme, zipTheme => {
                                                Ediphy.Visor.includeImage(zipTheme, selfContained ? filesUploaded : [], usedNames, (zipFile) => {
                                                    zipFile.generateAsync({ type: "blob" }).then(function(blob) {
                                                        // FileSaver.saveAs(blob, "ediphyvisor.zip");
                                                        FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g, '') + Math.round(+new Date() / 1000) + (is2004 ? "_2004" : "_1.2") + ".zip");
                                                        callback();
                                                    });
                                                });
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
    exportsEDI: function(state, callback) {
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
        let strState = JSON.stringify({ ...state, export: true });
        strState = strState.replace(/http:\/\/vishubcode.org/g, 'https://vishubcode.org');
        strState = strState.replace(/http:\/\/vishub.org/g, 'https://vishub.org');
        strState = strState.replace(/http:\/\/educainternet.es/g, 'https://educainternet.es');
        window.download(strState, "ediphy.edi", "text/json");
        callback();
    },
};

function getPlatform() {
    let allowedDomains = ["vishub.org", "educainternet.es", "localhost:3000", "localhost:8080", "ging.github.io/ediphy", "ging.github.com/ediphy"];
    let allowedDomain = false;
    allowedDomains.map((domain)=>{
        if (window.location.href.indexOf(domain) > -1) {
            allowedDomain = domain;
        }
    });
    return allowedDomain;
}
