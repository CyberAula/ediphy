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

// el visor no tiene estado como tal, solo reproduce el estado
export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //  fullscreen: false,
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
        }
        else{
            this.setState({
                pageNumber: this.state.pageNumber + 1,
            });
        }
    }
    buttonBack() {
        if(this.state.pageNumber === 1) {
        }
        else{
            this.setState({
                pageNumber: this.state.pageNumber - 1,
            });
        }
    }

    render() {
        console.log(this.props.props);
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
            let x = "" + position[0] * 6.12 + "px";
            let y = "" + position[1] * 7.92 + "px";
            let bool = (parseFloat(position[2]) === this.state.pageNumber);
            console.log(bool);

            let isPopUp = marks[id].connectMode === "popup";
            let noTrigger = true;
            let isVisor = true;
            return(
                bool ?
                    <MarkEditor
                        key={id}
                        style={{ left: x, top: y, position: "absolute" }}
                        /* time={1.5} mark={id} onRichMarkUpdated={this.props.props.onRichMarkUpdated} state={this.props.state} base={this.props.base}*/
                    >
                        <a key={id} href="#">
                            <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                                <Mark
                                    style={{ position: 'relative', top: "-24px", left: "-10px" }}
                                    color={color || "#17CFC8"}
                                    idKey={id}
                                    title={title}
                                    /* isVisor={isVisor}
                                    isPopUp={isPopUp}
                                    markConnection={marks[id].connection}
                                    noTrigger={noTrigger}*//>
                            </div>
                        </a>
                    </MarkEditor> : null);
        });
        return (
            <div style={{ width: "100%", height: "100%" }} className={"pdfDiv"}>
                <div className="topBar">
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

                <Document style={{ width: "100%", height: "100%" }}
                    file = {this.props.state.url}
                    onLoadSuccess={this.onDocumentLoad}>
                    <Page style={{ width: "100%", height: "100%" }} className="pdfPage"
                        pageNumber={this.state.pageNumber}
                    />
                </Document>
            </div>
        );
    }
}
