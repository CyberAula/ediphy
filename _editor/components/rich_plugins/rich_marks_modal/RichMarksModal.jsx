import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Alert from './../../common/alert/Alert';
import { Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Radio } from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import { ID_PREFIX_RICH_MARK, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, PAGE_TYPES } from '../../../../constants';
import i18n from 'i18next';
import { isSection, isContainedView, nextAvailName } from '../../../../utils';
require('./_richMarksModal.scss');

export default class RichMarksModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectMode: "new",
            displayMode: "navigate",
            newSelected: "",
            existingSelected: "",
            newType: PAGE_TYPES.SLIDE,
            viewNames: this.returnAllViews(this.props),
            showAlert: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        let current = nextProps.currentRichMark;
        let allViews = this.returnAllViews(nextProps);

        if (current) {
            this.setState({
                viewNames: allViews,
                color: current.color,
                connectMode: current.connectMode || "new",
                displayMode: current.displayMode || "navigate",
                newSelected: (current.connectMode === "new" ? current.connection : ""),
                newType: PAGE_TYPES.SLIDE,
                existingSelected: (current.connectMode === "existing" && this.remapInObject(nextProps.navItems, nextProps.containedViews)[current.connection] ?
                    this.remapInObject(nextProps.navItems, nextProps.containedViews)[current.connection].id : ""),
            });
        } else {
            this.setState({
                viewNames: allViews,
                color: null,
                connectMode: "new",
                displayMode: "navigate",
                newSelected: "",
                newType: PAGE_TYPES.SLIDE,
                existingSelected: "",
            });
        }

    }

    render() {
        let richMarkValue = null;
        let marksType = this.props.pluginToolbar && this.props.pluginToolbar.config && this.props.pluginToolbar.config.marksType && this.props.pluginToolbar.config.marksType[0] ? this.props.pluginToolbar.config.marksType[0] : {};
        function getRichMarkInput(value) {
            richMarkValue = value;
        }

        let current = this.props.currentRichMark;
        // Por defecto la página actual si no hay ninguna seleccionada
        let currentView = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? { label: this.props.containedViews[this.props.containedViewSelected].name, id: this.props.containedViewSelected } :
            { label: this.props.navItems[this.props.navItemSelected].name, id: this.props.navItemSelected };

        let selected = this.state.existingSelected && (this.props.containedViews[this.state.existingSelected] || this.props.navItems[this.state.existingSelected]) ? (isContainedView(this.state.existingSelected) ? { label: this.props.containedViews[this.state.existingSelected].name, id: this.state.existingSelected } :
            { label: this.props.navItems[this.state.existingSelected].name, id: this.state.existingSelected }) : currentView;
        let newSelected = "";

        // if (this.state.connectMode === 'existing') {
        if (this.props.containedViews[this.state.newSelected]) {
            newSelected = this.props.containedViews[this.state.newSelected].name;
        } else if (this.props.navItems[this.state.newSelected]) {
            newSelected = this.props.navItems[this.state.newSelected].name;
        }
        // }
        let pluginType = this.props.pluginToolbar && this.props.pluginToolbar.config ? this.props.pluginToolbar.config.displayName : 'Plugin';
        return (
            /* jshint ignore:start */
            <Modal className="pageModal richMarksModal" backdrop bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>{(current ? i18n.t("marks.edit_mark_to") : i18n.t("marks.add_mark_to")) + pluginType }</Modal.Title>
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
                                    defaultValue={current ? current.title : ''}/><br/>
                            </Col>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Col xs={4} md={2}>
                                <ControlLabel>{i18n.t("marks.mark_color")}</ControlLabel>
                            </Col>
                            <Col xs={8} md={6}>
                                <FormControl ref="color"
                                    type="color"
                                    value={this.state.color || marksType.defaultColor}
                                    onChange={e=>{this.setState({ color: e.target.value });}}
                                /><br/>
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
                                        this.setState({ connectMode: "new" });
                                    }}>{i18n.t("marks.new_content")}</Radio>
                                <Radio value="existing"
                                    name="connect_mode"
                                    checked={this.state.connectMode === "existing"}
                                    onChange={e => {
                                        this.setState({ connectMode: "existing" });
                                    }}>{i18n.t("marks.existing_content")}</Radio>
                                <Radio value="external"
                                    name="connect_mode"
                                    checked={this.state.connectMode === "external"}
                                    onChange={e => {
                                        this.setState({ connectMode: "external" });
                                    }}>{i18n.t("marks.external_url")}</Radio>

                            </Col>
                        </FormGroup>
                        <Col xs={5} md={3}>
                            <FormGroup style={{ display: this.state.connectMode === "new" ? "initial" : "none" }}>
                                <FormControl componentClass="select"
                                    defaultValue={this.state.newType}
                                    style={{
                                        display: /* this.state.newType === PAGE_TYPES.SLIDE || this.state.newType === PAGE_TYPES.DOCUMENT*/ this.state.newSelected === "" ? "initial" : "none",
                                    }}
                                    onChange={e => {
                                        this.setState({ newType: e.nativeEvent.target.value });
                                    }}>
                                    <option value={PAGE_TYPES.DOCUMENT}>{i18n.t("marks.new_document")}</option>
                                    <option value={PAGE_TYPES.SLIDE}>{i18n.t("marks.new_slide")}</option>
                                </FormControl>
                                <span style={{
                                    display: this.state.newSelected === "" ? "none" : "initial",
                                }}>
                                    {i18n.t("marks.hover_message")} {newSelected}
                                </span>
                            </FormGroup>
                            <FormGroup style={{ display: this.state.connectMode === "existing" ? "initial" : "none" }}>
                                <Typeahead options={this.returnAllViews(this.props)}
                                    placeholder="Search view by name"
                                    ignoreDiacritics={false}
                                    selected={[selected]}
                                    onChange={items => {
                                        this.setState({ existingSelected: items.length !== 0 ? items[0].id : "" });
                                    }}/>
                            </FormGroup>
                            <FormGroup style={{ display: this.state.connectMode === "external" ? "initial" : "none" }}>
                                <FormControl ref="externalSelected"
                                    type="text"
                                    defaultValue={current && this.state.connectMode === "external" ? current.connection : "http://vishub.org/"}
                                    placeholder="URL"/>
                            </FormGroup>
                        </Col>
                    </Row>
                    {/* <FormGroup>
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
                            {/* Input need to have certain label like richValue*/}
                            <Col xs={4} md={2}>
                                <ControlLabel>{marksType.name ? marksType.name : i18n.t("marks.value")}</ControlLabel><br/>
                                <ControlLabel style={{ color: 'grey', fontWeight: 'lighter', marginTop: '-5px' }}>{this.props.pluginToolbar && this.props.pluginToolbar.config && this.props.pluginToolbar.config.marksType && this.props.pluginToolbar.config.marksType[0] && this.props.pluginToolbar.config.marksType[0].format ? this.props.pluginToolbar.config.marksType[0].format : "x,y"}</ControlLabel>

                            </Col>
                            <Col xs={8} md={6}>
                                <FormControl
                                    ref="value"
                                    type={this.state.actualMarkType}
                                    defaultValue={current ? current.value : (marksType.default ? marksType.default : 0)}/>
                            </Col>
                        </FormGroup>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    {/* <span>También puedes arrastrar el icono <i className="material-icons">room</i> dentro del plugin del vídeo para añadir una nueva marca</span>*/}
                    <Button onClick={e => {
                        this.props.onRichMarksModalToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let title = ReactDOM.findDOMNode(this.refs.title).value;
                        let newId = ID_PREFIX_CONTAINED_VIEW + Date.now();
                        let newMark = current && current.id ? current.id : ID_PREFIX_RICH_MARK + Date.now();
                        let connectMode = this.state.connectMode;
                        let color = this.state.color || marksType.defaultColor || '#222';
                        let connection;
                        // CV name
                        let name = title || nextAvailName(i18n.t('contained_view'), this.props.containedViews);
                        // Mark name
                        title = title || nextAvailName(i18n.t("marks.new_mark"), this.props.pluginToolbar.state.__marks, 'title');
                        switch (connectMode) {
                        case "new":
                            connection = current && current.connection && current.connectMode === 'new' ?
                                current.connection :
                                {
                                    id: newId,
                                    parent: { [this.props.boxSelected]: [newMark] },
                                    name: name,
                                    boxes: [],
                                    type: this.state.newType,
                                    extraFiles: {},
                                    header: {
                                        elementContent: {
                                            documentTitle: name,
                                            documentSubTitle: '',
                                            numPage: '' },
                                        display: {
                                            courseTitle: 'hidden',
                                            documentTitle: 'expanded',
                                            documentSubTitle: 'hidden',
                                            breadcrumb: "reduced",
                                            pageNumber: "hidden" },
                                    },
                                };

                            break;
                        case "existing":
                            connection = selected.id || this.props.navItemSelected;
                            break;
                        case "external":
                            connection = ReactDOM.findDOMNode(this.refs.externalSelected).value;
                            break;
                        }
                        let displayMode = this.state.displayMode;
                        let value = ReactDOM.findDOMNode(this.refs.value).value;
                        // First of all we need to check if the plugin creator has provided a function to check if the input value is allowed
                        if(this.props.validateValueInput) {
                            let val = this.props.validateValueInput(value);
                            // If the value is not allowed, we show an alert with the predefined message and we abort the Save operation
                            if (val && val.isWrong) {
                                this.setState({ showAlert: true, alertMsg: (val.message ? val.message : i18n.t("mark_input")) });
                                return;
                            // If the value is allowed we check if it has been modified (like rounded decimals) and we assign it to value
                            } else if (val && val.value) {
                                value = val.value;
                            }
                        }
                        this.props.onRichMarkUpdated({ id: (current ? current.id : newMark), title, connectMode, connection, displayMode, value, color }, this.state.newSelected === "");
                        if(connectMode === 'new' && !this.props.toolbars[connection.id] && this.state.newType === PAGE_TYPES.DOCUMENT) {
                            this.props.onBoxAdded({ parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now() }, false, false);
                        }
                        this.props.onRichMarksModalToggled();

                    }}>Save changes</Button>
                </Modal.Footer>
                <Alert className="pageModal"
                    show={this.state.showAlert}
                    hasHeader
                    title={i18n.t("marks.wrong_value")}
                    closeButton onClose={()=>{this.setState({ showAlert: false });}}>
                    <span> {this.state.alertMsg} </span>
                </Alert>
            </Modal>
            /* jshint ignore:end */
        );

    }

    /*
    * Maping method that joins cointainedViews and navItems in array but excluding the ones that can't be
    * */
    returnAllViews(props) {
        let viewNames = [];
        props.navItemsIds.map(id => {
            if (id === 0) {
                return;
            }
            if (props.navItems[id].hidden) {
                return;
            }
            if(!Dali.Config.sections_have_content && isSection(id)) {
                return;
            }
            // We need to turn off this requisite in case there is no more pages available and we need to link to the same page the box is in
            /* if(props.containedViewSelected === 0 && props.navItemSelected === id){
                return;
            }*/

            viewNames.push({ label: props.navItems[id].name, id: id });
        });
        Object.keys(props.containedViews).map(cv=>{
            if(cv === 0) {
                return;
            }

            if(props.containedViewSelected === cv) {
                return;
            }

            viewNames.push({ label: props.containedViews[cv].name, id: props.containedViews[cv].id });
        });
        return viewNames;
    }

    /*
    * Method used to remap navItems and containedViews together
    * */
    remapInObject(...objects) {
        return Object.assign({}, ...objects);
    }

}
