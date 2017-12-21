import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import i18n from "i18next";
import './_ActionsRibbon.scss';
import Alert from '../../common/alert/Alert';
import { isSlide } from '../../../../common/utils';
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

        return (
            <Col id="ActionRibbon" md={12} xs={12}
                style={{
                    height: this.props.ribbonHeight,
                    overflowY: 'hidden',
                }} ref="holder">
                <div id="Actions">
                    { slide ? [
                        (<button key={'-1'} className="navButton ActionBtn" onClick={this.props.onGridToggle}><i
                            className="material-icons">{this.props.grid ? "grid_on" : "grid_off"}</i> <span
                            className="hideonresize">{i18n.t("Grid")}</span></button>),
                        <span id="vs" key="-3" />] : null }
                    { actions.map((act, ind)=>{
                        return <button key={ind} className="navButton ActionBtn" onClick={onClick}><i
                            className="material-icons">{"content_" + act}</i> <span
                            className="hideonresize">{i18n.t("clipboard." + act)}</span></button>;
                    })}
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
