import React from 'react';
import i18n from 'i18next';
import { STLViewer } from 'stl-viewer';

/* eslint-disable react/prop-types */
export function Objetos3D(base) {
    return {
        getConfig: function() {
            return {
                name: 'Objetos3D',
                flavor: "react",
                displayName: i18n.t('Objetos3D.PluginName'),
                category: "multimedia",
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: false,
                },
                // needsConfigModal: false,
                // needsTextEdition: false,
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
            return (<div style={{ height: "100%", width: "100%" }}>
                <STLViewer url="http://localhost:8080/stl/eyeball.stl" loading={false} width={400} height={400} modelColor='#B92C2C' backgroundColor='#EAEAEA' rotate orbitControls/>
            </div>);
        },
    };
}
