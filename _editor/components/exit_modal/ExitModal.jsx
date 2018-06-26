import React, { Component } from 'react';
import { Modal, Button, Row } from 'react-bootstrap';
import i18n from 'i18next';

export default class ExitModal extends React.Component {
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{show: boolean, pluginActive: string, reason: null, disabledButton: boolean}}
         */
    }
    componentWillUpdate(nextProps) {
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
        let exit_url = this.props.status === "draft" ? ediphy_editor_params.exit_tab_url : ediphy_editor_params.exit_document_url;
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
                                this.props.save(window, exit_url);
                            }}>{i18n.t('exitModal.save_and_exit')}</Button>
                            <Button onClick={()=>{
                                window.parent.location.href = exit_url;
                            }}>{i18n.t('exitModal.leave_without_changes')}</Button>
                            <Button onClick={()=>this.props.closeExitModal()}>{i18n.t('exitModal.cancel')}</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div> : null
        );
    }
}
