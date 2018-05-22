import React from 'react';
import { findDOMNode } from 'react-dom';
import STLViewer from 'stl-viewer';
import screenfull from 'screenfull';
import { toColor } from '../../../common/common_tools';

export default class Visor3DPluginEditor extends React.Component {

    render() {
        let color = toColor(this.props.state.color).newColor;
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <STLViewer
                    url={this.props.state.url}
                    modelColor={color}
                    backgroundColor={'#ffffff'}
                    rotate={this.props.state.rotate}
                    width={400}
                    height={400}
                    orbitControls />
            </div>);
    }
}
