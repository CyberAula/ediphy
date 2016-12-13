export function RichText(base) {
    return {
        getConfig: function () {
            return {
                name: 'RichText',
                displayName: Dali.i18n.t('RichText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                initialWidth: '100%',
                extraTextConfig: {
                    extraPlugins: "daliplugin"
                },
                icon: 'format_color_text'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t('RichText.box_style'),
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
                                    __name: Dali.i18n.t('RichText.border_size'),
                                    type: 'number',
                                    value: '0px',
                                    min: 0,
                                    max: 10,
                                    units: 'px'
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('RichText.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('RichText.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('RichText.radius'),
                                    type: 'number',
                                    value: '0%',
                                    min: '0',
                                    max: '50',
                                    step: '5',
                                    units: '%'
                                },
                                opacity: {
                                    __name: Dali.i18n.t('RichText.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01
                                }
                            }
                        }
                    }
                }
            };
        }
    };
}
