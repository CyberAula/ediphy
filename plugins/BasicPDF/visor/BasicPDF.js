import React from 'react';
import i18n from 'i18next';
import { Document, Page } from 'react-pdf';

export function BasicPDF(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicPDF',
                flavor: "react",
                displayName: i18n.t('BasicPDF.PluginName'),
                category: 'objects',
                aspectRatioButtonConfig: {
                    location: ["main", "__sortable"],
                    defaultValue: true,
                },
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'description',

            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('BasicPDF.PluginName'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('BasicPDF.URL'),
                                    type: 'text',
                                    value: base.getState().url,
                                    autoManaged: false,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('BasicPDF.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('BasicPDF.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('BasicPDF.border_size'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('BasicPDF.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('BasicPDF.border_color'),
                                    type: 'color',
                                    value: '#000000',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('BasicPDF.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('BasicPDF.opacity'),
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
                url: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf',
                numPages: null,
                pageNumber: 1,
            };
        },
        /*    onDocumentLoad = ({ numPages }) => {
          this.setSate({ numPages });
        },
*/
        getRenderTemplate: function(state) {

            return (

                <div>
                    <Document file = {state.url}>
                        <Page
                            pageNumber={state.pageNumber}
                        />
                    </Document>
                </div>
            );
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

    };
}
