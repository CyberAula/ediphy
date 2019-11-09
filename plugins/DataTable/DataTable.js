import React from "react";
import TableComponent from './components/table-component';
import i18n from 'i18next';
import Config from './components/config-component';

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
                initialWidthSlide: '60%',
                initialHeightSlide: 'auto',
                createFromLibrary: ['csv,application/vnd.ms-excel', 'url'],
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
                                "opacity",
                                "padding",
                                "borderWidth",
                                "borderStyle",
                                "borderColor",
                                "borderRadius",

                            ],
                            buttons: {
                                padding: {
                                    __name: i18n.t("DataTable.padding"),
                                    type: "number",
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                    units: "px",
                                },
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
            let data = [["John Doe", 16, "USA"],
                ["Mary Smith", 23, "Canada"],
                ["Marion  Gilbert", 18, "Australia"],
                ["Bruce Johnson", 21, "UK"],
                ["Ronald Armstrong", 31, "Ireland"],
                ["Brianna Reardown", 37, "Malta"]];
            let keys = ["Name", "Age", "Country"];

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
                    initialSort: keys[0] || 0,
                    initialOrder: 'descending',
                    theme: 'solid',
                },
            };
        },
        getRenderTemplate: function(state) {
            return (
                <TableComponent data={state.data} keys={state.keys} options={state.options} />
            );

        },
        getConfigTemplate: function(id, state, updateState, props) {
            return ({ component: <Config id={id} state={state} updateState={updateState} props={props} step={props.step}/>, n_steps: 2 });
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

    };
}
/* eslint-enable react/prop-types */
