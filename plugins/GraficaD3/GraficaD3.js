import React from "react";
import Chart from './components/chart-component';
import Config from './components/config-component';

require('./_graficaD3.scss');
/* eslint-disable react/prop-types */

export function GraficaD3() {
    return {
        getConfig: function() {
            return {
                name: "GraficaD3",
                flavor: "react",
                displayName: Ediphy.i18n.t("GraficaD3.PluginName"),
                category: "image",
                needsConfigModal: true,
                needsConfirmation: true,
                needsTextEdition: false,
                icon: "insert_chart",
                initialWidth: '700px',
                initialHeight: "300px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
                createFromLibrary: ['csv', 'url'],
                searchIcon: false,
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Ediphy.i18n.t("GraficaD3.style"),
                            icon: "palette",
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('GraficaD3.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t("GraficaD3.border_width"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t("GraficaD3.border_style"),
                                    type: "select",
                                    value: "solid",
                                    options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t("GraficaD3.border_color"),
                                    type: "color",
                                    value: "#000000",
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t("GraficaD3.border_radius"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                    step: 5,
                                    units: "%",
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t("GraficaD3.opacity"),
                                    type: "range",
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
                dataProvided: [["Name", "Age"], ["John", 25], ["Toby", 17]],
                dataProcessed: [{ name: "John", 0: "John", 1: 25 }, { name: "Toby", 0: "Toby", 1: 17 }],
                editing: true,
                options: {
                    type: "area",
                    xaxis: 0,
                    graphs: [{
                        column: 1,
                        name: "Age",
                        color: "#332ef0",
                    }],
                    gridX: true,
                    gridY: true,
                },
            };
        },
        getRenderTemplate: function(state, props) {
            return (
                <Chart id={props.id} dataProcessed={state.dataProcessed} options={state.options} />
            );

        },
        getConfigTemplate: function(id, state, updateState, props) {
            return ({ component: <Config id={id} state={state} updateState={updateState} props={props} step={props.step}/>, n_steps: 2 });

        },

    };
}
/* eslint-enable react/prop-types */
