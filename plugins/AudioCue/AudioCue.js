import React from 'react';
import i18n from 'i18next';
import AudioCueComponent from './AudioCueComponent';
import audio_placeholder from './../../dist/images/meadow.jpg';

/* eslint-disable react/prop-types */
export function AudioCue(base) {
    return {
        getConfig: function() {
            return {
                name: 'AudioCue',
                displayName: i18n.t('AudioCue.PluginName'),
                category: "multimedia",
                flavor: "react",
                needsTextEdition: false,
                initialWidth: '60px',
                initialHeight: '60px',
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
                            __name: i18n.t('AudioCue.config'),
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
                                cueColor: {
                                    __name: Ediphy.i18n.t('AudioCue.Color'),
                                    type: 'custom_color_plugin',
                                    value: state.cueColor || getComputedStyle(document.documentElement).getPropertyValue('--themeColor1'),
                                },
                                useImage: {
                                    __name: i18n.t('AudioCue.UseImage'),
                                    type: 'checkbox',
                                    checked: state.useImage,
                                },
                                icon: {
                                    __name: i18n.t('AudioCue.Image'),
                                    type: 'external_provider',
                                    hide: !state.useImage,
                                    value: state.icon,
                                    accept: "image/*",
                                },
                                hideAnimation: {
                                    __name: i18n.t('AudioCue.HideAnimation'),
                                    type: 'checkbox',
                                    checked: state.hideAnimation,
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
                cueColor: { color: 'rgba(0, 173, 157, 1)', custom: false },
                useImage: false,
                icon: audio_placeholder,
            };
        },
        getRenderTemplate: function(state, props) {
            return (<AudioCueComponent props={props} state={state}/>);
        },
    };
}
/* eslint-enable react/prop-types */
