import React from "react";
import i18n from 'i18next';

export default class VirtualRealityPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            position: [0, 0, 0],
        };
        this.toolbarUpdateValue = this.toolbarUpdateValue.bind(this);
        this.receiver = this.receiver.bind(this);
    }
    render() {
        return (<iframe className={'VR'} allow="vr" width= '100%' height= '100%'
            data-x={this.state.position[0]} data-y={this.state.position[1]} data-z={this.state.position[2]}
            src={'http://localhost:8081/index.html?id=' + this.props.id + "&visor=false"} id="receiver" />);
    }
    componentDidMount() {
        window.addEventListener("message", this.receiver);
    }
    componentWillUnmount() {
        window.removeEventListener('message', this.receiver);
    }
    receiver(e) {
        try{
            let data = JSON.parse(e.data);
            // console.log(data);
            if (!this.windowSource && data.msg === 'LOAD' && data.id === this.props.id) {
                this.windowSource = e.source;
                this.toolbarUpdateValue();
            }
            if (this.windowSource && data.msg === 'POSITION' && data.id === this.props.id) {
                this.setState({ position: data.position });
            }

        } catch (err) {
            console.error(err);
        }

    }
    toolbarUpdateValue(props = this.props) {
        let receiverWindow = this.windowSource;
        if(receiverWindow) {
            let { imagenBack, urlBack, audioBack, showPanel, numberOfPictures } = props.state;
            let imgs = [];
            for (let i = 0; i < numberOfPictures; i++) {
                imgs.push({ currentImg: props.state['urlPanel' + i] });
            }
            receiverWindow.postMessage({ msg: 'DATA', imagenBack, urlBack, audioBack: { play: audioBack },
                showPanel: { show: showPanel }, imgs, marks: props.marks }, "*");
        }

    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.state) !== JSON.stringify(nextProps.state)) {
            this.toolbarUpdateValue(nextProps);
        }
        if (JSON.stringify(this.props.marks) !== JSON.stringify(nextProps.marks)) {
            this.toolbarUpdateValue(nextProps);
        }
    }
}
