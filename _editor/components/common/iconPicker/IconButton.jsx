import React, { Component } from 'react';

/* eslint-disable react/prop-types */
class IconButton extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        return (<div className={this.props.selected ? "markIcon selectedIcon" : "markIcon"} onClick={this.onClick} style={{ padding: "0.6em" }}> <i className="material-icons">{this.props.text}</i></div>);
    }
    onClick() {
        this.props.handleClick(this.props.text);
    }
    // eslint-disable-next-line no-unused-vars
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props !== nextProps;
    }
}

export default IconButton;
/* eslint-enable react/prop-types */
