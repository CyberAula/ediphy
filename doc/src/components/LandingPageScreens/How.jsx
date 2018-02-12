import React, { Component } from 'react';
import Wrapper from './Wrapper';
import { Col, Row, Well } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import i18n from 'i18next';
/* eslint-disable react/prop-types */
export default class How extends Component {
    render() {
        return (<Wrapper id="how" >
            <Row>
                <Col xs={12} lg={6} lgPush={3} md={10} mdPush={1}>
                    <h2 dangerouslySetInnerHTML={{ __html: i18n.t("Home.How.Header") }} />
                    <h3>{i18n.t("Home.How.Subheader")}</h3>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={4}>
                    <Well>
                        <h4><i className="material-icons how_icon">help_outline</i><br/>{i18n.t("About.UserManual")}</h4>
                        {i18n.t("About.UserManual_desc")}<Link to="/manual"><span className="how_link">{i18n.t("About.UserManual")}</span></Link>
                    </Well>
                </Col>
                <Col xs={12} md={4}>
                    <Well>
                        <h4><i className="material-icons how_icon">build</i><br/>{i18n.t("About.PluginAPI")}</h4>
                        {i18n.t("About.PluginAPI_desc")}<Link to="/api"><span className="how_link">{i18n.t("About.PluginAPI2")}</span></Link>
                    </Well>
                </Col>
                <Col xs={12} md={4}>
                    <Well>
                        <h4><i className="material-icons how_icon">code</i><br/>{i18n.t("About.Documentation")} </h4>
                        {i18n.t("About.Documentation_desc")}<Link to="/doc"><span className="how_link"> {i18n.t("About.Documentation2")}</span></Link>
                    </Well>
                </Col>
            </Row>
        </Wrapper>);
    }
}
/* eslint-enable react/prop-types */
