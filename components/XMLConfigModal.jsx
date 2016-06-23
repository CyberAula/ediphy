import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class XMLConfigModal extends Component {
    render() {
        return (
            <Modal backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>XML Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div ref={"container"}>
                        Import XML
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onXMLEditorToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        let state = this.props.toolbar.state;
                        state["__xml"] = this.generateXMLFromView();
                        Dali.Plugins.get(this.props.toolbar.config.name).forceUpdate(state, this.props.id);
                        this.props.onXMLEditorToggled();
                    }}>Save changes</Button>
                </Modal.Footer>

            </Modal>
        );
    }

    componentDidUpdate(prevProps, prevState){
        if(this.props.visible && !prevProps.visible){
            this.refs.container.innerHTML = this.generateViewFromXML(this.props.toolbar.state["__xml"])
        }
    }

    componentDidMount(){
        if(this.props.toolbar && this.props.toolbar.state["__xml"]){
            this.refs.container.innerHtml = this.generateViewFromXML(this.props.toolbar.state["__xml"])
        }
    }

    generateViewFromXML(xml){
        return "Import " + xml;
    }

    generateXMLFromView(){
        return true;
    }
}
