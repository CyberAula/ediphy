export function Youtube(base) {
    return {
        getConfig: function () {
            return {
                name: 'Youtube',
                displayName: Dali.i18n.t('Youtube.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
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
                                    value: base.getState().url,
                                    autoManaged: false
                                }
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
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('Youtube.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 10
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('Youtube.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('Youtube.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('Youtube.radius'),
                                    type: 'number',
                                    units: '%',
                                    value: '0',
                                    min: '0',
                                    max: '50'
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
        getInitialState: function () {
            return {
                url: 'https://www.youtube.com/watch?v=3zUvnRg3zao'
            };
        },
        getRenderTemplate: function (state) {
            return "<iframe  class=\"basicImageClass\"  style=\"width: 100%; height: 100%; z-index:0;\" src=\"" + this.parseURL(state.url) + "\" frameborder=\"0\" allowfullscreen ></iframe>";
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
