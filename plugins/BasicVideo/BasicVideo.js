export function BasicVideo(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicVideo',
                displayName: Ediphy.i18n.t('BasicVideo.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                icon: 'play_arrow',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('BasicVideo.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('BasicVideo.URL'),
                                    type: 'text',
                                    value: state.url,
                                    autoManaged: false,
                                },
                                controls: {
                                    __name: Ediphy.i18n.t('BasicVideo.Show_controls'),
                                    type: 'checkbox',
                                    checked: state.controls,
                                    autoManaged: false,
                                },
                                autoplay: {
                                    __name: Ediphy.i18n.t('BasicVideo.Autoplay'),
                                    type: 'checkbox',
                                    checked: state.autoplay,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('BasicVideo.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicVideo.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicVideo.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicVideo.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicVideo.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicVideo.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicVideo.opacity'),
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
        // TEST URL http://video.webmfiles.org/big-buck-bunny_trailer.webm
        // Posibilidad: http://modernizr.com/
        getInitialState: function() {
            return {
                url: 'http://dl1.webmfiles.org/big-buck-bunny_trailer.webm',
                controls: true,
                autoplay: false,
            };
        },
        getRenderTemplate: function(state) {
            return "<video " + (state.controls && state.controls !== "on" ? "controls='true' " : "") + (state.autoplay ? " autoPlay " : "") + " style=\"width: 100%; height: 100%; z-index:0;\" src=\"" + state.url + "\"  class=\"basicVideoClass\"></video>";
        },
    };
}
/* eslint-enable react/prop-types */
