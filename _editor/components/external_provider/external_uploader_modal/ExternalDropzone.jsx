import React, { Component } from 'react';
import FileInput from './../../common/file-input/FileInput';
import PropTypes from 'prop-types';

/**
 * VISH Dropzone component
 */
export default class ExternalDropzone extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{hover: boolean, file: null}}
         */
        this.state = {
            hover: false,
            file: null,
        };
        /**
         * Binded function
         */
        this.onDrop = this.onDrop.bind(this);
    }

    /**
     * Dropped file callback
     * @param acceptedFile
     * @param rejectedFile
     */
    onDrop(event) {
        let files = event.target.files;

        if (event.target.files.length === 1) {
            this.setState({ file: event.target.files[0] });
        }
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
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
        return (
            <FileInput onChange={this.onDrop} className="fileInput" accept={this.props.accept}>
                <div className="fileDrag">
                    <span style={{ display: this.state.file ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ Ediphy.i18n.t('FileInput.Drag') }</b>{ Ediphy.i18n.t('FileInput.Drag_2') }<b>{ Ediphy.i18n.t('FileInput.Click') }</b>{ Ediphy.i18n.t('FileInput.Click_2') }</span>
                    <span className="fileUploaded" style={{ display: this.state.file ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i> { this.state.file ? this.state.file.name : '' }</span>
                </div>
            </FileInput>
        );
    }
}

ExternalDropzone.proptypes = {
    /**
     * Delegación del botón en la creación
     * */
    accept: PropTypes.any,
};
