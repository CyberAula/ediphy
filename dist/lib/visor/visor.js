var DaliVisor = (function () {
    var getScripts = function (state, page) {
        var scripts = "";
        getPluginsInView(state, page).map(function (name) {
            var plugin = Dali.Visor.Plugins.get(name);
            for (var fnName in plugin) {
                if (fnName !== "callExtraFunction" &&
                    fnName !== "export" &&
                    fnName !== "render") {
                    scripts += (scripts.length === 0 ? "<script type='text/javascript'>" : "")
                        + plugin[fnName].toString().replace("function", "function " + fnName)
                            .replace(/\n/g, "").replace(/\s+/g, " ");
                }
            }
        });

        if (scripts.length !== 0) {
            scripts += " function __getPlugin(element){if(element.className.indexOf('wholebox') !== -1) return element; return __getPlugin(element.parentElement);}";
            scripts += "</script>";
        }
        
        return scripts;
    }

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

    return {
        exports: function (state) {
            var today = new Date();
            var strDate = 'd-m-Y'
                .replace('d', today.getDate())
                .replace('m', today.getMonth() + 1)
                .replace('Y', today.getFullYear());

            JSZipUtils.getBinaryContent('/lib/visor/dist.zip', function (err, data) {
                if (err) {
                    throw err; // or handle err
                }

                var zip = new JSZip(data);
                var navs = state.navItemsById;
                /*
                 JSZipUtils.getBinaryContent("path/to/picture.png", function (err, data) {
                 if(err) {
                 throw err; // or handle the error
                 }
                 var zip = new JSZip();
                 zip.file("picture.png", data, {binary:true});
                 });
                 */

                state.navItemsIds.map(function (page) {
                    var inner = new EJS({url: '/lib/visor/index.ejs'}).render({
                        scripts: getScripts(state, page),
                        page: page,
                        navs: navs,
                        boxesById: state.boxesById,
                        boxes: state.boxes,
                        toolbarsById: state.toolbarsById,
                        strDate: strDate
                    });

                    var nombre = navs[page].name;
                    zip.file(nombre + ".html", inner);
                });

                var content = zip.generate({type: "blob"});
                saveAs(content, "dalivisor.zip");
            });
        },
        exportPage: function (state) {
            var today = new Date();
            var strDate = 'd-m-Y'
                .replace('d', today.getDate())
                .replace('m', today.getMonth() + 1)
                .replace('Y', today.getFullYear());

            return new EJS({url: '/lib/visor/page.ejs'}).render({
                scripts: getScripts(state, state.navItemSelected),
                page: state.navItemSelected,
                navs: state.navItemsById,
                boxesById: state.boxesById,
                boxes: state.boxes,
                toolbarsById: state.toolbarsById,
                strDate: strDate
            });
        }
    }
})();