import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../common/file-input/FileInput";
import pdflib from 'pdfjs-dist/webpack';
/**
 * Generic import file modal
 */
export default class ImportFile extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
        };
        this.fileChanged = this.fileChanged.bind(this);
    }
    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal"
                show={this.props.show}>
                <Modal.Header>
                    <Modal.Title><span id="previewTitle">Importar fichero</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <form>
                        <FileInput onChange={ this.fileChanged } className="fileInput" accept=".pdf">
                            <div className="fileDrag">
                                <span style={{ display: this.state.FileLoaded ? 'none' : 'block' }}><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                                <span className="fileUploaded" style={{ display: this.state.FileLoaded ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i>{ this.state.FileName || '' }</span>
                            </div>
                        </FileInput>
                        <Row style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <Col xs={12} md={5} lg={5}><canvas id='mycanvas' /></Col>
                            <Col xs={12} md={7} lg={7}>
                                <FormGroup>
                                    <ControlLabel>Páginas</ControlLabel><br/>
                                    <Radio name="radioGroup" inline>
                                        Todas ({ this.state.FilePages })
                                    </Radio>{' '}
                                    <br/><br/>
                                    <Radio name="radioGroup" inline defaultChecked>
                                        <FormGroup >
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>Desde</InputGroup.Addon>
                                                <FormControl type="number"
                                                    style={{ minWidth: '55px' }}
                                                    value={1}
                                                    min={0}
                                                    max={this.state.FilePages}
                                                    onChange={e => {this.setState({ modifiedState: true });}}/>
                                            </InputGroup>
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>Hasta</InputGroup.Addon>
                                                <FormControl type="number"
                                                    style={{ minWidth: '55px' }}
                                                    value={1}
                                                    min={0}
                                                    max={this.state.FilePages}
                                                    onChange={e => {this.setState({ modifiedState: true });}}/>
                                            </InputGroup>
                                        </FormGroup>
                                    </Radio>{' '}
                                </FormGroup>
                            </Col>
                        </Row>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={e => {
                        this.cancel(); e.preventDefault();
                    }}>cancelar</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={e => {
                        console.log('import file');
                    }}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    fileChanged(event) {
        let process = this;
        let file = event.target.files[0];
        let pdfURL = URL.createObjectURL(file);
        // PDFJS.getDocument(data).then(function (doc) {};

        if (file.type === 'application/pdf') {
            let loadingTask = pdflib.getDocument(pdfURL);
            loadingTask.promise.then(function(pdfDocument) {
                let numPages = pdfDocument.numPages;
                process.setState({ FileLoaded: true, FileName: file.name, FilePages: numPages });
                // Request a first page
                return pdfDocument.getPage(1).then(function(pdfPage) {
                    // Display page on the existing canvas with 100% scale.
                    let viewport = pdfPage.getViewport(0.3);
                    let canvas = document.getElementById('mycanvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    canvas.style.border = '1px solid';
                    let ctx = canvas.getContext('2d');
                    let renderTask = pdfPage.render({
                        canvasContext: ctx,
                        viewport: viewport,
                    });

                    return renderTask.promise;
                });
            }).catch(function(reason) {
                console.error('Error: ' + reason);
            });
        }
    }
    /**
     * Close modal
     */
    cancel() {
        this.props.close();
    }
}

ImportFile.propTypes = {
    /**
     * Indicates whether the import file modal should be shown or hidden
     */
    show: PropTypes.bool,
    /**
     * Closes import file configuration modal
     */
    close: PropTypes.func.isRequired,
};
