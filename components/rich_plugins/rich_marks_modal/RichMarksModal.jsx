import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, Row,Col, FormGroup, ControlLabel, FormControl, Radio} from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import {ID_PREFIX_RICH_MARK, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, PAGE_TYPES} from '../../../constants';
import i18n from 'i18next';

export default class RichMarksModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectMode: "new",
            displayMode: "navigate",
            newSelected: PAGE_TYPES.SLIDE,
            existingSelected: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        let current = nextProps.currentRichMark;
        if (current) {
            this.setState({
                connectMode: current.connectMode || "new",
                displayMode: current.displayMode || "navigate",
                newSelected: (current.connectMode === "new" ? current.connection : PAGE_TYPES.SLIDE),
                existingSelected: (current.connectMode === "existing" && nextProps.navItems[current.connection] ? nextProps.navItems[current.connection].name : "")
            });
        }

    }

    render() {
        let richMarkValue = null;

        function getRichMarkInput(value){
            richMarkValue = value;
        }

        let viewNames = [];
        this.props.navItemsIds.map(id => {
            if (id === 0) {
                return;
            }
            if (this.props.navItems[id].hidden) {
                return;
            }
            viewNames.push({name: this.props.navItems[id].name, id: id});
        });
        Object.keys(this.props.containedViews).map(cv=>{
            if(cv=== 0){
                return;
            }
            viewNames.push({name:this.props.containedViews[cv].name, id: this.props.containedViews[cv].id});
        });

        let current = this.props.currentRichMark;
        return (
            /* jshint ignore:start */
            <Modal className="pageModal" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>{current ? i18n.t("marks.edit_mark_to") : i18n.t("marks.add_mark_to")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <FormGroup>
                            <Col xs={4} md={2}>
                                <ControlLabel>{i18n.t("marks.mark_name")}</ControlLabel>
                            </Col>
                            <Col xs={8} md={6}>
                            <FormControl ref="title"
                                         type="text"
                                         defaultValue={current ? current.title : ""}/>
                            </Col>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Col xs={4} md={2}>
                            <ControlLabel>{i18n.t("marks.link_to")}</ControlLabel>
                            </Col>
                            <Col xs={5} md={3}>
                            <Radio value="new"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "new"}
                                   onChange={e => {
                                        this.setState({connectMode: "new"});
                                   }}>{i18n.t("marks.new_content")}</Radio>
                            <Radio value="existing"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "existing"}
                                   onChange={e => {
                                        this.setState({connectMode: "existing"});
                                   }}>{i18n.t("marks.existing_content")}</Radio>
                            <Radio value="external"
                                   name="connect_mode"
                                   checked={this.state.connectMode === "external"}
                                   onChange={e => {
                                        this.setState({connectMode: "external"});
                                   }}>{i18n.t("marks.external_url")}</Radio>
                            </Col>
                        </FormGroup>
                        <Col xs={5} md={3}>
                        <FormGroup style={{display: this.state.connectMode === "new" ? "initial" : "none"}}>
                            <FormControl componentClass="select"
                                         defaultValue={this.state.newSelected}
                                         style={{
                                            display: this.state.newSelected === PAGE_TYPES.SLIDE || this.state.newSelected === PAGE_TYPES.DOCUMENT ? "initial" : "none"
                                         }}
                                         onChange={e => {
                                            this.setState({newSelected: e.nativeEvent.target.value});
                                         }}>
                                <option value={PAGE_TYPES.DOCUMENT}>{i18n.t("marks.new_document")}</option>
                                <option value={PAGE_TYPES.SLIDE}>{i18n.t("marks.new_slide")}</option>
                            </FormControl>
                            <span style={{
                                display: this.state.newSelected === PAGE_TYPES.SLIDE || this.state.newSelected === PAGE_TYPES.DOCUMENT ? "none" : "initial"
                                }}>
                                Connected to {this.state.newSelected}
                            </span>
                        </FormGroup>
                        <FormGroup style={{display: this.state.connectMode === "existing" ? "initial" : "none"}}>
                            <Typeahead options={viewNames}
                                       placeholder="Search view by name"
                                       labelKey="name"
                                       defaultSelected={[this.state.existingSelected]}
                                       onChange={items => {
                                           this.setState({existingSelected: items.length !== 0 ? items[0].id : ""});
                                       }}/>
                        </FormGroup>
                        <FormGroup style={{display: this.state.connectMode === "external" ? "initial" : "none"}}>
                            <FormControl ref="externalSelected"
                                         type="text"
                                         defaultValue={current && this.state.connectMode === "external" ? current.connection : ""}
                                         placeholder="URL"/>
                        </FormGroup>
                        </Col>
                    </Row>
                        {/*<FormGroup>
                            <ControlLabel>Display mode</ControlLabel>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "navigate"}
                                   onChange={e => {
                                        this.setState({displayMode: "navigate"});
                                   }}>Navigate to content</Radio>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "popup"}
                                   onChange={e => {
                                        this.setState({displayMode: "popup"});
                                   }}>Show as popup</Radio>
                            <Radio name="display_mode"
                                   checked={this.state.displayMode === "new_tab"}
                                   disabled={this.state.connectMode !== "external"}
                                   onChange={e => {
                                        this.setState({displayMode: "new_tab"});
                                   }}>Open in new tab</Radio>
                        </FormGroup>*/}
                        <Row>
                        <FormGroup>
                            {/*Input need to have certain label like richValue*/}
                            <Col xs={4} md={2}>
                                <ControlLabel>Value</ControlLabel>
                            </Col>
                            <Col xs={8} md={6}>
                                <FormControl
                                         ref="value"
                                         type={this.state.actualMarkType}
                                         defaultValue={current ? current.value : ""}/>
                            </Col>
                        </FormGroup>
                        </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onRichMarksModalToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let title = ReactDOM.findDOMNode(this.refs.title).value;
                        let newId = ID_PREFIX_CONTAINED_VIEW + Date.now();
                        let connectMode = this.state.connectMode;
                        let connection;
                         switch (connectMode){
                            case "new":
                                connection = current ?
                                    current.connection :
                                    {
                                        id: newId,
                                        parent: [this.props.boxSelected],
                                        name: i18n.t('contained_view'),
                                        boxes: [],
                                        type: this.state.newSelected,
                                        extraFiles: {},
                                        header: {
                                           elementContent:{
                                               documentTitle:'', 
                                               documentSubTitle: '', 
                                               numPage:''},
                                           display:{
                                               courseTitle: 'hidden', 
                                               documentTitle: 'expanded', 
                                               documentSubTitle: 'hidden', 
                                               breadcrumb: "reduced", 
                                               pageNumber: "hidden"}
                                       }
                                    };

                                break;
                            case "existing":
                                connection = this.state.existingSelected;
                                break;
                            case "external":
                                connection = ReactDOM.findDOMNode(this.refs.externalSelected).value;
                            break;
                        }
                        let displayMode = this.state.displayMode;
                        let value = ReactDOM.findDOMNode(this.refs.value).value;
                        this.props.onRichMarkUpdated({id: (current ? current.id : ID_PREFIX_RICH_MARK + Date.now()), title, connectMode, connection, displayMode, value});
                        if(connectMode === 'new' && this.state.newSelected === PAGE_TYPES.DOCUMENT) {
                            this.props.onBoxAdded({parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now()}, false, false);
                        }
                        this.props.onRichMarksModalToggled();
                    }}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            /* jshint ignore:end */
        );

    }


}
