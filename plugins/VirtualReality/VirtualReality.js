import React from 'react';
import i18n from 'i18next';
require('./_virtualReality.scss');

/* eslint-disable react/prop-types */
export function VirtualReality(base) {
    return {
        init: function() {
            base.registerExtraFunction(this.toolbarChangesValues, "toolbarChanges");
        },
        getConfig: function() {
            return {
                name: 'VirtualReality',
                displayName: i18n.t('VirtualReality.PluginName'),
                category: "multimedia",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '700px',
                initialHeight: "300px",
                initialWidthSlide: '50%',
                initialHeightSlide: '45%',
                icon: 'event_seat',
                needsPointerEventsAllowed: true,

            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: "Background",
                            icon: 'edit',
                            buttons: {
                                imagenBack: {
                                    __name: '',
                                    type: 'select',
                                    value: state.imagenBack,
                                    options: ['360_world.jpg', 'pano-planets.jpg', 'pano-nature.jpg', 'pano-nature2.jpg', 'pano-nature3.jpg', 'pano-boom.jpg', 'pano-people.jpg'],
                                },
                                audioBack: {
                                    __name: 'Audio ambiente',
                                    type: 'checkbox',
                                    checked: state.audioBack,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                imagenBack: '360_world.jpg',
                audioBack: false,
                stateIframe: {
                    imgBack: '360_world.jpg',
                    format: '2D',
                    playAudio: false,
                },
            };
        },
        getRenderTemplate: function(state, props) {
            this.toolbarChangesValues(state);
            return (
                <iframe className={'VR'} allow="vr" width= '100%' height= '100%' src='http://localhost:8081/index.html' id="receiver"/>);

        },
        toolbarChangesValues: function(state) {
            // Envío de datos toolbar
            // console.log("Entra en la función auxiliar");
            if(document.getElementById("receiver") != null) {
                let receiverWindow = document.getElementById("receiver").contentWindow;

                let rutaima = state.imagenBack;
                let playAudio = state.audioBack;
                receiverWindow.postMessage({ imagenBack: rutaima, audioBack: { play: playAudio } }, "http://localhost:8081/index.html");
            }
        },
    };
}
/* eslint-enable react/prop-types */
