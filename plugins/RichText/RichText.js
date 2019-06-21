/* eslint-disable react/prop-types */

export function RichText(base) {
    return {
        getConfig: function() {
            return {
                name: 'RichText',
                displayName: Ediphy.i18n.t('RichText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                initialWidth: 'auto',
                initialHeight: 'auto',
                extraTextConfig: {
                    extraPlugins: "ediphyplugin",
                },
                icon: 'format_indent_increase',
                flavor: 'plain',

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Ediphy.i18n.t('RichText.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: 'Padding',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('RichText.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('RichText.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('RichText.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('RichText.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('RichText.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
    };
}
/* eslint-enable react/prop-types */
