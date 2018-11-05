import React from 'react';
import img_broken from './../../../dist/images/broken_link.png';
/* eslint-disable react/prop-types */

export default class AudioCueComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.state.url,
            autoplay: this.props.state.autoplay,
            icon: this.props.state.icon,
            allowDeformed: this.props.state.allowDeformed,
        };
    }
    render() {
        let { props, state } = this.props;
        let audio = new Audio(state.url);
        let playing = false;
        if (state.autoplay) {
            audio.autoplay = true;
            playing = true;
            console.log('[INFO] AutoPlay ON. Audio iniciado.');
        }
        let clickAudio = function() {
            playing = !playing;
            // playing ? console.log(audio.play()) : audio.pause();

            if(playing) {
                audio.play();
                console.log('[INFO] Audio iniciado');
            } else {
                audio.pause();
                console.log('[INFO] Audio pausado');
            }
        };
        return(
            <button onClick={clickAudio} style={{ height: "100%", width: "100%", pointerEvents: "initial" }} className={"draggableImage"} ref={"draggableImage"}>
                <img ref ="img"
                    className="basicImageClass"
                    style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto" }}
                    src={state.icon}
                />
            </button>
        );
    }

}
