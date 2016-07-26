//var JSZip = require('jszip');
//var JSZipUtils = require('jszip-utils');
//var FileSaver = require('file-saver');

var DaliVisor = (function () {
    var getScripts = function (state, page) {
        var scripts = "";
        getPluginsInView(state, page).map(function (name) {
            var plugin = Dali.Visor.Plugins.get(name);
            for (var fnName in plugin) {
                if (fnName !== "callExtraFunction" &&
                    fnName !== "registerExtraFunction" &&
                    fnName !== "getExtraFunctions" &&
                    fnName !== "export" &&
                    fnName !== "render" &&
                    fnName !== "create" &&
                    fnName !== "init"
                ) {
                    scripts += (scripts.length === 0 ? "<script type='text/javascript'>" : "") +
                        plugin[fnName].toString().replace("function", "function " + fnName)
                            .replace(/\n/g, "").replace(/\s+/g, " ");
                }
            }
        });

        if (scripts.length !== 0) {
            scripts += " function __getPlugin(element){if(element.className.indexOf('wholebox') !== -1) return element; return __getPlugin(element.parentElement);}";
            scripts += "</script>";
        }

        return scripts;
    };

    var getPluginsInView = function (state, page) {
        let plugins = [];
        let ids = [];
        state.navItemsById[page].boxes.map(function (id) {
            ids.push(id);
            ids = ids.concat(getDescendants(state, id));
        });

        ids.map(function (id) {
            let toolbar = state.toolbarsById[id];
            if (plugins.indexOf(toolbar.config.name) === -1) {
                plugins.push(toolbar.config.name);
            }
        });

        return plugins;
    };

    var getDescendants = function (state, id) {
        var selected = [];
        var box = state.boxesById[id];
        for (var i = 0; i < box.children.length; i++) {
            var container = box.sortableContainers[box.children[i]];
            for (var j = 0; j < container.children.length; j++) {
                selected.push(container.children[j]);
                selected = selected.concat(getDescendants(state, container.children[j]));
            }
        }
        return selected;
    };
    var parseEJS = function (path, page, state) {
        return (new EJS({url: path}).render({
            scripts: getScripts(state, page),
            title: state.title,
            page: page,
            navs: state.navItemsById,
            boxesById: state.boxesById,
            boxes: state.boxes,
            toolbarsById: state.toolbarsById
        }));
    };

    return {
        exports: function (state) {
            JSZipUtils.getBinaryContent(Dali.Config.visor_zip, function (err, data) {
                if (err) {
                    throw err; // or handle err
                }
                JSZip.loadAsync(data).then(function (zip) {
                    var navs = state.navItemsById;

                    state.navItemsIds.map(function (page) {
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
                scripts: getScripts(state, state.navItemSelected),
                page: state.navItemSelected,
                navs: state.navItemsById,
                boxesById: state.boxesById,
                boxes: state.boxes,
                toolbarsById: state.toolbarsById
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
                        var inner = parseEJS(Dali.Config.visor_ejs, page, state);
                        var nombre = navs[page].name;
                        sections.push(nombre);
                        zip.file(nombre + ".html", inner);
                    });
                    zip.file("index.html", DaliScorm.getIndex(navs));
                    zip.file("imsmanifest.xml", DaliScorm.testXML(state.title, sections));

                    return zip;
                }).then(function (zip) {
                    return zip.generateAsync({type: "blob"});
                }).then(function (blob) {
                    FileSaver.saveAs(blob, "dalivisor.zip");
                });
            });
        }
    };
})();