export function BasicVideo(base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicVideo',
                displayName: Dali.i18n.t('BasicVideo.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    name: "Aspect Ratio",
                    location: ["main", "__sortable"],
                    defaultValue: "checked"
                },
                icon: 'play_arrow'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('BasicVideo.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('BasicVideo.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false
                                },
                                controls: {
                                    __name: Dali.i18n.t('BasicVideo.Show_controls'),
                                    type: 'checkbox',
                                    value: base.getState().controls,
                                    autoManaged: false
                                },
                                autoplay: {
                                    __name: Dali.i18n.t('BasicVideo.Autoplay'),
                                    type: 'checkbox',
                                    value: base.getState().autoplay,
                                    autoManaged: false
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('BasicVideo.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('BasicVideo.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('BasicVideo.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: 'px'
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicVideo.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit']
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicVideo.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicVideo.radius'),
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    units: '%'
                                },
                                opacity: {
                                    __name: Dali.i18n.t('BasicVideo.opacity'),
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
        // TEST URL http://video.webmfiles.org/big-buck-bunny_trailer.webm
        // Posibilidad: http://modernizr.com/
        getInitialState: function () {
            return {
                url: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm',
                controls: "checked",
                autoplay: "unchecked"
            };
        },
        getRenderTemplate: function (state) {
            return "<video " + ((state.controls === "checked") ? " controls " : "") + ((state.autoplay === "checked") ? " autoplay " : "") + " style=\"width: 100%; height: 100%; pointer-events: 'none'; z-index:0;\" src=\"" + state.url + "\"   class=\"basicImageClass\"  ></video>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }
    };
}
