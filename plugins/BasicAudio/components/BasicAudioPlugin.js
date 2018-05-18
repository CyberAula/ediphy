import React from 'react';
import { findDOMNode } from 'react-dom';
// import ReactAudioPlayer from 'react-audio-player';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import img from './../../../dist/images/broken_link.png';
import WaveSurfer from 'wavesurfer.js';
import ReactWavesurfer from 'react-wavesurfer';
import Mark from '../../../common/components/mark/Mark';
export default class BasicAudioPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
            posPctg: 0,
            volume: 0.5,
            controls: true,
            duration: 1,
            waves: true,
            autoplay: false,
            audioPeaks: null,
            ondas: false, // null??
            name: "No name",
            toBeTriggered: [],
            triggering: false,
        };
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
    }

    handlePosChange(e) {
        console.log('oischa', e.wavesurfer);
        try {
            if (e.wavesurfer.backend.ac.currentTime) {
            }
            this.setState({
                pos: +e.originalArgs[0],
                posPctg: (+e.originalArgs[0] / (this.state.duration || 1)),
            });
        } catch(err) {
            console.error(err);
        }
    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    // cuando el componente va a recibir nuevas nextProps
    /*    componentWillReceiveProps(nextProps) {
        if(nextProps.state.waves === true) {
            this.setState({ waves: true, audioPeaks: this.state.ondas });
            if(this.state.waves === true) {
                if(this.state.progressColor !== nextProps.state.progressColor) {
                    this.setState({ progressColor: nextProps.state.progressColor });
                }else if(this.state.waveColor !== nextProps.state.waveColor) {
                    this.setState({ waveColor: nextProps.state.waveColor });
                }
            }
        } else if (nextProps.state.waves === false) {
            this.setState({ waves: false, audioPeaks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
        }

    }*/

    onProgress(state) {
        console.log(state);
        this.setState(state);
    }

    /*
    componentWillMount: justo antes del render inicial
    componentDidMount: justo despues de que el render inciial ocurra y nunca mas
    */

    // invocado antes de renderizar cuando se reciben nuevas props o estado
    /*  componentWillUpdate(nextProps, nextState) {
        if(nextState.played !== this.state.played) {
            let sudo = this;

            let marks = this.props.props.marks || {};
            let triggerMark = this.props.props.onMarkClicked;
            let triggerArray = this.state.toBeTriggered;
            triggerArray.forEach(function(e) {
                if ((parseFloat(e.value) / 100).toFixed(3) < parseFloat(nextState.played).toFixed(3)) {
                    let toBeTriggered = triggerArray;
                    triggerMark(sudo.props.props.id, e.value, true);
                    toBeTriggered.splice(e, 1);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }
            });

            Object.keys(marks).forEach(function(key) {
                let notInArray = true;

                triggerArray.forEach(function(mark) {
                    if(mark === key) {
                        notInArray = false;
                    }
                });

                if(notInArray && parseFloat(nextState.played).toFixed(3) <= (parseFloat(marks[key].value) / 100).toFixed(3) && parseFloat(parseFloat(nextState.played).toFixed(3)) + 0.1 >= parseFloat((parseFloat(marks[key].value) / 100).toFixed(3))) {
                    let toBeTriggered = triggerArray;
                    toBeTriggered.push(marks[key]);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }
            });
        }
    }*/

    onReady(e) {
        this.setState({
            duration: e.wavesurfer.backend.buffer.duration,
            pos: 0,
            posPctg: 0,
            autoplay: this.props.state.autoplay,
            ondas: e.wavesurfer.backend.mergedPeaks,
            waveColor: e.wavesurfer.params.waveColor,
            progressColor: e.wavesurfer.params.progressColor,
        });
    }
    componentWillUpdate(nextProps, nextState) {
        if(nextState.pos !== this.state.pos) {
            let sudo = this;

            let marks = this.props.props.marks || {};
            let triggerMark = this.props.props.onMarkClicked;
            let triggerArray = this.state.toBeTriggered;
            triggerArray.forEach(function(e) {
                if ((parseFloat(e.value) / 100).toFixed(3) < parseFloat(nextState.posPctg).toFixed(3)) {
                    let toBeTriggered = triggerArray;
                    triggerMark(sudo.props.props.id, e.value, true);
                    toBeTriggered.splice(e, 1);
                    sudo.setState({ toBeTriggered: toBeTriggered });
                }
            });

            Object.keys(marks).forEach(function(key) {
                let notInArray = true;

                triggerArray.forEach(function(mark) {
                    if(mark === key) {
                        notInArray = false;
                    }
                });

                if(notInArray && parseFloat(nextState.posPctg).toFixed(3) <= (parseFloat(marks[key].value) / 100).toFixed(3) && parseFloat(parseFloat(nextState.posPctg).toFixed(3)) + 0.1 >= parseFloat((parseFloat(marks[key].value) / 100).toFixed(3))) {
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
            peaks: this.state.peaks,
            cursorColor: 'grey',
        };

            /* Podemos pasar una devolución de llamada en los refs*/
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            let isPopUp = marks[id].connectMode === "popup";
            let noTrigger = true;
            let isVisor = true;
            return(
                <div key={id} className="videoMark" style={{ background: color || "#17CFC8", left: value, position: "absolute" }} >
                    <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }}
                        color={color || "#17CFC8"}
                        idKey={id}
                        title={title}
                        isVisor={isVisor}
                        isPopUp={isPopUp}
                        markConnection={marks[id].connection}
                        noTrigger={noTrigger}/>
                </div>
            );
        });

        return (
            <div className="basic-audio-wrapper" ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
                <div>

                    <div className="progress-audio-input dropableRichZone" style={{ pointerEvents: "auto" }}>
                        {markElements}
                    </div>

                    <div className="react-wavesurfer">
                        <ReactWavesurfer
                            style={{ width: "100%", height: "100%" }}
                            height="100%"
                            width="100%"
                            audioFile={this.props.state.url}
                            playing={this.state.playing}
                            audioPeaks={this.state.audioPeaks}
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
                            <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                            <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
