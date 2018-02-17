import React from 'react';

export default class Score extends React.Component {
    render() {
        let score = this.props.exercises.score * 100;
        let pass = (this.props.exercises.minForPass || 50) <= score;

        if (this.props.exercises.attempted) {
            return <div className={"pageScore score" + (pass ? "Pass" : "Fail")}>
                Your score is <br/>
                <span>{score + '%'}</span>
            </div>;
        }
        return null;
    }
}
