import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../common/file-input/FileInput";
import pdflib from 'pdfjs-dist/webpack';
import { ADD_BOX } from "../../../../common/actions";
import { isSlide } from "../../../../common/utils";
import { randomPositionGenerator } from "../../clipboard/clipboard.utils";
import { ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES } from "../../../../common/constants";
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
            FileURL: '',
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
            FileType: '',
            ImportAs: '',
            PagesFrom: 1,
            PagesTo: 1,
        };
        this.AddPlugins = this.AddPlugins.bind(this);
        this.AddAsNavItem = this.AddAsNavItem.bind(this);
        this.fileLoad = this.fileLoad.bind(this);
        this.ImportFile = this.ImportFile.bind(this);
        this.PreviewFile = this.PreviewFile.bind(this);
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
                    <Modal.Title><span id="previewTitle">Importar fichero <span className="highlight">{this.state.FileName}</span></span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <form>
                        <FileInput onChange={ this.fileLoad } className="fileInput" accept=".pdf">
                            <div className="fileDrag" style={{ display: this.state.FileLoaded ? 'none' : 'block' }}>
                                <span><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                            </div>
                        </FileInput>
                        <div className="fileLoaded" style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <h2>Vista previa</h2>
                            {/* <div className="fileUploaded" ><i className="material-icons">insert_drive_file</i><span>{ this.state.FileName || '' }</span></div> */}
                        </div>
                        <Row style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <Col xs={12} md={6} lg={6}>
                                <img id='FilePreview' />
                                {/* <button onClick={ e => {this.PreviewFile(2); }}> */}
                                {/* <i className="material-icons">arrow_back</i> */}
                                {/* </button> */}
                                {/* <button onClick={ e => {this.PreviewFile(3); }}> */}
                                {/* <i className="material-icons">arrow_forward</i> */}
                                {/* </button> */}
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>Páginas</ControlLabel>
                                    <Radio name="radioPages" inline onChange={e => {this.setState({ PagesFrom: 1, PagesTo: this.state.FilePages });}}>
                                        Todas ({ this.state.FilePages })
                                    </Radio>
                                    <Radio name="radioPages" inline defaultChecked>
                                        <FormGroup >
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>Desde</InputGroup.Addon>
                                                <FormControl type="number"
                                                    style={{ minWidth: '55px' }}
                                                    value={ this.state.PagesFrom }
                                                    min={1}
                                                    max={this.state.FilePages}
                                                    onChange={e => {this.setState({ PagesFrom: e.target.value });}}/>
                                            </InputGroup>
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>Hasta</InputGroup.Addon>
                                                <FormControl type="number"
                                                    style={{ minWidth: '55px' }}
                                                    value={this.state.PagesTo}
                                                    min={1}
                                                    max={this.state.FilePages}
                                                    onChange={e => {this.setState({ PagesTo: e.target.value });}}/>
                                            </InputGroup>
                                        </FormGroup>
                                    </Radio>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Importar como</ControlLabel>
                                    {/* <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'DocBackground' });}}>
                                        Fondo en documento
                                        </Radio> */}
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'SliBackground' });}} >
                                        Fondo en diapositiva
                                    </Radio>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'Image' });}}>
                                        Imágenes
                                    </Radio>
                                    <Radio name="radioImport" inline defaultChecked onChange={e => {this.setState({ ImportAs: 'Custom' });}}>
                                        Ajustar al tamaño del fichero
                                    </Radio>
                                </FormGroup>
                            </Col>
                        </Row>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
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
            switch(this.state.ImportAs) {
            case 'Image':
                this.AddPlugins();
                break;
            case 'SliBackground':
                this.AddAsNavItem();
                break;
            case 'Custom':
                this.AddAsNavItem(true);
                break;
            }
        }
        // TODO: rest of cases (files)

        // delete canvas preview util
        for (let i = 1; i <= this.state.FilePages; i++) {
            let canvas = document.getElementById('can' + i);
            document.body.removeChild(canvas);
        }
        // reset state
        this.setState({
            FileURL: '',
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
            FileType: '',
            ImportAs: '',
            PagesFrom: 1,
            PagesTo: 1,
        });

        this.props.close();
    }

    AddAsNavItem(hasCustomSize) {
        // TODO: refactor -> create new action
        for (let i = this.state.PagesFrom; i <= this.state.PagesTo; i++) {
            let canvas = document.getElementById('can' + i);
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let newId = ID_PREFIX_PAGE + Date.now();
            let customSize = hasCustomSize ? { width: canvas.width, height: canvas.height } : 0;
            this.props.onNavItemAdded(
                newId,
                "Página " + i + " PDF",
                0,
                PAGE_TYPES.SLIDE,
                this.props.navItemsIds.length,
                { background: dataURL, attr: 'centered' },
                customSize
            );
            this.props.onIndexSelected(newId);
        }
    }

    // function for preview pages
    PreviewFile(page) {
        let preview = document.getElementById('FilePreview');
        let firstCanvas = document.getElementById('can' + page);
        preview.src = firstCanvas.toDataURL();
        preview.style.width = '100%';
        preview.style.height = 'auto';
        preview.style.border = '1px solid';
    }

    AddPlugins() {
        // insert image plugins
        for (let i = this.state.PagesFrom; i <= this.state.PagesTo; i++) {
            let canvas = document.getElementById('can' + i);
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let initialParams;
            // If slide
            if (isSlide(this.props.navItems[this.props.navItemSelected].type)) {
                let position = {
                    x: randomPositionGenerator(20, 40),
                    y: randomPositionGenerator(20, 40),
                    type: 'absolute',
                };
                initialParams = {
                    parent: this.props.navItemSelected,
                    container: 0,
                    position: position,
                    url: dataURL,
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
                    FileURL: pdfURL,
                    FileLoaded: true,
                    FileName: file.name,
                    FilePages: numPages,
                    FileType: '(.pdf)',
                    ImportAs: 'Custom' });
                // Request pages
                let page;
                for (let i = 1; i <= numPages; i++) {
                    page = pdfDocument.getPage(i).then(function(pdfPage) {
                        // Display page on the existing canvas with 100% scale.
                        let viewport = pdfPage.getViewport(1.0);
                        let canvas = document.createElement('canvas');
                        document.body.appendChild(canvas);
                        canvas.id = "can" + i;
                        canvas.style.visibility = "hidden";
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        let ctx = canvas.getContext('2d');
                        let renderTask = pdfPage.render({
                            canvasContext: ctx,
                            viewport: viewport,
                        });
                        if (i === 1) {
                            renderTask.promise.then(() => {
                                process.PreviewFile(i);
                            });
                        }
                        return renderTask.promise;
                    });
                }
                return page;
            }).catch(function(reason) {
                console.error('Error: ' + reason);
            });
        }
    }

    /**
     * Close modal
     */
    closeModal() {
        // delete canvas preview util
        for (let i = 1; i <= this.state.FilePages; i++) {
            let canvas = document.getElementById('can' + i);
            document.body.removeChild(canvas);
        }
        this.setState({
            FileLoaded: false,
            FileName: '',
            FilePages: 0,
            FileType: '',
            ImportAs: '',
            PagesFrom: 1,
            PagesTo: 1,
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
