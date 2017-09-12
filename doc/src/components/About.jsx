import React, { Component } from 'react';
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
                                    Si eres un usuario que desea aprender a utilizar Dalí, accede al <a href="#" onClick={()=>{this.props.handleNav(3, 0);}}>Manual de usuario</a>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">build</i> Plugin API</h3>
                                    Si deseas crear tu propio plugin para completar tu instancia de Dalí, consulta la <a href="#" onClick={()=>{this.props.handleNav(4, 1);}}>API de Plugins</a>
                                </Well>
                            </Col>
                            <Col xs={12} md={4}>
                                <Well>
                                    <h3><i className="material-icons">code</i> Documentación</h3>
                                    Si deseas contribuír al proyecto, consulta la <a href="#" onClick={()=>{this.props.handleNav(4, 2);}}>documentación de desarrolladores</a>
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
