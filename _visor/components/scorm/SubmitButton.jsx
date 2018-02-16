import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import i18n from 'i18next';

export default class SubmitButton extends Component {
    render() {
        return <Button className="submitButton" onClick={this.props.onSubmit}>✓  Submit</Button>;
    }
}
