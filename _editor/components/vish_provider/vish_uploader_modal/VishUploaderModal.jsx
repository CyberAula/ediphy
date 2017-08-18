import React, { Component } from 'react';
import VishDropzone from './VishDropzone';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button, Glyphicon } from 'react-bootstrap';

export default class VishUploaderModal extends Component {
    render() {
        return (
            <Modal className="pageModal" backdrop bsSize="large" show={this.props.visible}>
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
                            <FormControl ref="desc" componentClass="textarea" style={{ resize: 'none' }}/>
                        </FormGroup>
                        <FormGroup>
                            <VishDropzone ref="dropZone" />
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
                            this.props.onUploadVishResource(
                                {
                                    title: ReactDOM.findDOMNode(this.refs.title).value,
                                    description: ReactDOM.findDOMNode(this.refs.desc).value,
                                    file: this.refs.dropZone.state.file,
                                }
                            );
                        }}>
                        Upload
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isBusy.value && this.props.isBusy.value && this.props.visible) {
            this.props.onVishUploaderToggled(nextProps.isBusy.msg);
        }
    }
}
