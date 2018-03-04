import React from 'react';
// import { findDOMNode } from 'react-dom';
import ReactAudioPlayer from 'react-audio-player';
import screenfull from 'screenfull';
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from './../../../_editor/components/rich_plugins/mark_editor/MarkEditor';
// import img from './../../../dist/images/broken_link.png';

export default class BasicAudioPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            controls: true,
        };
    }

    render() {
        /* props.state o solo state??*/
        return (
            <div>
                <ReactAudioPlayer
                    autoplay={false}
                    url={this.props.state.url}
                    controls={this.props.state.controls}/>
            </div>
        );
    }
}
