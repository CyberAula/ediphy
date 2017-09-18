import React from "react";
import Chart from './components/chart-component';
import Config from './components/config-component';

require('./_graficaD3.scss');

export function GraficaD3(base) {
    return {
        getConfig: function() {
            return {
                name: "GraficaD3",
                flavor: "react",
                displayName: Dali.i18n.t("GraficaD3.PluginName"),
                category: "image",
                needsConfigModal: true,
                needsConfirmation: true,
                needsTextEdition: false,
                icon: "insert_chart",
                initialWidth: '700px',
                initialHeight: "300px",
                initialWidthSlide: '70%',
                initialHeightSlide: '60%',
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t("GraficaD3.style"),
                            icon: "palette",
                            buttons: {
                                padding: {
                                    __name: Dali.i18n.t('GraficaD3.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Dali.i18n.t("GraficaD3.border_width"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: "px",
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t("GraficaD3.border_style"),
                                    type: "select",
                                    value: "solid",
                                    options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"],
                                },
                                borderColor: {
                                    __name: Dali.i18n.t("GraficaD3.border_color"),
                                    type: "color",
                                    value: "#000000",
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t("GraficaD3.border_radius"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                    step: 5,
                                    units: "%",
                                },
                                opacity: {
                                    __name: Dali.i18n.t("GraficaD3.opacity"),
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
            let data = [{ "First field": "1" }, { "First field": "2" }];
            let keys = ["First field"];

            return {
                data: data,
                keys: keys,
                valueKeys: keys,
                editing: true,
                options: {
                    type: "area",
                    x: "",
                    y: [{
                        key: "",
                        color: "#ff7f0e",
                    }],
                    gridX: true,
                    gridY: true,
                    rings: [{
                        name: "",
                        value: "",
                        color: "#ff7f0e",
                    }],
                },
            };
        },
        getRenderTemplate: function(state) {
            return (
            /* jshint ignore:start */
                <Chart data={state.data} options={state.options} />
            /* jshint ignore:end */
            );

        },
        getConfigTemplate: function(extState) {
            return (
            /* jshint ignore:start */
                <Config state={extState} base={base} />
            /* jshint ignore:end */
            );
        },
        fileChanged: function(event) {
            let files = event.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = function() {
                base.setState("chartData", JSON.parse(this.result));
            };
            reader.readAsText(file);
        },
        chartTypeChange: function(elements) {
            base.setState("chartType", elements[0].id);
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

    };
}
