import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import ExternalDropzone from './ExternalDropzone';
import { extensions } from '../FileHandlers/FileHandlers';
import '../../../nav_bar/global_config/_reactTags.scss';
import { ID_PREFIX_FILE, FILE_UPLOAD_ERROR, FILE_UPLOADING } from '../../../../../common/constants';
import { isFile } from '../../../../../common/utils';
let spinner = require('../../../../../dist/images/spinner.svg');

export default class UploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: undefined,
            filter: "",
            extensionFilter: this.props.show,
            keywords: [],
            error: false,
            uploading: false,
            uploaded: false,
        };
        this.uploadHandler = this.uploadHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);

    }
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
            <h5>{i18n.t("Importa un fichero desde tu equipo...")}</h5>
            <hr />
            { (!this.state.file && !this.state.uploading && !this.state.uploaded) ?
                <ExternalDropzone ref="dropZone" accept={this.props.show} callback={this.dropHandler}/> : null}

            { (this.state.file || this.state.uploading || this.state.uploaded) ? <Row>
                <Col xs={12} sm={6}>
                    {(aux === 'image' && fileSelected && fileSelected.url) ? <img className="previewImg" src={fileSelected.url} alt=""/> : <div className={"preview"}>
                        <i className="material-icons">{icon || "attach_file"}</i>
                    </div>}
                </Col>
                <Col xs={12} sm={6}>
                    <FormGroup >
                        <div id="fileNameTitle">
                            <span>{this.state.file.name}</span><br/><br/>
                            <Button bsStyle="primary" style={{ display: (!this.state.file || this.state.uploaded) ? 'none' : 'inline-block' }} onClick={this.uploadHandler}><i className="material-icons">file_upload</i> {i18n.t("FileModal.APIProviders.upload")}</Button>
                            <Button style={{ display: (!this.state.file || this.state.uploaded) ? 'none' : 'inline-block' }} onClick={(e)=>{this.setState({ file: undefined, uploaded: false, error: false, uploading: false });}}><i className="material-icons">clear</i> {i18n.t("FileModal.APIProviders.clear")}</Button>
                        </div>
                        {this.state.uploading ? <div id="spinnerFloatContainer"><img className="spinnerFloat" src={spinner} alt=""/></div> : null}
                        {/* <ControlLabel>{i18n.t('global_config.keywords')}</ControlLabel><br/>
                          <ReactTags tags={keywords}
                                     placeholder={i18n.t('global_config.keyw.Add_tag')}
                                     delimiters={[188, 13]}
                                     handleDelete={this.handleDelete}
                                     handleAddition={this.handleAddition}
                                     handleDrag={this.handleDrag} />*/}
                        { this.state.error ? <div id="errorMsg" className="uploadModalMsg"><i className="material-icons">error</i><div>{i18n.t("FileModal.APIProviders.error")}</div></div> : null }
                        { this.state.uploaded ? <div id="uploadedMsg" className="uploadModalMsg"><i className="material-icons">check_circle</i><div> {i18n.t("FileModal.APIProviders.uploaded")}</div> </div> : null }
                    </FormGroup>
                </Col>
            </Row> : null}

        </div>);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ extensionFilter: nextProps.show });
        }
        if (nextProps.isBusy && this.props.isBusy && nextProps.isBusy.value !== this.props.isBusy.value) {
            if (nextProps.isBusy.msg === FILE_UPLOADING && this.props.isBusy.msg !== FILE_UPLOADING) {
                // this.setState({error: false, uploading: true, uploaded: false})
            } else if (this.props.isBusy.msg === FILE_UPLOADING && nextProps.isBusy.msg === FILE_UPLOAD_ERROR) {
                this.setState({ error: true, uploaded: false, uploading: false });
            } else if (this.props.isBusy.msg === FILE_UPLOADING && isFile(nextProps.isBusy.msg)) {
                let newFile = this.props.filesUploaded[nextProps.isBusy.msg];
                console.log(newFile);
                let extension = newFile.mimetype;
                for (let e in extensions) {
                    let ext = extensions[e];
                    if (newFile && newFile.mimetype && newFile.mimetype.match && newFile.mimetype.match(ext.value)) {
                        extension = ext.value;
                    }
                }
                console.log(nextProps.isBusy.msg);
                this.props.onElementSelected(newFile.name, newFile.url, extension, nextProps.isBusy.msg);
                this.setState({ error: false, uploading: false, uploaded: true });
            }
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if ((nextProps.filesUploaded && this.props.filesUploaded && Object.keys(nextProps.filesUploaded).length !== Object.keys(this.props.filesUploaded).length)
        /* || nextState.filter !== this.state.filter || nextState.extensionFilter !== this.state.extensionFilter*/) {
            // this.props.onElementSelected( undefined, undefined, undefined, undefined);
        }
    }
    dropHandler(file) {
        this.setState({ file });
    }

    uploadHandler() {
        let keywordsArray = this.state.keywords.map(key => { return key.text; });
        let keywords = keywordsArray.join(",");
        this.props.uploadFunction(this.state.file, keywords);
        this.setState({ keywords: [], uploading: true });

    }

    /** *
   * Keyword deleted callback
   * @param i position of the keyword
   */
    handleDelete(i) {
        let tags = Object.assign([], this.state.keywords);
        tags.splice(i, 1);
        this.setState({ keywords: tags });
    }

    /**
   * Keyword added callback
   * @param tag Keyword name
   */
    handleAddition(tag) {
        let tags = Object.assign([], this.state.keywords);
        tags.push({
            id: tags.length + 1,
            text: tag,
        });
        this.setState({ keywords: tags });
    }

    /**
   * Keyword moved callback
   * @param tag Tag moving
   * @param currPos Current position
   * @param newPos New position
   */
    handleDrag(tag, currPos, newPos) {
        let tags = Object.assign([], this.state.keywords);

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
        // re-render
        this.setState({ keywords: tags });
    }

}

UploadComponent.propTypes = {
    /**
   * Boolean that shows/hide the file upload modal
   */
    callback: PropTypes.func,
};
