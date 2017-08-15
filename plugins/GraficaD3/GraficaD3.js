import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col, Grid, Row, Table, Checkbox, Radio } from "react-bootstrap";
import Typeahead from 'react-bootstrap-typeahead';
import i18n from 'i18next';
let Chart = require("./chart-component");
let Config = require("./config-component");
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
                            order: [
                                "margins",
                                "paddings",
                                "borderWidth",
                                "borderStyle",
                                "borderColor",
                                "borderRadius",
                                "opacity",
                            ],
                            accordions: {
                                margins: {
                                    __name: Dali.i18n.t("GraficaD3.margin"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("GraficaD3.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: Dali.i18n.t("GraficaD3.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: Dali.i18n.t("GraficaD3.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("GraficaD3.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                                paddings: {
                                    __name: Dali.i18n.t("GraficaD3.padding"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("GraficaD3.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: Dali.i18n.t("GraficaD3.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: Dali.i18n.t("GraficaD3.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("GraficaD3.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                            },
                            buttons: {
                                borderWidth: {
                                    __name: Dali.i18n.t("GraficaD3.border_width"),
                                    type: "number",
                                    value: "0px",
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
                                    value: "0%",
                                    min: "0",
                                    max: "50",
                                    step: "5",
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
            let data = [];
            let keys = [];
            let row = {};
            for (let i = 0; i < 1; i++) {
                keys.push(i);
                row[i] = "";
            }
            for (let i = 0; i < 2; i++) {
                data.push(row);
            }

            return {
                data: data,
                keys: keys,
                valueKeys: keys,
                editing: true,
                options: {
                    type: "line",
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
