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

        return(
            <div>
                <div className={"loader"} id="bars" onClick={this.playPause.bind(this)} style={{ visibility: this.state.playing ? "visible" : "hidden", position: "absolute" }}>
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barUp" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />
                    <div className="barDown" />

                </div>
                <button onClick={this.playPause.bind(this)} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
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
