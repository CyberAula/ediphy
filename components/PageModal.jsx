import React, {Component} from 'react';
import {Modal, Button, ButtonGroup} from 'react-bootstrap';

export default class PageModal extends Component {
    render() {
        let navItem = this.props.navItems[this.props.caller];
        let proposedName = "Page " + (navItem.children.length + 1);
        return (
            <Modal show={this.props.visibility} backdrop={true} bsSize="large" onHide={e => this.props.onVisibilityToggled(0, false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new page</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <ButtonGroup vertical={true} block={true}>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded("pa-" + Date.now(), proposedName, this.props.caller, [], navItem.level + 1, 'document', this.calculatePosition())}>Document</Button>
                        <Button bsStyle="primary" onClick={e => this.props.onPageAdded("pa-" + Date.now(), proposedName, this.props.caller, [], navItem.level + 1, 'slide', this.calculatePosition())}>Slide</Button>
                        <Button bsStyle="primary" disabled>Poster</Button>
                        <Button bsStyle="primary" disabled>Others</Button>
                    </ButtonGroup>
                </Modal.Body>
            </Modal>
        );
    }

    calculatePosition(){
        let navItem = this.props.navItems[this.props.caller];
        let position = this.props.navItemsIds.indexOf(this.props.caller);
        return (position + navItem.children.length + 1);
    }
}