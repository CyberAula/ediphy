import React from 'react';
/* eslint-disable react/prop-types */
export function Google3DPolyObject(base) {
    return {
        getConfig: function() {
            return {
                name: 'Google3DPolyObject',
                displayName: Ediphy.i18n.t('Google3DPolyObject.PluginName'),
                category: 'objects',
                icon: '3d_rotation',
                initialWidth: '70%',
                initialHeight: "500px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
                flavor: 'react',
                createFromLibrary: ['obj', 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: Ediphy.i18n.t('Google3DPolyObject.URL'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('Google3DPolyObject.URL_copypaste'),
                                    type: 'text',
                                    value: state.url,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('Google3DPolyObject.box_style'),
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
                                    __name: Ediphy.i18n.t('Google3DPolyObject.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Google3DPolyObject.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Google3DPolyObject.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Google3DPolyObject.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Google3DPolyObject.opacity'),
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
                url: 'https://poly.google.com/view/0ivy-FxYrz9/embed',
            };
        },
        getRenderTemplate: function(state) {
	        return(<iframe width="100%" height="100%" src={state.url} frameBorder="0" style={{ width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', border: '1px solid grey' }} allowvr="yes" allow="vr; xr; accelerometer; magnetometer; gyroscope; autoplay;" allowFullScreen mozAllowFullScreen webkitAllowFullScreen onMouseWheel="" />);
        },
    };
}

/* eslint-enable react/prop-types */
