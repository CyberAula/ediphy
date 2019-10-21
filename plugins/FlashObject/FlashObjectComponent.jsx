import React from 'react';
import { FlashObjectPlugin } from "./Styles";
/* eslint-disable react/prop-types */

export default class FlashObjectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
        };
    }
    render() {
        return <FlashObjectPlugin
            key={this.state.key}
            wmode="opaque"
            src={this.props.src}
            onClick={(e)=>{e.currentTarget.classList.add('pointerevents');}}
        />;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.setState({ key: this.state.key + 1 });
        }
    }
}
/* eslint-enable react/prop-types */
