import React from 'react';
import i18n from 'i18next';
import AudioCueComponent from './AudioCueComponent';
import img_placeholder from './../../dist/images/placeholder.svg';

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
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'volume_up',
                createFromLibrary: true,
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
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: 'URL',
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "image/*",
                                },
                                allowDeformed: {
                                    __name: Ediphy.i18n.t('HotspotImages.allowDeformed'),
                                    type: "checkbox",
                                    checked: state.allowDeformed,
                                },
                                scale: {
                                    __name: Ediphy.i18n.t('HotspotImages.scale'),
                                    type: "range",
                                    min: 0,
                                    max: 20,
                                    step: 0.2,
                                    value: state.scale || 1,
                                },
                                hyperlink: {
                                    __name: Ediphy.i18n.t('HotspotImages.hyperlink'),
                                    type: 'text',
                                    value: state.hyperlink,
                                    placeholder: Ediphy.i18n.t('HotspotImages.link_placeholder'),
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
                icon: img_placeholder,
            };
        },
        getRenderTemplate: function(state, props) {
            return (<AudioCueComponent props={props} state={state}/>);

        },
    };
}
/* eslint-enable react/prop-types */
