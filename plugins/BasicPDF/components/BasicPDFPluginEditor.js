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
        this.state = {
            numPages: null,
            pageNumber: 3,
        };
        /*  this.onDocumentLoad = ({ numPages }) => {
          this.props.setSate({numPages});
        }*/
        this.onDocumentLoad = this.onDocumentLoad.bind(this);
    }

    onDocumentLoad({ numPages }) {
        this.setState({ numPages });
    }

    render() {
    //    const { pageNumber, numPages } = this.props.state;
        return (
            <div>
                <Document key={this.props.state.url} style={{ height: "100%", width: "100%" }}
                    file = {this.props.state.url}
                    onLoadSuccess={this.onDocumentLoad}>
                    <Page style={{ height: "100%", width: "100%" }}
                        pageNumber={this.state.pageNumber}
                    />
                </Document>
            </div>
        );

    }
}
