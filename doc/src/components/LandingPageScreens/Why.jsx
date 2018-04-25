import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import react from '../../img/React-icon.svg';
import redux from '../../img/Redux-icon.svg';
import git from '../../img/Github-icon.svg';
import plugin from '../../img/plugin.svg';
import i18n from 'i18next';
import Wrapper from './Wrapper';
/* eslint-disable react/prop-types */
export default class Why extends Component {
    render() {
        return (<Wrapper id="why" >
            <Row>
                <Col xs={12}>
                    <h2 dangerouslySetInnerHTML={{ __html: i18n.t("Home.Why.Header") }} />
                    <p>{i18n.t("Home.Why.Subheader1")}<br/>
                        {i18n.t("Home.Why.Subheader2")}</p>
                </Col>
            </Row>
            <Row className="tools">
                <Col xs={12} md={4} className="mainPageBlock">
                    <Link to="api">
                        <img src={plugin} className="homeImg" alt=""/>
                    </Link>
                    <h3>{i18n.t("Home.PluginBased")}</h3>
                </Col>
                <Col xs={12} md={4} className="mainPageBlock">
                    <a href="https://facebook.github.io/react/">
                        <img src={react} className="homeImg" alt=""/>
                    </a>
                    <a href="http://redux.js.org/docs/introduction/">
                        <img src={redux} className="homeImg" alt=""/>
                    </a>
                    <h3>{i18n.t("Home.ReactRedux")}</h3>
                </Col>

                <Col xs={12} md={4} className="mainPageBlock">
                    <a href="https://github.com/ging/ediphy/">
                        <img src={git} className="homeImg" alt=""/>
                    </a>
                    <h3>{i18n.t("Home.Github")}</h3>
                </Col>
            </Row>
        </Wrapper>);
    }
}
/* eslint-enable react/prop-types */
