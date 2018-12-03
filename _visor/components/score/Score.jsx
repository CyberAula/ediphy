import React from 'react';
import PropTypes from 'prop-types';
import i18n from "i18next";

export default class Score extends React.Component {
    render() {
        let score = this.props.exercises.score * 100;
        let pass = (this.props.exercises.minForPass || 50) <= score;
        // score = Math.round((score) * 1000) / 1000;
        score = score.toFixed(0);
        if (this.props.exercises.attempted) {
            return <div className={"pageScore score" + (pass ? "Pass" : "Fail")}>
                {i18n.t("Score_feedback")} <br/>
                <span>{score + '%'}</span>
            </div>;
        }
        return null;
    }
}

Score.propTypes = {
    /**
   * Object containing all the exercises in the course
   */
    exercises: PropTypes.object.isRequired,
};
