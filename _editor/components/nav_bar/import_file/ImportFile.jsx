import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../common/file-input/FileInput";
import pdflib from 'pdfjs-dist';

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
                        <h4>Selecciona un fichero</h4>
                        <FileInput onChange={this.fileChanged} className="fileInput" accept=".pdf">
                            <div className="fileDrag">
                                <span style={{ display: 'block' }}><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                            </div>
                        </FileInput>
                        <canvas id='mycanvas'/>
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
        let files = event.target.files;
        let file = files[0];
        if (file.type === 'application/pdf') {
            pdflib.PDFJS.workerSrc = 'pdf.worker-bundle.js';
            // Loading a document.
            let loadingTask = pdflib.getDocument('images/sample.pdf');
            loadingTask.promise.then(function(pdfDocument) {
                // Request a first page
                return pdfDocument.getPage(1).then(function(pdfPage) {
                    // Display page on the existing canvas with 100% scale.
                    let viewport = pdfPage.getViewport(1.0);
                    let canvas = document.getElementById('mycanvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    let ctx = canvas.getContext('2d');
                    let renderTask = pdfPage.render({
                        canvasContext: ctx,
                        viewport: viewport,
                    });
                    console.log(canvas);
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
