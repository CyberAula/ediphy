import React from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';

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

    onDocumentLoad(numPages) {
        this.setState({
            numPages: numPages,
        });
    }

    render() {
    //    const { pageNumber, numPages } = this.props.state;
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute" }} time={1.5} mark={id} onRichMarkUpdated={this.props.props.onRichMarkUpdated} state={this.props.state} base={this.props.base}>
                    <a key={id} href="#">
                        <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                            <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }} color={color || "#17CFC8"} idKey={id} title={title} />
                        </div>
                    </a>
                </MarkEditor>);
        });
        return (
            <div>
                <Document className={"react-pdf__Document dropableRichZone"} style={{ height: "100%", width: "100%" }}
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
