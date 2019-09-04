import React from 'react';
import STLViewer from 'stl-viewer';
import { toColor } from '../../../common/common_tools';
import '../_visor3D.scss';
import ReactResizeDetector from 'react-resize-detector';
/* eslint-disable react/prop-types */

export default class Visor3DPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 400,
            height: 400,
        };
    }
    render() {
        let color = toColor(this.props.state.color).newColor;
        let backgroundColor = toColor(this.props.state.backgroundColor).newColor;
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <STLViewer
                    url={this.props.state.url}
                    modelColor={color}
                    backgroundColor={backgroundColor}
                    rotate={this.props.state.rotate}
                    width={this.state.width}
                    height={this.state.height}
                    orbitControls />
                <ReactResizeDetector handleWidth handleHeight onResize={(w, h)=>{ this.onResize(w, h);}} />

            </div>);
    }
    onResize(width, height) {
        this.setState({ width, height });
    // findParentBySelector
        // no recuerdo para que necesitabamos findParentBySelector
    }
}
/* eslint-enable react/prop-types */
