import React from 'react';
import i18n from 'i18next';
import Visor3DPluginEditor from './components/Visor3DPluginEditor.js';

/* eslint-disable react/prop-types */
export function Visor3D() {
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
                needsPointerEventsAllowed: true,
                createFromLibrary: ['application/*', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('Visor3D.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: i18n.t('Visor3D.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "application/*",
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Visor3D.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('Visor3D.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Visor3D.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Visor3D.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Visor3D.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Visor3D.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Visor3D.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.05,
                                },
                            },
                        },
                        settings: {
                            __name: Ediphy.i18n.t('Visor3D.settings'),
                            icon: 'settings',
                            buttons: {
                                color: {
                                    __name: Ediphy.i18n.t('Visor3D.color'),
                                    type: 'color',
                                    value: state.color,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('Visor3D.background_color'),
                                    type: 'color',
                                    value: state.backgroundColor,
                                },
                                rotate: {
                                    __name: Ediphy.i18n.t('Visor3D.Auto_rotate'),
                                    type: 'checkbox',
                                    checked: state.rotate,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: "http://localhost:8080/stl/zub.stl",
                color: "#B45F04",
                backgroundColor: "#FFFFFF",
                rotate: true,
            };
        },
        getRenderTemplate: function(state) {
            return (
                <div
                    className="threeDViewerPluginEditor"
                    style={{ height: "100%", width: "100%" }}>
                    <Visor3DPluginEditor
                        style={{ width: "100%", height: "100%" }}
                        state={state}/>
                </div>);
        },

    };
}
/* eslint-enable react/prop-types */
