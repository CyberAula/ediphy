import React from 'react';
import i18n from 'i18next';
import AudioCueComponent from './AudioCueComponent';
import audio_placeholder from './../../dist/images/audio-cue.svg';

/* eslint-disable react/prop-types */
export function AudioCue(base) {
    return {
        getConfig: function() {
            return {
                name: 'AudioCue',
                displayName: i18n.t('AudioCue.PluginName'),
                category: "multimedia",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '80px',
                initialHeight: "80px",
                initialWidthSlide: '6.86%',
                initialHeightSlide: '12.58%',
                icon: 'volume_up',
                createFromLibrary: ['audio/*', 'url'],
                searchIcon: true,

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'Config',
                            icon: 'build',
                            buttons: {
                                url: {
                                    __name: i18n.t('AudioCue.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "audio/*",
                                },
                                autoplay: {
                                    __name: i18n.t('AudioCue.AutoPlay'),
                                    type: 'checkbox',
                                    checked: state.autoplay,
                                },
                                quizColor: {
                                    __name: Ediphy.i18n.t('TrueFalse.QuizColor'),
                                    type: 'color',
                                    value: state.colorCue || 'rgba(0, 173, 156, 1)',
                                },
                                useImage: {
                                    __name: i18n.t("MultipleAnswer.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.useImage,
                                },
                                icon: {
                                    __name: i18n.t('AudioCue.Image'),
                                    type: 'external_provider',
                                    value: state.icon,
                                    accept: "image/*",
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: 'http://vishub.org/audios/15288.mp3',
                autoplay: false,
                icon: audio_placeholder,
                colorCue: 'rgba(0, 173, 156, 1)',
                useImage: false,
            };
        },
        getRenderTemplate: function(state, props) {
            return (<AudioCueComponent props={props} state={state}/>);

        },
    };
}
/* eslint-enable react/prop-types */
