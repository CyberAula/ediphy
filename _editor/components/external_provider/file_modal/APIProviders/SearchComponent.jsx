import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';

export default class SearchComponent extends React.Component {
    render() {
        return <InputGroup className="searchInputTopBar">
            <FormControl onChange={this.props.onChange} autoFocus ref="query" type="text" />
            <InputGroup.Addon className="inputSearch" onClick={(e) => {
                this.props.onSearch(ReactDOM.findDOMNode(this.refs.query).value);
                e.preventDefault();
            }}>
                {i18n.t("FileModal.APIProviders.search")}  <Glyphicon glyph="search" />
            </InputGroup.Addon>
        </InputGroup>;
    }
}
