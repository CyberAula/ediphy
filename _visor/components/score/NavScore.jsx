import React from 'react';
import PropTypes from 'prop-types';
import { NavScoreContainer } from "./Styles";

export default class NavScore extends React.Component {

    render() {
        let { userName, totalScore, totalWeight, completionProgress } = this.props.scoreInfo;
        let score = Math.round((totalScore / (totalWeight || 1)) * 10000) / 100 + "%";
        let progress = Math.round(completionProgress * 10000) / 100 + '%';
        if (this.props.show) {
            return (
                [<NavScoreContainer key="component" className="scorePanel navScore">
                    <h5 id="userName"><i className="material-icons">person</i>  <span>{userName}</span></h5>
                    <div className="row rowScore">
                        <div className="col-xs-6 colScore"><i className="material-icons">insert_chart</i> {(parseFloat(totalScore)).toFixed(2) + "/" + totalWeight}</div>
                        <div className="col-xs-6 colScore"><i className="material-icons">pie_chart</i> {score}</div>
                    </div>
                    <span className="progressField"> {progress} </span>
                    <div id="progressbar">
                        <div id="currentprogress" style={{ width: progress }}/>
                    </div>
                </NavScoreContainer>, <hr key="sep" style={{ borderTopColor: "#555" }}/>]
            );
        }
        return null;

    }

}

NavScore.propTypes = {
    /**
   * Course score information
   */
    scoreInfo: PropTypes.object.isRequired,
    /**
   * Show score
   */
    show: PropTypes.bool,
};
