import React, {Component} from 'react';
import {Modal, Button, Tabs, Tab} from 'react-bootstrap';

export default class BoxModal extends Component {
    render() {
        return (
        <Modal show={this.props.visibility} backdrop={true} bsSize="large" onHide={e => this.props.onToggleVisibility(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Plugin Selection</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Tabs position="left">
                    <Tab eventKey={0} title="Temp">
                        <Button bsSize="large" onClick={e => this.props.onBoxAdded('normal', true, true)}>Add simple box</Button>
                        <Button bsSize="large" onClick={e => this.props.onBoxAdded('sortable', false, false)}>Add sortable</Button>
                    </Tab>
                    <Tab eventKey={1} title="Text"></Tab>
                    <Tab eventKey={2} title="Images"></Tab>
                    <Tab eventKey={3} title="Multimedia"></Tab>
                    <Tab eventKey={4} title="Animations"></Tab>
                    <Tab eventKey={5} title="Exercises"></Tab>
                </Tabs>
            </Modal.Body>

            <Modal.Footer>
                <Button bsStyle="primary" onClick={e => this.props.onToggleVisibility(false)}>Save changes</Button>
            </Modal.Footer>

        </Modal>
        );
    }
}