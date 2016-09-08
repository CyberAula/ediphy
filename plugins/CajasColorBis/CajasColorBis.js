export function CajasColorBis(base) {
    return {
        defaultColors: ['azul', 'cyan', 'gris'],
        getConfig: function () {
            return {
                name: 'CajasColorBis',
                category: 'animations',
                icon: 'view_column'
            };
        },
        getToolbar: function () {
            var toolBar = {
                main: {
                    __name: "Main",
                    accordions: {
                        b_general: {
                            __name: "General",
                            icon: 'build',
                            buttons: {
                                nBoxes: {
                                    __name: "Número de cajas",
                                    type: 'number',
                                    value: 2,
                                    max: 8,
                                    min: 1,
                                    autoManaged: false
                                },
                                rounded: {
                                    __name: "Borde redondeado",
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    units: '%',
                                    autoManaged: false
                                },
                                /* wayHorizontal:{
                                 __name: "Dirección",
                                 type: 'number',
                                 value: 1,
                                 max: 1,
                                 min: 0,
                                 autoManaged: false
                                 },
                                 image:{
                                 __name: "Imagen",
                                 type: 'number',
                                 value: 1,
                                 max: 1,
                                 min: 0,
                                 autoManaged: false
                                 },*/
                                radios: {
                                    __name: 'Tipo de cajas color',
                                    type: 'radio',
                                    value: 'HorizontalNoImagen',
                                    options: ['HorizontalNoImagen', 'HorizontalSiImagen', 'VerticalNoImagen', 'VerticalSiImagen'],
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
            toolBar.main.accordions.buttonStyle = {__name: "Estilo títulos",icon: 'palette', buttons: {}};
            for (var i = 0; i < base.getState().nBoxes; i++) {
                toolBar.main.accordions.buttonStyle.buttons["box" + i] = {
                    __name: 'Caja ' + i,
                    type: 'select',
                    value: this.defaultColors[i],
                    options: ['verdeoscuro', 'cyan', 'granate', 'naranja', 'rojo', 'azul', 'marron', 'rojizo', 'azulpuro', 'azulverdoso', 'violeta', 'marronvivo', 'gris', 'amarillo'],
                    autoManaged: false
                };
            }
            return toolBar;
        },
        getInitialState: function () {//el color de las cajas es el capa_{colors[i]}
            return {
                nBoxes: 3,
                colors: ['azul', 'cyan', 'gris'],
                wayHorizontal: true,
                image: false,
                rounded: 'unchecked'
            };
        },
        getRenderTemplate: function (state) {
            var template = "<div class='cajascolor' plugin-data-initialWidth='500px' style='width: 100%; height: 100%'>";
            var disp = 'block';
            var i;

            if (state.image) {
                template += "<div style='height: 20%; max-height: 100px;' ><plugin plugin-data-key='image' plugin-data-default='BasicImage' /></div>";
            }

            var rounded = '';
            if (state.rounded === 'checked') {
                rounded = ' rounded';
            }

            if (state.wayHorizontal) {
                template += "<div class='tabla_colores'><div class='fila_colores'>";
                var width = 100 / state.nBoxes;
                for (i = 0; i < state.nBoxes; i++) {
                    template += "<div value='ffd' class='celda_colores " + state.colors[i] + " " + rounded + "'  onclick='$dali$.click()' style='max-height:50px; height: 10%; width: " + width + "%'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText'  plugin-data-resizable plugin-data-initialHeight='50px' /></div>";
                    if (i !== (state.nBoxes - 1)) {
                        template += "<div class='sep'></div>";
                    }
                }
                template += "</div></div>";

                for (i = 0; i < state.nBoxes; i++) {
                    template += "<div class='bloque_colores capa_" + state.colors[i] + " " + rounded + "'  style='min-height: 40px; height: 15%  !important; display:" + disp + "'><plugin plugin-data-key='box" + i + "' plugin-data-resizable /></div>";
                }

                template += "</div>";
            } else {
                for (i = 0; i < state.nBoxes; i++) {
                    template += "<div class='tabla_colores'><div class='fila_colores'>";
                    template += "<div class='celda_colores " + state.colors[i] + " " + rounded + "'   onclick='$dali$.click()' style='max-height: 50px; height: 10%;'><plugin plugin-data-key='title" + i + "' plugin-data-default='BasicText'  " + (i % 2 === 0 ? " plugin-data-resizable plugin-data-fontSize plugin-data-initialHeight='100px'" : "") + " /></div>";
                    template += "</div></div>";
                    template += "<div class='bloque_colores capa_" + state.colors[i] + " " + rounded + "'  style='min-height: 40px; height: 15% !important; display:" + disp + "'><plugin plugin-data-key='box" + i + "'  plugin-data-resizable /></div>";
                }
            }

            template += "</div>";

            return template;
        },
        handleToolbar: function (name, value) {
            var newColors;

            if (/box/.test(name)) {
                var idB = name.slice(3);
                newColors = base.getState().colors;
                newColors[idB] = value;
                base.setState('colors', newColors);
            } else if (name === 'nBoxes') {
                var diff = value - base.getState().nBoxes;
                diff = Math.abs(diff);

                if (value > base.getState().nBoxes) {
                    do {
                        base.setState('colors', base.getState().colors.concat(['azul']));
                        diff--;
                    } while (diff > 0);
                } else if (value < base.getState().nBoxes) {
                    newColors = base.getState().colors;
                    do {
                        newColors.pop();
                        base.setState('colors', newColors);
                        diff--;
                    } while (diff > 0);
                }
                base.setState(name, value);
                /*  }else if( name == 'wayHorizontal' || name == 'image'){
                 base.setState(name, !!value);*/
            } else if (name === 'rounded') {
                base.setState(name, base.getState().rounded === 'checked' ? 'unchecked' : 'checked');
            } else if (name === 'radios') {
                base.setState('image', (/Si/.test(value)));
                base.setState('wayHorizontal', (/Horizontal/.test(value)));
            }
        }
    };
}