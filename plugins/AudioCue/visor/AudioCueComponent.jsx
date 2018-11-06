import React from 'react';
require('../AudioCue.scss');

import imagePlay from "./../../../dist/images/play.svg";
import imagePause from "./../../../dist/images/pause.svg";

/* eslint-disable react/prop-types */

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

        if(this.state.playing) {
            this.audio.play();
        } else {
            this.audio.pause();
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
                        style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "100%" }}
                        src={state.icon}
                    />
                </button>
            </div>
        );
    }

}
