import React from 'react';
import './_flashObject.scss';
export default class FlashObjectComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
        };
    }
    render() {
        return <embed className="flashObject" key={this.state.key} wmode="opaque" src={this.props.src} width="100%" height="100%"/>;
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.src !== nextProps.src) {
            this.setState({ key: this.state.key + 1 });
        }
    }
}
