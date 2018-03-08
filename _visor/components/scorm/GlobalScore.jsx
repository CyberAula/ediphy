import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';

export default class GlobalScore extends Component {

    render() {
        let { userName, totalScore, totalWeight, isPassed, completionProgress } = this.props.scoreInfo;
        return (
            <div className={"globalScore"}>
                <h5><i className="material-icons">person</i>{userName}</h5>
                {/* <span className="scoreField">{isPassed}</span>*/}
                <h6>
                    <span className="scoreField"> Score: </span>
                    <span className="scoreField"> {totalScore + "/" + totalWeight} points</span>
                    <span className="scoreField">{parseFloat((totalScore / totalWeight) * 100).toFixed(2) + "%"}</span><br/>
                    <span className="scoreField"> Progress:  </span>
                    <span className="scoreField"> {parseFloat(completionProgress * 100).toFixed(2) + '%'} </span>
                </h6>
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
