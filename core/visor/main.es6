import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import FileSaver from 'file-saver';

import Dali from './../main';
import Plugins from './plugins';

var parseEJS = function (path, page, state, fromScorm) {
    return (new EJS({url: path}).render({
        state: state,
        title: state.title,
        page: page,
        navs: state.navItemsById,
        boxesById: state.boxesById,
        boxes: state.boxes,
        toolbarsById: state.toolbarsById,
        relativePath: fromScorm ? "../" : ""
    }));
};

export default {
    Plugins: Plugins(),
    exports: function (state) {
        JSZipUtils.getBinaryContent(Dali.Config.visor_zip, function (err, data) {
            if (err) {
                throw err; // or handle err
            }
            JSZip.loadAsync(data).then(function (zip) {
                var navs = state.navItemsById;

                state.navItemsIds.map(function (page) {
                    if(navs[page].hidden){
                        return;
                    }
                    var inner = parseEJS(Dali.Config.visor_ejs, page, state);
                    var nombre = navs[page].name;
                    zip.file(nombre + ".html", inner);
                });
                return zip;
            }).then(function (zip) {
                return zip.generateAsync({type: "blob"});
            }).then(function (blob) {
                FileSaver.saveAs(blob, "dalivisor.zip");
            });
        });
    },
    exportPage: function (state) {
        return new EJS({url: Dali.Config.visor_ejs}).render({
            title: state.title,
            state: state,
            page: state.navItemSelected,
            navs: state.navItemsById,
            boxesById: state.boxesById,
            boxes: state.boxes,
            toolbarsById: state.toolbarsById,
            relativePath: "/",
        });
    },
    exportScorm: function (state) {
        JSZipUtils.getBinaryContent(Dali.Config.scorm_zip, function (err, data) {
            if (err) {
                throw err; // or handle err
            }
            JSZip.loadAsync(data).then(function (zip) {
                var navs = state.navItemsById;
                var sections = [];
                state.navItemsIds.map(function (page) {
                    if(navs[page].hidden){
                        return;
                    }

                    var nombre = navs[page].name.replace(/ /g, "_");
                    var path = "unidad" + navs[page].unitNumber + "/";
                    sections.push(path + nombre);
                    if(Object.keys(navs[page].extraFiles).length !== 0){
                        for(var boxKey in navs[page].extraFiles){
                            $.ajax({
                                url: navs[page].extraFiles[boxKey],
                                async: false,
                                success: function (response, status, xhr) {
                                    zip.file(path + nombre + "_ejer.xml", xhr.responseText);
                                    state.toolbarsById[boxKey].state.__xml_path = path + nombre + "_ejer.xml";
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
                zip.file("imsmanifest.xml", Dali.Scorm.testXML(state.title, sections));

                return zip;
            }).then(function (zip) {
                return zip.generateAsync({type: "blob"});
            }).then(function (blob) {
                FileSaver.saveAs(blob, "dalivisor.zip");
            });
        });
    }
};