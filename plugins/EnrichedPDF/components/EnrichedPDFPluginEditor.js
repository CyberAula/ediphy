import React from 'react';
import MarkEditor from '../../../_editor/components/richPlugins/markEditor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';

const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);
pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;
import { setOptions, Document, Page } from 'react-pdf';
import { DroppableRichZone, PageNumber, PDFButton, PDFContainer, PDFDocument, PDFPage, TopBar } from "../Styles";
import _handlers from "../../../_editor/handlers/_handlers";
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
        this.h = _handlers(this);
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
                        onRichMarkMoved={this.h.onRichMarkMoved}
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
            <PDFContainer>
                <TopBar>
                    <PDFButton onClick={this.buttonBack}>
                        <i className={"material-icons"}>keyboard_arrow_left</i>
                    </PDFButton>
                    <PageNumber> {this.state.pageNumber} of {this.state.numPages} </PageNumber>
                    <PDFButton onClick={this.buttonNext}>
                        <i className={"material-icons"}>keyboard_arrow_right</i>
                    </PDFButton>
                </TopBar>
                <PDFDocument>
                    <Document file={this.props.state.url} onLoadSuccess={this.onDocumentLoad}>
                        <DroppableRichZone className={'dropableRichZone'}>
                            <PDFPage>
                                <Page className='pdfPage' pageNumber={this.state.pageNumber}>{markElements}</Page>
                            </PDFPage>
                        </DroppableRichZone>
                    </Document>
                </PDFDocument>
            </PDFContainer>
        );

    }
}
/* eslint-enable react/prop-types */
