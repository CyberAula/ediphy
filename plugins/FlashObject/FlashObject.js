import React from 'react';
import i18n from 'i18next';
import FlashObjectComponent from "./FlashObjectComponent";

/* eslint-disable react/prop-types */
export function FlashObject() {
    return {
        getConfig: function() {
            return {
                name: 'FlashObject',
                displayName: i18n.t('FlashObject.PluginName'),
                category: "objects",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'flash_on',
                createFromLibrary: ['swf', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'URL',
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: '',
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: 'swf',
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Webpage.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: 'Padding',
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Webpage.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Webpage.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Webpage.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Webpage.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Webpage.opacity'),
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
                url: "http://vishub.org/swfs/4669.swf",
            };
        },
        getRenderTemplate: function(state) {
            return (<FlashObjectComponent src={state.url}/>);
        },
    };
}
/* eslint-enable react/prop-types */
