import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button} from 'react-bootstrap';
import Dali from './../../../core/main';

export default class VishUploaderModal extends Component {
    render() {
        return (
            /* jshint ignore:start */
            <Modal className="pageModal" backdrop={true} bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>Upload pictures, videos and other resources</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl ref="title" type="text"/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl componentClass="textarea" style={{resize: 'none'}}/>
                        </FormGroup>
                        <FormGroup>
                            <FormControl ref="file" type="file"/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{this.props.isBusy.value ? this.props.isBusy.msg : ""}</ControlLabel>
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={this.props.isBusy.value} onClick={e => {
                        this.props.onVishUploaderToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary"
                            disabled={this.props.isBusy.value}
                            onClick={e => {
                                this.props.onUploadVishResource("");
                            }}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.isBusy.value && this.props.isBusy.value){
            this.props.onVishUploaderToggled(nextProps.isBusy.msg);
        }
    }
}
