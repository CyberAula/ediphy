import React from 'react';

export default class Answer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return this.props.children;
    }

}
