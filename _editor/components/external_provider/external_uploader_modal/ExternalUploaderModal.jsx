import React, { Component } from 'react';
import VishDropzone from './ExternalDropzone';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';

/**
 * VISH Uploader Component
 */
export default class VishUploaderModal extends Component {
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal" backdrop bsSize="large" show={this.props.visible}>
                <Modal.Header>
                    <Modal.Title>{i18n.t("vish_upload_other")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form action="javascript:void(0);">
                        <FormGroup>
                            <ControlLabel>{i18n.t("vish_upload_title")}</ControlLabel>
                            <FormControl ref="title" type="text"/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{i18n.t("vish_upload_desc")}</ControlLabel>
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
                        {i18n.t("vish_upload")}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Before component receives props
     * Displays busy message
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (!nextProps.isBusy.value && this.props.isBusy.value && this.props.visible) {
            this.props.onVishUploaderToggled(nextProps.isBusy.msg);
        }
    }
}
