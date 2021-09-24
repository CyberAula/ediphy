import React from 'react';
/* eslint-disable react/prop-types */
export function ScormPackage() {
    return {
        getConfig: function() {
            return {
                name: 'ScormPackage',
                displayName: Ediphy.i18n.t('ScormPackage.PluginName'),
                category: 'evaluation',
                icon: 'extension',
                initialWidth: '70%',
                initialHeight: "300px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
                flavor: 'react',
                createFromLibrary: ['scormpackage', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('ScormPackage.URL'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: '',
                                    type: 'externalProvider',
                                    value: state.url,
                                    accept: "scormpackage",
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('ScormPackage.box_style'),
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
                                    __name: Ediphy.i18n.t('ScormPackage.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('ScormPackage.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('ScormPackage.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('ScormPackage.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('ScormPackage.opacity'),
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
                url: 'https://vishubcode.org/scorm/packages/211/vishubcode_scorm_wrapper.html',
                // 'https://vishubcode.org/scorm/packages/170/dist/index.html',
            };
        },
        getRenderTemplate: function(state) {
            const params = new URLSearchParams(window.location.search);
            let url = state.url;
            if (url && params.has('ESCAPP_USER') && params.has('ESCAPP_TOKEN')) {
                url = url.replace("%%ESCAPP_USER%%", params.get('ESCAPP_USER'));
                url = url.replace("%%ESCAPP_TOKEN%%", params.get('ESCAPP_TOKEN'));
            }
            return (<iframe style={{ width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', border: 'none' }} src={url}/>);
        },
    };
}

/* eslint-enable react/prop-types */
