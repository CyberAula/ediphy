/* eslint-disable react/prop-types */

export function Youtube(base) {
    return {
        getConfig: function() {
            return {
                name: 'Youtube',
                displayName: Ediphy.i18n.t('Youtube.PluginName'),
                category: 'multimedia',
                initialWidth: '350px',
                initialHeight: '200px',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                icon: 'slideshow',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('Youtube.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('Youtube.URL'),
                                    type: 'text',
                                    value: state.url,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Youtube.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('Youtube.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Youtube.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Youtube.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Youtube.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Youtube.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Youtube.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05,
                                },

                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: 'https://www.youtube.com/watch?v=3zUvnRg3zao',
            };
        },
        getRenderTemplate: function(state) {
            return "<iframe  class=\"basicImageClass\"  style=\"width: 100%; height: 100%; z-index:0;\" src=\"" + this.parseURL(state.url) + "\" frameBorder=\"0\" allowFullScreen ></iframe>";
        },
        handleToolbar: function(name, value) {
            if (name === 'url') {
                base.setState(name, base.parseURL(value));
            } else {
                base.setState(name, value);
            }
        },
        parseURL: function(url) {
            if (url === '') {
                return url;
            }
            let patt1 = /youtube.com\/watch\?v=(.*)/;
            let patt2 = /youtube.com\/embed\/(.*)/;
            let patt3 = /youtu.be\/(.*)/;
            if (patt2.exec(url)) {
                return url;
            }
            let code = patt1.exec(url);
            if (code) {
                return 'https://www.youtube.com/embed/' + code[1];
            }
            let code2 = patt3.exec(url);
            if (code2) {
                return 'https://www.youtube.com/embed/' + code2[1];
            }
            alert('No es un video de youtube.');
            return '';
        },
    };
}
/* eslint-enable react/prop-types */
