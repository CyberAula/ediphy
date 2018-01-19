import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../common/file-input/FileInput";
import pdflib from 'pdfjs-dist/webpack';
import { ADD_BOX } from "../../../../common/actions";
import { isSlide } from "../../../../common/utils";
import { randomPositionGenerator } from "../../clipboard/clipboard.utils";
import { ID_PREFIX_SORTABLE_CONTAINER } from "../../../../common/constants";
import Ediphy from "../../../../core/editor/main";
// styles
import './_ImportFile.scss';

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
            FileType: '',
            ImportAs: '',
        };
        this.fileLoad = this.fileLoad.bind(this);
    }
    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal" id="ImportFileModal"
                show={this.props.show}>
                <Modal.Header>
                    <Modal.Title><span id="previewTitle">Importar fichero {this.state.FileType}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <form>
                        <FileInput onChange={ this.fileLoad } className="fileInput" accept=".pdf">
                            <div className="fileDrag" style={{ display: this.state.FileLoaded ? 'none' : 'block' }}>
                                <span><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                            </div>
                        </FileInput>
                        <div className="fileLoaded" style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <div className="fileUploaded" ><i className="material-icons">insert_drive_file</i><span>{ this.state.FileName || '' }</span></div>
                        </div>
                        <Row style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <Col xs={12} md={6} lg={6}><canvas id='FilePreview' /></Col>
                            <Col xs={12} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Páginas</ControlLabel>
                                    <Radio name="radioPages" inline>
                                        Todas ({ this.state.FilePages })
                                    </Radio>
                                    <Radio name="radioPages" inline defaultChecked>
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
                                    </Radio>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Importar como</ControlLabel>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'DocBackground' });}}>
                                       Fondo en documento
                                    </Radio>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'SliBackground' });}}>
                                        Fondo en diapositiva
                                    </Radio>
                                    <Radio name="radioImport" inline defaultChecked onChange={e => {this.setState({ ImportAs: 'Image' });}}>
                                        Imágenes
                                    </Radio>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'Custom' });}}>
                                        Ajustar al tamaño del fichero
                                    </Radio>
                                </FormGroup>
                            </Col>
                        </Row>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.cancel(); e.preventDefault();
                    }}>cancelar</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        this.ImportFile(e); e.preventDefault();
                    }}>Aceptar</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    ImportFile() {
        switch(this.state.FileType) {
        case '(.pdf)':
            let canvas = document.getElementById('FilePreview');
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let initialParams;
            console.log(this.props.navItemSelected);
            // If slide
            if (isSlide(this.props.navItemSelected)) {
                let position = {
                    x: randomPositionGenerator(20, 40),
                    y: randomPositionGenerator(20, 40),
                    type: 'absolute',
                };
                initialParams = {
                    parent: this.props.navItemSelected,
                    container: 0,
                    position: position,
                };
            } else {
                initialParams = {
                    parent: this.props.navItems[this.props.navItemSelected].boxes[0],
                    container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                    url: dataURL,
                };
            }
            Ediphy.Plugins.get('HotspotImages').getConfig().callback(initialParams, ADD_BOX);
        }
        this.setState({
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
            FileType: '',
            ImportAs: '',
        });
        this.props.close();
    }

    fileLoad(event) {
        let process = this;
        let file = event.target.files[0];
        let pdfURL = URL.createObjectURL(file);

        if (file.type === 'application/pdf') {
            let loadingTask = pdflib.getDocument(pdfURL);
            loadingTask.promise.then(function(pdfDocument) {
                let numPages = pdfDocument.numPages;
                process.setState({
                    FileLoaded: true,
                    FileName: file.name,
                    FilePages: numPages,
                    FileType: '(.pdf)',
                    ImportAs: 'Image' });
                // Request a first page
                return pdfDocument.getPage(1).then(function(pdfPage) {
                    // Display page on the existing canvas with 100% scale.
                    let viewport = pdfPage.getViewport(0.5);
                    let canvas = document.getElementById('FilePreview');
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
        this.setState({
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
            FileType: '',
            ImportAs: '',
        });

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
