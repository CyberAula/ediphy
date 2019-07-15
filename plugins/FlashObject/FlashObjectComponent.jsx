import React from 'react';
import './_flashObject.scss';
/* eslint-disable react/prop-types */

export default class FlashObjectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
        };
    }
    render() {
        return <embed className="flashObject" key={this.state.key} wmode="opaque" src={this.props.src} width="100%" onClick={(e)=>{e.currentTarget.classList.add('pointerevents');}} height="100%"/>;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.setState({ key: this.state.key + 1 });
        }
    }
}
/* eslint-enable react/prop-types */
