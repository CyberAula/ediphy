import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../common/file-input/FileInput";
import { ADD_BOX } from "../../../../common/actions";
import { isContainedView, isSlide } from "../../../../common/utils";
import { randomPositionGenerator } from "../../clipboard/clipboard.utils";
import { ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES } from '../../../../common/constants';
import Ediphy from "../../../../core/editor/main";
// styles
import './_ImportFile.scss';
import { createBox } from '../../../../common/common_tools';

// PDF Library conf.
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);

pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;

/**
 * Generic import file modal
 */
export default class ImportFileModal extends Component {
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

    componentDidMount() {
        require.ensure([], function() {
            let worker;
            worker = require('./pdf.worker.js');
        });
    }
    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal pdfFileDialog" id="ImportFileModal"
                show={this.props.show}>
                <Modal.Header>
                    <Modal.Title><span id="previewTitle">{i18n.t("importFile.title")}<span className="highlight">{this.state.FileName}</span></span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <form>
                        <FileInput onChange={ this.fileLoad } className="fileInput" accept=".pdf">
                            <div className="fileDrag" style={{ display: this.state.FileLoaded ? 'none' : 'block' }}>
                                <span><b>{ i18n.t('FileInput.Drag') }</b>{ i18n.t('FileInput.Drag_2') }<b>{ i18n.t('FileInput.Click') }</b></span>
                            </div>
                        </FileInput>
                        <div className="fileLoaded" style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <h2>{i18n.t("Preview")}</h2>
                        </div>
                        <Row style={{ display: this.state.FileLoaded ? 'block' : 'none' }}>
                            <Col xs={12} md={6} lg={6}>
                                <img id='FilePreview' />
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <FormGroup>
                                    <ControlLabel>{i18n.t("importFile.pages.title")}</ControlLabel>
                                    <Radio name="radioPages" inline onChange={e => {this.setState({ PagesFrom: 1, PagesTo: this.state.FilePages });}}>
                                        {i18n.t("importFile.pages.whole_file")} ({ this.state.FilePages })
                                    </Radio>
                                    <Radio name="radioPages" inline defaultChecked>
                                        <FormGroup >
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>{i18n.t("importFile.pages.from")}</InputGroup.Addon>
                                                <FormControl type="number"
                                                    style={{ minWidth: '55px' }}
                                                    value={ this.state.PagesFrom }
                                                    min={1}
                                                    max={this.state.FilePages}
                                                    onChange={e => {this.setState({ PagesFrom: e.target.value });}}/>
                                            </InputGroup>
                                            <InputGroup className="inputGroup">
                                                <InputGroup.Addon>{i18n.t("importFile.pages.to")}</InputGroup.Addon>
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
                                    <ControlLabel>{i18n.t("importFile.importAs.title")}</ControlLabel>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'SliBackground' });}} >
                                        {i18n.t("importFile.importAs.slideBackground")}
                                    </Radio>
                                    <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'Image' });}}>
                                        {i18n.t("importFile.importAs.images")}
                                    </Radio>
                                    <Radio name="radioImport" inline defaultChecked onChange={e => {this.setState({ ImportAs: 'Custom' });}}>
                                        {i18n.t("importFile.importAs.customSize")}
                                    </Radio>
                                </FormGroup>
                            </Col>
                        </Row>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        this.ImportFile(e); e.preventDefault();
                    }}>{i18n.t("importFile.footer.ok")}</Button>
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
        let navs = [];
        for (let i = this.state.PagesFrom; i <= this.state.PagesTo; i++) {
            let canvas = document.getElementById('can' + i);
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let newId = ID_PREFIX_PAGE + Date.now();
            let customSize = hasCustomSize ? { width: canvas.width, height: canvas.height } : 0;
            let nav = {
                id: newId,
                name: hasCustomSize ? (i18n.t('page') + i + " PDF") : i18n.t('slide'),
                parent: 0,
                hideTitles: true,
                type: PAGE_TYPES.SLIDE,
                position: this.props.navItemsIds.length + navs.length,
                background: { background: dataURL, backgroundAttr: 'centered' },
                customSize,
            };
            navs.push(nav);

        }
        this.props.onNavItemsAdded(navs, 0);
        if (navs.length > 0) {
            this.props.onIndexSelected(navs[navs.length - 1].id);
            this.props.onNavItemSelected(navs[navs.length - 1].id);
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
        let cv = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected);
        let cvSli = cv && isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let cvDoc = cv && !isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let inASlide = isSlide(this.props.navItemSelected.type) || cvSli;
        let page = cv ? this.props.containedViewSelected : this.props.navItemSelected;
        for (let i = this.state.PagesFrom; i <= this.state.PagesTo; i++) {
            let canvas = document.getElementById('can' + i);
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let initialParams;
            // If slide
            if (inASlide) {
                let position = {
                    x: randomPositionGenerator(20, 40),
                    y: randomPositionGenerator(20, 40),
                    type: 'absolute', page,
                };
                initialParams = {
                    parent: cvSli ? this.props.containedViewSelected : this.props.navItemSelected,
                    container: 0,
                    position: position,
                    url: dataURL, page,
                };
            } else {
                initialParams = {
                    parent: cvDoc ? this.props.containedViews[this.props.containedViewSelected].boxes[0] : this.props.navItems[this.props.navItemSelected].boxes[0],
                    container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                    url: dataURL, page,
                };
            }
            initialParams.id = ID_PREFIX_BOX + Date.now();
            createBox(initialParams, "HotspotImages", inASlide, this.props.onBoxAdded, this.props.boxes);

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
                // eslint-disable-next-line no-console
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

ImportFileModal.propTypes = {
    /**
     * Whether the import file modal should be shown or hidden
     */
    show: PropTypes.bool,
    /**
     * Closes import file modal
     */
    close: PropTypes.func.isRequired,
    /**
      * Add several views
      */
    onNavItemsAdded: PropTypes.func.isRequired,
    /**
     * Select view/contained view in the index context
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Select view
     */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Object that contains all created views (identified by its *id*)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Id of the selected page
     */
    navItemSelected: PropTypes.any,
    /**
     * Object that holds all the contained views in the project
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Id of the contained view selected
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object that contains the boxes
     */
    boxes: PropTypes.object,
    /**
     * Function for creating a new box
     */
    onBoxAdded: PropTypes.func.isRequired,
};
