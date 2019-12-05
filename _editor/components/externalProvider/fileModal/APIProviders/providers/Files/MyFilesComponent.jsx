import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18next';
import { Button, Row, Col, Grid, FormGroup, FormControl, ModalBody, Modal } from 'react-bootstrap';
import CodePreview from "../Code/CodePreview";
import Select from 'react-select';
import Alert from "../../../../../common/alert/Alert";
import { extensionHandlers as extensions } from '../../../FileHandlers/FileHandlers';
export default class MyFilesComponent extends React.Component {
    state = {
        file: undefined,
        filter: "",
        extensionFilter: this.props.show,
        keywords: [],
        confirmDelete: false,
        errorDeleteAlert: false,
    };

    render() {
        let empty = true;
        let files = Object.keys(this.props.filesUploaded).map(f => {
            let file = this.props.filesUploaded[f];
            let type = file.mimetype;
            let icon = "attach_file";
            for (let e in extensions) {
                let ext = extensions[e];

                if (ext.value !== '' && type.match(ext.value)) {
                    type = ext.value;
                    icon = ext.icon;
                }

            }
            if(((file.name && file.name.match(this.state.filter)) || (file.mimetype && file.mimetype.match(this.state.filter))) // Matches written filter
                && (this.state.extensionFilter === "*" || (file.mimetype && file.mimetype.match(this.state.extensionFilter))) // Matches extension filter
            ) { empty = false;
                return { ...file, type, icon };
            }

            return { ...file, type, icon, hide: true };
        });
        files.reverse();
        let currentExtension = this.props.show === "*" ? this.state.extensionFilter : this.props.show;
        currentExtension = currentExtension === '*' ? '' : currentExtension;
        let aux = currentExtension;
        for (let e in extensions) {
            let ext = extensions[e];
            if (currentExtension.match(ext.value)) {
                aux = ext.value;
            }
        }
        currentExtension = aux;
        let fileSelected = this.props.filesUploaded[this.props.idSelected];
        let download = { // Forces browser download
            title: i18n.t('FileModal.FileHandlers.downloadAsFile'),
            disabled: !fileSelected,
            action: ()=>{
                window.download(fileSelected.url, fileSelected.name);
            },
        };
        /*  <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}</h5> */
        return(<div className="contentComponent myFilesComponent">
            <h5>{i18n.t("FileModal.APIProviders.MyFilesTitle")}</h5>
            <hr />
            <div className={"filters"}>
                <FormGroup key="filter">
                    <FormControl type="text" value={this.state.filter} placeholder={i18n.t('Filter')} id="filterInput" autoFocus onChange={e => {this.setState({ filter: e.target.value });}}/>
                </FormGroup>
                <FormGroup key="extfilter">
                    <Select
                        name="form-field-extensions"
                        value={currentExtension}
                        disabled = {this.props.show !== "*"}
                        options={Object.values(extensions)}
                        className="selectD"
                        onChange={e => {this.setState({ extensionFilter: e.value });}} />
                </FormGroup>
            </div>
            <Grid>
                <Row className="myFilesRow" onClick={()=>{this.setState({ preview: false }); this.props.onElementSelected(undefined, undefined, undefined);}}>
                    {files.map((file, i)=>{
                        let filetype = file.type; // ? file.type : ((split && (split.length > 1)? split[split.length-1]:'application'));
                        let isActive = (file.id === this.props.idSelected);
                        return (<Col key={i} className={"myFile" + (file.hide ? ' hidden' : '')} xs={12} sm={6} md={4} lg={3}>
                            {isActive ? <Button className="deleteButton" onClick={(e)=>{
                                this.setState({ confirmDelete: true });
                                e.stopPropagation();}}>
                                <i className="material-icons">delete</i>
                            </Button> : null}
                            {isActive ? <Button className="downloadButton" onClick={()=>{
                                download.action();}}>
                                <i className="material-icons">cloud_download</i>
                            </Button> : null}
                            {(isActive && this.props.elementSelectedType !== "image") ? <Button className="previewFileButton" onClick={(e)=>{
                                e.stopPropagation(); this.setState({ preview: true });}}>
                                {this.props.elementSelectedType === "audio" ? <i className="material-icons">volume_down</i> : <i className="material-icons">remove_red_eye</i>}
                            </Button> : null}
                            <Button style={{ backgroundImage: filetype === 'image' ? ("url(" + file.url + ")") : "" }} onClick={(e)=>{
                                this.props.onElementSelected(file.name, file.url, filetype, file.id);
                                e.stopPropagation();
                            }} className={"myFileContent" + (isActive ? " active" : "")}>
                                {file.type === 'image' ? "" : <i className="material-icons">{file.icon || "attach_file"}</i>}
                            </Button>
                            <span className="ellipsis">{file.name}</span>
                        </Col>);
                    })}

                </Row>
                {this.state.confirmDelete ? <Alert className="pageModal"
                    show
                    hasHeader
                    title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                    cancelButton
                    acceptButtonText={i18n.t("messages.OK")}
                    onClose={(bool)=>{
                        if(bool) {
                            this.props.onElementSelected(undefined, undefined, undefined);
                            this.props.deleteFileFromServer(this.props.idSelected, this.props.elementSelected, (status) => {
                                if (!status) {
                                    this.setState({ errorDeleteAlert: true });
                                }
                            });
                        }
                        this.setState({ confirmDelete: false });
                    }}>
                    <span> {i18n.t("FileModal.APIProviders.confirm_delete")} </span><br/>

                </Alert> : null}
                {empty ? <p className="empty">{i18n.t("FileModal.APIProviders.no_files")}</p> : null}
                {this.state.errorDeleteAlert ? (<Alert className="pageModal" show hasHeader acceptButtonText={i18n.t("messages.OK")}
                    title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">warning</i>{i18n.t("messages.error")}</span>}
                    onClose={()=>{ this.setState({ errorDeleteAlert: false }); }}>
                    <span> {i18n.t("error.deleting")} </span><br/>
                </Alert>) : null}
                <Modal className="pageModal previewVideoModal" onHide={()=>{this.setState({ preview: false });}} show={this.state.preview && this.props.elementSelected}>
                    <Modal.Header closeButton><Modal.Title>{i18n.t("Preview")}</Modal.Title></Modal.Header>
                    <ModalBody>
                        {this.generatePreview()}
                    </ModalBody>
                </Modal>
            </Grid>
        </div>);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({ extensionFilter: nextProps.show });
        }
    }
    UNSAFE_componentWillUpdate(nextProps) {
        if ((nextProps.filesUploaded && this.props.filesUploaded && nextProps.filesUploaded.length !== this.props.filesUploaded.length)
        /* || nextState.filter !== this.state.filter || nextState.extensionFilter !== this.state.extensionFilter*/) {
            // this.props.onElementSelected( undefined, undefined, undefined);
        }
    }
    generatePreview = () => {
        switch(this.props.elementSelectedType) {
        case "webapp":
        case "pdf":
        case "scormpackage":
            return <iframe src={this.props.elementSelected} frameBorder="0" width={'100%'} height={"400"} />;
        case "image":
            return null;
        case "audio":
            return <audio src={this.props.elementSelected} controls width={'100%'} height={"400"} style={{ width: '100%' }} />;
        case "video":
            return <video src={this.props.elementSelected} controls width={'100%'} height={"400"} />;
        case "swf":
            return <embed src={this.props.elementSelected} wmode="opaque" width={'100%'} height={"400"} />;
        case "xml":
        case "csv":
        case "edi":
        case "vish":
            return <CodePreview source={this.props.elementSelected}/>;
        default:
            return null;
        }
    };
}

MyFilesComponent.propTypes = {
    /**
     * Filter that indicates what types of files are shown. "*" means all.
     */
    show: PropTypes.any,
    /**
     * Files uploaded to server
     */
    filesUploaded: PropTypes.any,
    /**
     * Identifier of element whose source is being changed (box/slide background). It can be empty
     */
    idSelected: PropTypes.any,
    /**
    * Selected Element type
     */
    elementSelectedType: PropTypes.any,
    /**
     * Element selected from files
     */
    elementSelected: PropTypes.any,
    /**
     * Function that is called when the user selects an element
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Function for deleting files from server
     */
    deleteFileFromServer: PropTypes.func,
};
