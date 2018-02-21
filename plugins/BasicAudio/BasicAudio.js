import React from 'react';
import i18n from 'i18next';
import ReactAudioPlayer from 'react-audio-player';

export function BasicAudio(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicAudio',
                flavor: "react",
                displayName: i18n.t('BasicAudio.PluginName'),
                category: "multimedia",
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'play_circle_filled',
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('BasicAudio.Audio'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('BasicAudio.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false,
                                },
                                autoplay: {
                                    __name: Ediphy.i18n.t('BasicAudio.Autoplay'),
                                    type: 'checkbox',
                                    checked: base.getState().autoplay,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('BasicAudio.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicAudio.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicAudio.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicAudio.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicAudio.opacity'),
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
                url: 'http://www.music.helsinki.fi/tmt/opetus/uusmedia/esim/a2002011001-e02-128k.mp3',
                autoplay: false,
            };
        },
        getRenderTemplate: function(state, props) {

            /* Revisar:
          Autoplay cambia con la toolbar pero no actúa, cuando seleccionas reproducir automaticamente
          no lo hace. Ademas cuando le doy a Previsualizar state.autoplay pasa a ser undefined
          */

            let aautoplay = state.autoplay;
            return (
                <div style={{ height: "100%", width: "100%" }}>
                    <ReactAudioPlayer
                        autoplay={aautoplay}
                        controls
                        src={state.url}
                    />
                </div>
            );
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}
