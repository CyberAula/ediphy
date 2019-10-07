import React from 'react';
/* eslint-disable react/prop-types */
import { generateCustomColors } from "../../common/themes/themeLoader";
import { Bar, BasicImage, ColorBackground, Container, DraggableImage, Loader, PlayButton } from "./Styles";

export default class AudioCueComponent extends React.Component {
    state = {
        playing: false,
    };

    audio = new Audio(this.props.state.url);

    playPause = () => this.setState({ playing: !this.state.playing });

    managePlaying = () => {
        if(this.state.playing) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    };

    // If deleted while playing, audio should be stopped
    componentWillUnmount = () => this.audio.pause();

    UNSAFE_componentWillMount() {
        if(this.props.fromVisor && this.props.state.autoplay) {
            this.setState({ playing: true });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.state.url !== nextProps.state.url) {
            this.audio.setAttribute('src', nextProps.state.url);
        }
        if (this.props.fromVisor && !nextProps.props.show && this.props.props.show) {
            this.setState({ playing: false });
        }
    }

    render() {
        let { state } = this.props;
        this.managePlaying();
        let cueColor = state.cueColor.color || 'rgba(0, 173, 156, 1)';
        let customStyle = state.cueColor.custom ? generateCustomColors(cueColor, 1, true) : null;

        let animationState = this.state.playing ? "running" : "paused";
        let times = Array(15).fill().map(() => Math.floor(Math.random() * 100) + 400);
        let bars = Array(30).fill().map((a, i) => <Bar key={i} up={i < 15} offset={i % 15 * 7} time={times[i % 15]} animationState={animationState}/>);
        return(
            <Container style={customStyle}>
                <DraggableImage onClick={this.playPause}>
                    <ColorBackground useImage={state.useImage}/>
                    <BasicImage className="basicImageClass" useImage={state.useImage} src={state.icon}/>
                    {!state.hideAnimation && <Loader onClick={this.playPause}>{bars}</Loader>}
                    <PlayButton hideAnimation={state.hideAnimation} playing={this.state.playing}/>
                </DraggableImage>
            </Container>
        );
    }
}

/* eslint-enable react/prop-types */

