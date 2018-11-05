import React from 'react';
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
        return(
            <div style={{ height: "100%", width: "100%" }} className={"draggableImage"} ref={"draggableImage"}>
                <img ref ="img"
                    className="basicImageClass"
                    style={{ width: this.state.allowDeformed ? "100%" : "100%", height: this.state.allowDeformed ? "" : "auto", transform, WebkitTransform: transform, MozTransform: transform }}
                    src={state.url}
                    onError={(e) => {
                        e.target.onError = null;
                        e.target.src = img_broken; // Ediphy.Config.broken_link;
                    }}
                />
                <audio controls>
                    <source src={this.state.url}/>
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }

}
