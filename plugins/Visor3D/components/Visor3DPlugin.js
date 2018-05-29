import React from 'react';
import { findDOMNode } from 'react-dom';
import STLViewer from 'stl-viewer';
import screenfull from 'screenfull';
import { toColor } from '../../../common/common_tools';
import '../_visor3D.scss';
import ReactResizeDetector from 'react-resize-detector';
import { findParentBySelector } from '../../../common/utils';
export default class Visor3DPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
            width: 400,
            height: 400,
        };
    }

    onClickFullscreen() {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.obj_wrapper));
        } else {
            screenfull.exit();

        }
        this.setState({ fullscreen: !this.state.fullscreen });

        window.dispatchEvent(new Event('resize'));

    }

    render() {
        let color = toColor(this.props.state.color).newColor;
        let backgroundColor = toColor(this.props.state.backgroundColor).newColor;
        return (
            <div ref={obj_wrapper => {this.obj_wrapper = obj_wrapper;}} style={{ height: "100%", width: "100%" }}>
                <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                <div className="rrd-wrapper">
                    <STLViewer
                        url={this.props.state.url}
                        modelColor={color}
                        backgroundColor={backgroundColor}
                        rotate={this.props.state.rotate}
                        width={this.state.width}
                        height={this.state.height}
                        orbitControls />
                    <ReactResizeDetector handleWidth handleHeight onResize={(w, h)=>{ this.onResize(w, h);}} /></div>

            </div>);
    }
    onResize(width, height) {
        this.setState({ width, height });
        console.log(width, height);
    // findParentBySelector

    }
}
