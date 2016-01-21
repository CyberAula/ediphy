import React, {Component} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class PluginConfigModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            pluginActive: '',
        };
    }

    render() {
        return (
            <Modal backdrop={true} bsSize="large" show={this.state.show}>
                <Modal.Header>
                    <Modal.Title>Plugin Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div ref={c => {
                        if(c !== null){
                            Dali.API.Private.setConfigContainer(c);
                            Dali.API.Private.answer(Dali.API.Private.events.openConfig);
                        }
                    }}></div>
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" onClick={e => {
                        this.setState({show: false});
                        Dali.Plugins.get(this.state.pluginActive).render();
                    }}>Save changes</Button>
                </Modal.Footer>

            </Modal>
        );
    }

    componentDidMount(){
        Dali.API.Private.listenEmission(Dali.API.Private.events.openConfig, (e) => {
            this.setState({show: true, pluginActive: e.detail});
        });
    }
}
