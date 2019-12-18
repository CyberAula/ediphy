import React from 'react';
import ReactDOM from 'react-dom';
import WaveSurfer from 'wavesurfer.js';
import MarkEditor from '../../../_editor/components/richPlugins/markEditor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';
import { convertHMStoSeconds, pad } from '../../../common/commonTools';
import { setRgbaAlpha } from "../../../common/commonTools";

import ReactResizeDetector from 'react-resize-detector';
import { getCurrentColor } from "../../../common/themes/themeLoader";
import {
    AudioPlugin,
    Wave,
    WaveContainer,
    Progress,
    Duration,
    Controls,
    Play,
    Volume,
    MarkBar,
    AudioMark,
} from "../Styles";

import _handlers from "../../../_editor/handlers/_handlers";
/* eslint-disable react/prop-types */

export default class BasicAudioPluginEditor extends React.Component {
    state = {
        pos: 0,
        volume: 0.5,
        controls: true,
        duration: 1,
        waves: true,
        autoplay: false,
        height: 128,
        playedSeconds: 0,
        color: getCurrentColor('default'),
    };

    h = _handlers(self);

    handleTogglePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.wavesurfer.playPause();
    };

    handlePosChange = e => {
        let dragging = this.state.dragging;
        if (!dragging) {
            let pos = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width);
            this.setState({ pos });
            this.wavesurfer.seekTo(pos);
        }
        document.removeEventListener('mousemove', this.onMouseMove);
    };

    onMouseDown = () => {
        this.setState({ dragging: false });
        document.addEventListener('mousemove', this.onMouseMove);
    };

    onMouseMove = () => {
        if (!this.state.dragging) {
            this.setState({ dragging: true });
        }
    };

    handleVolumeChange = e => {
        this.setState({ volume: +e.target.value });
        this.wavesurfer.setVolume(this.state.volume);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        let colorThemeChanged = !this.props.state.progressColor.custom && nextProps.props.themeColors !== {} && this.state.color !== nextProps.props.themeColors.themeColor1;

        if (nextProps.state !== this.props.state || colorThemeChanged) {
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

            let color = this.props.state.progressColor.custom ? this.props.state.progressColor.color : nextProps.props.themeColors.themeColor1;
            this.setState({
                playing: false,
                waves: nextProps.state.waves,
                color: color,
                ready: false,
            }, () => {
                this.wavesurfer.load(nextProps.state.url);
                this.wavesurfer.on('ready', ()=>{this.onReady(pos, playing);});
                this.wavesurfer.on('audioprocess', this.onProgress);
            });
        }

    }
    createOptions(props) {
        let color = props.state.progressColor.custom ? props.state.progressColor.color
            : props.props.themeColors.themeColor1;
        return {
            scrollParent: props.state.scroll,
            hideScrollbar: !props.state.scroll,
            progressColor: color,
            waveColor: setRgbaAlpha(color, 0.5),
            normalize: true,
            barWidth: (props.state.barWidth > 0 ? props.state.barWidth : undefined),
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
        this.wavesurfer.on('audioprocess', this.onProgress);
    }

    componentWillUnmount() {
        this.wavesurfer.stop();
        this.wavesurfer.destroy();
    }
    onProgress = state => this.setState({ pos: state });

    onReady = (pos, playing) => {
        this.setState({
            duration: this.wavesurfer.backend.buffer.duration,
            pos: 0,
            playing: false,
            autoplay: this.props.state.autoplay,
            ondas: this.props.state.waves ? this.wavesurfer.backend.mergedPeaks : [0, 0, 0, 0],
            waveColor: this.wavesurfer.params.waveColor.color,
            progressColor: this.wavesurfer.params.progressColor.color,
            waves: this.props.state.waves,
            height: this.props.state.waves ? 128 : 0,
            ready: true,
        });
        // en el estado height se cambia bien
        this.wavesurfer.seekTo(pos);
        if (playing) {
            this.wavesurfer.play();
            this.setState({ playing: true });
        }
    };

    onResize = () => {
        if (this.wavesurfer && this.state.ready) {
            let pos = (this.wavesurfer.getCurrentTime() || 0) / (this.wavesurfer.getDuration() || 1);
            this.wavesurfer.empty();
            this.wavesurfer.pause();
            this.wavesurfer.drawBuffer();
            this.wavesurfer.seekTo(pos);
            if (this.state.playing) {
                this.wavesurfer.play();
            }
        }
    };

    render() {
        const playIcon = this.state.playing ? <i className="material-icons">pause</i>
            : <i className="material-icons">play_arrow</i>;

        let marks = this.props.props.marks || {}; //
        let markElements = Object.keys(marks).map((id) =>{
            let secondsValue = convertHMStoSeconds(marks[id].value);
            let duration = this.state.duration;
            let value = (secondsValue * 100 / duration) + "%";
            let title = marks[id].title;
            let content = marks[id].content;
            let color = marks[id].color;
            let size = marks[id].size;
            let markType = marks[id].markType;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute", top: "0.1em" }}
                    boxId={this.props.props.id} time={1.5} mark={id} marks={marks} dispatch={this.props.props.dispatch}
                    onRichMarkMoved={this.h.onRichMarkMoved} state={this.props.state}
                    base={this.props.base}>
                    <AudioMark style={{ background: color || "var(--themeColor1)" }}>
                        <Mark style={{ position: 'relative', top: "-1.7em", left: "-1em" }}
                            idKey={id} title={title} markType={markType} content={content} size={size} color={color}/>
                    </AudioMark>
                </MarkEditor>);
        });
        return (
            <AudioPlugin ref={player_wrapper => {this.player_wrapper = player_wrapper;}}
                style={{ width: "100%", height: "100%", pointerEvents: "all" }}>
                <div className={'duration'} duration={this.state.duration} style={{ display: 'none' }}/>
                <WaveContainer>
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{ this.onResize(e);}} />
                    <Wave/>
                </WaveContainer>
                <Progress
                    onMouseUp={this.handlePosChange.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}>
                    <MarkBar> {markElements}</MarkBar>
                </Progress>

                {(this.props.state.controls) && (
                    <Controls>
                        <Play onClick={this.handleTogglePlay.bind(this)}>{playIcon}</Play>
                        <Duration>{ Math.trunc(this.state.pos / 60) + ":" + pad(Math.trunc(this.state.pos % 60))
                        + "/" + Math.trunc(this.state.duration / 60) + ":"
                        + pad(Math.trunc(this.state.duration % 60))}</Duration>
                        <Volume value={this.state.volume} onChange={this.handleVolumeChange.bind(this)}/>
                    </Controls>
                )}
            </AudioPlugin>
        );
    }
}
/* eslint-enable react/prop-types */
