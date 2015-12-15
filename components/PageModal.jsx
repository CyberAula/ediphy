import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';

export default class PageModal extends Component {
    render() {
        return (
            <Modal show={this.props.visibility} backdrop={true} bsSize="large" onHide={e => this.props.onVisibilityToggled(null, false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new page</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ButtonGroup vertical={true} block={true}>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded(Date.now(), this.props.proposedName, this.props.caller, this.props.sections[this.props.caller].level + 1)}>Document</Button>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded(Date.now(), this.props.proposedName, this.props.caller, this.props.sections[this.props.caller].level + 1)}>Slide</Button>
                        <Button bsStyle="primary" disabled>Poster</Button>
                        <Button bsStyle="primary" disabled>Others</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
        );
    }
}