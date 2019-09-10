import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './_score.scss';
export default class GlobalScore extends Component {

    render() {
        let { userName, totalScore, totalWeight, completionProgress } = this.props.scoreInfo;
        let score = Math.round((totalScore / (totalWeight || 1)) * 10000) / 100 + "%";
        let progress = Math.round(completionProgress * 10000) / 100 + '%';
        if (this.props.show) {
            return (
                <div className={"scorePanel globalScore " + this.props.fadePlayerClass}
                    onMouseEnter={() => this.props.setHover()}
                    onMouseLeave={() => this.props.deleteHover()}>
                    <h5 id="userName"><i className="material-icons">person</i> <span>{userName}</span></h5>
                    <h6 id="score">
                        <span className="scoreField scoreField1"><i className="material-icons">insert_chart</i> {totalScore + "/" + totalWeight} </span>
                        <span className="scoreField scoreField2"><i className="material-icons">pie_chart</i> {score} </span><br/>

                    </h6>
                    <span className="progressField"> {progress} </span>
                    <div id="progressbar">
                        <div id="currentprogress" style={{ width: progress }} />
                    </div>
                </div>
            );
        }
        return null;

    }
}

GlobalScore.propTypes = {
    /**
   * Object containing all the global score information
   */
    scoreInfo: PropTypes.object.isRequired,
    /**
   * Show score
   */
    show: PropTypes.bool,
    /**
     * CSS class used to hide player when mouse stops moving
     */
    fadePlayerClass: PropTypes.string,
    /**
     * Function that allows to add the hover class to the player and the arrow tab
     */
    setHover: PropTypes.func,
    /**
     * Function that allows to delete the hover class in he player and the arrow tab
     */
    deleteHover: PropTypes.func,
};
