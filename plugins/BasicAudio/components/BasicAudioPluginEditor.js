import React from 'react';
import { findDOMNode } from 'react-dom';
// import screenfull from 'screenfull';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import img from './../../../dist/images/broken_link.png';
// import aud from './../../../dist/playlists/basic.mp3';
import ReactWavesurfer from 'react-wavesurfer';
import Mark from '../../../common/components/mark/Mark';

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // audioFile: '',
            // playing: false,
            pos: 0,
            volume: 0.5,
            audioRate: 1,
            controls: true,
            duration: 1,
            waves: false,
            autoplay: false,
            audioPeaks: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
    }

    handlePosChange(e) {
        console.log(e.originalArgs[0]);
        this.setState({
            pos: e.originalArgs[0],
        });

    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    handleAudioRateChange(e) {
        // api audio html5
        // stack overflow
    //  console.log(e.target.value)
        this.setState({
            audioRate: /* +*/e.target.value,
        });
        // <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.audioRate} onChange={this.handleAudioRateChange.bind(this)} />
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }
    }

    handleLoadingPeaks(e) {
        if (this.state.audioPeaks["0"] === 0) {
            this.setState({
                audioPeaks: [
                    0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538,
                    0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218,
                    0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621,
                    0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984,
                    0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833,
                    0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108],
            });
        }else{
            this.setState({
                audioPeaks: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
        }
    }

    onProgress(state) {
        this.setState(state);
    }

    /*    getDuration() {
        return this.state.duration;
    }
*/
    render() {
        console.log(this.state.pos);
        const waveOptions = {
            scrollParent: true,
            height: 100,
            progressColor: 'purple',
            waveColor: 'violet',
            normalize: true,
            barWidth: 3,
            audioRate: this.state.audioRate,
            peaks: this.state.peaks,
        };

        /* Podemos pasar una devolución de llamada en los refs*/
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            // aqui solo entra cuando le das a save changes que es cuando da error
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute" }} time={1.5} mark={id} onRichMarkUpdated={this.props.props.onRichMarkUpdated} state={this.props.state} base={this.props.base}>
                    <a key={id} href="#">
                        <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                            <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }} color={color || "#17CFC8"} idKey={id} title={title} />
                        </div>
                    </a>
                </MarkEditor>);
        });

        return (
            <div className="basic-audio-wrapper" ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
                <ReactWavesurfer
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    audioFile={this.props.state.url}
                    playing={this.state.playing}
                    audioPeaks={this.state.audioPeaks}
                    volume={this.state.volume}
                    options={waveOptions}

                    pos={this.state.pos}
                    onPosChange={this.handlePosChange.bind(this)}

                    onReady={(e) => {/* duration*/console.log(e);

                        this.setState({ duration: e.wavesurfer.backend.buffer.duration,
                            pos: 0 });}}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onFinish={() => this.setState({ playing: false })}
                    onLoading={this.onProgress.bind(this)}
                    // onDuration={duration => this.setState({ duration })}
                />

                {(this.props.state.controls) && (
                    <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                        <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-audio-input dropableRichZone" style={{ height: "15px", position: "relative" }}>
                            <div className="fakeProgress"/>
                            <input style={{ left: ((this.state.pos * 100) / this.state.duration) }}className="mainSlider" type='range' min={0} max={100} onChange={this.handlePosChange.bind(this)} />
                            {markElements}
                        </div>
                        <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        <button className="peaks-button" onClick={this.handleLoadingPeaks.bind(this)}> { <i className="material-icons" style={{ pointerEvents: 'auto' }}>equalizer</i>}</button>
                    </div>
                )}
            </div>
        );

    }
}
