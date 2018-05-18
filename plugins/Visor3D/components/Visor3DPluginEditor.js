import React from 'react';
import { findDOMNode } from 'react-dom';
import STLViewer from 'stl-viewer';
import screenfull from 'screenfull';

export default class Visor3DPluginEditor extends React.Component {

    render() {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <STLViewer
                    url={this.props.state.url}
                    modelColor={this.props.state.color}
                    rotate={this.props.state.rotate}
                    orbitControls />
            </div>);
    }
}
