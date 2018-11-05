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
        let { props, state } = this.props;
        return(
            <a style={{ height: "100%", width: "100%" }} className={"draggableImage"} ref={"draggableImage"}>
                <img ref ="img"
                    className="basicImageClass"
                    style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto" }}
                    src={state.icon}
                />
            </a>
        );
    }

}
