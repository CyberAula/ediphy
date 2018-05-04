import React from 'react';
import i18n from 'i18next';
// import Visor3DluginEditor from './components/Visor3DluginEditor.js';

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
                initialWidth: 'auto',
                initialHeight: "auto",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: '3d_rotation',
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: false,
                },
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('Visor3D.Visor3D'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('Visor3D.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "audio/*",
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Visor3d.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('Visor3d.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Visor3d.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Visor3d.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Visor3d.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Visor3d.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Visor3d.opacity'),
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
                url: 'http://localhost:8080/stl/eyeball.stl',
            };
        },
        getRenderTemplate: function(state) {
            return (<div style={{ height: "100%", width: "100%" }}>
                <STLViewer
                    url='http://localhost:8080/stl/eyeball.stl'

	                   width={400}
	                   height={400}
	                   modelColor='#B92C2C'
	                   backgroundColor='#EAEAEA'
	                   rotate
	                   orbitControls
                />
            </div>);
        },
        /* return (<div style={{ height: "100%", width: "100%" }}>
    <Visor3DluginEditor style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
</div>);*/
    };
}
