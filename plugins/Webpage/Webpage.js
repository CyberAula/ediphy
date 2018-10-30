import React from 'react';
/* eslint-disable react/prop-types */
export function Webpage(base) {
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
                                    type: 'text',
                                    value: state.url,
                                },
                                fixedPosition: {
                                    __name: Ediphy.i18n.t('Webpage.fixedPosition'),
                                    type: 'checkbox',
                                    checked: state.fixedPosition,
                                },
                                scrollY: {
                                    __name: Ediphy.i18n.t('Webpage.y'),
                                    type: 'number',
                                    checked: state.y,
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
                url: 'http://vishub.org',
                fixedPosition: false,
            };
        },
        getRenderTemplate: function(state) {
            return <iframe style={{ width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', border: '1px solid grey' }} onLoad={(e)=>{e.target.scrollTop(state.scrollY);}} scrolling={state.fixedPosition ? 'no' : 'yes'} src={state.url}/>;

        },

    };
}

/* eslint-enable react/prop-types */
