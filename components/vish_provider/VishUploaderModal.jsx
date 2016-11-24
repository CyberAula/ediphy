import React, {Component} from 'react';
import Dropzone from  'react-dropzone';
import ReactDOM from 'react-dom';
import {Modal, FormControl, Col, Form, FormGroup, ControlLabel, Button, Glyphicon} from 'react-bootstrap';
import Dali from './../../core/main';

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
                            <VishDropzone />
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
        if(!nextProps.isBusy.value && this.props.isBusy.value && this.props.visible){
            this.props.onVishUploaderToggled(nextProps.isBusy.msg);
        }
    }
}

var VishDropzone = React.createClass({

    getInitialState: function () {
        return {
            hover: false,
            file: null
        };
    },

    onDrop: function (acceptedFile, rejectedFile) {

        if (acceptedFile.length === 1) {
            console.log(acceptedFile[0]);
            this.setState({file : acceptedFile[0]});
        }
    },
    toggleHover: function(){
        this.setState({hover: !this.state.hover});
    },
    mouseOver: function () {
        this.setState({hover: true});
    },
    mouseOut: function () {
        this.setState({hover: false});
    },
    render: function () {
        var file = this.state.file;

        var dropStyle = {borderColor: "#92B0B3",
            borderStyle: "dashed",
            borderWidth: "2px",
            width : "100%",
            height : "200px",
            display : "table"};

        if (this.state.hover) {
            dropStyle.background = "#C8DADF";
        } else {
            dropStyle.background = "#FFFFFF";
        }

        return (
            /* jshint ignore:start */
            <Dropzone onDrop={this.onDrop} multiple={false} style={dropStyle}>
                {(file) ?
                    (<div style={{ verticalAlign : "middle", textAlign : "center", display: "table-cell"}}>{file.name}</div>) :
                    (<div style={{ verticalAlign : "middle", textAlign : "center", display: "table-cell"}}>
                    <div><Glyphicon glyph="hdd" /></div>
                    <span><strong>Choose a file</strong> or drag it here</span>
                    </div>)
                }
            </Dropzone>
            /* jshint ignore:end */
        );
    }
});
