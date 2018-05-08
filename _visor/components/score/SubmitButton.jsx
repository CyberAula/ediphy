import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import i18n from 'i18next';

export default class SubmitButton extends Component {
    render() {
        if (!this.props.exercises.attempted) {
            return <Button className="submitButton" onClick={this.props.onSubmit}>✓  {i18n.t("Submit")}</Button>;
        }
        return null;
    }
}

SubmitButton.propTypes = {
    /**
   * Object containing all the exercises in the course
   */
    exercises: PropTypes.object.isRequired,
    /**
   * Function for submitting the page quiz
   */
    onSubmit: PropTypes.func.isRequired,
};
