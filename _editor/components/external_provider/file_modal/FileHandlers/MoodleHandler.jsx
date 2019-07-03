import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'react-bootstrap';
import i18n from 'i18next';
import { isBox, isContainedView, isPage, isSlide, isSortableBox } from "../../../../../common/utils";
import { randomPositionGenerator } from "../../../clipboard/clipboard.utils";
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../../common/constants';
import Ediphy from "../../../../../core/editor/main";
import './_MoodleXMLDataTable.scss';
import { DataTable } from 'react-datatable-bs';
import { parseMoodleXML } from "./moodleXML";
require('react-datatable-bs/css/table-twbs.css');

import { createBox } from '../../../../../common/common_tools';
export default class MoodleHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [[]],
            selectedQuestions: [],
            selectAll: false,
        };
        this.realKeys = [
            /* <input type="checkbox"  onChange={(e)=>this.selectAllRows(e.target.checked)} /> */
            " ",
            i18n.t('FileModal.FileHandlers.question'),
            i18n.t('FileModal.FileHandlers.type'),
        ];
    }

    selectAllRows = (select) => {
        let selectedQuestions = [...this.state.selectedQuestions];
        [].forEach.call(document.getElementsByClassName('moodleXMLquestion'), (el) => {
            selectedQuestions[parseInt(el.dataset.id, 10)] = select;
        });
        this.setState({ selectedQuestions });
        this.forceResetSearch();
    };

    componentDidMount() {
        this.start();
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.element !== this.props.element) {
            this.start();
        }
    }

    isChecked = (q) => {
        return this.state.selectedQuestions[q];
    };

    start = () => {
        if(this.props.element) {
            let questions = [];
            parseMoodleXML(this.props.element, msg => {
                if (msg.success === true) {
                    msg.filtered.map((question) => {
                        if (question && question.question) {
                            questions.push(question);
                        }
                    });
                    this.setState({ questions, selectedQuestions: new Array(questions.length).fill(false) });
                }
            });
        }
    };

    toggleInput = (index) => {
        this.setState({
            selectedQuestions: this.state.selectedQuestions.map((ques, i) => i === index ? !ques : ques),
        });
        this.forceResetSearch();
    };

    filterSearch = (data, checked) => {
        let element = document.querySelector('.moodleDialog #search-field');
        const val = element.value;
        this.setState({ selectedQuestions: checked ? data.map((q) => q[1].toLowerCase().includes(val.toLowerCase().replace(/ /g, ''))) : new Array(data.length).fill(false) });
        this.forceResetSearch();
    };

    forceResetSearch() {
        let element = document.querySelector('.moodleDialog #search-field');
        const val = element.value;
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(element, "");
        let ev2 = new Event('input', { bubbles: true });
        element.dispatchEvent(ev2);
        setTimeout(()=>{
            element = document.querySelector('.moodleDialog #search-field');
            nativeInputValueSetter.call(element, val);
            let ev3 = new Event('input', { bubbles: true });
            element.dispatchEvent(ev3);
        }, 2);
    }

    createInput = (index) => {
        return <input type='checkbox' data-id={index} className="moodleXMLquestion" key={index} checked={this.isChecked(index)} onChange={()=>this.toggleInput(index)} />;
    };

    createData = (questionsData) => {
        return questionsData.map((q, index) => {
            let input = this.createInput(index);
            let text = (q.name === "TrueFalse" && q.answers[0]) ? q.answers[0] : q.question;
            let statement = text ? text.replace("<p>", "").replace("</p>", "") : q[1];
            let name = (q.name && Ediphy.Plugins.get(q.name)) ? Ediphy.Plugins.get(q.name).getConfig().displayName : q.name;
            return [input, statement, name];
        });
    };

    feedbackProvider = () => {
        let numberOfExercises = this.state.selectedQuestions.filter(Boolean).length;
        switch(numberOfExercises) {
        case 0:
            return i18n.t('FileModal.FileHandlers.feedback0');
        case 1:
            return i18n.t('FileModal.FileHandlers.feedback1s');
        default:
            return i18n.t('FileModal.FileHandlers.feedback1p') + ' ' + numberOfExercises + ' ' + i18n.t('FileModal.FileHandlers.feedback2p');
        }
    };

    render() {

        let data = this.createData(this.state.questions);
        let keys = data[0].map((i, index) => index);
        let cols = [];

        let feedback = this.feedbackProvider();

        keys.forEach(key =>{
            cols.push({ title: this.realKeys[key], prop: key });
        });

        let options = {
            disableFilter: false,
            disableRowChoice: true,
            disablePagination: false,
            pageSizeLabel: "",
            searchLabel: ' ',
            searchPlaceholder: i18n.t('FileModal.FileHandlers.filter_questions'),
            noDataLabel: i18n.t('FileModal.FileHandlers.no_matches'),
            initialPageLength: 8,
            initialSort: keys[0] || 0,
            initialOrder: 'descending',
            theme: 'striped',
        };
        return (<div className="moodleDialog">
            <form action="javascript:void(0);" onSubmit={e=>e.preventDefault()}>
                <div className="fileLoaded moodleTable" style={{ display: 'block' }}>
                    <h2>{i18n.t("Preview")}</h2>

                    <Row style={{ display: 'block' }}>
                        <Col xs={12} md={12} lg={12}>
                            <div className="tableContainer theme-striped">
                                <DataTable key={1}
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
                            </div>
                            <div className="import_file_buttons">
                                <div className={"selectAll"}>
                                    <input type='checkbox'
                                        id={"selectAll"}
                                        placeholder={i18n.t('FileModal.FileHandlers.selectAll')}
                                        onChange={(e)=> {
                                            this.filterSearch(data, e.target.checked);
                                            this.setState({ selectAll: e.target.checked });
                                        }}
                                        defaultChecked={false}
                                    />
                                    <label htmlFor={"selectAll"}>  {i18n.t('FileModal.FileHandlers.selectAll')}  </label>
                                </div>
                                <div className={'moodleXmlFeedback'}>
                                    <p>{feedback}</p>
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

    importFile = () => {
        let getInitialParams = (self, page) => {
            let initialParams;
            let isTargetSlide = false;

            if (page) {
                let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
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

    };

    closeModal(bool) {
        this.props.close(bool);
    }
}

MoodleHandler.propTypes = {
    /**
     * Closes import file modal
     */
    close: PropTypes.func.isRequired,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * FileModal Context
     */
    self: PropTypes.object,
    /**
     * Selected element
     */
    element: PropTypes.any,
};
