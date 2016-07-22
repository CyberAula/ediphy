import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';

export default class ServerFeedback extends Component {
    render() {
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
                    {this.props.content}
                </Modal.Body>
            </Modal>
            /* jshint ignore:end */
        );
    }
}