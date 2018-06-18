import React from 'react';
import i18n from 'i18next';
import VirtualRealityPluginEditor from "./components/VirtualRealityPluginEditor";
import img_placeholder from './../../dist/images/placeholder.svg';
require('./_virtualReality.scss');

/* eslint-disable react/prop-types */
export function VirtualReality(base) {
    return {
        init: function() {
            base.registerExtraFunction(this.toolbarChangeValues, "toolbarChanges");
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
                                    options: ['Elige un fondo...', '360_world.jpg', 'pano-planets.jpg', 'pano-nature.jpg', 'pano-nature2.jpg', 'pano-nature3.jpg', 'pano-boom.jpg', 'pano-people.jpg'],
                                },
                                audioBack: {
                                    __name: 'Audio ambiente',
                                    type: 'checkbox',
                                    checked: state.audioBack,
                                },
                                url: {
                                    __name: 'URL',
                                    type: 'external_provider',
                                    accept: "image/*",
                                    value: state.urlBack,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                imagenBack: undefined,
                urlBack: undefined,
                audioBack: false,
            };
        },
        getRenderTemplate: function(state, props) {
            return (

                <VirtualRealityPluginEditor id={props.id} state={state}/>);

        },
    };
}
/* eslint-enable react/prop-types */
