import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import screenfull from 'screenfull';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import img from './../../../dist/images/broken_link.png';
import WaveSurfer from 'wavesurfer.js';
import ReactWavesurfer from 'react-wavesurfer';

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            pos: 0,
        };
        this.handleTogglePlay = this.handleTogglePlay;
        this.handlePosChange = this.handlePosChange;
    }

    handleTogglePlay() {
        this.setState({
            playing: !this.state.playing,
        });
    }

    handlePosChange(e) {
        this.setState({
            pos: e.originalArgs[0],
        });
    }

    render() {

        let marks = this.props.state.__marks;

        let markElements = Object.keys(marks).map((id) =>{
            // aqui solo entra cuando le das a save changes
            console.log("render");
            let value = marks[id].value;
            let title = marks[id].title;
            let color = marks[id].color;

            return(
                <MarkEditor key={id} style={{ left: value, position: "absolute" }} time={1.5} mark={id} onRichMarkUpdated={this.props.props.onRichMarkUpdated} state={this.props.state} base={this.props.base}>
                    <a key={id} href="#">
                        <div style={{ width: "4px", height: "8px", background: color || "#17CFC8" }}>
                            <OverlayTrigger key={id} text={title} placement="top" overlay={<Tooltip id={id}>{title}</Tooltip>}>
                                <i style={{ color: color || "#17CFC8", position: "relative", top: "-24px", left: "-10px" }} className="material-icons">room</i>
                            </OverlayTrigger>
                        </div>
                    </a>
                </MarkEditor>);
        });

        return (
            <div>
                <ReactWavesurfer
                    audioFile={this.props.state.url}
                    pos={this.state.pos}
                    onPosChange={this.handlePosChange}
                    playing={this.state.playing}
                />

                {(this.props.state.controls) && (
                    <div>
                        {markElements}
                    </div>
                )}
            </div>
        );

    }
}
