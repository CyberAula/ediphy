import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';
/**
 * Server Feedback Alert
 */
export default class ServerFeedback extends Component {
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
                onHide={this.props.hideModal}
                show={this.props.show}
                dialogClassName="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg"> {this.props.title} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {alert}
                    <div className="msg_text">{this.props.isBusy.msg}</div>
                </Modal.Body>
            </Modal>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.isBusy.msg !== this.props.isBusy.msg) {
            if (this.props.isBusy.msg === i18n.t("success_transaction")) {
                setTimeout(()=>{this.props.hideModal();}, 2000);
            }
        }
    }
}

ServerFeedback.propTypes = {
    /**
     * Indica si se muestra el popup de feedback del servidor
     */
    show: PropTypes.bool,
    /**
     * Título del modal
     */
    title: PropTypes.any,
    /**
     * Indica si hay una operación con el servidor en curso
     */
    isBusy: PropTypes.any,
    /**
     * Oculta el popup
     */
    hideModal: PropTypes.func.isRequired,
};
