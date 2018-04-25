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
            // audioFile: '',
            playing: false,
            pos: 0,
            volume: 0.5,
            audioRate: 1,
            controls: true,
            audioPeaks: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        };
        this.handleAudioRateChange = this.handleAudioRateChange.bind(this);
    }

    handleTogglePlay() {
        console.log("le has dado a play/pause");
        this.setState({
            playing: !this.state.playing,
        });
    }

    handlePosChange(e) {
        this.setState({
            pos: e.originalArgs ? e.originalArgs[0] : +e.target.value,
        });
    }

    handleReady() {
        this.setState({
            pos: 5,
        });
    }

    handleVolumeChange(e) {
        this.setState({
            volume: +e.target.value,
        });
    }

    handleAudioRateChange(e) {
        this.setState({
            audioRate: +e.target.value,
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.state.controls === true && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: true });
        } else if (nextProps.state.controls === false && this.state.controls !== this.props.state.controls) {
            this.setState({ controls: false });
        }
    }

    /* Barra de progreso del audio:

<div className="form-group col-xs-4">
    <label htmlFor="simple-pos">Position:</label>
        <input name="simple-pos" type="number" step="0.01" value={this.state.pos} onChange={this.handlePosChange} className="form-control"/>
</div>

const timelineOptions = {
    timeInterval: 0.5,
    height: 30,
    primaryFontColor: '#00f',
    primaryColor: '#00f'
};
<Timeline options={timelineOptions}/>

*/

    handleLoadingPeaks() {
        console.log(this.state.audioPeaks);
        if (this.state.audioPeaks["0"] === 0) {
            console.log("first if");
            this.setState({
                audioPeaks: [
                    0.0218, 0.0183, 0.0165, 0.0198, 0.2137, 0.2888, 0.2313, 0.15, 0.2542, 0.2538,
                    0.2358, 0.1195, 0.1591, 0.2599, 0.2742, 0.1447, 0.2328, 0.1878, 0.1988, 0.1645, 0.1218,
                    0.2005, 0.2828, 0.2051, 0.1664, 0.1181, 0.1621, 0.2966, 0.189, 0.246, 0.2445, 0.1621,
                    0.1618, 0.189, 0.2354, 0.1561, 0.1638, 0.2799, 0.0923, 0.1659, 0.1675, 0.1268, 0.0984,
                    0.0997, 0.1248, 0.1495, 0.1431, 0.1236, 0.1755, 0.1183, 0.1349, 0.1018, 0.1109, 0.1833,
                    0.1813, 0.1422, 0.0961, 0.1191, 0.0791, 0.0631, 0.0315, 0.0157, 0.0166, 0.0108],
            });
        }else{
            this.setState({
                audioPeaks: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            });
        }
    }

    render() {

        const waveOptions = {
            scrollParent: true,
            height: 100,
            progressColor: '#6c718c',
            waveColor: '#c4c8dc',
            normalize: true,
            barWidth: 4,
            audioRate: this.state.audioRate,
            position: "relative",
        };

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
                <ReactWavesurfer
                    audioFile={this.props.state.url}
                    pos={this.state.pos}
                    onPosChange={this.handlePosChange.bind(this)}
                    playing={this.state.playing}
                    audioPeaks={this.state.audioPeaks}
                    volume={this.state.volume}
                    options={waveOptions}
                    onReady={this.handleReady.bind(this)}
                />

                {(this.props.state.controls) && (
                    <div className="audio-controls" style={{ pointerEvents: 'auto' }}>
                        <button className="play-audio-button" onClick={this.handleTogglePlay.bind(this)}>{this.state.playing ? <i className="material-icons">pause</i> : <i className="material-icons">play_arrow</i>}</button>
                        <div className="progress-audio-input dropableRichZone" style={{ height: "15px", position: "relative" }}>
                            <div className="fakeProgress" />
                            <div className="mainSlider" style={{ position: "absolute", left: this.state.played * 100 + "%" }} />
                            {markElements}
                        </div>
                        <input className="volume-audio-input " type='range' min={0} max={1} step='any' value={this.state.volume} onChange={this.handleVolumeChange.bind(this)} />
                        <button className="peaks-button" onClick={this.handleLoadingPeaks.bind(this)}> { <i className="material-icons" style={{ pointerEvents: 'auto' }}>equalizer</i>}</button>
                    </div>
                )}
            </div>
        );
    }
}
