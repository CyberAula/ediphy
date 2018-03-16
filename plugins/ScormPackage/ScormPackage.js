import React from 'react';
/* eslint-disable react/prop-types */
export function ScormPackage(base) {
    return {
        getConfig: function() {
            return {
                name: 'ScormPackage',
                displayName: Ediphy.i18n.t('ScormPackage.PluginName'),
                category: 'evaluation',
                icon: 'public',
                initialWidth: '70%',
                initialHeight: "300px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
                flavor: 'react',
            };
        },
        getToolbar: function() {
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
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false,
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
                url: 'lib/scorm/test/dist/index.html',
                // 'http://vishubcode.org/scorm/packages/170/dist/index.html',
            };
        },
        getRenderTemplate: function(state) {
            return (<iframe style={{ width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', border: 'none' }} src={state.url}/>);
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },
    };
}

/* eslint-enable react/prop-types */
