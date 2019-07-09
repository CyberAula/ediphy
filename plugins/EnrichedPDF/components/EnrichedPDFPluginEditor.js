import React from 'react';
import { findDOMNode } from 'react-dom';
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
/* eslint-disable react/prop-types */

export default class EnrichedPDFPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: 1,
        };
        this.onDocumentLoad = ({ numPages }) => {
            this.setState({ numPages });
        };
        this.buttonBack = this.buttonBack.bind(this);
        this.buttonNext = this.buttonNext.bind(this);
    }

    buttonNext() {
        if(this.state.pageNumber === this.state.numPages) {
        }else{
            this.setState({
                pageNumber: this.state.pageNumber + 1,
            });
        }
    }
    buttonBack() {
        if(this.state.pageNumber === 1) {
        }else{
            this.setState({
                pageNumber: this.state.pageNumber - 1,
            });
        }
    }

    render() {
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            let position;
            if (value && value.split(',').length === 3) {
                position = value.split(',');
            } else {
                position = [0, 0, 0];
            }

            let pdfDiv = document.querySelector("#box-" + this.props.props.id + " .pdfDiv");
            let w = pdfDiv ? pdfDiv.clientWidth : 0;
            let h = pdfDiv ? pdfDiv.clientHeight : 0;
            let x = "" + position[0] + "%";
            let y = "" + position[1] + "%";

            let bool = (parseFloat(position[2]) === this.state.pageNumber);
            return(
                bool ?
                    <MarkEditor
                        boxId={this.props.props.id}
                        key={id}
                        style={{ left: x, top: y, position: "absolute" }}
                        time={1.5}
                        mark={id}
                        // marks={marks}
                        onRichMarkMoved={this.props.props.handleMarks.onRichMarkMoved}
                        state={this.props.state}
                        base={this.props.base}>
                        <Mark
                            style={{ position: 'relative', top: "-24px", left: "-10px" }}
                            color={color || "#17CFC8"}
                            idKey={id}
                            title={title} />
                    </MarkEditor> : null);
        });
        return (
            <div style={{ width: "100%", height: "100%" }} className={"pdfDiv"}>
                <div className="topBar editorTopBar">
                    <button className={"PDFback"} onClick={this.buttonBack}>
                        <i className={"material-icons"}>keyboard_arrow_left</i>
                    </button>
                    <span className={"PDFnumPages"}>
                        {this.state.pageNumber} of {this.state.numPages}
                    </span>
                    <button className={"PDFnext"} onClick={this.buttonNext}>
                        <i className={"material-icons"}>keyboard_arrow_right</i>
                    </button>
                </div>
                <Document className={"react-pdf__Document "} style={{ width: "100%", height: "100%" }}
                    file = {this.props.state.url}
                    onLoadSuccess={this.onDocumentLoad}>
                    <div className="dropableRichZone">
                        <Page pageNumber={this.state.pageNumber} className="pdfPage">
                            {markElements}
                        </Page>

                    </div>

                </Document>
            </div>
        );

    }
}
/* eslint-enable react/prop-types */
