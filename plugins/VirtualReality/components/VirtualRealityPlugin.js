import React from "react";
import i18n from 'i18next';

export default class VirtualRealityPlugin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.toolbarUpdateValue = this.toolbarUpdateValue.bind(this);
        this.receiver = this.receiver.bind(this);
    }
    render() {
        return (
            <div>
                <iframe allow="vr" width= '100%' height= '100%' src={'http://localhost:8081/index.html?id=' + this.props.id} id="receiver" />
            </div>
        );
    }
    componentDidMount() {
        let receiverWindow = document.getElementById("receiver").contentWindow;
        let { imagenBack, urlBack, audioBack } = this.props.state;
        receiverWindow.postMessage({ imagenBack, urlBack, audioBack: { play: audioBack } }, "*");
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
        if(receiverWindow) {
            let { imagenBack, urlBack, audioBack } = props.state;
            receiverWindow.postMessage({ imagenBack, urlBack, audioBack: { play: audioBack } }, "*");
        }

    }
}
