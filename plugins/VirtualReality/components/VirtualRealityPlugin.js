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
            <iframe allow="vr" width= '100%' height= '100%' src={'http://localhost:8081/index.html?id=' + this.props.id + "&visor=true"} id="receiver" />
        );
    }
    componentDidMount() {
        let receiverWindow = document.getElementById("receiver").contentWindow;
        let { imagenBack, urlBack, urlPanel, audioBack } = this.props.state;

        this.toolbarUpdateValue();
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
            if (this.windowSource && data.msg === 'MARK' && data.id === this.props.id) {
                console.log('Lanzo marca');
                this.props.onMarkClicked(this.props.id, this.props.marks[data.mark].value);
            }
        } catch (err) {
            console.error(err);
        }

    }
    toolbarUpdateValue(props = this.props) {
        let receiverWindow = this.windowSource;
        if(receiverWindow) {
            let { imagenBack, urlBack, urlPanel, audioBack } = props.state;
            receiverWindow.postMessage({ imagenBack, urlBack, urlPanel, audioBack: { play: audioBack }, marks: props.marks }, "*");
        }

    }
}
