import React from 'react';
import { findDOMNode } from 'react-dom';
import STLViewer from 'stl-viewer';
import screenfull from 'screenfull';

export default class Visor3DPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            color: this.props.state.color,
        });
    }

    render() {
        console.log();
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <STLViewer
                    url={this.props.state.url}
                    modelColor={this.props.state.color}
                    rotate
                    orbitControls />
            </div>);
    }
}
