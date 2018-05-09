import React from 'react';
import i18n from 'i18next';
import STLViewer from 'stl-viewer';

/* eslint-disable react/prop-types */
export function Visor3D(base) {
    return {
        getConfig: function() {
            return {
                name: 'Visor3D',
                displayName: i18n.t('Visor3D.PluginName'),
                category: "objects",
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
                name: "Ediphy",
            };
        },
        getRenderTemplate: function(state, props) {

            return (
                <div style={{ height: "100%", width: "100%" }} className="dropableRichZone">
                    <STLViewer url="http://localhost:8080/stl/eyeball.stl" width={400} height={400} rotate orbitControls />
                </div>);

        },

    };
}
/* eslint-enable react/prop-types */
