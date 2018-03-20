import React from 'react';
import { findDOMNode } from 'react-dom';

// el visor no tiene estado como tal, solo reproduce el estado
export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
        };
    }

    render() {
        return (
            <div />
        );
    }
}
