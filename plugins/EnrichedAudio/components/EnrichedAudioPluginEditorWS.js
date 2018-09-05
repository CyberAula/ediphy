// components/waveform.js
import React from 'react';
import ReactDOM from 'react-dom';
import WaveSurfer from 'wavesurfer.js';
import MarkEditor from '../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';

import ReactResizeDetector from 'react-resize-detector';
/* eslint-disable react/prop-types */

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
            volume: 0.5,
            controls: true,
            duration: 1,
            waves: true,
            autoplay: false,
            // audioPeaks: null,
            // ondas: false,
            height: 128,

        };
        this.onProgress = this.onProgress.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
        this.wavesurfer.playPause();
    }

    handlePosChange(e) {
        let pos = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width);
        this.setState({ pos });
        this.wavesurfer.seekTo(pos);
    }

    handleVolumeChange(e) {
        this.setState({ volume: +e.target.value });
        this.wavesurfer.setVolume(this.state.volume);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.state !== this.props.state) {
            let pos = 0;
            let playing = false;
            if (this.props.state.url === nextProps.state.url) {
                pos = (this.wavesurfer.getCurrentTime() || 0) / (this.wavesurfer.getDuration() || 1);
                playing = this.state.playing;

            }
            if (this.props.state.autoplay !== nextProps.state.autoplay) {
                return;
            }
            this.wavesurfer.stop();
            this.wavesurfer.destroy();

            this.$el = ReactDOM.findDOMNode(this);
            this.$waveform = this.$el.querySelector('.wave');
            const waveOptions = this.createOptions(nextProps, this.state);
            this.wavesurfer = WaveSurfer.create({
                container: this.$waveform,
                ...waveOptions,
            });
            this.setState({
                playing: false,
                waves: nextProps.state.waves,
                // height: nextProps.state.waves ? 1 : 0,
            });
            this.wavesurfer.load(nextProps.state.url);
            this.wavesurfer.on('ready', ()=>{this.onReady(pos, playing);});
            this.wavesurfer.on('loading', this.onProgress);

        }

    }
    createOptions(props, state) {
        return {
            scrollParent: props.state.scroll,
            hideScrollbar: !props.state.scroll,
            progressColor: props.state.progressColor,
            waveColor: props.state.waveColor,
            normalize: true,
            barWidth: (props.state.barWidth > 0 ? props.state.barWidth : undefined),
            // peaks: state.peaks,
            cursorColor: 'grey',
            height: props.state.waves ? 128 : 0,
        };

    }

    componentDidMount() {
        this.$el = ReactDOM.findDOMNode(this);
        this.$waveform = this.$el.querySelector('.wave');
        const waveOptions = this.createOptions(this.props, this.state);
        this.wavesurfer = WaveSurfer.create({
            container: this.$waveform,
            ...waveOptions,
        });
        this.wavesurfer.load(this.props.state.url);
        this.wavesurfer.on('ready', ()=>this.onReady(0, false));
        this.wavesurfer.on('loading', this.onProgress);
    }

    componentWillUnmount() {
        this.wavesurfer.stop();
        this.wavesurfer.destroy();
    }
    onProgress(state) {
        this.setState({ pos: state });
    }

    onReady(pos, playing) {
        this.setState({
            duration: this.wavesurfer.backend.buffer.duration,
            pos: 0,
            playing: false,
            autoplay: this.props.state.autoplay,
            ondas: this.props.state.waves ? this.wavesurfer.backend.mergedPeaks : [0, 0, 0, 0],
            waveColor: this.wavesurfer.params.waveColor,
            progressColor: this.wavesurfer.params.progressColor,
            waves: this.props.state.waves,
            height: this.props.state.waves ? 128 : 0,
        });
        // en el estado height se cambia bien
        this.wavesurfer.seekTo(pos);
        if (playing) {
            this.wavesurfer.play();
            this.setState({ playing: true });
        }
    }
    onResize(e) {
        if (this.wavesurfer) {
            let pos = (this.wavesurfer.getCurrentTime() || 0) / (this.wavesurfer.getDuration() || 1);
            this.wavesurfer.empty();
            this.wavesurfer.pause();
            this.wavesurfer.drawBuffer();
            this.wavesurfer.seekTo(pos);
            if (this.state.playing) {
                this.wavesurfer.play();
            }
        }

    }
    render() {
        let marks = this.props.props.marks || {}; //
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute", top: "1px" }} time={1.5} mark={id} marks={marks} onRichMarkMoved={this.props.props.onRichMarkMoved} state={this.props.state} base={this.props.base}>
                    <div className="audioMark" style={{ background: color || "#17CFC8" }}>
                        <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }} color={color || "#17CFC8"} idKey={id} title={title} />
                    </div>
                </MarkEditor>);
        });

        return (
            <div className="basic-audio-wrapper" ref={player_wrapper => {this.player_wrapper = player_wrapper;}}
                style={{ width: "100%", height: "100%", pointerEvents: "all" }}>
                <div className="wavecontainer" style={{ position: 'absolute', height: '100%', width: '100%' }} >
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{ this.onResize(e);}} />
                    <div className='waveform'>
                        <div className='wave' />
                    </div>
                </div>
                <div className="progress-audio-input dropableRichZone" onClick={this.handlePosChange.bind(this)}>
                    <div className="markBar"> {markElements}</div>
                </div>

                <div>
                    {(this.props.state.controls) && (
                        <div className="audio-controls" style={{ pointerEvents: 'all' }}>
                            <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)} >{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                            <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
