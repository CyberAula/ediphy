import React from 'react';
require('../AudioCue.scss');

import imagePlay from "./../../../dist/images/play.svg";
import imagePause from "./../../../dist/images/pause.svg";

/* eslint-disable react/prop-types */

export default class AudioCueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoplay: this.props.state.autoplay,

        };
        this.audio = new Audio(props.url);
    }
    playPause() {
        this.setState({ playing: !this.state.playing });
    }

    componentWillMount() {
        if(this.state.autoplay) {
            this.setState({ playing: true });
        }
    }
    componentWillUnmount() {
        this.audio.pause();
    }

    render() {
        let { props, state } = this.props;
        this.audio.setAttribute('src', state.url);
        // this.audio.load();

        let imagePlayPause = this.state.playing ? imagePause : imagePlay;
        let useImage = state.useImage;

        if(this.state.playing) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
        return(
            <div className={"audioCueConatiner"} style={{ width: "100%", height: "100%" }}>

                <button onClick={this.playPause.bind(this)} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
                    <div className={"colorBackground"} style={{ height: "100%", width: "100%", pointerEvents: "initial", backgroundColor: state.colorCue, visibility: useImage ? "hidden" : "visible" }} />
                    <img ref ="img"
                        className="basicImageClass"
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "100%" : "100%", visibility: useImage ? "visible" : "hidden", position: "absolute" }}
                        src={state.icon}
                    />
                    <div className={"loader"} id="bars" onClick={this.playPause.bind(this)} style={{ position: "absolute" }}>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>

                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>
                        <div className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: this.state.playing ? "running" : "paused" }}/>

                    </div>
                    <img className={"playButton"} src={imagePlayPause} />

                </button>
            </div>
        );
    }

}
