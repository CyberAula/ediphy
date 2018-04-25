import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Col, Row, Well } from 'react-bootstrap';
import Markdown from 'react-remarkable';
import { WIKI_BASE_URL } from './../content';
import i18n from 'i18next';
/* eslint-disable react/prop-types */

export default class About extends Component {
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

/* eslint-enable react/prop-types */
