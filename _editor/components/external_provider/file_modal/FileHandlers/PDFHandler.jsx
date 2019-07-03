import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../../common/file-input/FileInput";
import { ADD_BOX } from "../../../../../common/actions";
import { isContainedView, isSlide } from "../../../../../common/utils";
import { randomPositionGenerator } from "../../../clipboard/clipboard.utils";
import { ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES } from '../../../../../common/constants';
import Ediphy from "../../../../../core/editor/main";
// styles
import { createBox } from '../../../../../common/common_tools';
let spinner = require('../../../../../dist/images/spinner.svg');

// PDF Library conf.
const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.js');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);

pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;

/**
 * Generic import file modal
 */
export default class PDFHandler extends Component {
    state = {
        FileURL: '',
        FileLoaded: false,
        FileName: '',
        FilePages: 0,
        FileType: '',
        ImportAs: 'Custom',
        PagesFrom: 1,
        PagesTo: 1,
    };

    componentWillUnmount() {
        for (let i = 1; i <= this.state.FilePages; i++) {
            let canvas = document.getElementById('can' + i);
            if(canvas) {
                document.body.removeChild(canvas);
            }

        }
    }
    componentDidMount() {
        this.start();
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.url !== this.props.url) {
            for (let i = 1; i <= prevState.FilePages; i++) {
                let canvas = document.getElementById('can' + i);
                document.body.removeChild(canvas);
            }
            this.start();
        }
    }

    start = () => {
        require.ensure([], function() {
            let worker;
            worker = require('./pdf.worker.js');
        });
        if(this.props.url) {
            let loadingTask = pdflib.getDocument(this.props.url);
            loadingTask.promise.then((pdfDocument) =>{
                let numPages = pdfDocument.numPages;
                this.setState({
                    FileURL: this.props.url,
                    FileLoaded: true,
                    FileName: this.props.url,
                    FilePages: numPages,
                    PagesTo: numPages,
                    FileType: '(.pdf)',
                    ImportAs: 'Custom' });
                // Request pages
                let page;
                for (let i = 1; i <= numPages; i++) {
                    page = pdfDocument.getPage(i).then((pdfPage) =>{
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
                                this.PreviewFile(i);
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
    };

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (<div className="pdfFileDialog">
            <form action="javascript:void(0);" onSubmit={e=>e.preventDefault()}>
                <div className="fileLoaded" style={{ display: 'block' }}>
                    <h2>{i18n.t("Preview")}</h2>
                </div>
                <Row style={{ display: 'block' }}>
                    <Col xs={12} md={6} lg={6}>
                        <img id='FilePreview' src={spinner} style={{ width: 'auto', padding: '25%' }}/>
                    </Col>
                    <Col xs={12} md={6} lg={6}>
                        <FormGroup>
                            <ControlLabel>{i18n.t("importFile.pages.title")}</ControlLabel>
                            <Radio name="radioPages" inline onChange={e => {this.setState({ PagesFrom: 1, PagesTo: this.state.FilePages });}} defaultChecked>
                                {i18n.t("importFile.pages.whole_file")} ({ this.state.FilePages })
                            </Radio>
                            <Radio name="radioPages" inline>
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
                            <Radio name="radioImport" inline onChange={e => {this.setState({ ImportAs: 'PDFViewer' });}}>
                                {i18n.t("importFile.importAs.PDFViewer")}
                            </Radio>
                        </FormGroup>
                        <div className="import_file_buttons">
                            <Button bsStyle="default" className="import_file_buttons" id="import_file_button" onClick={ e => {
                                this.closeModal(); e.preventDefault();
                            }}>{i18n.t("importFile.footer.cancel")}</Button>
                            <Button bsStyle="primary" className="import_file_buttons" id="cancel_button" onClick={ (e) => {
                                this.importFile(e); e.preventDefault();
                            }}>{i18n.t("importFile.footer.ok")}</Button>
                        </div>
                    </Col>
                </Row>
            </form>
        </div>
        );
    }

    importFile = () => {
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
            case 'PDFViewer':
                this.AddAsPDFViewer();
                break;
            }
        }

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

        this.closeModal(true);
    };

    AddAsPDFViewer() {
        // insert image plugins
        let cv = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected);
        let cvSli = cv && isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let cvDoc = cv && !isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let inASlide = (this.props.navItemSelected !== 0 && isSlide(this.props.navItems[this.props.navItemSelected].type)) || cvSli;
        let page = cv ? this.props.containedViewSelected : this.props.navItemSelected;
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
                url: this.props.url,
                page,
            };
        } else {
            initialParams = {
                parent: cvDoc ? this.props.containedViews[this.props.containedViewSelected].boxes[0] : this.props.navItems[this.props.navItemSelected].boxes[0],
                container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                url: this.props.url,
                page,
            };
        }
        initialParams.id = ID_PREFIX_BOX + Date.now();
        createBox(initialParams, "EnrichedPDF", inASlide, this.props.onBoxAdded, this.props.boxes);

    }

    AddAsNavItem = (hasCustomSize) => {
        let navs = [];
        for (let i = this.state.PagesFrom; i <= this.state.PagesTo; i++) {
            let canvas = document.getElementById('can' + i);
            let dataURL = canvas.toDataURL("image/jpeg", 1.0);
            let newId = ID_PREFIX_PAGE + Date.now() + '_' + i;
            let customSize = hasCustomSize ? { width: canvas.width, height: canvas.height } : 0;
            let nav = {
                id: newId,
                name: hasCustomSize ? (i18n.t('page') + i + " PDF") : i18n.t('slide'),
                parent: 0,
                hideTitles: true,
                type: PAGE_TYPES.SLIDE,
                position: this.props.navItemsIds.length + navs.length,
                background: { background: 'url(' + dataURL + ')', backgroundAttr: 'centered', customBackground: true },
                customSize,
            };
            navs.push(nav);
        }
        this.props.onNavItemsAdded(navs, 0);
        if (navs.length > 0) {
            this.props.onIndexSelected(navs[navs.length - 1].id);
            this.props.onNavItemSelected(navs[navs.length - 1].id);
        }
    };

    // function for preview pages
    PreviewFile = (page) => {
        let preview = document.getElementById('FilePreview');
        let firstCanvas = document.getElementById('can' + page);

        preview.src = firstCanvas.toDataURL();
        if (firstCanvas.width > firstCanvas.height) {
            preview.style.width = '100%';
            preview.style.height = 'auto';
        } else {
            preview.style.width = 'auto';
            preview.style.height = '430px';
        }
        preview.style.border = '1px solid';
        preview.style.padding = '0px';
    };

    AddPlugins = () => {
        // insert image plugins
        let cv = this.props.containedViewSelected !== 0 && isContainedView(this.props.containedViewSelected);
        let cvSli = cv && isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let cvDoc = cv && !isSlide(this.props.containedViews[this.props.containedViewSelected].type);
        let inASlide = (!cv && isSlide(this.props.navItems[this.props.navItemSelected].type)) || cvSli;
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
                    container: ID_PREFIX_SORTABLE_CONTAINER + Date.now() + '_' + i,
                    url: dataURL, page,
                };
            }
            initialParams.id = ID_PREFIX_BOX + Date.now() + '_' + i;
            createBox(initialParams, "HotspotImages", inASlide, this.props.onBoxAdded, this.props.boxes);
        }
    };

    fileLoad = (event) => {
        let file = event.target.files[0];
        let pdfURL = URL.createObjectURL(file);

        if (file.type === 'application/pdf') {
            let loadingTask = pdflib.getDocument(pdfURL);
            loadingTask.promise.then((pdfDocument)=> {
                let numPages = pdfDocument.numPages;
                this.setState({
                    FileURL: pdfURL,
                    FileLoaded: true,
                    FileName: file.name,
                    FilePages: numPages,
                    FileType: '(.pdf)',
                    ImportAs: 'Custom' });
                // Request pages
                let page;
                for (let i = 1; i <= numPages; i++) {
                    page = pdfDocument.getPage(i).then((pdfPage) =>{
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
                                this.PreviewFile(i);
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
    };

    /**
     * Close modal
     */
    closeModal(bool) {
        // delete canvas preview util
        for (let i = 1; i <= this.state.FilePages; i++) {
            let canvas = document.getElementById('can' + i);
            if(canvas) {
                document.body.removeChild(canvas);
            }
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

        this.props.close(bool);
    }
}

PDFHandler.propTypes = {
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
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * PDF File URL
     */
    url: PropTypes.string,
};
