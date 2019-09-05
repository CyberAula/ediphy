import React from 'react';
import { findDOMNode } from 'react-dom';
import STLViewer from 'stl-viewer';
import screenfull from 'screenfull';
import { fullScreenListener, isFullScreenOn, toColor } from '../../../common/common_tools';
import '../_visor3D.scss';
import ReactResizeDetector from 'react-resize-detector';
/* eslint-disable react/prop-types */

export default class Visor3DPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
            width: 400,
            height: 400,
        };
        this.checkFullScreen = this.checkFullScreen.bind(this);
    }

    onClickFullscreen() {
        let width = this.state.width;
        let height = this.state.height;
        if (!this.state.fullscreen) {
            this.setState({ fullscreen: !this.state.fullscreen, savedWidth: this.state.width, savedHeight: this.state.height });
            screenfull.request(findDOMNode(this.obj_wrapper));
        } else {
            screenfull.exit();
            width = this.state.savedWidth || 400;
            height = this.state.savedHeight || 400;
            this.setState({ fullscreen: !this.state.fullscreen, width, height });

        }

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
    }

    checkFullScreen() {
        // Si no está activada la pantalla completa pero en el estado sigue marcando que lo está
        // (porque hemos salido con la tecla escape), se la quitamos y reestablecemos el tamaño
        if (this.state.fullscreen && !isFullScreenOn()) {
            let width = this.state.savedWidth || 400;
            let height = this.state.savedHeight || 400;
            this.setState({ fullscreen: false, width, height });
        }
    }

    // Iniciamos los listeners para que nos avise cuando hay un cambio en pantalla completa
    componentDidMount() {
        fullScreenListener(this.checkFullScreen, true);

    }

    // Quitamos los listeners
    componentWillUnmount() {
        fullScreenListener(this.checkFullScreen, false);

    }
}
/* eslint-enable react/prop-types */
