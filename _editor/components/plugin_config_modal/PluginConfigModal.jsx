import React, { Component } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Ediphy from '../../../core/editor/main';
import i18n from 'i18next';
/**
 * Configuration modal for plugins that require it
 */
export default class PluginConfigModal extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{show: boolean, pluginActive: string, reason: null, disabledButton: boolean}}
         */
        this.state = {
            show: false,
            pluginActive: '',
            reason: null,
            disabledButton: false,
        };
    }

    /**
     * Before component updates
     * Gets config updates from Plugin API
     * @param nextProps
     * @param nextState
     */
    componentWillUpdate(nextProps, nextState) {
        /*
        if(this.state.show === false && nextState.show === true &&
            Ediphy.Plugins.get(nextProps.name) !== undefined &&
            Ediphy.Plugins.get(nextState.pluginActive).getConfig().needsConfirmation &&
            nextState.disabledButton !== true) {
            this.setState({ disabledButton: true });
        }

        if (nextState.disabledButton === true &&
            Ediphy.Plugins.get(this.state.pluginActive) !== undefined &&
            (Ediphy.Plugins.get(this.state.pluginActive).getConfig().needsConfirmation &&
            !this.props.state.editing)) {
            this.setState({ disabledButton: false });
        }*/
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.id && nextProps.id) {
            console.log(nextProps.id);
            this.setState({ pluginState: nextProps.state });
        }
    }
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        console.log(this.props, Ediphy.Plugins.get(this.props.name));
        return (
            <Modal className="pageModal pluginconfig"
                backdrop="static"
                bsSize="large"
                show={this.props.id}
                onHide={()=>{ this.setState({ show: false, reason: null }); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{i18n.t("plugin_config")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row >
                        {/* <div ref={c => {
                            if(c !== null) {
                                Ediphy.API_Private.answer(Ediphy.API_Private.events.openConfig, c);
                            }
                        }} />*/}
                        {this.props.id ? Ediphy.Plugins.get(this.props.name).getConfigTemplate(this.state.pluginState, (pluginState)=>{this.setState({ pluginState });}) : null}
                    </Row>
                    <div id="plugin_config_info" />
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="default" onClick={e => {
                        // this.setState({ show: false, reason: null });

                        this.props.closeConfigModal();
                    }}>{i18n.t("Cancel")}</Button>
                    <Button ref="plugin_insertion" bsStyle="primary" id="insert_plugin_config_modal" disabled={this.state.disabledButton}
                        onClick={e => {
                            this.props.updatePluginToolbar(this.props.id, this.state.pluginState);
                            // Ediphy.Plugins.get(this.state.pluginActive).render(this.state.reason);
                            // this.setState({ show: false, reason: null });
                            this.props.closeConfigModal();
                        }}>{i18n.t("insert_plugin")}</Button>

                </Modal.Footer>

            </Modal>
        );
    }

    /**
     * After component mounts.
     * Gets configuration from Plugin API
     */
    componentDidMount() {
        /* Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.openConfig, (e) => {
            this.setState({ show: true, pluginActive: e.detail.name, reason: e.detail.reason });
        });

        Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.configModalNeedsUpdate, (e)=>{
            this.forceUpdate();
        });*/
    }
}
