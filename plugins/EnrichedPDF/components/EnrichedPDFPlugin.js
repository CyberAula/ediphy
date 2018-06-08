import React from 'react';
import { findDOMNode } from 'react-dom';
import screenfull from 'screenfull';
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

export default class EnrichedPDFPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
            numPages: null,
            pageNumber: 1,
            rotate: 0,
        };
        this.onDocumentLoad = ({ numPages }) => {
            let pageNumber = 1;
            if (this.props.state.currentState) {
                try{
                    pageNumber = parseInt(this.props.state.currentState.split(',')[2]);
                } catch (e) { }

            }
            this.setState({ numPages, pageNumber });

        };
        this.buttonBack = this.buttonBack.bind(this);
        this.buttonNext = this.buttonNext.bind(this);
        this.buttonRotateRight = this.buttonRotateRight.bind(this);
        this.buttonRotateLeft = this.buttonRotateLeft.bind(this);
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

    buttonRotateRight() {
        this.setState({
            rotate: this.state.rotate + 90,
        });
    }
    buttonRotateLeft() {
        this.setState({
            rotate: this.state.rotate - 90,
        });
    }

    onClickFullscreen() {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.pdf_wrapper));
        } else {
            screenfull.exit();
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    componentWillMount() {

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
            let x = "" + position[0] * 6.12 + "px";
            let y = "" + position[1] * 7.92 + "px";
            let bool = (parseFloat(position[2]) === this.state.pageNumber);
            let isPopUp = marks[id].connectMode === "popup";
            let isVisor = true;
            return(
                bool ?
                    <div key={id} style={{ position: 'absolute', top: y, left: x, width: '24px', height: '26px' }}>
                        <Mark
                            color={color}
                            idKey={id}
                            title={title}
                            isPopUp={isPopUp}
                            isVisor={isVisor}
                            markConnection={marks[id].connection}
                            markValue={marks[id].value}
                            boxID={this.props.props.id}
                            onMarkClicked={(id, value)=>{this.props.props.onMarkClicked(id, value, true);}}
                        />
                    </div> : null);
        });

        return (

            <div ref={pdf_wrapper => {this.pdf_wrapper = pdf_wrapper;}} style={{ width: "100%", height: "100%" }} className={"pdfDiv"}>
                <div className="topBar">
                    <button className={"PDFrotateL"} onClick={this.buttonRotateLeft}>
                        <i className={"material-icons"}>rotate_left</i>
                    </button>
                    <button className={"PDFrotateR"} onClick={this.buttonRotateRight}>
                        <i className={"material-icons"}>rotate_right</i>
                    </button>
                    <div className="PDFpages">
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
                    <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>

                </div>

                <Document className={"react-pdf__Document dropableRichZone"} style={{ width: "100%", height: "100%" }}
                    file = {this.props.state.url}
                    onLoadSuccess={this.onDocumentLoad} rotate={this.state.rotate}>
                    <Page style={{ width: "100%", height: "100%" }} className="pdfPage"
                        pageNumber={this.state.pageNumber}
                    >{markElements}</Page>

                </Document>
            </div>
        );
    }
}
