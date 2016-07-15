Dali.Plugins["BasicText"] = function (base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                icon: 'format_color_text'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {

                        style: {
                            __name: "Estilo caja",
                            icon: 'style',
                            buttons: {
                                padding: {
                                    __name: 'Padding',
                                    type: 'number',
                                    value: 15,
                                    min: 0,
                                    max: 100,
                                    units: 'px' 
                                },
                                backgroundColor: {
                                    __name: 'Color de fondo',
                                    type: 'color',
                                    value: 'transparent' 
                                },
                                borderWidth: {
                                    __name: 'Grosor de borde',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10 

                                },
                                borderStyle: {
                                    __name: 'Estilo de borde',
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'] 
                                    
                                },
                                borderColor: {
                                    __name: 'Color de borde',
                                    type: 'color',
                                    value: 'transparent' 
                                },
                                borderRadius: {
                                    __name: 'Radio',
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50' 
                                },
                                opacity: {
                                    __name: 'Opacidad',
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01
                                }
                            }
                        },
                        '~extra': {
                            icon: 'more_horiz',
                            __name: "Extra",
                            buttons: {}
                        }
                    }
                }
            }
        }
    }
}
