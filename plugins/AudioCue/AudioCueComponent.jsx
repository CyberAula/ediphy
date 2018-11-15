import React from 'react';
/* eslint-disable react/prop-types */
require('./AudioCue.scss');
import imagePlay from "./../../dist/images/play.svg";
import imagePause from "./../../dist/images/pause.svg";

export default class AudioCueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
        };
        this.audio = new Audio(props.state.url);
    }
    playPause() {
        this.setState({ playing: !this.state.playing });
    }
    // If deleted while playing, audio should be stopped
    componentWillUnmount() {
        this.audio.pause();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.state.url !== nextProps.state.url) {
            this.audio.setAttribute('src', nextProps.state.url);
        }
    }
    render() {
        let { props, state } = this.props;
        let imagePlayPause = this.state.playing ? imagePause : imagePlay;
        if(this.state.playing) {
            this.audio.play();
        } else {
            this.audio.pause();
        }

        let useImage = state.useImage;
        return(
            <div className={"audioCueConatiner"} style={{ width: "100%", height: "100%" }}>

                <div onClick={this.playPause.bind(this)} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
                    <div className={"colorBackground"} style={{ height: "100%", width: "100%", pointerEvents: "initial", backgroundColor: state.colorCue, visibility: useImage ? "hidden" : "visible" }} />
                    <img ref ="img"
                        className="basicImageClass"
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "100%" : "100%", visibility: useImage ? "visible" : "hidden", position: "absolute" }}
                        src={state.icon}
                    />
                    { state.hideAnimation ? null : <div className={"loader"} id="bars" onClick={this.playPause.bind(this)} style={{ position: "absolute", display: "block" }}>
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
                    </div>}
                    <img className={ state.hideAnimation ? "playButtonCentered" : "playButton"} src={imagePlayPause} />
                </div>
            </div>
        );
    }

}

/* eslint-enable react/prop-types */

