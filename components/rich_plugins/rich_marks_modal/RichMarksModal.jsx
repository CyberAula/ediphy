import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, Row,Col, FormGroup, ControlLabel, FormControl, Radio} from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import {ID_PREFIX_RICH_MARK, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, PAGE_TYPES} from '../../../constants';
import i18n from 'i18next';
import {isSection, isContainedView} from '../../../utils';

export default class RichMarksModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            connectMode: "new",
            displayMode: "navigate",
            newSelected: PAGE_TYPES.SLIDE,
            existingSelected: "",
            viewNames: this.returnAllViews(this.props)
        };
    }

    componentWillReceiveProps(nextProps) {
        let current = nextProps.currentRichMark;
        let allViews = this.returnAllViews(nextProps);
        if (current) {
            this.setState({
                viewNames: allViews,
                connectMode: current.connectMode || "new",
                displayMode: current.displayMode || "navigate",
                newSelected: (current.connectMode === "new" ? current.connection : PAGE_TYPES.SLIDE),
                existingSelected: (current.connectMode === "existing" && this.remapInObject(nextProps.navItems,nextProps.containedViews)[current.connection] ?
                    this.remapInObject(nextProps.navItems,nextProps.containedViews)[current.connection].id : "")
            });
        }

    }

    render() {
        let richMarkValue = null;

        function getRichMarkInput(value){
            richMarkValue = value;
        }

        let current = this.props.currentRichMark;
        // Por defecto la página actual si no hay ninguna seleccionada
        let currentView = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ?  {label: this.props.containedViews[this.props.containedViewSelected].name, id: this.props.containedViewSelected}:
                                                                                                        {label: this.props.navItems[this.props.navItemSelected].name, id: this.props.navItemSelected};

        let selected = this.state.existingSelected ? (isContainedView(this.state.existingSelected) ? {label: this.props.containedViews[this.state.existingSelected].name, id: this.state.existingSelected}:
                                                                                                     {label: this.props.navItems[this.state.existingSelected].name, id: this.state.existingSelected}): currentView;
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
                                         defaultValue={current ? current.title : i18n.t("marks.new_mark")}/>
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
                            <Typeahead options={this.returnAllViews(this.props)}
                                       placeholder="Search view by name"
                                       ignoreDiacritics={false}
                                       selected={[selected]}
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
                                         defaultValue={current ? current.value : "0,0"}/>
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
                        // If it is an Enriched Video, the value should be a percentage
                        if (this.props.pluginToolbar.config.category === 'multimedia'){
                            let regex =  /(^\d+(?:\.\d*)?%$)/g;
                            let match = regex.exec(value);
                            if (match && match.length == 2){
                                let val = Math.round(parseFloat(match[1]) * 100) / 100;
                                if (isNaN(val) || val > 100) {
                                    alert(i18n.t("messages.mark_percentage"));
                                    return;
                                }
                                value = val + '%'
                            } else {
                                alert(i18n.t("messages.mark_percentage"));
                                return;
                            }
                        // If it is an image, the value should be 2 coordinates
                        } else if (this.props.pluginToolbar.config.category === 'image'){
                            let regex =  /(^\d+(?:\.\d*)?),(\d+(?:\.\d*)?$)/g ;
                            let match = regex.exec(value);
                            if(match && match.length === 3) {
                                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                                if (isNaN(x) || isNaN(y) || x > 100 || y > 100) {
                                    alert(i18n.t("messages.mark_xy"));
                                    return;
                                }
                                value = x + ',' + y;
                            } else {
                                alert(i18n.t("messages.mark_xy"));
                                return;
                            }
                        }

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


    /*
    * Maping method that joins cointainedViews and navItems in array but excluding the ones that can't be
    * */
    returnAllViews(props){
        let viewNames = [];
        props.navItemsIds.map(id => {
            if (id === 0) {
                return;
            }
            if (props.navItems[id].hidden) {
                return;
            }
            if(!Dali.Config.sections_have_content && isSection(id)){
                return;
            }

            if(props.containedViewSelected === 0 && props.navItemSelected === id){
                return;
            }

            viewNames.push({label: props.navItems[id].name, id: id});
        });
        Object.keys(props.containedViews).map(cv=>{
            if(cv=== 0){
                return;
            }

            if(props.containedViewSelected === cv){
                return;
            }

            viewNames.push({label:props.containedViews[cv].name, id: props.containedViews[cv].id});
        });
        return viewNames;
    }

    /*
    * Method used to remap navItems and containedViews together
    * */
    remapInObject(...objects){
        return Object.assign({},...objects);
    }



}
