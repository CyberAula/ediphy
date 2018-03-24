import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';

const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions, Document, Page } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});

export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                INACABADO
            </div>
        );
    }
}
