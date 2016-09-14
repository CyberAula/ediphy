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
                    name: "Aspect Ratio",
                    location: ["main", "_sortable"],
                    defaultValue: "checked"
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
                                    type: 'vish_searcher',
                                    autoManaged: false,
                                    value: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png'
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
                                    units: 'px',
                                    max: 100,
                                    autoManaged: false
                                },
                                backgroundColor: {
                                    __name: Dali.i18n.t('BasicImage.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                    autoManaged: false
                                },
                                borderSize: {
                                    __name: Dali.i18n.t('BasicImage.box_style'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 10,
                                    autoManaged: false
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicImage.box_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    autoManaged: false
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicImage.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                    autoManaged: false
                                },
                                borderRadius: {
                                    __name:  Dali.i18n.t('BasicImage.radius'),
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    units: '%',
                                    autoManaged: false
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
                url: 'http://nemanjakovacevic.net/wp-content/uploads/2013/07/placeholder.png',
                aspectRatio: 'unchecked',
                borderSize: 0,
                borderStyle: 'solid',
                borderRadius: '0%',
                borderColor: '#000000',
                backgroundColor: '#ffffff',
                padding: '0px',
                thumbnailVisibility: 'hidden'
            };
        },
        getConfigTemplate: function (state) {
            return "<div> Url: <input type=\"text\" autofocus id=\"BasicImage_input\" value=\"" + state.url + "\"><br><button onclick=\"$dali$.showPreview()\">Show preview</button><img id=\"BasicImage_preview\" src=\"" + state.url + "\" style=\"width: 100px; height: 100px; visibility: " + state.thumbnailVisibility + ";\" onclick=\"$dali$.imageClick()\" /></div>";
        },
        getRenderTemplate: function (state) {
            return "<div style=\"width: 100%; margin: 0px; height: 100%\"><img onclick=\"$dali$.showPreview()\" style=\"width: 100%; height: 100%; padding: " + state.padding + " ; background-color: " + state.backgroundColor + "; border-radius: " + state.borderRadius + "; border: " + state.borderSize + " " + state.borderStyle + " " + state.borderColor + ";\" src=\"" + state.url + "\"/></div>";
        },
        handleToolbar: function (name, value) {
            if (name === 'aspectRatio') {
                base.setState(name, base.getState().aspectRatio === 'checked' ? 'unchecked' : 'checked');
            }
            else {
                base.setState(name, value);
            }
        },
        imageClick: function () {
            alert("Miaua!");
        }
    };
}
