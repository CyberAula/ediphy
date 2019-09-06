import React from 'react';
/* eslint-disable react/prop-types */
require('./AudioCue.scss');
import imagePlay from "./../../dist/images/play.svg";
import imagePause from "./../../dist/images/pause.svg";
import { generateCustomColors } from "../../common/themes/themeLoader";

export default class AudioCueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
        };
        this.audio = new Audio(props.state.url);
        this.managePlaying = this.managePlaying.bind(this);
        this.playPause = this.playPause.bind(this);
    }
    playPause() {
        this.setState({ playing: !this.state.playing });
    }

    managePlaying() {
        if(this.state.playing) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }
    // If deleted while playing, audio should be stopped
    componentWillUnmount() {
        this.audio.pause();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.state.url !== nextProps.state.url) {
            this.audio.setAttribute('src', nextProps.state.url);
        }
    }

    render() {
        let { state } = this.props;
        this.managePlaying();

        let cueColor = state.cueColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.cueColor.custom ? generateCustomColors(cueColor, 1, true) : null;

        let useImage = state.useImage;
        let imagePlayPause = this.state.playing ? imagePause : imagePlay;

        let animationState = this.state.playing ? "running" : "paused";
        let barsUp = Array(15).fill().map((a, i) => <div key={i} className={this.state.playing ? "barUp playing" : "barUp"} style={{ animationPlayState: animationState }}/>);
        let barsDown = Array(15).fill().map((a, i) => <div key={i + 15} className={this.state.playing ? "barDown playing" : "barDown"} style={{ animationPlayState: animationState }}/>);
        let bars = [...barsUp, ...barsDown];
        return(
            <div className={"audioCueContainer"} style={ customStyle }>
                <div className={"draggableImage"} ref={"draggableImage"} onClick={this.playPause}>
                    <div key={0} className={"colorBackground"} style={{ visibility: useImage ? "hidden" : "visible" }} />
                    <img key={1} ref ="img"
                        className="basicImageClass"
                        style={{ visibility: useImage ? "visible" : "hidden" }}
                        src={state.icon}
                    />
                    { state.hideAnimation ? null : <div key={2} className={"loader"} onClick={this.playPause}>
                        {bars}
                    </div>}
                    <img key={3} className={ state.hideAnimation ? "playButtonCentered" : "playButton"} src={imagePlayPause} />
                </div>
            </div>
        );
    }
}

/* eslint-enable react/prop-types */

