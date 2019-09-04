import React from 'react';
import i18n from 'i18next';
import EnrichedPDFPluginEditor from './components/EnrichedPDFPluginEditor.js';
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});
import './EnrichedPDF.scss';
export function EnrichedPDF(base) {
    return {
        getConfig: function() {
            return {
                name: 'EnrichedPDF',
                flavor: "react",
                displayName: i18n.t('EnrichedPDF.PluginName'),
                category: "objects",
                aspectRatioButtonConfig: {
                    location: ["main", "structure"],
                    defaultValue: false,
                },
                isRich: true,
                initialWidth: 'auto',
                initialHeight: "auto",
                initialWidthSlide: '30%',
                initialHeightSlide: '70%',
                icon: 'description',
                marksType: {
                    name: i18n.t('EnrichedPDF.Coords'),
                    key: 'value',
                    format: '[x,y,Pag]',
                    default: '40.452,-3.727,1',
                    defaultColor: '#000002',
                },
                createFromLibrary: ["application/pdf", 'url'],
                searchIcon: true,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'PDF',
                            icon: 'link',
                            buttons: {
                                url: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.URL'),
                                    type: 'external_provider',
                                    value: state.url,
                                    accept: "application/pdf",
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('EnrichedPDF.box_style'),
                            icon: 'palette',
                            buttons: {
                                /* padding: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.padding'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 100,
                                },*/
                                borderWidth: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.border_size'),
                                    type: 'number',
                                    value: 2,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.border_color'),
                                    type: 'color',
                                    value: '#333',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('EnrichedPDF.opacity'),
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
            return (

                <div className="pdfViewerPlugin" style={{ height: "100%", width: "100%" }}>
                    <EnrichedPDFPluginEditor style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
                </div>
            );
        },
        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

        getDefaultMarkValue(state, boxId) {
            let x = 5.37;
            let y = 8.67;
            let page = document.querySelector("#box-" + boxId + " .pdfPage");
            let numPage = 1;
            if (page) {
                numPage = page.getAttribute("data-page-number");

            }
            return y + ',' + x + ',' + numPage;

        },
        parseRichMarkInput: function(x, y, width, height, toolbarState, boxId) {
            let page = document.querySelector("#box-" + boxId + " .pdfPage");
            let scrollElement = document.querySelector("#box-" + boxId + ' .react-pdf__Document');
            let xx = (x + 12 + scrollElement.scrollLeft) * 100 / page.clientWidth;
            let yy = (y + 26 + scrollElement.scrollTop) * 100 / page.clientHeight;
            // console.log(value);
            let numPage = page.getAttribute("data-page-number");
            // let numPage = document.querySelector(".pdfPage").getAttribute("data-page-number");
            return xx.toFixed(2) + ',' + yy.toFixed(2) + ',' + numPage;
        },
        validateValueInput: function(value) {
            let regex = /(^-?\d+(?:\.\d*)?),(-?\d+(?:\.\d*)?),(\d+$)/g;
            let match = regex.exec(value);
            if (match && match.length === 4) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                let p = Math.round(parseFloat(match[3]) * 100) / 100;
                if (isNaN(x) || isNaN(y)) {
                    return { isWrong: true, message: i18n.t("EnrichedPDF.message_mark_xyp") };
                }
                value = x + ',' + y + ',' + p;
            } else {
                return { isWrong: true, message: i18n.t("EnrichedPDF.message_mark_xyp") };
            }
            return { isWrong: false, value: value };
        },

    };
}
