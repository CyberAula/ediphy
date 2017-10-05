import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import img from './../../../dist/images/broken_link.png';

export default class PlayerPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0.8,
            duration: 0,
            played: 0,
            seeking: false,
            fullscreen: false,
            controls: true,
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
        this.setState({ played: parseFloat(e.target.value) });
    }

    onSeekMouseUp(e) {
        this.setState({ seeking: false });
        this.player.seekTo(parseFloat(e.target.value));
    }

    onProgress(state) {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }
    }

    render() {
        return (
            <div ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "none" }} className="player-wrapper">
                <ReactPlayer
                    ref={player => { this.player = player; }}
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    url={this.props.state.url}
                    playing={this.state.playing}
                    volume={this.state.volume}
                    fileConfig={{ attributes: { poster: img } }}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress.bind(this)}
                    onDuration={duration => this.setState({ duration })}
                />
                {(this.state.controls) && (
                    <div className="player-media-controls">
                        <button className="play-player-button" onClick={this.playPause.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <input className="progress-player-input"
                            type='range' min={0} max={1} step='any'
                            value={this.state.played}
                            onMouseDown={this.onSeekMouseDown.bind(this)}
                            onChange={this.onSeekChange.bind(this)}
                            onMouseUp={this.onSeekMouseUp.bind(this)}
                        />
                        {/* <progress className="progress-player-bar" max={1} value={this.state.played} />*/}
                        <input className="volume-player-input" type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume.bind(this)} />
                        <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                    </div>)}
            </div>
        );
    }
}
