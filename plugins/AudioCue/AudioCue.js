import React from 'react';
import i18n from 'i18next';

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
                icon: 'label',

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
                                name: {
                                    __name: 'Config',
                                    type: 'text',
                                    value: state.name,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                name: "Ediphy",
            };
        },
        getRenderTemplate: function(state, props) {
            return (<div style={{ height: "100%", width: "100%" }} className="dropableRichZone">
                Hello {state.name}
            </div>);

        },
    };
}
/* eslint-enable react/prop-types */
