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
import {
    ButtonsContainer,
    DroppableRichZone,
    FullScreen,
    PageNumber,
    PDFButton,
    PDFContainer, PDFDocument, PDFPage,
    RotateL,
    RotateR,
    ScaleButton,
    TopBar,
} from "../Styles";
setOptions({
    workerSrc: pdflib.PDFJS.workerSrc,
});
/* eslint-disable react/prop-types */

export default class EnrichedPDFPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
            numPages: null,
            scale: 1,
            pageNumber: 1,
            rotate: 0,
        };
        this.onDocumentLoad = ({ numPages }) => {
            let pageNumber = 1;
            if (this.props.state.currentState) {
                try{
                    pageNumber = parseInt(this.props.state.currentState.split(',')[2], 10);
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

    componentWillUnmount() {
        window.removeEventListener('keyup', this.keyListener.bind(this), true);
    }
    componentDidMount() {
        window.addEventListener('keyup', this.keyListener.bind(this), true);
    }

    keyListener(e) {
        // console.log(this.state.fullscreen)
        if (this.state.fullscreen) {

            let key = e.keyCode ? e.keyCode : e.which;
            if (key === 34) {
                e.stopPropagation();
                this.buttonNext();
            } else if (key === 33) {
                e.stopPropagation();
                this.buttonBack();
            }
        }
    }

    onZoomIn() {
        this.setState({ scale: Math.min(5, this.state.scale + 0.25) });
    }

    onZoomOut() {
        this.setState({ scale: Math.max(0, this.state.scale - 0.25) });
    }
    render() {
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) => {
            let value = marks[id].value;
            let title = marks[id].title;
            let markType = marks[id].markType;
            let position;
            if (value && value.split(',').length === 3) {
                position = value.split(',');
            } else {
                position = [0, 0, 0];
            }
            let content = marks[id].content;
            let color = marks[id].color;
            let size = marks[id].size;
            let x = "" + position[0] + "%";
            let y = "" + position[1] + "%";
            let bool = (parseFloat(position[2]) === this.state.pageNumber);
            let isPopUp = marks[id].connectMode === "popup";
            let isVisor = true;
            return(
                bool ?
                    <div key={id} style={{ position: 'absolute', top: y, left: x, transform: "translate(-50%, -50%)" }}>
                        <Mark
                            markType={markType}
                            content={content}
                            color={color}
                            size={size}
                            idKey={id}
                            title={title}
                            isPopUp={isPopUp}
                            isVisor={isVisor}
                            markConnection={marks[id].connection}
                            markValue={marks[id].value}
                            boxID={this.props.props.id}
                            onMarkClicked={(_id, _value)=>{this.props.props.onMarkClicked(_id, _value, true);}}
                        />
                    </div> : null);
        });

        return (

            <PDFContainer ref={pdf_wrapper => {this.pdf_wrapper = pdf_wrapper;}}>
                <TopBar visor>
                    <ButtonsContainer>
                        <RotateL onClick={this.buttonRotateLeft}>
                            <i className={"material-icons"}>rotate_left</i>
                        </RotateL>
                        <RotateR onClick={this.buttonRotateRight}>
                            <i className={"material-icons"}>rotate_right</i>
                        </RotateR>
                    </ButtonsContainer>

                    <div className="PDFpages">
                        <PDFButton className={"PDFback"} onClick={this.buttonBack}>
                            <i className={"material-icons"}>keyboard_arrow_left</i>
                        </PDFButton>
                        <PageNumber> {this.state.pageNumber} of {this.state.numPages} </PageNumber>
                        <PDFButton className={"PDFnext"} onClick={this.buttonNext}>
                            <i className={"material-icons"}>keyboard_arrow_right</i>
                        </PDFButton>
                    </div>
                    <ButtonsContainer>
                        <FullScreen onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</FullScreen>
                        <ScaleButton disabled={this.state.scale >= 5} onClick={this.onZoomIn.bind(this)}> <i className="material-icons">zoom_in</i></ScaleButton>
                        <ScaleButton disabled={this.state.scale <= 0.25} onClick={this.onZoomOut.bind(this)}> <i className="material-icons">zoom_out</i></ScaleButton>
                    </ButtonsContainer>

                </TopBar>
                <PDFDocument>
                    <Document file = {this.props.state.url} loading={<div>Please wait!</div>}
                        onLoadSuccess={this.onDocumentLoad} rotate={this.state.rotate}>
                        <DroppableRichZone className={'dropableRichZone'}>
                            <PDFPage>
                                <Page className='pdfPage' scale={this.state.scale} pageNumber={this.state.pageNumber}>
                                    {this.state.rotate === 0 || this.state.rotate === 360 ? markElements : null}
                                </Page>
                            </PDFPage>
                        </DroppableRichZone>
                    </Document>
                </PDFDocument>
            </PDFContainer>
        );
    }
}
/* eslint-enable react/prop-types */
