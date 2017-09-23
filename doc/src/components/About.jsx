import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Grid, Col, Row, Well } from 'react-bootstrap';
import Markdown from 'react-remarkable';
import { WIKI_BASE_URL } from './../content';

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
                                    <h3><i className="material-icons">help</i> Manual de usuario</h3>
                                    Si eres un usuario que desea aprender a utilizar Dalí, accede al <LinkContainer to="/manual"><span>Manual de usuario</span></LinkContainer>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">build</i> Plugin API</h3>
                                    Si deseas crear tu propio plugin para completar tu instancia de Dalí, consulta la <LinkContainer to="/api"><span>API de Plugins</span></LinkContainer>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">code</i> Documentación</h3>
                                    Si deseas contribuír o crear tu propia versión, consulta la <LinkContainer to="/doc"><span>documentación de desarrolladores</span></LinkContainer>
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
        let urlCl = WIKI_BASE_URL + 'CHANGELOG.md';
        $.ajax({
            url: urlCl,
            method: "GET" })
            .done(function(data) {
                this.setState({ changelog: data });
                let tableList = $('table');
                tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

            }.bind(this))
            .fail(function(xhr) {
                console.error('error', xhr);
                this.setState({ changelog: "" });
            }.bind(this));
        let urlA = WIKI_BASE_URL + 'About.md';
        $.ajax({
            url: urlA,
            method: "GET" })
            .done(function(data) {
                this.setState({ about: data });
                let tableList = $('table');
                tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

            }.bind(this))
            .fail(function(xhr) {
                console.error('error', xhr);
                this.setState({ about: "" });
            }.bind(this));
    }
}
