export function BasicText(base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicText',
                displayName: Dali.i18n.t('BasicText.PluginName'),
                category: 'text',
                needsConfigModal: false,
                needsTextEdition: true,
                initialWidth: '100%',
                icon: 'format_color_text'
            };
        },
        getToolbar: function () {
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
                                    value: '15px',
                                    min: 0,
                                    max: 100,
                                    units: 'px'
                                },
                                className: {
                                    __name: Dali.i18n.t('BasicText.classname'),
                                    type: 'text'
                                }
                            }
                        }
                    }
                }
            };
        }
    };
}
