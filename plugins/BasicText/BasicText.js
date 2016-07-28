export function BasicText(base) {
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
                                    __name: 'Grosor de borde',
                                    type: 'number',
                                    value: '0px',
                                    min: 0,
                                    max: 10,
                                    units: 'px'
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
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: 'Radio',
                                    type: 'number',
                                    value: '0%',
                                    min: '0',
                                    max: '50',
                                    step: '5',
                                    units: '%'
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
                            icon: 'link',
                            __name: "Alias",
                            buttons: {}
                        }
                    }
                }
            };
        }
    };
}
