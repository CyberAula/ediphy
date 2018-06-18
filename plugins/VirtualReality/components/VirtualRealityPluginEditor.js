import React from "react";
import i18n from 'i18next';

export default class VirtualRealityPluginEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.toolbarUpdateValue = this.toolbarUpdateValue.bind(this);
        this.receiver = this.receiver.bind(this);
    }
    render() {
        return (<iframe className={'VR'} allow="vr" width= '100%' height= '100%' src={'http://localhost:8081/index.html?id=' + this.props.id} id="receiver"/>);
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
            if (!this.windowSource && data.msg === 'load' && data.id === this.props.id) {
                this.windowSource = e.source;
                this.toolbarUpdateValue();
            }
        } catch (err) {
            console.error(err);
        }

    }
    toolbarUpdateValue(props = this.props) {
        let receiverWindow = this.windowSource;
        console.log("EN LA TOOLBARUPDATE SE RECIBE ESTE ESTADO DE URL: " + props.state.urlBack);
        if(receiverWindow) {
            let { imagenBack, urlBack, audioBack } = props.state;
            receiverWindow.postMessage({ imagenBack, urlBack, audioBack: { play: audioBack } }, "*");
        }

    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.state) !== JSON.stringify(nextProps.state)) {
            this.toolbarUpdateValue(nextProps);
        }
    }
}
