import React from 'react';
import { WebPlugin } from "./Styles";
/* eslint-disable react/prop-types */
export function Webpage() {
    return {
        getConfig: function() {
            return {
                name: 'Webpage',
                displayName: Ediphy.i18n.t('Webpage.PluginName'),
                category: 'objects',
                icon: 'public',
                initialWidth: '70%',
                initialHeight: "500px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
                flavor: 'react',
                createFromLibrary: ['webapp', 'url'],
                searchIcon: 'type',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('Webpage.URL'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('Webpage.URL_copypaste'),
                                    type: 'externalProvider',
                                    accept: "webapp",
                                    value: state.url,
                                },
                                fixedPosition: {
                                    __name: Ediphy.i18n.t('Webpage.fixedPosition'),
                                    type: 'checkbox',
                                    checked: state.fixedPosition,
                                },
                                /* scrollY: {
                                    __name: Ediphy.i18n.t('Webpage.y'),
                                    type: 'number',
                                    checked: state.y,
                                },*/
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
                url: 'http://vishub.org',
                fixedPosition: false,
            };
        },
        getRenderTemplate: function(state) {
            if (state.url && state.url.match("poly.google.com")) {
                return(
                    <WebPlugin width="100%" height="100%" src={state.url} frameBorder="0"
                        allowvr="yes" allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay;" allowFullScreen
                        mozallowfullscreen="true" webkitallowfullscreen="true" onMouseWheel="" scrolling={"no"}/>);
            }
            return <WebPlugin scrolling={state.fixedPosition ? 'no' : 'yes'} src={state.url}/>;

        },

    };
}

/* eslint-enable react/prop-types */
