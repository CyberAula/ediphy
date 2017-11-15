import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Grid, Col, Row } from 'react-bootstrap';
import icon from '../img/ging.png';
import react from '../img/React-icon.svg';
import redux from '../img/Redux-icon.svg';
import git from '../img/Github-icon.svg';
import plugin from '../img/plugin.svg';
import i18n from 'i18next';
export default class Content extends Component {

    render() {
        return (
            <Grid className="bsGrid">
                <br/>
                <Jumbotron>
                    <img src={icon} className="mainLogo" alt=""/>
                    <h1><b>Dalí</b> Editor</h1>
                    <h2>{i18n.t("Home.Description")}</h2>
                </Jumbotron>
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
                        <a href="https://github.com/ging/dali_editor/">
                            <img src={git} className="homeImg" alt=""/>
                        </a>
                        <h3>{i18n.t("Home.Github")}</h3>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
