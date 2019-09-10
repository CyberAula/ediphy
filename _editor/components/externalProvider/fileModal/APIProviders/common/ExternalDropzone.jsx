import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FileInput from '../../../../common/fileInput/FileInput';

/**
 * VISH Dropzone component
 */
export default class ExternalDropzone extends Component {

    state = {
        hover: false,
        file: null,
    };

    /**
     * Dropped file callback
     * @param acceptedFile
     * @param rejectedFile
     */
    onDrop = (event) => {
        let files = event.target.files;
        if (files.length === 1) {
            this.setState({ file: files[0] });
            if(this.props.callback) {
                this.props.callback(files[0]);
            }
        }
    };

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
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
                    <span style={{ display: this.state.file ? 'none' : 'block' }}><b>{ Ediphy.i18n.t('FileInput.Drag') }</b>{ Ediphy.i18n.t('FileInput.Drag_2') }<b>{ Ediphy.i18n.t('FileInput.Click') }</b>{ Ediphy.i18n.t('FileInput.Click_2') }</span>
                    <span className="fileUploaded" style={{ display: this.state.file ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i> { this.state.file ? this.state.file.name : '' }</span>
                </div>
            </FileInput>
        );
    }

}

ExternalDropzone.propTypes = {
    /**
     * Mimetype accepted
     * */
    accept: PropTypes.any,
    /**
     * Function called when file is dropped
     */
    callback: PropTypes.func,
};
