import React from 'react';
import EnrichedPDFPlugin from '../components/EnrichedPDFPlugin.js';
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});
import { PDFViewerPlugin } from "../Styles";

export function EnrichedPDF(base) {
    return {
        getRenderTemplate: function(state, props) {
            return (
                <PDFViewerPlugin>
                    <EnrichedPDFPlugin base={base} props={props} state={state}/>
                </PDFViewerPlugin>
            );
        },
    };
}
