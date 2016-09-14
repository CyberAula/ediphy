export function Youtube(base) {
    return {
        getConfig: function () {
            return {
                name: 'Youtube',
                displayName: Dali.i18n.t('Youtube.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    name: "Aspect Ratio",
                    location: ["main", "_sortable"],
                    defaultValue: "checked"
                },
                icon: 'slideshow'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('Youtube.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('Youtube.URL'),
                                    type: 'text',
                                    autoManaged: false,
                                    value: 'https://www.youtube.com/watch?v=S9M3c1_yl-E'
                                },
                                /*aspectRatio: {
                                 __name: 'Aspect Ratio',
                                 type: 'checkbox',
                                 value: 'unchecked',
                                 checked: 'false',
                                 autoManaged: false
                                 },
                                 allowFullScreen: {
                                 __name: 'Allow FullScreen',
                                 type: 'checkbox',
                                 value: 'unchecked',
                                 checked: 'false',
                                 autoManaged: false
                                 },
                                 controls: {
                                 __name: 'Show Controls',
                                 type: 'checkbox',
                                 value: 'unchecked',
                                 checked: 'false',
                                 autoManaged: false
                                 },*/
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('Youtube.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('Youtube.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 100,
                                    autoManaged: false
                                },
                                borderSize: {
                                    __name: Dali.i18n.t('Youtube.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 10,
                                    autoManaged: false
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('Youtube.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    autoManaged: false
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('Youtube.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                    autoManaged: false
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('Youtube.radius'),
                                    type: 'number',
                                    units: '%',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    autoManaged: false
                                },
                                opacity: {
                                    __name: Dali.i18n.t('Youtube.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05
                                }

                            }
                        }
                    }
                }
            };
        },
        getSections: function () {
            return [
                {
                    tab: 'Main',
                    accordion: ['Basic', 'Box']
                },
                {
                    tab: 'Other',
                    accordion: ['Extra']
                }
            ];
        },
        getInitialState: function () {
            return {
                url: 'https://www.youtube.com/watch?v=S9M3c1_yl-E',
                borderSize: '0px',
                thumbnailVisibility: 'hidden',
                borderStyle: 'solid',
                borderRadius: '0%',
                borderColor: '#000000',
                backgroundColor: '#ffffff',
                padding: '0px',
                opacity: 1
            };
        },
        getRenderTemplate: function (state) {
            return "<iframe width=\"560\" height=\"315\" controls frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%;  padding:" + state.padding + "; border-radius:" + state.borderRadius + "; opacity: " + state.opacity + "; border:" + state.borderSize + " " + state.borderStyle + " " + state.borderColor + "; z-index:0;\" src=\"" + this.parseURL(state.url) + "\"></iframe>";
        },
        handleToolbar: function (name, value) {
            if (name === 'url') {
                base.setState(name, base.parseURL(value));
            } else {
                base.setState(name, value);
            }
        },
        parseURL: function (url) {
            if (url === '') {
                return url;
            }
            var patt1 = /youtube.com\/watch\?v=(.*)/;
            var patt2 = /youtube.com\/embed\/(.*)/;
            var patt3 = /youtu.be\/(.*)/;
            if (patt2.exec(url)) {
                return url;
            }
            var code = patt1.exec(url);
            if (code) {
                return 'https://www.youtube.com/embed/' + code[1];
            }
            var code2 = patt3.exec(url);
            if (code2) {
                return 'https://www.youtube.com/embed/' + code2[1];
            }
            alert('No es un video de youtube.');
            return '';
        }
    };
}
