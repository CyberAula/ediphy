import React from 'react';
import { convertHMStoSeconds, pad, setRgbaAlpha } from '../../../common/commonTools';
import ReactWavesurfer from 'react-wavesurfer';
import Mark from '../../../common/components/mark/Mark';
import { AudioPlugin, WaveSurferContainer, VisorControls, Duration, AudioMark, MarkBar, Volume, Play } from "../Styles";
/* eslint-disable react/prop-types */

export default class BasicAudioPlugin extends React.Component {
    state = {
        pos: 0,
        posPctg: 0,
        volume: 0.5,
        controls: true,
        duration: 1,
        waves: this.props.state.waves,
        autoplay: this.props.state.autoplay,
        ondas: null,
        toBeTriggered: [],
        triggering: false,
        playedSeconds: 0,
    };

    handleTogglePlay = () => this.setState({ playing: !this.state.playing });

    handlePosChange = e => {
        try {
            if (e.wavesurfer.backend.ac.currentTime) {
            }
            this.setState({
                pos: +e.originalArgs[0],
                posPctg: (+e.originalArgs[0] / (this.state.duration || 1)),
            });
        } catch(err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    };

    handleVolumeChange = e => this.setState({ volume: +e.target.value });

    onReady = e => {
        let pos = this.state.pos;
        let posPctg = 0;
        let duration = e.wavesurfer.backend.buffer.duration;
        if (this.props.state.currentState) {
            try{
                posPctg = this.props.state.currentState;
                pos = convertHMStoSeconds(posPctg) + 1; // (parseInt(posPctg.substr(0, 5), 10) + 2) * duration / 100;
            }catch(_e) {
                // eslint-disable-next-line no-console
                console.log(_e);
            }
        }
        this.setState({
            duration,
            pos,
            posPctg,
            autoplay: this.props.state.autoplay,
            playing: this.props.state.autoplay || this.props.state.currentState,
            waves: this.props.state.waves,
            ondas: this.props.state.waves,
            waveColor: e.wavesurfer.params.waveColor,
            progressColor: e.wavesurfer.params.progressColor,
        });
    };
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(nextState.pos !== this.state.pos) {
            let prevPos = parseFloat(this.state.pos).toFixed(3);
            let nextPos = parseFloat(nextState.pos).toFixed(3);
            let sudo = this;
            let marks = this.props.props.marks || {};
            let triggerMark = this.props.props.onMarkClicked;
            let triggerArray = this.state.toBeTriggered;

            triggerArray.forEach(function(e, i) {
                // if (((parseFloat(e.value) / 100).toFixed(3) < nextPos) && (nextPos - prevPos) < 0.04) {
                if (parseFloat(convertHMStoSeconds(e.value)) < nextPos && (nextPos - prevPos) < 0.04) {
                    let toBeTriggered = triggerArray;
                    triggerMark(sudo.props.props.id, e.value, true);
                    toBeTriggered.splice(i, 1);
                    sudo.setState({ toBeTriggered: toBeTriggered, comingFromMark: true, playing: false });
                }
            });

            Object.keys(marks).forEach(function(key) {
                let notInArray = true;

                triggerArray.forEach(function(mark) {
                    if(mark.id === key) {
                        notInArray = false;
                    }
                });
                // let mValue = convertHMStoSeconds(marks[key].value);
                // if(notInArray && nextPos <= mValue && parseFloat(nextPos) + 0.05 >= parseFloat(mValue) && (nextPos - prevPos) < 0.04) {
                if(notInArray &&
                        nextPos <= parseFloat(convertHMStoSeconds(marks[key].value)) && parseFloat(nextPos) + 0.3 >= parseFloat(marks[key].value) &&
                        (nextPos - prevPos) < 1) {
                    let toBeTriggered = triggerArray;
                    toBeTriggered.push(marks[key]);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }

            });
        }
        if(nextProps.props.show && !this.props.props.show && nextState.comingFromMark) {
            this.setState({ comingFromMark: false, playing: true });

        }
        if (!nextProps.props.show && this.props.props.show) {
            this.setState({ playing: false });
        }
    }
    render() {
        let color = this.props.state.progressColor.custom ? this.props.state.progressColor.color : this.props.props.themeColors.themeColor1;

        const waveOptions = {
            scrollParent: false, // muestra toda la onda
            hideScrollbar: false,
            progressColor: color,
            waveColor: setRgbaAlpha(color, 0.5),
            normalize: true,
            barWidth: (this.props.state.barWidth > 0 ? this.props.state.barWidth : undefined),
            cursorColor: 'grey',
            height: this.props.state.waves ? 128 : 0,
        };

        const playIcon = this.state.playing ? <i className="material-icons">pause</i>
            : <i className="material-icons">play_arrow</i>;

        /* Podemos pasar una devolución de llamada en los refs*/
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let secondsValue = convertHMStoSeconds(marks[id].value);
            let duration = this.state.duration;
            let value = (secondsValue * 100 / duration) + "%";
            let title = marks[id].title;
            let content = marks[id].content;
            let colorImage = marks[id].color;
            let size = marks[id].size;
            let markColor = marks[id].color;
            let markType = marks[id].markType;
            let themeColor = this.props.state.progressColor.custom ? this.props.state.progressColor.color : this.props.props.themeColors.themeColor1;
            let isPopUp = marks[id].connectMode === "popup";
            let noTrigger = false;
            let isVisor = true;

            return(
                <AudioMark key={id} style={{ background: markColor || themeColor || "#17CFC8", left: value, position: "absolute" }} >
                    <Mark style={{ position: 'relative', top: "-1.7em", left: "-1em" }}
                        content={content}
                        color={colorImage}
                        size={size}
                        markType={markType}
                        idKey={id}
                        title={title}
                        isVisor={isVisor}
                        isPopUp={isPopUp}
                        markConnection={marks[id].connection}
                        noTrigger={noTrigger}
                        onMarkClicked={()=>{this.props.props.onMarkClicked(this.props.props.id, marks[id].value, true);}}/>
                </AudioMark>
            );
        });

        return (
            <AudioPlugin
                ref={player_wrapper => {this.player_wrapper = player_wrapper;}}
                style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
                <MarkBar> {markElements}</MarkBar>
                <div className={'duration'} duration={this.state.duration} style={{ display: 'none' }}/>
                <WaveSurferContainer duration={this.state.duration} style={{ width: "100%", height: "100%" }}>
                    <ReactWavesurfer
                        style={{ width: "100%", height: "100%" }}
                        height="100%"
                        width="100%"
                        audioFile={this.props.state.url}
                        playing={this.state.playing}
                        volume={this.state.volume}
                        options={waveOptions}
                        pos={this.state.pos}
                        onPosChange={this.handlePosChange.bind(this)}
                        onReady= {this.onReady.bind(this)}
                        onPlay={() => this.setState({ playing: true })}
                        onPause={() => this.setState({ playing: false })}
                        onFinish={() => this.setState({ playing: false })}
                    />
                </WaveSurferContainer>
                {(this.props.state.controls) && (
                    <VisorControls className="audio-controls visorControls" style={{ pointerEvents: 'auto' }}>
                        <Play onClick={this.handleTogglePlay.bind(this)}>{playIcon}</Play>
                        <Duration>{ Math.trunc(this.state.pos / 60) + ":" + pad(Math.trunc(this.state.pos % 60)) + "/" + Math.trunc(this.state.duration / 60) + ":" + pad(Math.trunc(this.state.duration % 60))}</Duration>
                        <Volume value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                    </VisorControls>
                )}
            </AudioPlugin>
        );
    }
}
/* eslint-enable react/prop-types */
