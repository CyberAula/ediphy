import { FontManager } from 'font-picker';
import throttle from 'lodash.throttle';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class FontPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeFont: this.props.activeFont,
            errorText: '',
            expanded: false,
            loadingStatus: 'loading', // possible values: 'loading', 'finished', 'error'
        };

    }

    render() {
    }
}

