export function EnrichedVideo(base) {
    return {
        getConfig: function () {
            return {
                name: 'EnrichedVideo',
                displayName: Dali.i18n.t('EnrichedVideo.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    name: "Aspect Ratio",
                    location: ["main", "__sortable"],
                    defaultValue: "checked"
                },
                isRich: true,
                icon: 'play_arrow'
            };
        },
        getToolbar: function () {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Dali.i18n.t('EnrichedVideo.Video'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Dali.i18n.t('EnrichedVideo.URL'),
                                    type: 'text',
                                    value: base.getState().url
                                },
                                controls: {
                                    __name: Dali.i18n.t('EnrichedVideo.Show_controls'),
                                    type: 'checkbox',
                                    value: base.getState().controls
                                },
                                autoplay: {
                                    __name: Dali.i18n.t('EnrichedVideo.Autoplay'),
                                    type: 'checkbox',
                                    value: base.getState().autoplay
                                }
                            }
                        },
                        style: {
                            __name: Dali.i18n.t('EnrichedVideo.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('EnrichedVideo.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    units: 'px',
                                    max: 100
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t('EnrichedVideo.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: 'px'
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('EnrichedVideo.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('EnrichedVideo.border_color'),
                                    type: 'color',
                                    value: '#000000'
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('EnrichedVideo.radius'),
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    units: '%'
                                },
                                opacity: {
                                    __name: Dali.i18n.t('EnrichedVideo.opacity'),
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
            return "<video " + ((state.controls === "checked") ? " controls " : "") + ((state.autoplay === "checked") ? " autoplay " : "") + " style=\"width: 100%; height: 100%; pointer-events: 'none'; z-index:0;\" src=\"" + state.url + "\"></video>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }
    };
}
