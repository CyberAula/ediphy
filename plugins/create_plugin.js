import path from 'path';
import fs from 'fs';
const BASE = "plugins/";
let options = {
    name: "",
    displayName: "",
    category: "multimedia",
    isReact: true,
    visor: true,
    isRich: false,
};

function p(text) {
    console.log(text);
}

function help() {
    p("Uso: npm run create-plugin -- \"<Nombre del plugin>\" ");
    p("  Opciones: ");
    p("     legacy:                Plugin JS en vez de React ");
    p("     no-visor:              Plugin sin definir para el visor ");
    p("     rich:                  Plugin enriquecido ");
    p("     category <categoría>:  Categoría del plugin ");
    p("");
}

function parseArgs(args) {
    if (!args || args.length < 3) {
        p("Es obligatorio ponerle un nombre al plugin");
        p("Escribe 'npm run create-plugin help' para más información");
        return;
    }
    if (args[2] === "help") {
        help();
        return;
    }
    args.forEach(function(val, index, array) {
        if (index === 2) {
            p("Creando plugin: " + val);
            options.name = val.split(" ").join("");
            options.displayName = val;
        } else if (index > 2) {
            switch(val) {
            case "legacy":
                options.isReact = false;
                break;
            case "no-visor":
                options.visor = false;
                break;
            case "category":
                if(index < args.length) {
                    options.category = args[index + 1];
                }
                break;
            case "rich":
                options.isRich = true;
                break;
            default:
                if(index >= 1 && args[index - 1] !== 'category') {
                    p("Opción " + val + " no reconocida");
                }
                break;
            }
        }
    });
    createPlugins();
    p("Opciones");
    p(options);

}

function createPlugins() {
    let dir = BASE + options.name;
    console.log(template());
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/options.name" + ".js", "");
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el plugin o borre el directorio existente");
        return;
    }

}

function template() {
    return `
    import React from 'react';
    import i18n from 'i18next';
    
    export function ${options.name}(base) {
        return {
            getConfig: function() {
                return {
                    name: '${options.name}',
                    displayName: i18n.t('${options.name}.PluginName'),
                    category: ${options.category},
                    ${options.isReact ? "flavor: 'react'," : "\b"}
                    ${options.isRich ? "true," : "\b"}
                    needsConfigModal: false,
                    needsTextEdition: false,
                    initialWidth: '480px',
                    initialHeight: "270px",
                    initialWidthSlide: '30%',
                    initialHeightSlide: '30%',
                    icon: 'label',
                };
            },
            getToolbar: function() {
                return {
                    main: {
                        __name: "Main",
                        accordions: {
    
                            style: {
                                __name: i18n.t('${options.name}.box_style'),
                                icon: 'palette',
                                buttons: {
                                    padding: {
                                        __name: i18n.t('${options.name}.padding'),
                                        type: 'number',
                                        value: 0,
                                        min: 0,
                                        max: 100,
                                    },
                                    backgroundColor: {
                                        __name: i18n.t('${options.name}.background_color'),
                                        type: 'color',
                                        value: '#ffffff',
                                    },
                                    borderWidth: {
                                        __name: i18n.t('${options.name}.border_size'),
                                        type: 'number',
                                        value: 0,
                                        min: 0,
                                        max: 10,
                                    },
                                    borderStyle: {
                                        __name: i18n.t('${options.name}.border_style'),
                                        type: 'select',
                                        value: 'solid',
                                        options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    },
                                    borderColor: {
                                        __name: i18n.t('${options.name}.border_color'),
                                        type: 'color',
                                        value: '#000000',
                                    },
                                    borderRadius: {
                                        __name: i18n.t('${options.name}.radius'),
                                        type: 'number',
                                        value: 0,
                                        min: 0,
                                        max: 50,
                                    },
                                    opacity: {
                                        __name: i18n.t('${options.name}.opacity'),
                                        type: 'range',
                                        value: 1,
                                        min: 0,
                                        max: 1,
                                        step: 0.01,
                                    },
                                },
                            },
                            basic: {
                                __name: i18n.t('${options.name}.name'),
                                icon: 'link',
                                buttons: {
                                    url: {
                                        __name: 'Name',
                                        type: 'text',
                                        value: base.getState().name,
                                        autoManaged: false,
                                    },
                                },
                            },
                        },
                    },
                };
            },
            getInitialState: function() {
                return {
                    name: "Ediphy",
                };
            },
            getRenderTemplate: function(state) {
                return (<div>Hello {state.name} </div>);
    
            },
            handleToolbar: function(name, value) {
                base.setState(name, value);
            },
            
        };
    }
`;
}

parseArgs(process.argv);
