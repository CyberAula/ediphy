import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';
import FileInput from "../../../common/file-input/FileInput";
import { ADD_BOX } from "../../../../../common/actions";
import { isBox, isContainedView, isPage, isSlide, isSortableBox } from "../../../../../common/utils";
import { randomPositionGenerator } from "../../../clipboard/clipboard.utils";
import { ID_PREFIX_BOX, ID_PREFIX_PAGE, ID_PREFIX_SORTABLE_CONTAINER, PAGE_TYPES } from '../../../../../common/constants';
import Ediphy from "../../../../../core/editor/main";

import { DataTable } from 'react-datatable-bs';
require('react-datatable-bs/css/table-twbs.css');

import { parseMoodleXML } from "./moodleXML";
// styles
import './_ImportFile.scss';
import './_DataTable.scss';

import { createBox } from '../../../../../common/common_tools';
let spinner = require('../../../../../dist/images/spinner.svg');

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
            questions: [["John Doe", 16, "USA"],
                ["Mary Smith", 23, "Canada"],
                ["Marion  Gilbert", 18, "Australia"],
                ["Bruce Johnson", 21, "UK"],
                ["Ronald Armstrong", 31, "Ireland"],
                ["Brianna Reardown", 37, "Malta"]],
            selectedQuestions: [],
            selectAll: false,
        };
        this.importFile = this.importFile.bind(this);
        this.start = this.start.bind(this);
        this.isChecked = this.isChecked.bind(this);

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

    isChecked(q) {
        return this.state.selectedQuestions[q];
    }

    start() {
        if(this.props.element) {
            let questions = [];
            parseMoodleXML(this.props.element, msg => {
                if (msg.success === true) {
                    msg.filtered.map((question) => {
                        if (question && question.question) {
                            questions.push(question);
                        }
                    });
                    this.setState({ questions: questions, selectedQuestions: new Array(questions.length).fill(false) });
                }
            });
        }

    }
    /**
     * Renders React component
     * @returns {code}
     */
    render() {

        let questionsData = this.state.questions;
        let data = questionsData.map((q, index) => {
            let input =
                <input type='checkbox'
                    key={index}
                    onChange={()=> {
                        this.setState({ selectedQuestions: this.state.selectedQuestions.map((ques, i) => i === index ? !ques : ques), selectAll: false,
                        });
                    }}
                    // defaultChecked={false}
                    checked={this.isChecked(index)}/>;

            let qu = q.question ? q.question.replace("<p>", "").replace("</p>", "") : q[1];
            return [input, qu, q.name];

        });

        let keys = data[0].map((i, index) => index);
        let realKeys = ["Selected", "Question", "Type"];
        let cols = [];

        keys.forEach(key =>{
            cols.push({ title: realKeys[key], prop: key });
        });

        let options = {
            disableFilter: false,
            disableRowChoice: true,
            disablePagination: false,
            pageSizeLabel: i18n.t('DataTable.options.pageSizeLabel_txt'),
            searchLabel: ' ',
            searchPlaceholder: '',
            noDataLabel: i18n.t("DataTable.options.noDataLabel_txt"),
            initialPageLength: 7,
            initialSort: keys[0] || 0,
            initialOrder: 'descending',
            theme: 'solid',
        };
        return (<div className="moodleDialog">
            <form>
                <div className="fileLoaded moodleTable" style={{ display: 'block' }}>
                    <h2>{i18n.t("Preview")}</h2>

                    <Row style={{ display: 'block' }}>
                        <Col xs={12} md={12} lg={12}>
                            <DataTable key={keys || 0}
                                keys="name"
                                columns={cols}
                                initialData={data || []}
                                initialPageLength={options.initialPageLength}
                                disablePagination={options.disablePagination}
                                disableFilter={options.disableFilter}
                                disableRowChoice={options.disableRowChoice}
                                pageSizeLabel={options.pageSizeLabel}
                                noDataLabel={options.noDataLabel}
                                searchLabel={options.searchLabel}
                                searchPlaceholder={options.searchPlaceholder}
                                pageLengthOptions={options.pageLengthOptions}
                                paginationBottom
                                initialSortBy={{ prop: "name", order: options.initialOrder }}
                            />

                            <div className="import_file_buttons">
                                <div className={"selectAll"}>
                                    <input type='checkbox'
                                        id={"selectAll"}
                                        placeholder={"Select all"}
                                        onChange={(e)=> {
                                            this.setState({ selectAll: e.target.checked, selectedQuestions: new Array(this.state.questions.length).fill(e.target.checked),
                                            });
                                        }}
                                        checked={this.state.selectAll}
                                    />
                                    <label htmlFor={"selectAll"}>  Select all  </label>
                                </div>
                                <div className={"moodleButtons"}>
                                    <Button bsStyle="default" className="import_file_buttons" id="import_file_button" onClick={ e => {
                                        this.closeModal(); e.preventDefault();
                                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                                    <Button bsStyle="primary" className="import_file_buttons" id="cancel_button" onClick={ (e) => {
                                        this.importFile(e); e.preventDefault();
                                    }}>{i18n.t("importFile.footer.ok")}</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

            </form>

        </div>
        );
    }

    importFile() {
        let getInitialParams = (self, page) => {
            let ids = {};
            let initialParams;
            let isTargetSlide = false;

            if (page) {
                let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
                let id = ID_PREFIX_BOX + Date.now();
                isTargetSlide = isSlide(page.type);
                let parent = isTargetSlide ? page.id : page.boxes[0];
                let row = 0;
                let col = 0;
                let container = isTargetSlide ? 0 : containerId;
                let newInd;
                if (self.props.boxSelected && self.props.boxes[self.props.boxSelected] && isBox(self.props.boxSelected)) {
                    parent = self.props.boxes[self.props.boxSelected].parent;
                    container = self.props.boxes[self.props.boxSelected].container;
                    isTargetSlide = container === 0;
                    row = self.props.boxes[self.props.boxSelected].row;
                    col = self.props.boxes[self.props.boxSelected].col;
                    newInd = self.getIndex(parent, container);
                }

                ids = { id, parent, container, row, col, page: page ? page.id : 0 };
                initialParams = {
                    id: ID_PREFIX_BOX + Date.now(),
                    parent: parent, //
                    container: container,
                    row: row,
                    col: col,
                    index: newInd,
                    page: page ? page.id : 0,
                    position: isTargetSlide ? {
                        type: "absolute",
                        x: randomPositionGenerator(20, 40),
                        y: randomPositionGenerator(20, 40),
                    } : { type: 'relative', x: "0%", y: "0%" },
                };
            }

            return { initialParams, isTargetSlide };
        };

        let sanitizeInitialParams = (initialParams, boxes) => {
            let parent = initialParams.parent;

            if(isSortableBox(parent) || isPage(parent) || isContainedView(parent)) {
                return initialParams;
            }

            if(isBox(parent)) {
                let box = boxes[parent];
                return { ...initialParams, parent: box.parent, container: box.container };
            }

            return initialParams;
        };

        let questions = this.state.questions;
        let selectedQuestions = this.state.selectedQuestions;

        let toAdd = questions.filter((item, index) => selectedQuestions[index]);

        for (let question of toAdd) {
            let { initialParams, isTargetSlide } = getInitialParams(this.props.self, this.props.self.currentPage());
            initialParams.exercises = question;
            initialParams.initialState = question.state;

            if(question.id) {
                initialParams.id = question.id;
            }

            if(question.name === 'InputText') {
                let y = (parseFloat(initialParams.position.y) - 6).toString() + '%';
                let x = (parseFloat(initialParams.position.x) - 2).toString() + '%';
                let textParams = {
                    ...initialParams,
                    id: initialParams.id + '_0',
                    text: question.question,
                    position: isTargetSlide ? { ...initialParams.position, y: y, x: x } : initialParams.position,
                };
                delete textParams.exercises;
                delete textParams.initialState;
                createBox(textParams, "BasicText", isTargetSlide, this.props.onBoxAdded, this.props.boxes);
            }

            let sanitized = sanitizeInitialParams(initialParams, this.props.boxes);
            createBox(sanitized, question.name, isTargetSlide, this.props.onBoxAdded, this.props.boxes);

            if(question.img) {
                let imgParams = {
                    ...initialParams,
                    id: initialParams.id + '_I',
                    url: question.img,
                    container: "sc-Question",
                    parent: initialParams.id,
                    index: 0,
                    position: { type: "relative", x: 0, y: 0 },
                    isDefaultPlugin: 'true',
                };
                delete imgParams.exercises;
                delete imgParams.initialState;
                createBox(imgParams, "HotspotImages", isTargetSlide, this.props.onBoxAdded, this.props.boxes);

            }

        }

        this.props.self.close();

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
    /**
     * FileModal Context
     */
    self: PropTypes.object,
};
