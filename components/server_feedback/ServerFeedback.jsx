import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';

export default class ServerFeedback extends Component {
    render() {
        const isSaving = this.props.isBusy.value;
        let alert = null;
        if(isSaving){
            alert = <i className="material-icons success">check</i>;
        } else {
            alert = <i className="material-icons error">close</i>;
        }
        return (
            /* jshint ignore:start */
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
            /* jshint ignore:end */
        );
    }
}