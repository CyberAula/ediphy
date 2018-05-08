// components/waveform.js
import React from 'react';
import ReactDOM from 'react-dom';
import WaveSurfer from 'wavesurfer.js';
import MarkEditor from '../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';

import ReactResizeDetector from 'react-resize-detector';

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
            audioPeaks: null,
            ondas: false, // null??
            name: "No name",
        };
        this.onProgress = this.onProgress.bind(this);
        this.onReady = this.onReady.bind(this);
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
        this.wavesurfer.playPause();
    }

    handlePosChange(e) {
        this.setState({ pos: +e.originalArgs[0] });
        this.wavesurfer.seekTo(this.state.pos);
    }

    handleVolumeChange(e) {
        this.setState({ volume: +e.target.value });
        this.wavesurfer.setVolume(this.state.volume);
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.state !== this.props.state) {
            let pos = 0;
            let playing = false;
            if (this.props.url === nextProps.url) {
                pos = (this.wavesurfer.getCurrentTime() || 0) / (this.wavesurfer.getDuration() || 1);
                playing = this.state.playing;

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
            this.setState({ playing: false, waves: nextProps.state.waves });
            this.wavesurfer.load(nextProps.state.url);
            this.wavesurfer.on('ready', ()=>{this.onReady(pos, playing);});
            this.wavesurfer.on('loading', this.onProgress);

        }

    }
    createOptions(props, state) {
        return {
            scrollParent: props.state.scroll,
            hideScrollbar: !props.state.scroll,
            progressColor: props.state.progressColor, // parte de la izquierda
            waveColor: props.state.waveColor, // this.state.waveColor, //parte de la derecha
            normalize: true,
            peaks: state.peaks,
            cursorColor: 'grey',
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
            ondas: this.wavesurfer.backend.mergedPeaks,
            waveColor: this.wavesurfer.params.waveColor,
            progressColor: this.wavesurfer.params.progressColor,
        });
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
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            // aqui solo entra cuando le das a save changes
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
                <div>
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{ this.onResize(e);}} />
                    <div className="fakeProgress dropableRichZone" style={{ pointerEvents: "auto" }}>
                        {markElements}

                    </div>
                    <div className="react-wavesurfer">
                        {/* <ReactWavesurfer
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
                            onReady= {this.onReady.bind(this)}
                            onPlay={() => this.setState({ playing: true })}
                            onPause={() => this.setState({ playing: false })}
                            onFinish={() => this.setState({ playing: false })}
                            onLoading={this.onProgress.bind(this)}
                        />*/}
                        <div className='waveform'>
                            <div className='wave' />
                        </div>
                    </div>
                </div>
                <div>
                    {(this.props.state.controls) && (
                        <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                            <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)} style={{ backgroundColor: this.props.state.waveColor }}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                            <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
