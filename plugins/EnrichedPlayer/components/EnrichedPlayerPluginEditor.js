import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';
import { convertHMStoSeconds } from "../../../common/common_tools";
import img from './../../../dist/images/broken_link.png';
import { pad } from '../../../common/common_tools';

/* eslint-disable react/prop-types */

export default class EnrichedPlayerPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0.8,
            duration: 0,
            played: 0,
            playedSeconds: 0,
            seeking: false,
            fullscreen: false,
            // controls: this.props.state.controls || true,
        };
    }

    playPause() {
        this.setState({ playing: !this.state.playing });
    }

    onClickFullscreen() {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.player_wrapper));
        } else {
            screenfull.exit();
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    setVolume(e) {
        this.setState({ volume: parseFloat(e.target.value) });
    }

    setPlaybackRate(e) {
        this.setState({ playbackRate: parseFloat(e.target.value) });
    }

    onSeekMouseDown() {
        this.setState({ seeking: true });
    }

    onSeekChange(e) {
        this.setState({ played: (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width });
    }

    onSeekMouseUp(e) {
        if(e.target.className.indexOf('progress-player-input') !== -1 ||
            e.target.className.indexOf('fakeProgress') !== -1 ||
            e.target.className.indexOf('mainSlider') !== -1) {
            let pos = (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width;
            this.player.seekTo(pos);
            this.setState({ seeking: false, played: pos });
        }
    }

    onProgress(state) {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }
    }

    getDuration() {
        return this.state.duration;
    }
    onReady(e) {
        this.setState({ ready: true });
    }
    render() {
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let secondsValue = convertHMStoSeconds(marks[id].value);
            let duration = this.state.duration;
            let value = (secondsValue * 100 / duration) + "%";
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute", top: "0.3em" }} boxId={this.props.props.id} time={1.5} mark={id} marks={marks} onRichMarkMoved={this.props.props.handleMarks.onRichMarkMoved} state={this.props.state} base={this.props.base}>
                    <div className="videoMark" style={{ background: color || "#17CFC8" }}>
                        <Mark style={{ position: 'relative', top: "-1.7em", left: "-0.75em" }} color={color || "#17CFC8"} idKey={id} title={title} />
                    </div>
                </MarkEditor>);
        });

        return (
            <div ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "none" }} className="enriched-player-wrapper" duration={this.state.duration}>
                <ReactPlayer
                    ref={player => { this.player = player; }}
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    url={this.props.state.url}
                    playing={this.state.playing}
                    // fileConfig={{ attributes: { poster: img } }}
                    volume={this.state.volume}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress.bind(this)}
                    // onMouseDown={this.onSeekMouseDown.bind(this)}
                    //  onChange={this.onSeekChange.bind(this)}
                    // onMouseUp={this.onSeekMouseUp.bind(this)}
                    onReady={this.onReady.bind(this)}
                    onDuration={duration => this.setState({ duration })}
                />
                {this.props.state.controls ?
                    <div className="player-media-controls flexControls" style={{ pointerEvents: 'all' }}>
                        <button className="play-player-button" onClick={this.playPause.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-player-input dropableRichZone" style={{ height: "1.7em", position: "relative", bottom: '0.3em' }}
                            onMouseDown={this.onSeekMouseDown.bind(this)}
                            onChange={this.onSeekChange.bind(this)}
                            onMouseUp={this.onSeekMouseUp.bind(this)}>
                            <div className="fakeProgress" />

                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {this.state.ready ? markElements : null}
                        </div>
                        <div className="durationField">{ Math.trunc(this.state.playedSeconds / 60) + ":" + pad(Math.trunc(this.state.playedSeconds % 60)) + "/" + Math.trunc(this.state.duration / 60) + ":" + pad(Math.trunc(this.state.duration % 60))}</div>
                        <input className="volume-player-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume.bind(this)} />
                        <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                    </div> :

                    <div className="player-media-controls flexControls" style={{ pointerEvents: 'all', visibility: 'hidden' }}>
                        <div className="progress-player-input dropableRichZone" style={{ height: "1.7em", position: "relative", bottom: '0.3em' }}>
                            <div className="fakeProgress" />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {this.state.ready ? markElements : null}
                        </div>
                    </div>}
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
