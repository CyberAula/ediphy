import React from 'react';
import i18n from 'i18next';
import BasicPDFPlugin from '../components/BasicPDFPlugin.js';
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions, Document, Page } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});
import '../_pdfCss.scss';
export function BasicPDF(base) {
    return {
        getRenderTemplate: function(state, props) {
            return (
                <div className="pdfViewerPlugin" style={{ height: "100%", width: "100%" }}>
                    <BasicPDFPlugin style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
                </div>
            );
        },

    };
}
