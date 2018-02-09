import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Jumbotron, Grid, Col, Row, Well } from 'react-bootstrap';
import icon from '../img/ging.png';
import react from '../img/React-icon.svg';
import redux from '../img/Redux-icon.svg';
import git from '../img/Github-icon.svg';
import plugin from '../img/plugin.svg';
import Markdown from 'react-remarkable';
import { WIKI_BASE_URL } from './../content';
import i18n from 'i18next';

export default class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            changelog: null,
            about: null,
        };
    }
    render() {
        let changelog = this.state.changelog || "";
        let about = this.state.about || "";
        return (
            <Grid className="bsGrid">
                <br/>
                <Jumbotron>
                    <img src={icon} className="mainLogo" alt=""/>
                    <h1><b>ED</b>iphy</h1>
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
                        <a href="https://github.com/ging/ediphy/">
                            <img src={git} className="homeImg" alt=""/>
                        </a>
                        <h3>{i18n.t("Home.Github")}</h3>
                    </Col>
                </Row>
                <div className="markdownContainer">
                    <Markdown>
                        { about }
                        <Row>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">help</i>{i18n.t("About.UserManual")}</h3>
                                    {i18n.t("About.UserManual_desc")}<Link to="/manual"><span>{i18n.t("About.UserManual")}</span></Link>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">build</i>{i18n.t("About.PluginAPI")}</h3>
                                    {i18n.t("About.PluginAPI_desc")}<Link to="/api"><span>{i18n.t("About.PluginAPI2")}</span></Link>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">code</i>{i18n.t("About.Documentation")} </h3>
                                    {i18n.t("About.Documentation_desc")}<Link to="/doc"><span> {i18n.t("About.Documentation2")}</span></Link>
                                </Well>
                            </Col>
                        </Row>
                        { changelog }
                    </Markdown>
                </div>
            </Grid>
        );
    }
    componentDidMount() {
        let lang = i18n.t("lang");
        lang = lang === 'en' ? "" : ("_" + lang);
        let urlCl = WIKI_BASE_URL + 'CHANGELOG' + lang + '.md';
        $.ajax({
            url: urlCl,
            method: "GET" })
            .done(function(data) {
                this.setState({ changelog: data });
                let tableList = $('table');
                tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

            }.bind(this))
            .fail(function(xhr) {
                // eslint-disable-next-line no-console
                console.error('error', xhr);
                this.setState({ changelog: "" });
            }.bind(this));
        let urlA = WIKI_BASE_URL + 'About' + lang + '.md';
        $.ajax({
            url: urlA,
            method: "GET" })
            .done(function(data) {
                this.setState({ about: data });
                let tableList = $('table');
                tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

            }.bind(this))
            .fail(function(xhr) {
                // eslint-disable-next-line no-console
                console.error('error', xhr);
                this.setState({ about: "" });
            }.bind(this));
    }
}
