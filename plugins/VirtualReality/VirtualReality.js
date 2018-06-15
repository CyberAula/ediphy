import React from 'react';
import i18n from 'i18next';
import VirtualRealityPluginEditor from "./components/VirtualRealityPluginEditor";
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
            };
        },
        getRenderTemplate: function(state, props) {
            return (
                <VirtualRealityPluginEditor id={props.id} state={state}/>);
        },
    };
}
/* eslint-enable react/prop-types */
