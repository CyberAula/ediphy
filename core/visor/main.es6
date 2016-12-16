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
    if (Object.keys(state.navItemsById[page].extraFiles).length !== 0){
        return (new EJS({url: path + "_exercise.ejs"}).render({
            title: state.title,
            subtitle: titleModifier(state.navItemsById[state.navItemSelected].name),
            state: state,
            relativePath: "../",
            daliDocumentsPath: "css/"
        }));
    }
    return (new EJS({url: path + ".ejs"}).render({
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
        var nav_names_used = {};
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
                    zip.file(name + ".html", inner);
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
        if (Object.keys(state.navItemsById[state.navItemSelected].extraFiles).length !== 0){
            return (new EJS({url: Dali.Config.visor_ejs + "_exercise.ejs"}).render({
                title: state.title,
                subtitle: titleModifier(state.navItemsById[state.navItemSelected].name),
                state: state,
                relativePath: "../",
                daliDocumentsPath: "css/"
            }));
        }
        return new EJS({url: Dali.Config.visor_ejs + ".ejs"}).render({
            title: state.navItemsById[state.navItemSelected].name,
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
                    var path = "unit" + navs[page].unitNumber + "/";
                    //sections.push(path + nombre);
                    if(Object.keys(navs[page].extraFiles).length !== 0){
                        for(var boxKey in navs[page].extraFiles){
                            $.ajax({
                                url: navs[page].extraFiles[boxKey],
                                async: false,
                                success: function (response, status, xhr) {
                                    zip.file(path + nombre + "_ejer.xml", xhr.responseText);
                                    state.toolbarsById[boxKey].state.__xml_path = path + nombre + "_ejer.xml";
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
                zip.file("imsmanifest.xml", Dali.Scorm.createimsManifest(state.title, navs));
                zip_title = state.title;

                return zip;
            }).then(function (zip) {
                return zip.generateAsync({type: "blob"});
            }).then(function (blob) {
                FileSaver.saveAs(blob, zip_title.toLowerCase().replace(/\s/g,'') + Math.round(+new Date()/1000) +".zip");
            });
        });
    }
};
