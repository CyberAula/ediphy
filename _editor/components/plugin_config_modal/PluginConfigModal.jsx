import React, { Component } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import Ediphy from '../../../core/editor/main';
import i18n from 'i18next';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUI } from "../../../common/actions";

/**
 * Configuration modal for plugins that require it
 */
class PluginConfigModal extends Component {

    state = {
        show: false,
        pluginActive: '',
        reason: null,
        disabledButton: false,
        currentStep: 1,
    };

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
                        this.closeConfigModal();
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
                                this.closeConfigModal();
                                this.setState({ currentStep: 1 });
                            }
                        }}>{(this.state.currentStep < stepsnumber) ? i18n.t("step_next") + " >" : i18n.t("confirm_changes")}</Button>
                </Modal.Footer>

            </Modal>
        );
    }

    /**
     * Closes configuration modal
     */
    closeConfigModal = () => this.props.dispatch(updateUI({ pluginConfigModal: false }));

}

function mapStateToProps(state) {
    return {
        fileModalResult: state.reactUI.fileModalResult,
        name: state.undoGroup.present.pluginToolbarsById[state.reactUI.pluginConfigModal] ? state.undoGroup.present.pluginToolbarsById[state.reactUI.pluginConfigModal].pluginId : "",
        state: state.undoGroup.present.pluginToolbarsById[state.reactUI.pluginConfigModal] ? state.undoGroup.present.pluginToolbarsById[state.reactUI.pluginConfigModal].state : {},
    };
}

export default connect(mapStateToProps)(PluginConfigModal);

PluginConfigModal.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
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
