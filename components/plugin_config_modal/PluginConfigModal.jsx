import React, {Component} from 'react';
import {Modal, Button, Row} from 'react-bootstrap';
import Dali from './../../core/main';

export default class PluginConfigModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            pluginActive: '',
            reason: null,
            disabledButton: false
        };
    }

    componentWillUpdate(nextProps, nextState){

        if(this.state.show === false && nextState.show === true &&
            Dali.Plugins.get(nextState.pluginActive) !== undefined &&
            Dali.Plugins.get(nextState.pluginActive).getConfig().needsConfirmation &&
            nextState.disabledButton !== true){
                this.setState({ disabledButton: true});
        }

        if (nextState.disabledButton === true &&
            Dali.Plugins.get(this.state.pluginActive) !== undefined &&
            (Dali.Plugins.get(this.state.pluginActive).getConfig().needsConfirmation &&
            !Dali.Plugins.get(this.state.pluginActive).getState().editing)){
                this.setState({ disabledButton: false});
        }
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
                    <div id="plugin_config_info">
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="secondary" onClick={e => {
                        this.setState({show: false, reason: null});
                    }}>Cancel</Button>
                    <Button ref="plugin_insertion" bsStyle="primary" id="insert_plugin_config_modal" disabled={this.state.disabledButton}
                            onClick={e => {
                        Dali.Plugins.get(this.state.pluginActive).render(this.state.reason);
                        this.setState({show: false, reason: null});
                    }}>Insert Plugin</Button>
                </Modal.Footer>

            </Modal>
            /* jshint ignore:end */
        );
    }

    componentDidMount() {
        Dali.API_Private.listenEmission(Dali.API_Private.events.openConfig, (e) => {
            this.setState({show: true, pluginActive: e.detail.name, reason: e.detail.reason});
        });

        Dali.API_Private.listenEmission(Dali.API_Private.events.configModalNeedsUpdate,(e)=>{
            this.forceUpdate();
        });
    }
}