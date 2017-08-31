import React, { Component } from 'react';
import { Grid, Col, Row, Well } from 'react-bootstrap';
import Markdown from 'react-remarkable';
import { WIKI_BASE_URL } from './../content';

export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: null,
        };
    }
    render() {
        let content = this.state.content || "";
        return (
            <Grid>
                <div className="markdownContainer">
                    <Markdown>
                        { content }
                    </Markdown>
                </div>
            </Grid>
        );
    }

    componentDidMount() {
        let url = WIKI_BASE_URL + 'CHANGELOG.md';
        $.ajax({
            url: url,
            method: "GET" })
            .done(function(data) {
                this.setState({ content: data });
                let tableList = $('table');
                tableList.map(table => tableList[table].classList.add('table', 'table-striped'));

            }.bind(this))
            .fail(function(xhr) {
                console.error('error', xhr);
                this.setState({ content: "" });
            }.bind(this));
    }
}
