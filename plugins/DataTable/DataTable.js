import React from "react";
import TableComponent from './components/table-component';
import i18n from 'i18next';
import Config from './components/config-component';
require('./_datatable.scss');

export function DataTable(base) {
    return {
        getConfig: function() {
            return {
                name: "DataTable",
                flavor: "react",
                displayName: i18n.t("DataTable.PluginName"),
                category: "text",
                needsConfigModal: true,
                needsConfirmation: true,
                needsTextEdition: false,
                icon: "view_stream",
                initialWidth: '100%',
                initialHeight: "auto",
                initialWidthSlide: '100%',
                initialHeightSlide: 'auto',
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: i18n.t("DataTable.style"),
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
                                    __name: i18n.t("DataTable.margin"),
                                    buttons: {
                                        left: {
                                            __name: i18n.t("DataTable.left"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: i18n.t("DataTable.right"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: i18n.t("DataTable.top"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: i18n.t("DataTable.bottom"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                                paddings: {
                                    __name: i18n.t("DataTable.padding"),
                                    buttons: {
                                        left: {
                                            __name: i18n.t("DataTable.left"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: i18n.t("DataTable.right"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: i18n.t("DataTable.top"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: i18n.t("DataTable.bottom"),
                                            type: "number",
                                            value: 0,
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                            },
                            buttons: {
                                borderWidth: {
                                    __name: i18n.t("DataTable.border_width"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                    units: "px",
                                },
                                borderStyle: {
                                    __name: i18n.t("DataTable.border_style"),
                                    type: "select",
                                    value: "solid",
                                    options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"],
                                },
                                borderColor: {
                                    __name: i18n.t("DataTable.border_color"),
                                    type: "color",
                                    value: "#000000",
                                },
                                borderRadius: {
                                    __name: i18n.t("DataTable.border_radius"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                    step: 5,
                                    units: "%",
                                },
                                opacity: {
                                    __name: i18n.t("DataTable.opacity"),
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
            let data = [/* ["First column", 1, 0], ["Second column", 0, 1] */];
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
                editing: true,
                options: {
                    disableFilter: false,
                    disableRowChoice: false,
                    disablePagination: false,
                    pageSizeLabel: i18n.t('DataTable.options.pageSizeLabel_txt'),
                    searchLabel: i18n.t('DataTable.options.searchLabel_txt'),
                    searchPlaceholder: '',
                    noDataLabel: i18n.t("DataTable.options.noDataLabel_txt"),
                    initialPageLength: 5,
                    initialSort: 0,
                    initialOrder: 'descending',
                },
            };
        },
        getRenderTemplate: function(state) {
            return (
                <TableComponent data={state.data} options={state.options} />
            );

        },
        getConfigTemplate: function(extState) {
            return (
                <Config state={extState} base={base} />
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
