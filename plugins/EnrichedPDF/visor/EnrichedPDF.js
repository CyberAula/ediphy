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
import '../EnrichedPDF.scss';
export function EnrichedPDF(base) {
    return {
        getRenderTemplate: function(state, props) {
            return (
                <div className="pdfViewerPlugin" style={{ height: "100%", width: "100%" }}>
                    <EnrichedPDFPlugin style={{ width: "100%", height: "100%" }} base={base} props={props} state={state}/>
                </div>
            );
        },

    };
}
