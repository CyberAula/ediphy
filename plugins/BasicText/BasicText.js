export function BasicText() {
    return {
        getConfig: function() {
            return {
                name: 'BasicText',
                displayName: Ediphy.i18n.t('BasicText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                initialWidth: 'auto',
                initialWidthSlide: '30%',
                icon: 'short_text',
                flavor: 'plain',
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Ediphy.i18n.t('BasicText.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicText.padding'),
                                    type: 'number',
                                    value: 7,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('BasicText.backgroundColor'),
                                    type: 'color',
                                    value: 'rgba(255,255,255,0)',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicText.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicText.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicText.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicText.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicText.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                                color: {
                                    __name: 'Color',
                                    type: 'color',
                                    value: 'var(--themeColor6)',
                                    hide: true,
                                },
                                /* ,
                                className: {
                                    __name: Ediphy.i18n.t('BasicText.classname'),
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
/* eslint-enable react/prop-types */
