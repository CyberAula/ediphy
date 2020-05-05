import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import MarkEditor from '../../../_editor/components/richPlugins/markEditor/MarkEditor';
import Mark from '../../../common/components/mark/Mark';
import { convertHMStoSeconds } from "../../../common/commonTools";
import { pad } from '../../../common/commonTools';
import {
    FakeProgress,
    MediaControls,
    Play,
    PlayerPlugin,
    Progress,
    FullScreen,
    Duration,
    Volume,
    MainSlider, VideoMark,
} from "../Styles";
import _handlers from "../../../_editor/handlers/_handlers";

/* eslint-disable react/prop-types */

export default class EnrichedPlayerPluginEditor extends React.Component {
    state = {
        volume: 0.8,
        duration: 0,
        played: 0,
        playedSeconds: 0,
        seeking: false,
        fullscreen: false,
    };

    h = _handlers(self);

    playPause = () => this.setState({ playing: !this.state.playing });

    onClickFullscreen = () => {
        if(!this.state.fullscreen) {
            screenfull.request(findDOMNode(this.player_wrapper));
        } else {
            screenfull.exit();
        }
        this.setState({ fullscreen: !this.state.fullscreen });
    }

    setVolume = e => this.setState({ volume: parseFloat(e.target.value) });

    onSeekMouseDown = () => this.setState({ seeking: true });

    onSeekChange = e => this.setState({ played: (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width });

    onSeekMouseUp = e => {
        if(e.target.className.indexOf('progress-player-input') !== -1 ||
            e.target.className.indexOf('fakeProgress') !== -1 ||
            e.target.className.indexOf('mainSlider') !== -1) {
            let pos = (e.clientX - e.target.getBoundingClientRect().left) / e.target.getBoundingClientRect().width;
            this.player.seekTo(pos);
            this.setState({ seeking: false, played: pos });
        }
    };

    onProgress = state => {
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state);
        }
    };

    getDuration = () => this.state.duration;

    onReady = () => this.setState({ ready: true });

    render() {
        let marks = this.props.props.marks || {};
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
                <MarkEditor key={id} style={{ left: value, position: "absolute", top: "0.3em" }} dispatch={this.props.props.dispatch} boxId={this.props.props.id} time={1.5} mark={id} marks={marks} onRichMarkMoved={this.h.onRichMarkMoved} state={this.props.state} base={this.props.base}>
                    <VideoMark style={{ background: color || "#17CFC8" }}>
                        <Mark pluginType={'player'} style={{ position: 'relative', top: "-1.7em", left: "-0.75em" }} color={color || "#17CFC8"} idKey={id} size={size} title={title} content={content} markType={markType} />
                    </VideoMark>
                </MarkEditor>);
        });

        return (
            <PlayerPlugin className='enriched-player-wrapper' ref={player_wrapper => {this.player_wrapper = player_wrapper;}} duration={this.state.duration}>
                <div className={'duration'} duration={this.state.duration} style={{ display: 'none' }}/>
                <ReactPlayer
                    ref={player => { this.player = player; }}
                    style={{ width: "100%", height: "100%" }}
                    height="100%"
                    width="100%"
                    url={this.props.state.url}
                    playing={this.state.playing}
                    volume={this.state.volume}
                    onPlay={() => this.setState({ playing: true })}
                    onPause={() => this.setState({ playing: false })}
                    onEnded={() => this.setState({ playing: false })}
                    onProgress={this.onProgress}
                    onReady={this.onReady}
                    onDuration={duration => {this.setState({ duration });}}
                />
                {this.props.state.controls ?
                    <MediaControls>
                        <Play onClick={this.playPause}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</Play>
                        <Progress
                            onMouseDown={this.onSeekMouseDown}
                            onChange={this.onSeekChange}
                            onMouseUp={this.onSeekMouseUp}>
                            <FakeProgress/>
                            <MainSlider style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {this.state.ready ? markElements : null}
                        </Progress>
                        <Duration>{ Math.trunc(this.state.playedSeconds / 60) + ":" + pad(Math.trunc(this.state.playedSeconds % 60)) + "/" + Math.trunc(this.state.duration / 60) + ":" + pad(Math.trunc(this.state.duration % 60))}</Duration>
                        <Volume value={this.state.volume} onChange={this.setVolume} />
                        <FullScreen onClick={this.onClickFullscreen}>{(!this.state.fullscreen) ? <i className="material-icons">fullscreen</i> : <i className="material-icons">fullscreen_exit</i>}</FullScreen>
                    </MediaControls> :

                    <MediaControls style={{ pointerEvents: 'all', visibility: 'hidden' }}>
                        <Progress>
                            <FakeProgress/>
                            <MainSlider style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {this.state.ready ? markElements : null}
                        </Progress>
                    </MediaControls>}
            </PlayerPlugin>
        );
    }
}
/* eslint-enable react/prop-types */
