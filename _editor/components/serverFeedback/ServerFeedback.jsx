import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';
import { updateUI } from "../../../common/actions";

import { connect } from "react-redux";

/**
 * Server Feedback Alert
 */
class ServerFeedback extends Component {
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        const isSaving = this.props.isBusy.value;
        let alert = null;
        if(isSaving || this.props.isBusy.msg === i18n.t("success_transaction")) {
            alert = <i className="material-icons success">check</i>;
        } else {
            alert = <i className="material-icons error">close</i>;
        }
        return (
            <Modal id="serverModal"
                onHide={this.closeServerModal}
                show={this.props.show}
                dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"> {i18n.t("messages.save_changes")} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alert}
                    <div className="msg_text">{this.props.isBusy.msg}</div>
                </Modal.Body>
            </Modal>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isBusy.msg !== this.props.isBusy.msg) {
            if (this.props.isBusy.msg === i18n.t("success_transaction")) {
                setTimeout(this.closeServerModal, 2000);
            }
        }
    }

    closeServerModal = () => this.props.dispatch(updateUI({ serverModal: false }));
}

function mapStateToProps(state) {
    return {
        show: state.reactUI.serverModal,
        isBusy: state.undoGroup.present.isBusy,
    };
}

export default connect(mapStateToProps)(ServerFeedback);

ServerFeedback.propTypes = {
    /**
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
    /**
     * Indica si se muestra el popup de feedback del servidor
     */
    show: PropTypes.bool,
    /**
     * Indica si hay una operación con el servidor en curso
     */
    isBusy: PropTypes.any,
};
