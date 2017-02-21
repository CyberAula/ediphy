export function BasicImage(base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicImage',
                displayName: Dali.i18n.t('BasicImage.PluginName'),
                category: 'image',
                needsConfigModal: false,
                needsTextEdition: false,
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true
                },
                icon: 'image'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('BasicImage.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'vish_provider',
                                    value: base.getState().url,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('BasicImage.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('BasicImage.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100
                                },
                                backgroundColor: {
                                    __name: Dali.i18n.t('BasicImage.background_color'),
                                    type: 'color',
                                    value: '#ffffff'
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicImage.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicImage.border_style'),
                                    type: 'radio',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicImage.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name:  Dali.i18n.t('BasicImage.radius'),
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
                                    step: 0.01
                                }
                            }
                        }
                    }
                }
            };
        },
        getInitialState: function () {
            return {
                url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
            };
        },
        getRenderTemplate: function (state) {
            return "<div style=\"width: 100%; margin: 0px; height: 100%; \"><img onclick=\"$dali$.showPreview()\" class=\"basicImageClass\" style=\"width: 100%; height: 100%; \" src=\"" + state.url + "\"/></div>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        },
        imageClick: function () {
            /*alert("Miaua!");*/
        }
    };
}
