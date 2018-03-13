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
                initialWidthSlide: '60%',
                initialHeightSlide: 'auto',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: i18n.t("DataTable.style"),
                            icon: "palette",
                            order: [
                                "padding",
                                "borderWidth",
                                "borderStyle",
                                "borderColor",
                                "borderRadius",
                                "opacity",
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
            let data = [{ Name: "John Doe", Age: 16, Country: "USA" },
                { Name: "Mary Smith", Age: 23, Country: "Canada" },
                { Name: "Marion  Gilbert", Age: 18, Country: "Australia" },
                { Name: "Bruce Johnson", Age: 21, Country: "UK" },
                { Name: "Ronald Armstrong", Age: 31, Country: "Ireland" },
                { Name: "Brianna Reardown", Age: 37, Country: "Malta" }];
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
                    theme: 'basic',
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
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

    };
}
/* eslint-enable react/prop-types */
