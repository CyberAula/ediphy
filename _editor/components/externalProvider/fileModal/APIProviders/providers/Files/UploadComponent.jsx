import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup } from 'react-bootstrap';
import ExternalDropzone from '../../common/ExternalDropzone';
import { extensionHandlers as extensions } from '../../../FileHandlers/FileHandlers';
import { FILE_UPLOAD_ERROR, FILE_UPLOADING } from '../../../../../../../common/constants';
import { isFile } from '../../../../../../../common/utils';
let spinner = require('../../../../../../../dist/images/spinner.svg');

export default class UploadComponent extends React.Component {
    state = {
        file: undefined,
        filter: "",
        extensionFilter: this.props.show,
        keywords: [],
        error: false,
        uploading: false,
        uploaded: false,
        allowed: true,
        forbidden: false,
    };

    render() {
        let file = this.state.file;
        let currentExtension = this.props.show;
        currentExtension = currentExtension === '*' ? '' : currentExtension;
        let aux = currentExtension;
        let icon = "attach_file";
        for (let e in extensions) {
            let ext = extensions[e];
            if (file && file.type && file.type.match && file.type.match(ext.value)) {
                aux = ext.value;
                icon = ext.icon || icon;
            }
        }
        let fileSelected = this.props.filesUploaded[this.props.idSelected];
        return(<div className="contentComponent uploadComponent">
            <h5>{i18n.t("FileModal.APIProviders.UploadFilesTitle")}</h5>
            <hr />
            { (!this.state.file && !this.state.uploading && !this.state.uploaded) ?
                <ExternalDropzone ref="dropZone" accept={this.props.show} callback={this.dropHandler}/> : null}

            { (this.state.file || this.state.uploading || this.state.uploaded) ? <Row>
                <Col xs={12} sm={6}>
                    {(aux === 'image' && (this.state.preview || (fileSelected && fileSelected.url))) ? <img className="previewImg" src={(fileSelected ? fileSelected.url : this.state.preview)} alt=""/> : <div className={"preview"}>
                        <i className="material-icons">{icon || "attach_file"}</i>
                    </div>}
                </Col>
                <Col xs={12} sm={6}>
                    <FormGroup >
                        <div id="fileNameTitle">
                            <span>{this.state.file ? this.state.file.name : ""}</span><br/><br/>
                            <Button disabled={!this.state.allowed} bsStyle="primary" style={{ display: (!this.state.file || this.state.uploaded) ? 'none' : 'inline-block' }} onClick={this.uploadHandler}><i className="material-icons">file_upload</i> {i18n.t("FileModal.APIProviders.upload")}</Button>
                            <Button style={{ display: (!this.state.file || this.state.uploaded) ? 'none' : 'inline-block' }} onClick={()=>{this.setState({ file: undefined, uploaded: false, error: false, uploading: false, allowed: true, forbidden: false });}}><i className="material-icons">clear</i> {i18n.t("FileModal.APIProviders.clear")}</Button>
                        </div>
                        {this.state.uploading ? <div id="spinnerFloatContainer"><img className="spinnerFloat" src={spinner} alt=""/></div> : null}
                        {/* <ControlLabel>{i18n.t('globalConfig.keywords')}</ControlLabel><br/>
                          <ReactTags tags={keywords}
                                     placeholder={i18n.t('globalConfig.keyw.Add_tag')}
                                     delimiters={[188, 13]}
                                     handleDelete={this.handleDelete}
                                     handleAddition={this.handleAddition}
                                     handleDrag={this.handleDrag} />*/}
                        { this.state.error ? <div id="errorMsg" className="uploadModalMsg"><i className="material-icons">error</i><div>{i18n.t("FileModal.APIProviders.error")}</div></div> : null }
                        { (this.state.uploaded) ? <div id="uploadedMsg" className="uploadModalMsg"><i className="material-icons">check_circle</i><div> {i18n.t("FileModal.APIProviders.uploaded")}</div></div> : null }
                        {!this.state.allowed ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_allowed")}</div> : null}
                        {this.state.forbidden ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_forbidden")}</div> : null}
                        <Button
                            style={{ display: (this.state.uploaded) ? 'inline-block' : 'none' }}
                            bsStyle="primary"
                            onClick={()=>{
                                this.props.onElementSelected(undefined, undefined, undefined, undefined);
                                this.setState({ file: undefined, uploaded: false, error: false, uploading: false, allowed: true });}}>
                            {i18n.t("FileModal.APIProviders.UploadNewFile")}</Button>
                    </FormGroup>
                </Col>
            </Row> : null}

        </div>);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ extensionFilter: nextProps.show });
        }
        if (nextProps.isBusy && this.props.isBusy && nextProps.isBusy.value !== this.props.isBusy.value) {
            if (nextProps.isBusy.msg === FILE_UPLOADING && this.props.isBusy.msg !== FILE_UPLOADING) {
                // this.setState({error: false, uploading: true, uploaded: false})
            } else if (this.props.isBusy.msg === FILE_UPLOADING && nextProps.isBusy.msg === FILE_UPLOAD_ERROR) {
                this.setState({ error: true, uploaded: false, uploading: false, allowed: true, forbidden: false });
            } else if (this.props.isBusy.msg === FILE_UPLOADING && isFile(nextProps.isBusy.msg)) {
                let newFile = this.props.filesUploaded[nextProps.isBusy.msg];
                let extension = newFile.mimetype;

                for (let e in extensions) {
                    let ext = extensions[e];
                    if (newFile && newFile.mimetype && newFile.mimetype.match && newFile.mimetype.match(ext.value)) {
                        extension = ext.value;
                    }
                    if (newFile.mimetype === 'application/vnd.ms-excel') {
                        // ????? extension === 'csv';
                    }

                }
                /* if (extension === "json" && ){

                }*/
                this.props.onElementSelected(newFile.name, newFile.url, extension, nextProps.isBusy.msg);
                this.setState({ error: false, uploading: false, uploaded: true });
            }
        }
    }
    dropHandler = (file) => {
        this.setState({ file });
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            let extension = file.type;
            for (let e in extensions) {
                let ext = extensions[e];
                if (file && file.type && file.type.match && file.type.match(ext.value)) {
                    extension = ext.value;
                }
            }
            let allowed = true;
            if (!(this.props.show === "*" || this.props.show.match(extension))) {
                allowed = false;
            }
            this.setState({ preview: ((reader.result)), allowed });
        };
    };

    uploadHandler = () => {
        let keywordsArray = this.state.keywords.map(key => { return key.text; });
        let keywords = keywordsArray.join(",");
        if (Ediphy.Config.zip_files_forbidden && this.state.file && this.state.file.name && (this.state.file.name.match(/\.zip$/) || this.state.file.name.match(/\.edi/) || this.state.file.name.match(/\.vish$/))) {
            this.setState({ forbidden: true });
            return;
        }
        this.props.uploadFunction(this.state.file, keywords);
        this.setState({ keywords: [], uploading: true });

    };

    /** *
   * Keyword deleted callback
   * @param i position of the keyword
   */
    handleDelete = (i) => {
        let tags = Object.assign([], this.state.keywords);
        tags.splice(i, 1);
        this.setState({ keywords: tags });
    };

    /**
   * Keyword added callback
   * @param tag Keyword name
   */
    handleAddition = (tag) => {
        let tags = Object.assign([], this.state.keywords);
        tags.push({
            id: tags.length + 1,
            text: tag,
        });
        this.setState({ keywords: tags });
    };

    /**
   * Keyword moved callback
   * @param tag Tag moving
   * @param currPos Current position
   * @param newPos New position
   */
    handleDrag = (tag, currPos, newPos) => {
        let tags = Object.assign([], this.state.keywords);

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
        // re-render
        this.setState({ keywords: tags });
    };
}

UploadComponent.propTypes = {
    /**
     * Format allowed
     */
    show: PropTypes.any,
    /**
     * Files uploaded to server
     */
    filesUploaded: PropTypes.any,
    /**
     * File selected id
     */
    idSelected: PropTypes.any,
    /**
     * Selects Element
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Server busy
     */
    isBusy: PropTypes.any,
    /**
     * Uploads file to server
     */
    uploadFunction: PropTypes.any,

};
