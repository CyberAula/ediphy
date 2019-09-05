import React from 'react';
// import SCORM_API from '../../core/scorm/SCORM_API';
import IframeMessenger from './libs/IframeMessenger';

/* eslint-disable react/prop-types */

export default class ScormIframeWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.IframeMessenger = new IframeMessenger(
            {
                onSetScore: this.onSetScore.bind(this),
                onSetProgress: this.onSetProgress.bind(this),
                onSetSuccessStatus: this.onSetSuccessStatus.bind(this),
                onSetCompletionStatus: this.onSetCompletionStatus.bind(this),
            },
        );
        this.IframeMessenger.init();

    }
    render() {
        return (<iframe src={this.props.url + "?ediphy=" + this.props.id} style={{ width: '100%', height: '100%', zIndex: 0, border: 'none' }} objecttype="scormpackage" webkitAllowFullScreen="true" allowFullScreen="true" mozallowfullscreen="true" />);
    }

    onSetScore(score, origin) {
        let attempted = this.props.exercises && this.props.exercises.attempted;
        try{
            let myurl = origin.split("?ediphy=");
            let id = myurl[1];
            if (this.props.id === id && !attempted) {
                this.props.setAnswer(score);
            }
        }catch(e) {}

    }
    onSetProgress() {
        // Do nothing
    }
    onSetSuccessStatus() {
        // Do nothing
    }
    onSetCompletionStatus() {
        // Do nothing
    }
}
/* eslint-enable react/prop-types */
