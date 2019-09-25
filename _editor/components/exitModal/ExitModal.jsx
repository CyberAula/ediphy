import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import i18n from 'i18next';
import PropTypes from 'prop-types';

export default class ExitModal extends React.Component {
    UNSAFE_componentWillUpdate(nextProps) {
        if(nextProps.showExitModal && !this.props.showExitModal) {
            // this.props.publishing(true);
            window.exitFlag = true;
        }
        if(!nextProps.showExitModal && this.props.showExitModal) {
            // this.props.publishing(false);
            window.exitFlag = null;
        }
    }

    render() {
        let exit_url = window.ediphy_editor_params ? (this.props.status === "draft" ? window.ediphy_editor_params.exit_tab_url : window.ediphy_editor_params.exit_document_url) : undefined;
        return(
            Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.showExitModal ?
                <div className="static-modal">
                    <Modal.Dialog className={'pageModal'}>
                        <Modal.Header>
                            <Modal.Title>{i18n.t('exitModal.Title')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{i18n.t('exitModal.Body')}</Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="primary" onClick={()=>{
                                if (exit_url) {
                                    this.props.save(window, exit_url);
                                }

                            }}>{i18n.t('exitModal.save_and_exit')}</Button>
                            <Button onClick={()=>{
                                if (exit_url) {
                                    window.parent.location.href = exit_url;
                                }
                            }}>{i18n.t('exitModal.leave_without_changes')}</Button>
                            <Button onClick={this.props.closeExitModal}>{i18n.t('exitModal.cancel')}</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div> : null
        );
    }
}
ExitModal.propTypes = {
    /**
     * Whether the exit modal is shown
     */
    showExitModal: PropTypes.bool,
    /**
     * Document status (`draft`/`final`)
     */
    status: PropTypes.string,
    /**
     * Keep unsaved changes
     */
    save: PropTypes.func.isRequired,
    /**
     * Close exit modal
     */
    closeExitModal: PropTypes.func.isRequired,
};
