import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import Dali from './../../core/main';

export default class VishCatalogModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            /* jshint ignore:start */
            <Modal className="pageModal" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>BUSCADOR VISH</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form style={{minHeight: 250}}>
                        <FormGroup>
                            {this.props.images.map((item, index) => {
                                return (
                                    <img key={index}
                                         src={item}
                                         style={{
                                            width: 160,
                                            height: 160,
                                            border: "solid transparent 3px"
                                         }} />
                                );
                            })}
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={e => {
                        this.props.onVishCatalogToggled();
                    }}>OK</Button>
                </Modal.Footer>
            </Modal>
            /* jshint ignore:end */
        );
    }
}
