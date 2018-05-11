import React from 'react';
import i18n from 'i18next';
import BasicPDFPluginEditor from './components/BasicPDFPluginEditor.js';
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions, Document, Page } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});
import './_pdfCss.scss';
export function BasicPDF(base) {
    return {
        getConfig: function() {
            return {
                name: 'BasicPDF',
                flavor: "react",
                displayName: i18n.t('BasicPDF.PluginName'),
                category: "objects",
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: false,
                },
                isRich: true,
                initialWidth: 'auto',
                initialHeight: "auto",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'description',
                marksType: [{
                    name: i18n.t('BasicPDF.Coords'),
                    key: 'value',
                    format: '[x,y,Pag]',
                    default: '40.452,-3.727,1',
                    defaultColor: '#000002',
                }],
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: i18n.t('BasicPDF.source'),
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('BasicPDF.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "application/pdf",
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
                                    value: 2,
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
                                    value: '#333',
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
                url: 'https://media.readthedocs.org/pdf/flask-cors/latest/flask-cors.pdf',
                numPages: null,
                pageNumber: 1,
            };
        },

        getRenderTemplate: function(state, props) {
            // console.log(props)
            return (

                <div className="pdfViewerPlugin" style={{ height: "100%", width: "100%" }}>
                    <BasicPDFPluginEditor style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
                </div>
            );
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

        getDefaultMarkValue(state) {
            return '50%';
        },
        parseRichMarkInput: function(...value) {

            let y = (value[0] + 12) * 100 / value[2];
            let x = (value[1] + 26) * 100 / value[3];
            // let numPage = document.querySelector("#"+value[6]+".pdfPage").getAttribute("data-page-number");
            let numPage = document.querySelector(".pdfPage").getAttribute("data-page-number");
            return y.toFixed(2) + ',' + x.toFixed(2) + ',' + numPage;
        },
        validateValueInput: function(value) {
            // let regex = /(^-*\d+(?:\.\d*)?),(-*\d+(?:\.\d*)?$),(\d+)/g;
            let regex = /(^-?\d+(?:\.\d*)?),(-?\d+(?:\.\d*)?),(\d+$)/g;
            let match = regex.exec(value);
            if (match && match.length === 4) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                let p = Math.round(parseFloat(match[3]) * 100) / 100;
                if (isNaN(x) || isNaN(y)) {
                    return { isWrong: true, message: i18n.t("BasicPDF.message_mark_xyp") };
                }
                value = x + ',' + y + ',' + p;
            } else {
                return { isWrong: true, message: i18n.t("BasicPDF.message_mark_xyp") };
            }
            // console.log("OK");
            return { isWrong: false, value: value };
        },
        /* getDefaultMarkValue(state) {
            let cfg = state.config;
            return Math.round(cfg.lat * 100000) / 100000 + ',' + Math.round(cfg.lng * 100000) / 100000;
        },
        pointerEventsCallback: function(bool, toolbarState) {
            return;
        },
*/

    };
}
