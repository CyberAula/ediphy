import React from 'react';
import { findDOMNode } from 'react-dom';
// import screenfull from 'screenfull';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import img from './../../../dist/images/broken_link.png';
import ReactWavesurfer from 'react-wavesurfer';
import Mark from '../../../common/components/mark/Mark';

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: 0,
            volume: 0.5,
            controls: true,
            duration: 1,
            waves: true,
            autoplay: false,
            audioPeaks: null,
            ondas: false, // null??
        };
    }

    handleTogglePlay() {
        this.setState({ playing: !this.state.playing });
    }

    handlePosChange(e) {
        this.setState({
            pos: +e.originalArgs[0],
        });
    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    componentWillReceiveProps(nextProps) {
        /*  if(nextProps.state.autoplay === true && this.state.autoplay !== this.props.state.autoplay) {
            this.setState({ autoplay: true });
        } else if (nextProps.state.autoplay === false && this.state.autoplay !== this.props.state.autoplay) {
            this.setState({ autoplay: false });
        }

        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }*/
        // console.log(this.state)
        // console.log(nextProps.state)
        if(nextProps.state.waves === true) {
            this.setState({ waves: true, audioPeaks: this.state.ondas });
            console.log("false->true");
            console.log(this.state.waves);
            if(this.state.waves === true) {
                console.log(this.state.progressColor);
                console.log(nextProps.state.progressColor);
                if(this.state.progressColor !== nextProps.state.progressColor) {
                    this.setState({ progressColor: nextProps.state.progressColor });
                    console.log("Has cambiado el color");
                }else if(this.state.waveColor !== nextProps.state.waveColor) {
                    this.setState({ waveColor: nextProps.state.waveColor });
                    console.log("Has cambiado el color waves");
                }
            }
        } else if (nextProps.state.waves === false) {
            this.setState({ waves: false, audioPeaks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
            console.log("true->false");
        }
        console.log(this.state.progressColor);

    }

    onProgress(state) {
        this.setState(state);
    }

    onReady(e) {
        // if(this.props.state.autoplay === true){
        this.setState({
            duration: e.wavesurfer.backend.buffer.duration,
            pos: 0,
            autoplay: this.props.state.autoplay,
            ondas: e.wavesurfer.backend.mergedPeaks,
            waveColor: e.wavesurfer.params.waveColor,
            progressColor: e.wavesurfer.params.progressColor,
        });
        // }
        console.log(e);
    }

    render() {
        const waveOptions = {
            scrollParent: true,
            /* true si la waveform avanza con el tiempo de la cancion
            false si se va a ver la waveform entera, en este caso no tenemos barra de progreso oscura*/
            height: 100, // NO DEBERIA FIJARLO, SI HAGO ALTA LA CAJA NO VARIA
            hideScrollbar: false,
            progressColor: this.state.progressColor, // parte de la izquierda
            waveColor: 'violet', // this.state.waveColor, //parte de la derecha
            normalize: true,
            // reflection:true,
            peaks: this.state.peaks,
        };

        console.log(waveOptions);

        /* Podemos pasar una devolución de llamada en los refs*/
        let marks = this.props.props.marks || {};
        let markElements = Object.keys(marks).map((id) =>{
            // aqui solo entra cuando le das a save changes
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;
            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute" }} time={1.5} mark={id} onRichMarkUpdated={this.props.props.onRichMarkUpdated} state={this.props.state} base={this.props.base}>
                    <a key={id} href="#">
                        <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                            <Mark style={{ position: 'relative', top: "-24px", left: "-10px" }} color={color || "#17CFC8"} idKey={id} title={title} />
                        </div>
                    </a>
                </MarkEditor>);
        });

        return (
            <div className="basic-audio-wrapper" ref={player_wrapper => {this.player_wrapper = player_wrapper;}} style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>

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

                {(this.props.state.controls) && (
                    <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                        <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-audio-input dropableRichZone" style={{ height: "15px", position: "relative", width: this.state.duration, pointerEvents: "auto" }}>
                            <div className="fakeProgress" style={{ pointerEvents: "auto" }}/>
                            <input className="mainSlider" style={{ left: (this.state.pos * 100) / this.state.duration, pointerEvents: "auto" }} type='range' min={0} max={100} onChange={this.handlePosChange.bind(this)} />
                            {markElements}
                        </div>
                        <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                    </div>
                )}
            </div>
        );
        //  <button className="peaks-button" onClick={this.handleLoadingPeaks.bind(this)}> { this.props.state.waves ? <i className="material-icons" style={{ pointerEvents: 'auto' }}>equalizer</i> : <i className="material-icons" style={{ pointerEvents: 'none' }}>equalizer</i>}</button>
    }
}
