import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import i18n from "i18next";
import './_ActionsRibbon.scss';
import Alert from '../../common/alert/Alert';
import Clipboard from '../../clipboard/Clipboard';
import { isSlide, isSortableBox } from '../../../../common/utils';
export default class ActionsRibbon extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            clipboardAlert: false,
        };
    }
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let actions = ["copy", "cut", "paste"];
        let onClick = (e)=>{this.setState({ clipboardAlert: !this.state.clipboardAlert });};

        let page = this.props.containedViews[this.props.containedViewSelected] ? this.props.containedViews[this.props.containedViewSelected] : (
            this.props.navItems[this.props.navItemSelected] ? this.props.navItems[this.props.navItemSelected] : null
        );
        let slide = page && isSlide(page.type);
        let container = 0;
        let box_layer = page.boxes.indexOf(this.props.boxSelected);
        let disable_bt = this.props.boxSelected === -1 || page.boxes.length === 1;
        let boxes = page.boxes;
        // let index = Object.keys(this.props.boxes).length;
        // TODO:revisar este código para que puedan funcionar las capas en los documentos (posición absoluta combinada con relativa...mal)
        /* if (!slide && this.props.boxes[this.props.boxSelected] !== undefined && index > 1) {
            container = this.props.boxes[this.props.boxSelected].container;
            boxes = this.props.boxes[page.boxes[0]].sortableContainers[container].children;
            box_layer = this.props.boxes[page.boxes[0]].sortableContainers[container].children.indexOf(this.props.boxSelected);
            disable_bt = this.props.boxSelected === -1 || page.boxes.length === 2;
        } */
        return (
            <Col id="ActionRibbon" md={12} xs={12}
                style={{
                    height: this.props.ribbonHeight,
                    overflowY: 'hidden',
                }} ref="holder">
                <div id="Actions">
                    { slide ? [<button key={'-4'} className="ActionBtn" disabled={ disable_bt || box_layer === boxes.length - 1 } onClick={() => {
                        this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'front', boxes);}}>
                        <i className="material-icons">flip_to_front</i>
                        <span className="hideonresize">{i18n.t("order.BringtoFront")}</span>
                    </button>,
                    <button key={'-6'} className="ActionBtn" disabled={disable_bt || box_layer === boxes.length - 1} onClick={() => {
                        this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'ahead', boxes);}}>
                        <i className="material-icons">flip_to_front</i>
                        <span className="hideonresize">{i18n.t("order.Ahead")}</span>
                    </button>,
                    <button key={'-7'} className="ActionBtn" disabled={disable_bt || box_layer === 0} onClick={() => {
                        this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'behind', boxes);}}>
                        <i className="material-icons">flip_to_back</i>
                        <span className="hideonresize">{i18n.t("order.Behind")}</span>
                    </button>,
                    <button key={'-5'} className="ActionBtn" disabled={disable_bt || box_layer === 0} onClick={() => {
                        this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'back', boxes);}}>
                        <i className="material-icons">flip_to_back</i>
                        <span className="hideonresize">{i18n.t("order.SendtoBack")}</span>
                    </button>,
                    <span id="vs" key="-8" />,
                        (<button key={'-1'} className={this.props.grid ? "ActionBtn active" : "ActionBtn"} onClick={this.props.onGridToggle}><i
                            className="material-icons">grid_on</i> <span
                            className="hideonresize">{i18n.t("Grid")}</span></button>),
                        <span id="vs" key="-3" />] : null }
                    <Clipboard boxes={this.props.boxes}
                        boxSelected={this.props.boxSelected}
                        navItemSelected={this.props.navItemSelected}
                        containedViewSelected={this.props.containedViewSelected}
                        navItems={this.props.navItems}
                        containedViews={this.props.containedViews}
                        toolbars={this.props.toolbars}
                        onTextEditorToggled={this.props.onTextEditorToggled}
                        onBoxPasted={this.props.onBoxPasted}
                        onBoxDeleted={this.props.onBoxDeleted} >
                        { actions.map((act, ind)=>{
                            return <button key={ind} className="ActionBtn" name={act} onClick={onClick}><i
                                className="material-icons">{"content_" + act}</i> <span
                                className="hideonresize">{i18n.t("clipboard." + act)}</span></button>;
                        })}
                        <button key={"duplicate"} className="ActionBtn" name={"duplicate"} ><i
                            className="material-icons">{"content_copy"}</i> <span
                            className="hideonresize">{i18n.t("clipboard.duplicate")}</span></button>
                    </Clipboard>

                    {this.createAlert(this.state.clipboardAlert, onClick)}
                </div>
            </Col>
        );
    }
    createAlert(state, callback) {
        return <Alert show={state} onClose={callback} className="pageModal" key="-2">
            <p>{i18n.t("clipboard.msg")}</p>
            <Col xs={4}>
                <h2>Ctrl+C</h2>
                <div>{i18n.t("clipboard.to")} {i18n.t("clipboard.copy").toLowerCase()}</div>
            </Col>
            <Col xs={4}>
                <h2>Ctrl+X</h2>
                <div>{i18n.t("clipboard.to")} {i18n.t("clipboard.cut").toLowerCase()}</div>
            </Col>
            <Col xs={4}>
                <h2>Ctrl+V</h2>
                <div>{i18n.t("clipboard.to")} {i18n.t("clipboard.paste").toLowerCase()}</div>
            </Col>
            <br/>

        </Alert>;
    }
}

ActionsRibbon.propTypes = {
    /**
     * Id of the page selected
     */
    navItemSelected: PropTypes.any,
    /**
     * Id of the contained view selected
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing pages and sections
     */
    navItems: PropTypes.object,
    /**
     * Object that holds contained views
     */
    containedViews: PropTypes.object,
    /**
     * Height of the ribbon in px (contains the string px)
     */
    ribbonHeight: PropTypes.string,
    /**
     * Toggle grid on slides function
     */
    onGridToggle: PropTypes.func,
    /**
     * Whether grid is disabled or not
     */
    grid: PropTypes.bool,
};
