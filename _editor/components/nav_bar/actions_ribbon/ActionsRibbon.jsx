import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import i18n from "i18next";
import './_ActionsRibbon.scss';
import Alert from '../../common/alert/Alert';

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
        return (
            <Col id="ActionRibbon" md={12} xs={12}
                style={{
                    height: this.props.ribbonHeight,
                    overflowY: 'hidden',
                }} ref="holder">
                <div id="Actions">
                    {actions.map((act, ind)=>{
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
        return <Alert show={state} onClose={callback} className="pageModal" >
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
