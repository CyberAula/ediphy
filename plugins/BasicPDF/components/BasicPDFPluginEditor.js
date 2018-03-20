import React from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';

const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions, Document, Page } from 'react-pdf';
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Document file = {this.props.state.url}>
                    <Page
                        pageNumber={this.props.state.pageNumber}
                    />
                </Document>
            </div>
        );

    }
}
