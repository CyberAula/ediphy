import React from 'react';
/* eslint-disable react/prop-types */
require('./AudioCue.scss');
import imagePlay from "./../../dist/images/play.svg";
import imagePause from "./../../dist/images/pause.svg";

export default class AudioCueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.state.url,
            autoplay: this.props.state.autoplay,
            icon: this.props.state.icon,
            allowDeformed: this.props.state.allowDeformed,
            playing: false,
            useImage: this.props.state.useImage,
            colorCue: this.props.state.colorCue,
        };
        this.audio = new Audio(props.url);
    }
    playPause() {
        console.log('[INFO] this.state.playing is: ' + this.state.playing);
        if (this.state.playing) {
            console.log();
            // this.audio.pause();
            console.log('[INFO] Audio pausado');
        } else {
            // console.log(this.audio.play());
            console.log('[INFO] Audio iniciado');
        }
        this.setState({ playing: !this.state.playing });
    }
    // If deleted while playing, audio should be stopped
    componentWillUnmount() {
        this.audio.pause();
    }
    render() {
        let { props, state } = this.props;
        this.audio.setAttribute('src', state.url);
        // this.audio.load();
        let imagePlayPause = this.state.playing ? imagePause : imagePlay;
        if(this.state.playing) {
            this.audio.play();
            console.log('[INFO] Audio iniciado');
        } else {
            this.audio.pause();
            console.log('[INFO] Audio pausado');
        }

        console.log('[INFO] El color del plugin es :' + this.state.colorCue);

        return(
            <div className={"audioCueConatiner"} style={{ width: "100%", height: "100%" }}>

                <button onClick={this.playPause.bind(this)} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
                    <div className={"colorBackground"} style={{ height: "100%", width: "100%", pointerEvents: "initial", backgroundColor: this.state.colorCue }} />
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
                    <img ref ="img"
                        className="basicImageClass"
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto", visibility: "hidden" }}
                        src={state.icon}
                    />
                </button>
            </div>
        );
    }

}
