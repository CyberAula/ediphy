import React, { Component } from 'react';
import ExternalDropzone from './ExternalDropzone';
import Alert from './../../common/alert/Alert';
import ReactDOM from 'react-dom';
import { Modal, FormControl, Form, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';

/**
 * VISH Uploader Component
 */
export default class ExternalUploaderModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
    }
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
                            <ExternalDropzone ref="dropZone" accept={this.props.accept}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{this.props.isBusy.value ? this.props.isBusy.msg : ""}</ControlLabel>
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button disabled={this.props.isBusy.value} onClick={e => {
                        this.props.onExternalUploaderToggled();
                    }}>Cancel</Button>
                    <Button bsStyle="primary"
                        disabled={this.props.isBusy.value}
                        onClick={e => {
                            let { title, description, file } = {
                                title: ReactDOM.findDOMNode(this.refs.title).value,
                                description: ReactDOM.findDOMNode(this.refs.desc).value,
                                file: this.refs.dropZone.state.file,
                            };
                            if (title && title !== "" && description && description !== "" && file) {
                                this.props.onUploadVishResource({ title, description, file });
                            } else {
                                let alert = (
                                    <Alert className="pageModal" show hasHeader backdrop={false}
                                        title={ <span><i className="material-icons" style={{ fontSize: '14px', marginRight: '5px' }}>warning</i>{ i18n.t("messages.alert") }</span> }
                                        closeButton onClose={()=>{this.setState({ alert: null });}}>
                                        <span> { i18n.t('messages.all_fields') } </span>
                                    </Alert>);
                                this.setState({ alert: alert });
                            }

                        }}>
                        {i18n.t("vish_upload")}
                    </Button>
                    { this.state.alert }
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
            this.props.onExternalUploaderToggled(nextProps.isBusy.msg);
        }
    }
}
