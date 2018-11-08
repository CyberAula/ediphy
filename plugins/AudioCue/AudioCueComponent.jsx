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

        let useImage = state.useImage;
        console.log('[INFO] El color del plugin es :' + state.colorCue);
        console.log('[INFO] useImage = ' + state.useImage);
        console.log('[INFO] autoPlay = ' + state.autoplay);
        console.log('[INFO] icon = ' + state.icon);

        return(
            <div className={"audioCueConatiner"} style={{ width: "100%", height: "100%" }}>

                <button onClick={this.playPause.bind(this)} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
                    <div className={"colorBackground"} style={{ height: "100%", width: "100%", pointerEvents: "initial", backgroundColor: state.colorCue, visibility: useImage ? "hidden" : "visible" }} />
                    <img ref ="img"
                        className="basicImageClass"
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "100%" : "100%", visibility: useImage ? "visible" : "hidden", position: "absolute" }}
                        src={state.icon}
                    />
                    <div className={"loader"} id="bars" onClick={this.playPause.bind(this)} style={{ position: "absolute", display: state.hideAnimation ? "none" : "block" }}>
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
                    <img className={ state.hideAnimation ? "playButtonCentered" : "playButton"} src={imagePlayPause} />

                </button>
            </div>
        );
    }

}

/* eslint-enable react/prop-types */

