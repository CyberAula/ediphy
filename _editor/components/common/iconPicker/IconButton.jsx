import React, { Component } from 'react';

class IconButton extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (<div onClick={this.onClick}> <i className="material-icons">{this.props.text}</i></div>);
    }
    onClick() {
        this.props.handleClick(this.props.text);
    }
}

export default IconButton;
