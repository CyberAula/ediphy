import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import Mark from '../../../common/components/mark/Mark';
import { pad } from '../../../common/commonTools';
import { convertHMStoSeconds } from "../../../common/commonTools";
/* eslint-disable react/prop-types */

export default class EnrichedPlayerPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0.8,
            duration: 0,
            played: 0,
            seeking: false,
            fullscreen: false,
            controls: true,
            toBeTriggered: [],
            triggering: false,
            playedSeconds: 0,
        };
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextState.played !== this.state.played) {
            let plugin = this;
            let marks = this.props.props.marks || {};
            let triggerMark = this.props.props.onMarkClicked;
            let triggerArray = this.state.toBeTriggered;
            triggerArray.forEach(function(e, i) {
                // if ((parseFloat(e.value) / 100).toFixed(3) < parseFloat(nextState.played).toFixed(3)) {
                if (parseFloat(convertHMStoSeconds(e.value)) < nextState.playedSeconds) {
                    let toBeTriggered = triggerArray;
                    triggerMark(plugin.props.props.id, e.value, true);
                    toBeTriggered.splice(i, 1);
                    plugin.setState({ toBeTriggered, playing: false, comingFromMark: true });
                }
            });

            Object.keys(marks).forEach(function(key) {
                let notInArray = true;

                triggerArray.forEach(function(mark) {
                    if(mark.id === key) {
                        notInArray = false;
                    }
                });

                // if(notInArray &&
                //   parseFloat(nextState.played).toFixed(3) <= (parseFloat(marks[key].value) / 100).toFixed(3) &&
                //  parseFloat(parseFloat(nextState.played).toFixed(3)) + 0.05 >= parseFloat((parseFloat(marks[key].value) / 100).toFixed(3))) {
                let valueIntoSeconds = parseFloat(convertHMStoSeconds(marks[key].value), 10);

                if(notInArray &&
                    parseFloat(nextState.playedSeconds) <= valueIntoSeconds &&
                    nextState.playedSeconds + 0.35 >= valueIntoSeconds) {
                    let toBeTriggered = triggerArray;
                    toBeTriggered.push(marks[key]);
                    plugin.setState({ toBeTriggered });
                }
            });
        }
    }

    componentWillMount() {
        if(this.props.state.currentState !== undefined) {
            let initialPoint = parseFloat(convertHMStoSeconds(this.props.state.currentState)) + 0.35;
            this.setState({ initialPoint });
        }
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
        // if (!this.state.seeking) {
        this.setState(state);
        // }

    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }
        if (nextProps.props.show !== this.props.props.show) {
            this.setState({ playing: this.state.comingFromMark || this.props.props.autoplay,
                comingFromMark: nextProps.props.show ? false : this.state.comingFromMark });
        }
    }

    onReady() {
        if(this.player !== undefined && this.state.initialPoint !== undefined) {
            this.player.seekTo(this.state.initialPoint);
            this.setState({ initialPoint: undefined, playing: true, ready: true });
        } else {

            this.setState({ ready: true });
        }
    }
    render() {
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let secondsValue = convertHMStoSeconds(marks[id].value);
            let duration = this.state.duration;
            let value = (secondsValue * 100 / duration) + "%";
            let title = marks[id].title;
            let color = marks[id].color;
            let isPopUp = marks[id].connectMode === "popup";
            let noTrigger = false;
            let isVisor = true;
            return(
                <div key={id} className="videoMark" style={{ background: color || "#17CFC8", left: value, position: "absolute" }} >
                    <Mark style={{ position: 'relative', top: "-1.7em", left: "-0.75em" }}
                        color={color || "#17CFC8"}
                        idKey={id}
                        title={title}
                        isVisor={isVisor}
                        isPopUp={isPopUp}
                        markConnection={marks[id].connection}
                        noTrigger={noTrigger}
                        onMarkClicked={()=>{this.props.props.onMarkClicked(this.props.props.id, marks[id].value, true);}}
                    />
                </div>
            );
        });

        return (
            <div ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%" }} className="enriched-player-wrapper" duration={this.state.duration}>
                <ReactPlayer
                    ref={player => { this.player = player; }}
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    progressInterval={300}
                    url={this.props.state.url}
                    playing={this.state.playing}
                    volume={this.state.volume}
                    // fileConfig={{ attributes: { poster: img } }}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress.bind(this)}
                    onDuration={duration => this.setState({ duration })}
                    onReady={this.onReady.bind(this)}
                />
                {(this.state.controls) && (
                    <div className="player-media-controls flexControls visorControls" style={{ pointerEvents: 'all' }}>
                        <button className="play-player-button" onClick={this.playPause.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-player-input dropableRichZone" style={{ height: "1.7em", position: "relative" }}
                            // value={this.state.played}
                            onMouseDown={this.onSeekMouseDown.bind(this)}
                            onChange={this.onSeekChange.bind(this)}
                            onMouseUp={this.onSeekMouseUp.bind(this)}>
                            <div className="fakeProgress" style={{ top: "0", zIndex: 0 }} />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%", top: "0" }} />
                            {this.state.ready ? markElements : null}
                        </div>
                        <div className="durationField">{ Math.trunc(this.state.playedSeconds / 60) + ":" + pad(Math.trunc(this.state.playedSeconds % 60)) + "/" + Math.trunc(this.state.duration / 60) + ":" + pad(Math.trunc(this.state.duration % 60))}</div>
                        <input className="volume-player-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.setVolume.bind(this)} />
                        <button className="fullscreen-player-button" onClick={this.onClickFullscreen.bind(this)}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</button>
                    </div>)}
            </div>
        );
    }
}

/* eslint-enable react/prop-types */
