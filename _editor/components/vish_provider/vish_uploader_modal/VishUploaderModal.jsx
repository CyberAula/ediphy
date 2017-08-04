import React, { Component } from 'react';
import FileInput from '@ranyefet/react-file-input'; import ReactDOM from 'react-dom';
import { Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button, Glyphicon } from 'react-bootstrap';

export default class VishUploaderModal extends Component {
    render() {
        return (
            /* jshint ignore:start */
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
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isBusy.value && this.props.isBusy.value && this.props.visible) {
            this.props.onVishUploaderToggled(nextProps.isBusy.msg);
        }
    }
}

let VishDropzone = React.createClass({

    getInitialState: function() {
        return {
            hover: false,
            file: null,
        };
    },

    onDrop: function(acceptedFile, rejectedFile) {

        if (acceptedFile.length === 1) {
            this.setState({ file: acceptedFile[0] });
        }
    },
    toggleHover: function() {
        this.setState({ hover: !this.state.hover });
    },
    mouseOver: function() {
        this.setState({ hover: true });
    },
    mouseOut: function() {
        this.setState({ hover: false });
    },
    render: function() {
        let file = this.state.file;

        let dropStyle = {
            borderColor: "#92B0B3",
            borderStyle: "dashed",
            borderWidth: "2px",
            width: "100%",
            height: "200px",
            display: "table",
        };

        if (this.state.hover) {
            dropStyle.background = "#C8DADF";
        } else {
            dropStyle.background = "#FFFFFF";
        }
        /* <Dropzone onDrop={this.onDrop} multiple={false} style={dropStyle}>
         {(file) ?
         (<div
         style={{ verticalAlign: "middle", textAlign: "center", display: "table-cell" }}>{file.name}</div>) :
         (<div style={{ verticalAlign: "middle", textAlign: "center", display: "table-cell" }}>
         <div><Glyphicon glyph="hdd"/></div>
         <span><strong>Choose a file</strong> or drag it here</span>
         </div>)
         }
         </Dropzone>*/
        return (
            <FileInput onChange={this.onDrop} className="fileInput">
                {/* <Button className="btn btn-primary" style={{ marginTop: '0px' }}>{ Dali.i18n.t('FileDialog') }</Button>*/}
                {/* <span style={{ marginLeft: '10px' }}>*/}
                {/* <label className="control-label">{ Dali.i18n.t('FileDialog') + ':   ' } </label> { this.state.name || '' }</span>*/}
                <div className="fileDrag">
                    <span style={{ display: this.state.name ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ Dali.i18n.t('FileInput.Drag') }</b>{ Dali.i18n.t('FileInput.Drag_2') }<b>{ Dali.i18n.t('FileInput.Click') }</b>{ Dali.i18n.t('FileInput.Click_2') }</span>
                    <span className="fileUploaded" style={{ display: this.state.name ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i> { this.state.name || '' }</span>
                </div>
            </FileInput>
        );
    },
});
