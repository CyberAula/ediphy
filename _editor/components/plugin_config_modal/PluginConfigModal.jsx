import React, { Component } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Ediphy from '../../../core/editor/main';
import i18n from 'i18next';
import PluginRibbon from "../nav_bar/plugin_ribbon/PluginRibbon";
import { updateBox } from "../../../common/actions";
import PropTypes from "prop-types";
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
            currentStep: 1,
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
            this.setState({ pluginState: nextProps.state });
        }
    }
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let props = {
            openFileModal: this.props.openFileModal,
            fileModalResult: this.props.fileModalResult,
        };
        let steps = [];
        let stepsnumber = 0;

        let component = null;
        if(this.props.name) {
            let template = Ediphy.Plugins.get(this.props.name).getConfigTemplate(this.props.id, this.state.pluginState, (pluginState)=>{this.setState({ pluginState });}, { ...props, step: this.state.currentStep });
            component = template.component;
            stepsnumber = template.n_steps;
        }
        return (
            <Modal className="pageModal pluginconfig"
                backdrop="static"
                bsSize="large"
                keyboard
                show={this.props.id}
                onHide={()=>{ this.setState({ show: false, reason: null }); }}>
                <Modal.Header /* closeButton*/>
                    <Modal.Title>{i18n.t("plugin_config")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row >
                        {this.props.id ? component : null}
                    </Row>
                    <div id="plugin_config_info" />
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="default" onClick={e => {
                        this.props.closeConfigModal();
                        this.setState({ currentStep: 1 });
                    }}>{i18n.t("Cancel")}</Button>
                    { (this.state.currentStep > 1) ? <Button bsStyle="default" onClick={e => {
                        this.setState({ currentStep: this.state.currentStep - 1 });
                    }}>{"< " + i18n.t("step_previous")}</Button> : null}
                    <Button ref="plugin_insertion" bsStyle="primary" id="insert_plugin_config_modal" disabled={this.state.disabledButton}
                        onClick={e => {
                            if (this.state.currentStep < stepsnumber) {
                                this.setState({ currentStep: this.state.currentStep + 1 });
                            }else{
                                this.props.updatePluginToolbar(this.props.id, this.state.pluginState);
                                this.props.closeConfigModal();
                                this.setState({ currentStep: 1 });
                            }
                        }}>{(this.state.currentStep < stepsnumber) ? i18n.t("step_next") + " >" : i18n.t("confirm_changes")}</Button>
                </Modal.Footer>

            </Modal>
        );
    }
    /**
     * After component mounts.
     * Gets configuration from Plugin API
     */

}
PluginConfigModal.propTypes = {
    /**
     * Selected plugin id
     */
    id: PropTypes.any.isRequired,
    /**
     * Selected plugin name
     */
    name: PropTypes.string.isRequired,
    /**
     * Selected plugin state
     */
    state: PropTypes.object.isRequired,
    /**
     * Closes configuration modal
     */
    closeConfigModal: PropTypes.func,
    /**
     * Updates plugin toolbar
     */
    updatePluginToolbar: PropTypes.func.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Function that opens the file search modal
     */
    openFileModal: PropTypes.func.isRequired,
};
