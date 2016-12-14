export function CajasColorBis(base) {
    return {
        defaultColors: ['azul', 'cyan', 'gris'],
        getConfig: function () {
            return {
                name: 'CajasColorBis',
                displayName: Dali.i18n.t('CajasColorBis.PluginName'),
                category: 'animations',
                icon: 'view_column',
				needsConfigModal: true,
                initialWidth: '60%'
            };
        },
        getToolbar: function () {
            var toolBar = {
                main: {
                    __name: "Main",
                    accordions: {
                        b_general: {
                            __name: Dali.i18n.t('CajasColorBis.general'),
                            icon: 'build',
                            buttons: {
                                nBoxes: {
                                    __name: Dali.i18n.t('CajasColorBis.number_of_boxes'),
                                    type: 'number',
                                    value: base.getState().nBoxes,
                                    max: 8,
                                    min: 1,
                                    autoManaged: false
                                },
                                rounded: {
                                    __name: Dali.i18n.t('CajasColorBis.rounded_border'),
                                    type: 'checkbox',
                                    value: base.getState().rounded,
                                    autoManaged: false
                                },
                                image:{
                                    __name: "Imagen",
                                    type: 'checkbox',
                                    value: base.getState().image,
                                    autoManaged: false
                                }
                            }
                        }
                    }
                }
            };
            /*var StyleCajas = {}
             StyleCajas.__name = "Estilo de los botones";
             var buttonsSC = {};
             var objAux;
             */
            toolBar.main.accordions.buttonStyle = {__name: "Estilo títulos", icon: 'palette', buttons: {}};
            for (var i = 0; i < base.getState().nBoxes; i++) {
                toolBar.main.accordions.buttonStyle.buttons["color" + i] = {
                    __name: Dali.i18n.t('CajasColorBis.Box') + i,
                    type: 'select',
                    value: base.getState()['color' + i],
                    options: ['verdeoscuro', 'cyan', 'granate', 'naranja', 'rojo', 'azul', 'marron', 'rojizo', 'azulpuro', 'azulverdoso', 'violeta', 'marronvivo', 'gris', 'amarillo'],
                    autoManaged: false
                };
            }
            return toolBar;
        },
        getInitialState: function () {//el color de las cajas es el capa_{colors[i]}
            let state = {
                nBoxes: 3,
                wayHorizontal: true,
                image: false,
                rounded: 'unchecked'
            };

            for (let i = 0; i < state.nBoxes; i++) {
                state['color' + i] = 'verdeoscuro';
            }

            return state;
        },
        getConfigTemplate: function (state) {

            Element.prototype.setAttributes = function (attrs) {
                for (var idx in attrs) {
                    if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
                        for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
                    } else if (idx === 'html') {
                        this.innerHTML = attrs[idx];
                    } else {
                        this.setAttribute(idx, attrs[idx]);
                    }
                }
            };
            
            let template = document.createElement("div");
            let attrs = {
                'style' : {
                    width: '100%',
                    height: '100%'
                }
            };
            template.setAttributes(attrs);
            
            let set = document.createElement("fieldset");
            attrs = {
                'style' : {
                    border: 'none'
                }
            };
            set.setAttributes(attrs);
            
            for (let i = 0; i < base.getState().nBoxes; i++) {
                
                let select = document.createElement("select");
                let attrs = {
                    'id' : i,
                    'onclick' : '$dali$.colorChanged(event, this)',
                    'style' : {
                        width: '100%'
                    }
                };
                select.setAttributes(attrs);
                
                let options = ['verdeoscuro', 'cyan', 'granate', 'naranja', 'rojo', 'azul', 'marron', 'rojizo', 'azulpuro', 'azulverdoso', 'violeta', 'marronvivo', 'gris', 'amarillo'];
                
                for (let a = 0; a < options.length; a++) {
                    let option = document.createElement("option");
                    let attrs = {
                        'value' : options[a],
                        'style' : {
                            width: '100%'
                        }
                    };
                    option.setAttributes(attrs);
                    
                    option.appendChild(document.createTextNode(options[a]));
                    select.appendChild(option);
                }
                
                select.value = base.getState()['color' + i];
                let label = document.createElement("label");
                label.appendChild(document.createTextNode('Color ' + i));
                label.appendChild(select);
                template.appendChild(label);
                let br = document.createElement("br");
                template.appendChild(br);
            }
            

            var tmp = document.createElement("div");
            tmp.appendChild(template);
            return tmp.innerHTML;
		},
        colorChanged: function (event, element, parent) {
            base.setState('color' + element.id, element.value);
        },
        getRenderTemplate: function (state) {

            Element.prototype.setAttributes = function (attrs) {
                for (var idx in attrs) {
                    if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
                        for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
                    } else if (idx === 'html') {
                        this.innerHTML = attrs[idx];
                    } else {
                        this.setAttribute(idx, attrs[idx]);
                    }
                }
            };

            var template = document.createElement("div");
            var attrs = {
                'class' : 'cajascolor',
                'style' : {
                    width: '100%',
                    height: '100%'
                }
            };
            template.setAttributes(attrs);


            var imageTemplate = document.createElement('p');
            attrs = {
                'style' : {
                    'align' : 'center'
                }
            };
            imageTemplate.setAttributes(attrs);

            var imagePlugin = document.createElement('plugin');
            attrs = {
                'plugin-data-display-name' : Dali.i18n.t('CajasColorBis.image_box_name'),
                'plugin-data-key' : 'image',
                'plugin-data-default' : 'BasicImage'
            };
            imagePlugin.setAttributes(attrs);

            imageTemplate.appendChild(imagePlugin);


            var tablaTemplate = document.createElement('div');
            attrs = {
                'class' : 'tabla_colores'
            };
            tablaTemplate.setAttributes(attrs);

            var filaTemplate = document.createElement('div');
            attrs = {
                'class' : 'fila_colores'
            };
            filaTemplate.setAttributes(attrs);

            var celdasTemplate = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let celda = document.createElement("div");
                attrs = {
                    'class' : 'celda3_colores ' + state['color' + i] + ' ' + (state.rounded === 'checked' ? 'rounded' : '')
                };
                celda.setAttributes(attrs);

                let link = document.createElement('a');
                attrs = {
                    'href' : '#'
                };
                link.setAttributes(attrs);

                let title = document.createElement('plugin');
                attrs = {
                    'plugin-data-key' : 'title' + i,
                    'plugin-data-display-name' : Dali.i18n.t('CajasColorBis.title_box_name') + (i + 1),
                    'plugin-data-default' : 'BasicText',
                    'plugin-data-resizable' : true
                };
                title.setAttributes(attrs);

                link.appendChild(title);
                celda.appendChild(link);

                celdasTemplate[i] = celda;
            }

            var sepTemplate = document.createElement('div');
            attrs = {
                'class' : 'sep'
            };
            sepTemplate.setAttributes(attrs);

            var bloquesTemplate = [];
            for (let i = 0; i < state.nBoxes; i++) {

                let bloque = document.createElement('div');
                attrs = {
                    'id' : 'bloque' + i,
                    'class' : 'bloque_colores capa_' + state['color' + i]
                };
                bloque.setAttributes(attrs);

                let plugin = document.createElement('plugin');
                attrs = {
                    'plugin-data-key' : 'box' + i,
                    'plugin-data-display-name' : Dali.i18n.t('CajasColorBis.content_box_name') + (i + 1),
                    'plugin-data-default' : 'BasicText',
                    'plugin-data-resizable' : true
                };
                plugin.setAttributes(attrs);

                bloque.appendChild(plugin);
                bloquesTemplate[i] = bloque;
            }

            for (let i = 0; i < state.nBoxes; i++) {

                filaTemplate.appendChild(celdasTemplate[i]);
                if (i !== (state.nBoxes - 1)) {
                    filaTemplate.appendChild(sepTemplate.cloneNode(true));
                }

            }
            tablaTemplate.appendChild(filaTemplate);


            if (state.image === 'checked'){

                template.appendChild(imageTemplate);
            }
            template.appendChild(tablaTemplate);

            for (let i = 0; i < state.nBoxes; i++) {
                template.appendChild(bloquesTemplate[i]);
            }

            var tmp = document.createElement("div");
            tmp.appendChild(template);
            return tmp.innerHTML;

        },
        handleToolbar: function (name, value) {
            var newColors;

            if (/color/.test(name)) {
                var idB = name.replace('color', '');
                base.setState('color' + idB, value);
            } else if (name === 'nBoxes') {
                var diff = value - base.getState().nBoxes;

                if (diff > 0) {

                    for (let i = base.getState().nBoxes; i < value; i++) {
                        base.setState('color' + i, 'azul');
                    }
                }

                base.setState(name, value);
            } else if (name === 'rounded') {
                base.setState(name, value);
            } else if (name === 'image') {
                base.setState('image', value);
            }
        }
    };
}
