export function BasicText(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicText',
                displayName: Dali.i18n.t('BasicText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                /* initialWidth: '300px',
                initialHeight: '100px',*/
                icon: 'short_text',
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t('BasicText.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('BasicText.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },

                                backgroundColor: {
                                    __name: Dali.i18n.t('BasicImage.background_color'),
                                    type: 'color',
                                    value: 'rgba(255,255,255,0)',
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicImage.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicImage.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicImage.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicImage.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Dali.i18n.t('BasicImage.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                                /* ,
                                className: {
                                    __name: Dali.i18n.t('BasicText.classname'),
                                    type: 'text',
                                },*/
                            },
                        },
                    },
                },
            };
        },
    };
}
