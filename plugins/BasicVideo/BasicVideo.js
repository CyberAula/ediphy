export function BasicVideo(base) {
    return {
        getConfig: function () {
            return {
                name: 'BasicVideo',
                displayName: Dali.i18n.t('BasicVideo.PluginName'),
                category: 'multimedia',
                aspectRatioButtonConfig: {
                    name: "Aspect Ratio",
                    location: ["main", "_sortable"],
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
                                    autoManaged: false,
                                    value: 'http://video.webmfiles.org/big-buck-bunny_trailer.webm'
                                },
                                allowFullScreen: {
                                    __name: Dali.i18n.t('BasicVideo.Allow_fullscreen'),
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    checked: 'false',
                                    autoManaged: false
                                },
                                controls: {
                                    __name: Dali.i18n.t('BasicVideo.Show_controls'),
                                    type: 'checkbox',
                                    value: 'unchecked',
                                    checked: 'false',
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
                                    max: 100,
                                    autoManaged: false
                                },
                                borderSize: {
                                    __name: Dali.i18n.t('BasicVideo.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: 'px',
                                    autoManaged: false
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t('BasicVideo.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                    autoManaged: false
                                },
                                borderColor: {
                                    __name: Dali.i18n.t('BasicVideo.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                    autoManaged: false
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t('BasicVideo.radius'),
                                    type: 'number',
                                    value: '0',
                                    min: '0',
                                    max: '50',
                                    units: '%',
                                    autoManaged: false
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
                aspectRatio: 'unchecked',
                borderSize: '0px',
                borderStyle: 'solid',
                borderRadius: '0%',
                padding: '0px',
                borderColor: '#000000',
                opacity: 1,
                thumbnailVisibility: 'hidden'
            };
        },
        getRenderTemplate: function (state) {
            return "<video width=\"560\" height=\"315\" autoplay onclick=\"$dali$.click()\"" + ((state.controls === "checked") ? "controls=\"controls\" " : " ") + " frameBorder=\"0\" allowFullScreen style=\"width: 100%; height: 100%; pointer-events: 'none'; padding: " + state.padding + "; border: " + state.borderStyle + " " + state.borderSize + " " + state.borderColor + "; border-radius:" + state.borderRadius + "; opacity:" + state.opacity + "; z-index:0;\" src=\"" + state.url + "\"></video>";
        },
        handleToolbar: function (name, value) {
            base.setState(name, value);
        }
    };
}
