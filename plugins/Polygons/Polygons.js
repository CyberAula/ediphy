
import React from 'react';
import i18n from 'i18next';
import Poly from "./Poly";
import { generateCustomColors } from "../../common/themes/themeLoader";
import { PRIMARY_BLUE } from "../../sass/general/constants";

export function Polygons() {
    return {
        getConfig: function(state) {
            return {
                name: 'Polygons',
                displayName: i18n.t('Polygons.PluginName'),
                category: "shapes",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '10%',
                initialHeight: "auto",
                icon: 'star',
            };
        },

        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        polygonstyle: {
                            __name: i18n.t('Polygons.polygonstyle'),
                            icon: 'build',
                            buttons: {
                                nSides: {
                                    __name: Ediphy.i18n.t('Polygons.Sides'),
                                    type: 'number',
                                    value: state.nSides,
                                    min: 3,
                                    max: 10,
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Polygons.borderColor'),
                                    type: 'custom_color_plugin',
                                    value: state.borderColor,
                                },
                                polygonstrokeWidth: {
                                    __name: Ediphy.i18n.t("Polygons.polygonstrokeWidth"),
                                    type: "number",
                                    value: state.polygonstrokeWidth,
                                    min: 1,
                                    max: 10,
                                },
                                shapeColor: {
                                    __name: Ediphy.i18n.t('Polygons.shapeColor'),
                                    type: 'custom_color_plugin',
                                    value: state.shapeColor,
                                },
                                polygonOpacity: {
                                    __name: Ediphy.i18n.t("Polygons.polygonOpacity"),
                                    type: "range",
                                    value: state.polygonOpacity,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                        style: {
                            __name: i18n.t('Polygons.style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('Polygons.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('Polygons.backgroundColor'),
                                    type: 'color',
                                    value: 'transparent',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('Polygons.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('Polygons.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('Polygons.border_color'),
                                    type: 'color',
                                    value: '#dbdbdb',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('Polygons.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('Polygons.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                nSides: 4,
                borderColor: { color: document.documentElement.style.getPropertyValue('--themeColor1'), custom: false },
                polygonstrokeWidth: 1,
                shapeColor: { color: 'transparent', custom: false },
                polygonOpacity: 1,

            };
        },
        getRenderTemplate: function(state, props) {
            let borderColor = state.borderColor.custom ? (state.borderColor.color || PRIMARY_BLUE) : document.documentElement.style.getPropertyValue('--themeColor1');
            return(
                <Poly sides={state.nSides} cx={50} cy={50} r={50}
                    polygonstrokeWidth={state.polygonstrokeWidth}
                    borderColor={borderColor}
                    shapeColor={state.shapeColor.color}
                    polygonBorderStyle={state.polygonBorderStyle}
                    polygonOpacity={state.polygonOpacity}/>
            );
        },
    };
}
