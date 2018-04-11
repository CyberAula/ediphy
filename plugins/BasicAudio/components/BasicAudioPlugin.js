import React from 'react';
import { findDOMNode } from 'react-dom';
// import ReactAudioPlayer from 'react-audio-player';
import screenfull from 'screenfull';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import img from './../../../dist/images/broken_link.png';
import WaveSurfer from 'wavesurfer.js';
import ReactWavesurfer from 'react-wavesurfer';

export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // audioFile: '',
            playing: false,
            pos: 0,
            volume: 0.5,
            audioRate: 1,
            controls: true,
        };
        this.handleAudioRateChange = this.handleAudioRateChange.bind(this);
    }

    handleTogglePlay() {
        console.log("le has dado a play/pause");
        this.setState({
            playing: !this.state.playing,
        });
    }

    handlePosChange(e) {
        this.setState({
            pos: e.originalArgs ? e.originalArgs[0] : +e.target.value,
        });
    }

    handleReady() {
        this.setState({
            pos: 5,
        });
    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    handleAudioRateChange(e) {
        this.setState({
            audioRate: +e.target.value,
        });
    }

    onClickFullscreen() {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.player_wrapper)); // pq player_wrapper?
        } else {
            screenfull.exit();
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }
    }

    render() {

        const waveOptions = {
            scrollParent: true,
            height: 140,
            progressColor: '#6c718c',
            waveColor: '#c4c8dc',
            normalize: true,
            barWidth: 4,
            audioRate: this.state.audioRate,
        };

        let marks = this.props.state.__marks;
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <OverlayTrigger key={id} text={title} placement="top" overlay={<Tooltip id={id}>{title}</Tooltip>}>
                    <a key={id} style={{ left: value, position: "absolute" }} href="#">
                        <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                            <i className="material-icons" style={{ color: color || "#17CFC8", position: "relative", top: "-24px", left: "-10px" }}>room</i>
                        </div>
                    </a>
                </OverlayTrigger>);
        });

        return (
            <div className="basic-audio-wrapper" ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
                <ReactWavesurfer
                    audioFile={this.props.state.url}
                    pos={this.state.pos}
                    onPosChange={this.handlePosChange.bind(this)}
                    playing={this.state.playing}

                    volume={this.state.volume}
                    options={waveOptions}
                    onReady={this.handleReady.bind(this)}
                />

                {(this.props.state.controls) && (
                    <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                        <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-audio-input dropableRichZone" style={{ height: "15px", position: "relative" }}>
                            <div className="fakeProgress" />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {markElements}
                        </div>
                        <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        <button className="fullscreen-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                    </div>
                )}
            </div>
        );
    }
}
