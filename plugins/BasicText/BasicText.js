export function BasicText(base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                displayName: Dali.i18n.t('BasicText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                icon: 'format_color_text'
            };
        },
         getLocales: function(){
            return {
                en : {
                    "BasicText" : {
                        "background_color" : "Background color",
                        "border_color" : "Border color",
                        "border_size" : "Border Size",
                        "border_style" : "Border Style",
                        "box_style" : "Box style",
                        "opacity" : "Opacity",
                        "padding" : "Padding",
                        "PluginName" : "BasicText",
                        "radius" : "Radius",
                        "source" : "Source",
                    }
                },
                es : {
                      "BasicText" : {
                        "background_color" : "Color de fondo",
                        "border_color" : "Color de borde",
                        "border_size" : "Grosor de borde",
                        "border_style" : "Estilo de borde",
                        "box_style" : "Estilo caja",
                        "opacity" : "Opacidad",
                        "padding" : "Padding",
                        "PluginName" : "Texto Básico",
                        "radius" : "Radio",
                        "source" : "Origen",
                    }
                }
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t('BasicText.source'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: 'Padding',
                                    type: 'number',
                                    value: '15px',
                                    min: 0,
                                    max: 100,
                                    units: 'px'
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicText.border_size'),
                                    type: 'number',
                                    value: '0px',
                                    min: 0,
                                    max: 10,
                                    units: 'px'
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicText.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicText.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicText.radius'),
                                    type: 'number',
                                    value: '0%',
                                    min: '0',
                                    max: '50',
                                    step: '5',
                                    units: '%'
                                },
                                opacity: {
                                    __name: Dali.i18n.t('BasicText.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01
                                }
                            }
                        },
                        '~extra': {
                            icon: 'rate_review',
                            __name: "Alias",
                            buttons: {}
                        }
                    }
                }
            };
        }
    };
}
