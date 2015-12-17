import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';

export default class PageModal extends Component {
    render() {
        let proposedName = "Page " + (this.props.navItems[this.props.caller].children.length + 1);
        return (
            <Modal show={this.props.visibility} backdrop={true} bsSize="large" onHide={e => this.props.onVisibilityToggled(0, false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new page</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ButtonGroup vertical={true} block={true}>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded("pa-" + Date.now(), proposedName, this.props.caller, [], this.props.navItems[this.props.caller].level + 1, 'document')}>Document</Button>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded("pa-" + Date.now(), proposedName, this.props.caller, [], this.props.navItems[this.props.caller].level + 1, 'slide')}>Slide</Button>
                        <Button bsStyle="primary" disabled>Poster</Button>
                        <Button bsStyle="primary" disabled>Others</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
        );
    }
}