import React, { Component } from 'react';
import FileInput from './../../common/file-input/FileInput';

/**
 * VISH Dropzone component
 */
export default class VishDropzone extends Component {
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

    /* toggleHover() {
        this.setState({ hover: !this.state.hover });
    }
    mouseOver() {
        this.setState({ hover: true });
    }
    mouseOut() {
        this.setState({ hover: false });
    }*/

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
            <FileInput onChange={this.onDrop} className="fileInput" accept={this.props.accept}>
                {/* <Button className="btn btn-primary" style={{ marginTop: '0px' }}>{ Dali.i18n.t('FileDialog') }</Button>*/}
                {/* <span style={{ marginLeft: '10px' }}>*/}
                {/* <label className="control-label">{ Dali.i18n.t('FileDialog') + ':   ' } </label> { this.state.name || '' }</span>*/}

                <div className="fileDrag">
                    <span style={{ display: this.state.file ? 'none' : 'block' }}><i className="material-icons">ic_file_upload</i><b>{ Dali.i18n.t('FileInput.Drag') }</b>{ Dali.i18n.t('FileInput.Drag_2') }<b>{ Dali.i18n.t('FileInput.Click') }</b>{ Dali.i18n.t('FileInput.Click_2') }</span>
                    <span className="fileUploaded" style={{ display: this.state.file ? 'block' : 'none' }}><i className="material-icons">insert_drive_file</i> { this.state.file ? this.state.file.name : '' }</span>
                </div>
            </FileInput>
        );
    }
}
