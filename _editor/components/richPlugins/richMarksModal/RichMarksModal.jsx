import React, { Component } from 'react';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './../../../../node_modules/rc-color-picker/assets/index.css';
import { connect } from "react-redux";
import Picker from 'rc-color-picker';
import { Modal, Button, Row, Col, FormGroup, ControlLabel, FormControl, Radio } from 'react-bootstrap';

import Alert from './../../common/alert/Alert';
import { isSection, isContainedView, nextAvailName, makeBoxes } from '../../../../common/utils';
import { ID_PREFIX_RICH_MARK, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, PAGE_TYPES } from '../../../../common/constants';

import './_richMarksModal.scss';
import TemplatesModal from "../../carousel/templatesModal/TemplatesModal";

/**
 * Modal component to edit marks' configuration
 */
class RichMarksModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            connectMode: "new",
            displayMode: "navigate",
            newSelected: this.props.navItems[this.props.navItemSelected] ? this.props.navItems[this.props.navItemSelected].type : "",
            existingSelected: "",
            newType: PAGE_TYPES.SLIDE,
            viewNames: this.returnAllViews(this.props),
            showAlert: false,
            showTemplates: false,
            boxes: [],
        };
    }

    /**
     * Before component receives props
     * Updates component's state with toolbar's state info
     * @param nextProps
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        let current = nextProps.currentRichMark;
        let allViews = this.returnAllViews(nextProps);
        if (!this.props.visible) {
            if (current) {
                this.setState({
                    viewNames: allViews,
                    color: current.color,
                    connectMode: current.connectMode || "new",
                    displayMode: current.displayMode || "navigate",
                    newSelected: (current.connectMode === "new" ? current.connection : ""),
                    newType: nextProps.navItems[nextProps.navItemSelected] ? nextProps.navItems[nextProps.navItemSelected].type : "",
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
                    newType: nextProps.navItems[nextProps.navItemSelected] ? nextProps.navItems[nextProps.navItemSelected].type : "",
                    existingSelected: "",
                });
            }

        }

    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        // TODO refactor con ? ??
        let marksType = this.props.pluginToolbar?.pluginId
                        && Ediphy.Plugins.get(this.props.pluginToolbar.pluginId)?.getConfig()?.marksType
            ? Ediphy.Plugins.get(this.props.pluginToolbar.pluginId).getConfig().marksType : {};
        let current = this.props.currentRichMark;
        let selected = this.state.existingSelected && (this.props.containedViews[this.state.existingSelected] || this.props.navItems[this.state.existingSelected]) ? (isContainedView(this.state.existingSelected) ? { label: this.props.containedViews[this.state.existingSelected].name, id: this.state.existingSelected } :
            { label: this.props.navItems[this.state.existingSelected].name, id: this.state.existingSelected }) : this.returnAllViews(this.props)[0] || [];
        let newSelected = "";
        if (this.props.viewToolbars[this.state.newSelected] !== undefined) {
            newSelected = this.props.viewToolbars[this.state.newSelected].viewName;
        }
        let plugin = (this.props.pluginToolbar && this.props.pluginToolbar.pluginId && Ediphy.Plugins.get(this.props.pluginToolbar.pluginId)) ? Ediphy.Plugins.get(this.props.pluginToolbar.pluginId) : undefined;
        let defaultMarkValue = plugin ? Ediphy.Plugins.get(this.props.pluginToolbar.pluginId).getDefaultMarkValue(this.props.pluginToolbar.state, this.props.boxSelected) : '';
        let pluginType = (this.props.pluginToolbar && this.props.pluginToolbar.config) ? this.props.pluginToolbar.config.displayName : 'Plugin';
        let config = plugin ? plugin.getConfig() : null;
        let newId = "";
        return (
            <Modal className="pageModal richMarksModal" backdrop bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title><i style={{ fontSize: '18px' }} className="material-icons">room</i> {(current ? i18n.t("marks.edit_mark_to") : i18n.t("marks.add_mark_to")) + pluginType }</Modal.Title>
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

                                <Picker.Panel className="colorPanel"
                                    placement="bottomLeft"
                                    animation="slide-up"
                                    enableAlpha={false}
                                    color={this.state.color || marksType.defaultColor}
                                    onChange={e=>{this.setState({ color: e.color });}}
                                    mode="RGB" />
                                <br/>
                            </Col>
                        </FormGroup>
                    </Row>
                    <Row>
                        <Col xs={4} md={2} />
                        <Col xs={6} md={5}>
                            <div style={{ display: this.state.newSelected === "" ? "none" : "initial" }}>
                                {i18n.t("marks.hover_message")} <strong>{newSelected}</strong>
                            </div>
                        </Col>
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
                                    onChange={() => {
                                        this.setState({ connectMode: "new" });
                                    }}>{i18n.t("marks.new_content")}</Radio>
                                <Radio value="existing"
                                    name="connect_mode"
                                    disabled={!this.returnAllViews(this.props).length > 0}
                                    checked={this.state.connectMode === "existing"}
                                    onChange={() => {
                                        this.setState({ connectMode: "existing" });
                                    }}>{i18n.t("marks.existing_content")}</Radio>
                                <Radio value="external"
                                    name="connect_mode"
                                    checked={this.state.connectMode === "external"}
                                    onChange={() => {
                                        this.setState({ connectMode: "external" });
                                    }}>{i18n.t("marks.external_url")}</Radio>
                                <Radio value="popup"
                                    name="connect_mode"
                                    checked={this.state.connectMode === "popup"}
                                    onChange={() => {
                                        this.setState({ connectMode: "popup" });
                                    }}>{i18n.t("marks.popup")}</Radio>

                            </Col>
                        </FormGroup>
                        <Col xs={5} md={3}>
                            <FormGroup style={{ display: this.state.connectMode === "new" ? "block" : "none" }}>
                                <ControlLabel style={{
                                    display: this.state.newSelected === "" ? "initial" : "none",
                                }}>{i18n.t("marks.new_content_label")}</ControlLabel>
                                <div className={"typeSelector"}>
                                    <FormControl componentClass="select"
                                        defaultValue={this.state.newType}
                                        style={{
                                            display: this.state.newSelected === "" ? "initial" : "none",
                                            width: "80%",
                                        }}
                                        onChange={e => {
                                            this.setState({ newType: e.nativeEvent.target.value });
                                        }}>
                                        <option value={PAGE_TYPES.DOCUMENT}>{i18n.t("marks.new_document")}</option>
                                        <option value={PAGE_TYPES.SLIDE}>{i18n.t("marks.new_slide")}</option>
                                    </FormControl>

                                    <Button className={"templateSettingMarks"} style={{ display: this.state.newType === "slide" ? 'flex' : 'none' }} onClick={this.toggleTemplatesModal} > <i className={"material-icons"}>settings</i> </Button>
                                </div>
                            </FormGroup>
                            <FormGroup style={{ display: this.state.connectMode === "existing" ? "initial" : "none" }}>
                                <ControlLabel>{i18n.t("marks.existing_content_label")}</ControlLabel>
                                {this.state.connectMode === "existing" && <FormControl componentClass="select" onChange={e=>{this.setState({ existingSelected: e.target.value });}}>
                                    {this.returnAllViews(this.props).map(view=>{
                                        return <option key={view.id} value={view.id}>{this.props.viewToolbars[view.id].viewName}</option>;
                                    })}
                                </FormControl>}
                            </FormGroup>

                            <FormGroup style={{ display: this.state.connectMode === "external" ? "initial" : "none" }}>
                                <ControlLabel>{i18n.t("marks.external_url_label")}</ControlLabel>
                                <FormControl ref="externalSelected"
                                    type="text"
                                    defaultValue={current && this.state.connectMode === "external" ? current.connection : "http://vishub.org/"}
                                    placeholder="URL"/>
                            </FormGroup>
                            <FormGroup style={{ display: this.state.connectMode === "popup" ? "initial" : "none" }}>
                                <ControlLabel>{i18n.t("marks.popup_label")}</ControlLabel>
                                <FormControl ref="popupSelected" componentClass="textarea"
                                    defaultValue={current && this.state.connectMode === "popup" ? current.connection : ""}
                                    placeholder={i18n.t("marks.popup_placeholder")}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <FormGroup>
                            {/* Input need to have certain label like richValue*/}
                            <Col xs={4} md={2}>
                                <ControlLabel>{marksType.name ? marksType.name : i18n.t("marks.value")}</ControlLabel><br/>
                                <ControlLabel style={{ color: 'grey', fontWeight: 'lighter', marginTop: '-5px' }}>
                                    {(config &&
                                    config.marksType &&
                                    config.marksType &&
                                    config.marksType.format) ?
                                        config.marksType.format : "x,y"}
                                </ControlLabel>

                            </Col>
                            <Col xs={8} md={6}>
                                <FormControl
                                    key={this.props.markCursorValue}
                                    ref="value"
                                    type={this.state.actualMarkType}
                                    defaultValue={this.props.markCursorValue ? this.props.markCursorValue : (current ? current.value : (defaultMarkValue ? defaultMarkValue : 0))}/>
                            </Col>
                        </FormGroup>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    {/* <span>También puedes arrastrar el icono <i className="material-icons">room</i> dentro del plugin del vídeo para añadir una nueva marca</span>*/}
                    <Button onClick={() => {
                        this.props.handleMarks.onRichMarksModalToggled();
                        this.restoreDefaultTemplate();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={() => {
                        let title = ReactDOM.findDOMNode(this.refs.title).value;
                        newId = ID_PREFIX_CONTAINED_VIEW + Date.now();
                        let newMark = current && current.id ? current.id : ID_PREFIX_RICH_MARK + Date.now();
                        let connectMode = this.state.connectMode;
                        let color = this.state.color || marksType.defaultColor || '#222222';
                        let connection = selected.id;
                        // CV name
                        let name = connectMode === "existing" ? this.props.viewToolbars[connection].viewName : nextAvailName(i18n.t('contained_view'), this.props.viewToolbars, 'viewName');
                        // Mark name
                        title = title || nextAvailName(i18n.t("marks.new_mark"), this.props.marks, 'title');
                        let markState;

                        let value = ReactDOM.findDOMNode(this.refs.value).value;
                        // let value = this.props.markCursorValue;
                        // First of all we need to check if the plugin creator has provided a function to check if the input value is allowed
                        if (plugin && plugin.validateValueInput) {
                            let val = plugin.validateValueInput(value);
                            // If the value is not allowed, we show an alert with the predefined message and we abort the Save operation
                            if (val && val.isWrong) {
                                this.setState({ showAlert: true, alertMsg: (val.message ? val.message : i18n.t("mark_input")) });
                                return;
                            // If the value is allowed we check if it has been modified (like rounded decimals) and we assign it to value
                            } else if (val && val.value) {
                                value = val.value;
                            }
                        }
                        let sortable_id = ID_PREFIX_SORTABLE_BOX + Date.now();
                        switch (connectMode) {
                        case "new":
                            markState = {
                                mark: {
                                    id: newMark,
                                    origin: this.props.boxSelected,
                                    title: title,
                                    connection: newId,
                                    color: color,
                                    connectMode: connectMode,
                                    displayMode: this.state.displayMode,
                                    value: value,
                                },
                                view: {
                                    info: "new",
                                    type: this.state.newType,
                                    id: newId,
                                    parent: { [newMark]: this.props.boxSelected },
                                    // name: name,
                                    boxes: this.state.newType === "document" ? [sortable_id] : [],
                                    extraFiles: {},
                                },
                                viewToolbar: {
                                    id: newId,
                                    doc_type: this.state.newType,
                                    viewName: name,
                                    hideTitles: this.state.boxes.length > 0,
                                },
                            };
                            break;
                        case "existing":
                            markState = {
                                mark: {
                                    id: newMark,
                                    origin: this.props.boxSelected,
                                    title: title,
                                    connection: connection,
                                    color: color,
                                    connectMode: connectMode,
                                    displayMode: this.state.displayMode,
                                    value: value,
                                },
                                view: {
                                    info: "new",
                                    type: this.state.newType,
                                    id: newId,
                                    parent: this.props.boxSelected,
                                    name: name,
                                    boxes: [],
                                    extraFiles: {},
                                },
                            };
                            break;
                        case "external":
                            markState = {
                                mark: {
                                    id: newMark,
                                    origin: this.props.boxSelected,
                                    title: title,
                                    connection: ReactDOM.findDOMNode(this.refs.externalSelected).value,
                                    color: color,
                                    connectMode: connectMode,
                                    displayMode: this.state.displayMode,
                                    value: value,
                                },
                            };
                            break;
                        case "popup":
                            markState = {
                                mark: {
                                    id: newMark,
                                    origin: this.props.boxSelected,
                                    title: title,
                                    connection: ReactDOM.findDOMNode(this.refs.popupSelected).value,
                                    color: color,
                                    connectMode: connectMode,
                                    displayMode: this.state.displayMode,
                                    value: value,
                                },
                            };
                            break;
                        }
                        if(this.props.marks[newMark] === undefined) {
                            this.props.handleMarks.onRichMarkAdded(markState.mark, markState.view, markState.viewToolbar);
                        } else{
                            this.props.handleMarks.onRichMarkUpdated(markState.mark, markState.view, markState.viewToolbar);
                        }
                        this.generateTemplateBoxes(this.state.boxes, newId);
                        this.restoreDefaultTemplate();
                        this.props.handleMarks.onRichMarksModalToggled();
                    }}>{i18n.t("marks.save_changes")}</Button>
                </Modal.Footer>
                <Alert className="pageModal"
                    show={this.state.showAlert}
                    hasHeader
                    title={i18n.t("marks.wrong_value")}
                    closeButton onClose={()=>{this.setState({ showAlert: false });}}>
                    <span> {this.state.alertMsg} </span>
                </Alert>
                <TemplatesModal
                    fromRich
                    show={this.state.showTemplates}
                    close={this.toggleTemplatesModal}
                    navItems={this.props.navItems}
                    boxes={this.props.boxes}
                    onIndexSelected={this.props.onIndexSelected}
                    indexSelected={this.props.indexSelected}
                    onBoxAdded={this.props.onBoxAdded}
                    calculatePosition={this.calculatePosition}
                    templateClick={this.templateClick}
                    idSlide = {newId || ""}/>
                {/* <TemplatesModalRich*/}
                {/*    show={this.state.showTemplates}*/}
                {/*    close={this.toggleTemplatesModal}*/}
                {/*    navItems={this.props.navItems}*/}
                {/*    boxes={this.props.boxes}*/}
                {/*    onIndexSelected={this.props.onIndexSelected}*/}
                {/*    indexSelected={this.props.indexSelected}*/}
                {/*    onBoxAdded={this.props.onBoxAdded}*/}
                {/*    calculatePosition={this.calculatePosition}*/}
                {/*    templateClick={this.templateClick}*/}
                {/*    idSlide = {newId || ""}/>*/}
            </Modal>
        );

    }

    /**
     * Mapping method that joins contained views and navItems in array but excluding the ones that can't be
     * @param props Component's props
     * @returns {Array} Array of views
     */
    returnAllViews = (props) => {
        let viewNames = [];
        props.navItemsIds.map(id => {
            if (id === 0) {
                return;
            }
            if (props.navItems[id].hidden) {
                return;
            }
            if(!Ediphy.Config.sections_have_content && isSection(id)) {
                return;
            }
            // We need to turn off this requisite in case there is no more pages available and we need to link to the same page the box is in
            if(props.containedViewSelected === 0 && props.navItemSelected === id) {
                return;
            }

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
    };

    /**
     * Method used to remap navItems and containedViews together
     * @param objects
     * @returns {*}
     */
    remapInObject = (...objects) => {
        return Object.assign({}, ...objects);
    };

    toggleModal = (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 27 && this.props.visible) {
            this.props.handleMarks.onRichMarksModalToggled();
        }
    };

    /**
     * Shows/Hides the Import file modal
     */
    toggleTemplatesModal = () => {
        this.setState((prevState) => ({
            showTemplates: !prevState.showTemplates,
        }));
    };

    templateClick = (boxes) => {
        this.setState({
            boxes: boxes,
        });
    };

    restoreDefaultTemplate = () => {
        this.setState({
            boxes: [],
        });
    };

    generateTemplateBoxes = (boxes, newId) => {
        if(boxes.length > 0) {
            makeBoxes(boxes, newId, this.props);
        }
    };

    componentDidMount() {
        window.addEventListener('keyup', this.toggleModal);
    }
    componentWillUnmount() {
        window.removeEventListener('keyup', this.toggleModal);
    }
}

function mapStateToProps(state) {
    return{
        boxSelected: state.undoGroup.present.boxSelected,
        pluginToolbar: state.undoGroup.present.pluginToolbarsById[state.undoGroup.present.boxSelected],
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        navItemSelected: state.undoGroup.present.navItemSelected,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        markCursorValue: state.reactUI.markCursorValue,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        marks: state.undoGroup.present.marksById,
        navItems: state.undoGroup.present.navItemsById,
        navItemsIds: state.undoGroup.present.navItemsIds,
        currentRichMark: state.reactUI.currentRichMark,
        visible: state.reactUI.richMarksVisible,
    };
}

export default connect(mapStateToProps)(RichMarksModal);

RichMarksModal.propTypes = {
    /**
     * Caja seleccionada
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Toolbar del plugin
     */
    pluginToolbar: PropTypes.object,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Indica si se muestra o oculta el modal de edición de marcas
     */
    visible: PropTypes.any.isRequired,
    /**
     * Mark currently being edited
     */
    currentRichMark: PropTypes.any,
    /**
      * Cursor value when creating mark (coordinates)
      */
    markCursorValue: PropTypes.any,
    /**
     * Object containing all the marks
     */
    marks: PropTypes.object,
    /**
     * Object containing all the viewTollbars
     */
    viewToolbars: PropTypes.object,
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Function for adding a new box
     */
    onBoxAdded: PropTypes.func,
    /**
     * Function for getting the id of the selected template
     */
    onIndexSelected: PropTypes.func,
    /**
     * Contains the id of the selected template
     */
    indexSelected: PropTypes.func,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object.isRequired,
};
