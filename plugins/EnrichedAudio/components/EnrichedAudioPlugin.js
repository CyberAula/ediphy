import React from 'react';
import { findDOMNode } from 'react-dom';
// import ReactAudioPlayer from 'react-audio-player';
import WaveSurfer from 'wavesurfer.js';
import ReactWavesurfer from 'react-wavesurfer';
import Mark from '../../../common/components/mark/Mark';
/* eslint-disable react/prop-types */

export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
            posPctg: 0,
            volume: 0.5,
            controls: true,
            duration: 1,
            waves: this.props.state.waves,
            autoplay: this.props.state.autoplay,
            // audioPeaks: null,
            ondas: null,
            toBeTriggered: [],
            triggering: false,
        };
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
    }

    handlePosChange(e) {
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
    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    onProgress(state) {
        this.setState(state);
    }

    onReady(e) {
        let pos = this.state.pos;
        let posPctg = 0;
        let duration = e.wavesurfer.backend.buffer.duration;
        if (this.props.state.currentState) {
            try{
                posPctg = this.props.state.currentState;
                pos = (parseInt(posPctg.substr(0, 5), 10) + 2) * duration / 100;
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
            waves: this.props.state.waves,
            ondas: this.props.state.waves,
            waveColor: e.wavesurfer.params.waveColor,
            progressColor: e.wavesurfer.params.progressColor,
        });
        if (this.props.state.autoplay) {
            this.setState({ playing: true });
        }

    }
    componentWillUpdate(nextProps, nextState) {
        if(nextState.pos !== this.state.pos) {
            // console.log(this.state.toBeTriggered);
            let prevPos = parseFloat(this.state.posPctg).toFixed(3);
            let nextPos = parseFloat(nextState.posPctg).toFixed(3);
            let sudo = this;
            let marks = this.props.props.marks || {};
            let triggerMark = this.props.props.onMarkClicked;
            let triggerArray = this.state.toBeTriggered;

            triggerArray.forEach(function(e, i) {
                if (((parseFloat(e.value) / 100).toFixed(3) < nextPos) && (nextPos - prevPos) < 0.04) {
                    let toBeTriggered = triggerArray;
                    triggerMark(sudo.props.props.id, e.value, true);
                    toBeTriggered.splice(i, 1);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }
            });

            Object.keys(marks).forEach(function(key) {
                let notInArray = true;

                triggerArray.forEach(function(mark) {
                    if(mark.id === key) {
                        notInArray = false;
                    }
                });
                let mValue = (parseFloat(marks[key].value) / 100).toFixed(3);
                if(notInArray && nextPos <= mValue && parseFloat(nextPos) + 0.05 >= parseFloat(mValue) && (nextPos - prevPos) < 0.04) {
                    let toBeTriggered = triggerArray;
                    toBeTriggered.push(marks[key]);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }

            });
        }
    }
    render() {
        const waveOptions = {
            scrollParent: false, // muestra toda la onda
            hideScrollbar: false,
            progressColor: this.props.state.progressColor,
            waveColor: this.props.state.waveColor,
            normalize: true,
            barWidth: (this.props.state.barWidth > 0 ? this.props.state.barWidth : undefined),
            // peaks: this.state.peaks,
            cursorColor: 'grey',
            height: this.props.state.waves ? 128 : 0,
        };

            /* Podemos pasar una devolución de llamada en los refs*/
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            let isPopUp = marks[id].connectMode === "popup";
            let noTrigger = false;
            let isVisor = true;
            return(
                <div key={id} className="audioMark" style={{ background: color || "#17CFC8", left: value, position: "absolute" }} >
                    <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }}
                        color={color || "#17CFC8"}
                        idKey={id}
                        title={title}
                        isVisor={isVisor}
                        isPopUp={isPopUp}
                        markConnection={marks[id].connection}
                        noTrigger={noTrigger}
                        onMarkClicked={()=>{this.props.props.onMarkClicked(this.props.props.id, value, true);}}/>
                </div>
            );
        });

        return (
            <div className="basic-audio-wrapper"
                ref={player_wrapper => {this.player_wrapper = player_wrapper;}}
                style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
                <div>

                    <div className="markBar"> {markElements}</div>
                    <div className="react-wavesurfer" style={{ width: "100%", height: "100%" }}>
                        <ReactWavesurfer
                            style={{ width: "100%", height: "100%" }}
                            height="100%"
                            width="100%"
                            audioFile={this.props.state.url}
                            playing={this.state.playing}
                            // audioPeaks={this.state.audioPeaks}
                            volume={this.state.volume}
                            options={waveOptions}
                            pos={this.state.pos}
                            onPosChange={this.handlePosChange.bind(this)}
                            onReady= {this.onReady.bind(this)}
                            onPlay={() => this.setState({ playing: true })}
                            onPause={() => this.setState({ playing: false })}
                            onFinish={() => this.setState({ playing: false })}
                            onLoading={this.onProgress.bind(this)}
                        />
                    </div>
                </div>
                <div>
                    {(this.props.state.controls) && (
                        <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                            <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)} style={{ zIndex: 9999 }}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                            <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
/* eslint-enable react/prop-types */
