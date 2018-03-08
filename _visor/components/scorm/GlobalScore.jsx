import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import './_score.scss';
export default class GlobalScore extends Component {

    render() {
        let { userName, totalScore, totalWeight, isPassed, completionProgress } = this.props.scoreInfo;
        let score = Math.round((totalScore / (totalWeight || 1)) * 10000) / 100 + "%";
        let progress = Math.round(completionProgress * 10000) / 100 + '%';
        return (
            <div className={"scorePanel globalScore"}>
                <h5 id="userName"><i className="material-icons">person</i> <span>{userName}</span></h5>
                {/* <span className="scoreField">{isPassed}</span>*/}
                <h6 id="score">
                    <span className="scoreField"><i className="material-icons">insert_chart</i> {totalScore + "/" + totalWeight} points</span>
                    <span className="scoreField"><i className="material-icons">pie_chart</i> {score} </span><br/>

                </h6>
                <span className="progressField"> {progress} </span>
                <div id="progressbar">
                    <div id="currentprogress" style={{ width: progress }} />
                </div>
            </div>
        );
    }
}

GlobalScore.propTypes = {
    /**
   * Object containing all the global score information
   */
    scoreInfo: PropTypes.object.isRequired,
};
