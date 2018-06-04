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
        this.state = {

        };
    }

    render() {
        return(
            Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.showExitModal ?
                <div className="static-modal">
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>{i18n.t('exitModal.Title')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{i18n.t('exitModal.Body')}</Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="primary" onClick={()=>{
                                this.props.save(window, editor_params.exit_url);
                            }}>{i18n.t('exitModal.save_and_exit')}</Button>
                            <Button bsStyle="primary" onClick={()=>{
                                window.href.location = editor_params.exit_url;
                            }}>{i18n.t('exitModal.leave_without_changes')}</Button>
                            <Button onClick={()=>this.props.closeExitModal()}>{i18n.t('exitModal.cancel')}</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div> : null
        );
    }
}
