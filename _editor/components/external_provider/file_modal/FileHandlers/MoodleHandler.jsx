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

import { DataTable } from 'react-datatable-bs';
require('react-datatable-bs/css/table-twbs.css');

import { parseMoodleXML } from "./moodleXML";
// styles
import './_ImportFile.scss';
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
export default class MoodleHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            FileURL: '',
            FileLoaded: false,
            FileName: '',
            FileType: '',
            ImportAs: 'Custom',
            questions: [],
        };
        this.AddPlugins = this.AddPlugins.bind(this);
        this.importFile = this.importFile.bind(this);
        this.start = this.start.bind(this);
    }
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
        if(prevProps.element !== this.props.element) {
            for (let i = 1; i <= prevState.FilePages; i++) {
                let canvas = document.getElementById('can' + i);
                document.body.removeChild(canvas);
            }
            this.start();
        }
    }

    start() {
        if(this.props.element) {
            let questions = [];
            parseMoodleXML(this.props.element, msg => {
                console.log(msg);
                if (msg.success === "true") {
                    questions.push(msg.question);
                }
            });
            console.log('The questions are: ');
            console.log(questions);
        }

    }
    /**
     * Renders React component
     * @returns {code}
     */
    render() {

        let data = [["John Doe", 16, "USA"],
            ["Mary Smith", 23, "Canada"],
            ["Marion  Gilbert", 18, "Australia"],
            ["Bruce Johnson", 21, "UK"],
            ["Ronald Armstrong", 31, "Ireland"],
            ["Brianna Reardown", 37, "Malta"]];

        let keys = data[0].map((i, index) => index);
        console.log(keys);
        let realKeys = ["Name", "Age", "Country"];
        let cols = [];
        keys.forEach(key =>{
            cols.push({ title: realKeys[key], prop: key });
        });

        let options = {
            disableFilter: false,
            disableRowChoice: true,
            disablePagination: false,
            pageSizeLabel: i18n.t('DataTable.options.pageSizeLabel_txt'),
            searchLabel: i18n.t('DataTable.options.searchLabel_txt'),
            searchPlaceholder: '',
            noDataLabel: i18n.t("DataTable.options.noDataLabel_txt"),
            initialPageLength: 5,
            initialSort: keys[0] || 0,
            initialOrder: 'descending',
            theme: 'solid',
        };
        return (<div className="pdfFileDialog">
            <form>
                <div className="fileLoaded" style={{ display: 'block' }}>
                    <h2>{i18n.t("Preview")}</h2>
                </div>
                <Row style={{ display: 'block' }}>
                    <Col xs={12} md={6} lg={6}>
                        <DataTable key={keys || 0}
                            keys="name"
                            columns={cols}
                            initialData={data}
                            initialPageLength={5}
                            disablePagination={options.disablePagination}
                            disableFilter={options.disableFilter}
                            disableRowChoice={options.disableRowChoice}
                            pageSizeLabel={options.pageSizeLabel}
                            noDataLabel={options.noDataLabel}
                            searchLabel={options.searchLabel}
                            searchPlaceholder={options.searchPlaceholder}
                            pageLengthOptions={options.pageLengthOptions}
                            paginationBottom
                            initialSortBy={{ prop: "name", order: options.initialOrder } /* { prop: cols[0].title, order: 'descending' }*/}
                        />

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

    importFile() {
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
    }

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
                url: this.props.element,
                page,
            };
        } else {
            initialParams = {
                parent: cvDoc ? this.props.containedViews[this.props.containedViewSelected].boxes[0] : this.props.navItems[this.props.navItemSelected].boxes[0],
                container: ID_PREFIX_SORTABLE_CONTAINER + Date.now(),
                url: this.props.element,
                page,
            };
        }
        initialParams.id = ID_PREFIX_BOX + Date.now();
        createBox(initialParams, "EnrichedPDF", inASlide, this.props.onBoxAdded, this.props.boxes);

    }

    AddPlugins() {
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

    }

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

MoodleHandler.propTypes = {
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
