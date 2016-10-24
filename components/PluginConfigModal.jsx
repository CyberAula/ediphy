import React, {Component} from 'react';
import {Modal, Button, Row} from 'react-bootstrap';
import Dali from './../core/main';

export default class PluginConfigModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            pluginActive: '',
            isUpdating: false
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <Modal className="pageModal pluginconfig" backdrop={true} bsSize="large" show={this.state.show}>
                <Modal.Header>
                    <Modal.Title>Plugin Configuration</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row >
                        <div ref={c => {
                            if(c !== null){
                                Dali.API_Private.answer(Dali.API_Private.events.openConfig, c);
                            }
                        }}>
                        </div>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.setState({show: false, isUpdating: false});
                    }}>Cancel</Button>
                    <Button bsStyle="primary" onClick={e => {
                        Dali.Plugins.get(this.state.pluginActive).render(this.state.isUpdating);
                        this.setState({show: false, isUpdating: false});
                    }}>Save changes</Button>
                </Modal.Footer>

            </Modal>
            /* jshint ignore:end */
        );
    }

    componentDidMount() {
        Dali.API_Private.listenEmission(Dali.API_Private.events.openConfig, (e) => {
            this.setState({show: true, pluginActive: e.detail.name, isUpdating: e.detail.isUpdating});
        });
    }
}