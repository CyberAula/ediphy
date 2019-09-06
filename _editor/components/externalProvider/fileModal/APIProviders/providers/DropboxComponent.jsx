import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';
import i18n from 'i18next';
import DropboxChooser from 'react-dropbox-chooser';
import { extensionHandlers as extensionsH } from '../../FileHandlers/FileHandlers';
import { FILE_UPLOAD_ERROR, FILE_UPLOADING } from '../../../../../../common/constants';
import { isFile } from '../../../../../../common/utils';
let loadingBox = require('../../../../../../dist/images/loading-box.gif');

export default class DropboxComponent extends React.Component {
    state = {
        results: [],
        query: '',
        msg: i18n.t("FileModal.APIProviders.no_files"),
        error: false,
        uploading: false,
        uploaded: false,
        allowed: true,
        forbidden: false,
        fileName: 'fileName',
    };

    convertExtensions = (show) => {
        let type = show;
        for (let e in extensionsH) {
            let ext = extensionsH[e];

            if (ext.value !== '' && type.match(ext.value)) {
                type = ext.value;
            }

        }
        switch(type) {
        case '*':
        case undefined:
            return { type, extensions: undefined };
        case 'video':
            return { type, extensions: ['.avi', '.mpeg', '.ogv', '.webm', '.3gp', '.mp4', '.mpg'] };
        case 'audio':
            return { type, extensions: ['.aac', '.mid', '.midi', '.oga', '.wav', '.weba', '.3gp', '.mp3', '.m4a'] };
        case 'webapp':
            return { type, extensions: ['.html'] };
        case 'image':
            return { type, extensions: ['.jpeg', '.jpg', '.tif', '.tiff', '.png', '.bmp', '.svg', '.gif', '.webp'] };
        default:
            return { type, extensions: ['.' + type] };

        }
    };

    convertType = (extension) => {
        let conversion = {
            'avi': 'video/x-msvideo',
            'mpeg': 'video/mpeg',
            'ogv': 'videoogg',
            'webm': 'video/webm',
            '3gp': 'video/3gpp',
            'mp4': 'video/mp4',
            'mpg': 'video/mpg',
            'aac': 'audio/aac',
            'mid': 'audio/midi',
            'midi': 'audio/midi',
            'oga': 'audio/ogg',
            'wav': 'audio/x-wav',
            'weba': 'audio/weba',
            'mp3': 'audio/mp3',
            'm4a': 'audio/m4a',
            'csv': 'text/csv',
            'pdf': 'application/pdf',
            'html': 'text/html',
            'zip': 'application/zip',
            'xml': 'application/xml',
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'tif': 'image/tiff',
            'tiff': 'image/tiff',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'svg': 'image/svg+xml',
            'gif': 'image/gif',
            'webp': 'image/webp',
        };
        return conversion[extension];
    };

    render() {
        let { type, extensions } = this.convertExtensions(this.props.show);
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                </h5>
                <hr />

            </Form>
            <div className={"ExternalResults DropboxResults"}>

                {
                    this.props.elementSelected ? (
                        <div className={"dropbox-modal"}>
                            <div className={"left-side"}>
                                {this.generatePreview()}
                            </div>
                            <div className={"right-side"}>

                                <div className={"fileNameTitle"}>
                                    <span> {this.state.fileName}</span>
                                    <br/>
                                    <br/>
                                </div>
                                <div className={"info-messages"}>
                                    {this.state.uploading ? <div id="spinnerFloatContainer"><img className="spinnerFloat" src={loadingBox} width={"30%"} alt=""/></div> : null}
                                    {this.state.error ? <div id="errorMsg" className="uploadModalMsg"><i className="material-icons">error</i><div>{i18n.t("FileModal.APIProviders.error")}</div></div> : null }
                                    {(this.state.uploaded && !this.state.uploading) ? <div id="uploadedMsg" className="uploadModalMsg"><i className="material-icons">check_circle</i><div> {i18n.t("FileModal.APIProviders.uploaded")}</div></div> : null }
                                    {!this.state.allowed ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_allowed")}</div> : null}
                                    {this.state.forbidden ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_forbidden")}</div> : null}
                                </div>
                                <div className="dropbox-button">
                                    <div className="dropbox-button">
                                        <DropboxChooser
                                            appKey={'x9y6stdvs6vgb29'}
                                            success={files => this.onSuccess(files, type)}
                                            cancel={() => this.onCancel()}
                                            // multiselect={true}
                                            folderselect={false}
                                            linkType="direct"
                                            extensions={extensions}
                                        >
                                            <Button><svg className="maestro-nav__logo" aria-label="Inicio" xmlns="http://www.w3.org/2000/svg" role="img" width="32px" height="32px" viewBox="0 0 32 32" style={{ fill: "#007EE5" }} >
                                                <path d="M8 2.4l8 5.1-8 5.1-8-5.1 8-5.1zm16 0l8 5.1-8 5.1-8-5.1 8-5.1zM0 17.7l8-5.1 8 5.1-8 5.1-8-5.1zm24-5.1l8 5.1-8 5.1-8-5.1 8-5.1zM8 24.5l8-5.1 8 5.1-8 5.1-8-5.1z" />
                                            </svg><span>{i18n.t("dropbox_msg_alt")}</span>
                                            </Button></DropboxChooser>

                                    </div></div></div></div>
                    ) : (<DropboxChooser
                        appKey={'x9y6stdvs6vgb29'}
                        success={files => this.onSuccess(files, type)}
                        cancel={() => this.onCancel()}
                        // multiselect={true}
                        folderselect={false}
                        linkType="direct"
                        extensions={extensions}
                    ><div className={"dropbox-container"}>
                            <div className={"dropbox-click-upload"}>
                                {this.state.error ? <div id="errorMsg" className="uploadModalMsg"><i className="material-icons">error</i><div>{i18n.t("FileModal.APIProviders.error")}</div></div> : null }
                                {(this.state.uploaded) ? <div id="uploadedMsg" className="uploadModalMsg"><i className="material-icons">check_circle</i><div> {i18n.t("FileModal.APIProviders.uploaded")}</div></div> : null }
                                {!this.state.allowed ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_allowed")}</div> : null}
                                {this.state.forbidden ? <div id="warningMsg" className="uploadModalMsg"><i className="material-icons">warning</i>{i18n.t("FileModal.APIProviders.warning_forbidden")}</div> : null}

                                <div className="dropbox-button">
                                    <p> {this.state.uploading ? "Your file is being uploaded" : i18n.t("dropbox_msg")}</p>
                                    {this.state.uploading ? <div id="spinnerFloatContainer"><img className="spinnerFloat" src={loadingBox} width={"30%"} alt=""/></div> :
                                        <svg className="maestro-nav__logo" aria-label="Inicio" xmlns="http://www.w3.org/2000/svg" role="img" width="122px" height="122px" viewBox="0 0 32 32" style={{ fill: "#007EE5" }} >
                                            <path d="M8 2.4l8 5.1-8 5.1-8-5.1 8-5.1zm16 0l8 5.1-8 5.1-8-5.1 8-5.1zM0 17.7l8-5.1 8 5.1-8 5.1-8-5.1zm24-5.1l8 5.1-8 5.1-8-5.1 8-5.1zM8 24.5l8-5.1 8 5.1-8 5.1-8-5.1z" />
                                        </svg>}

                                    {this.state.uploading ? null :
                                    /* <svg className="maestro-nav__logo" aria-label="Inicio" xmlns="http://www.w3.org/2000/svg" role="img" width="122px" height="122px" viewBox="0 0 32 32" style={{ fill: "#007EE5" }} >
                                            <path d="M8 2.4l8 5.1-8 5.1-8-5.1 8-5.1zm16 0l8 5.1-8 5.1-8-5.1 8-5.1zM0 17.7l8-5.1 8 5.1-8 5.1-8-5.1zm24-5.1l8 5.1-8 5.1-8-5.1 8-5.1zM8 24.5l8-5.1 8 5.1-8 5.1-8-5.1z" />
                                        </svg>*/null
                                    }

                                </div></div></div></DropboxChooser>)
                }

            </div>
        </div>;
    }
    onSuccess = (files) => {
        this.setState({ uploading: true });
        try {
            if (files && files.length > 0) {
                let { name, link } = files[0];
                let ext = name.match(/\.(\w+)$/);
                ext = this.convertType((ext && ext.length > 1) ? ext[1] : 'file');
                fetch(link).then(response=>response.blob())
                    .then(blob=>{
                        let file = new File([blob], name, { type: ext });
                        this.props.uploadFunction(file, "");
                    });
                // this.props.onElementSelected(name, link, this.convertType(ext));
            }
        } catch(e) {
            alert(i18n.t('error.generic'));
            // eslint-disable-next-line no-console
            console.error(e);
        }
    };

    onCancel() {
    }

    generatePreview = () => {
        let item = this.props.elementSelected;
        switch(this.props.elementSelectedType) {
        case "vish":
        case "edi":
            return <iframe src={this.props.elementSelected + ".full"} frameBorder="0" width={'100%'} height={"400"} />;
        case "webapp":
        case "pdf":
        case "scormpackage":
            return <iframe src={this.props.elementSelected} frameBorder="0" width={'100%'} height={"400"} />;
        case "image":
            return <img src={this.props.elementSelected} width={'100%'} />;
        case "audio":
            return <audio src={this.props.elementSelected} controls width={'100%'} height={"400"} style={{ width: '100%' }} />;
        case "video":
            return <video src={this.props.elementSelected} controls width={'100%'} height={"400"} />;
        case "swf":
            return <embed src={this.props.elementSelected} wmode="opaque" width={'100%'} height={"400"} />;
        default:
            return null;
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (nextProps.isBusy && this.props.isBusy && nextProps.isBusy.value !== this.props.isBusy.value) {
            if (nextProps.isBusy.msg === FILE_UPLOADING && this.props.isBusy.msg !== FILE_UPLOADING) {
                // this.setState({error: false, uploading: true, uploaded: false})
            } else if (this.props.isBusy.msg === FILE_UPLOADING && nextProps.isBusy.msg === FILE_UPLOAD_ERROR) {
                this.setState({ error: true, uploaded: false, uploading: false, allowed: true });
            } else if (this.props.isBusy.msg === FILE_UPLOADING && isFile(nextProps.isBusy.msg)) {
                let newFile = this.props.filesUploaded[nextProps.isBusy.msg];
                let extension = newFile.mimetype;
                for (let e in extensionsH) {
                    let ext = extensionsH[e];
                    if (newFile && newFile.mimetype && newFile.mimetype.match && newFile.mimetype.match(ext.value)) {
                        extension = ext.value;
                    }
                    if (newFile.mimetype === 'application/vnd.ms-excel') {
                        extension === 'csv';
                    }
                }
                this.props.onElementSelected(newFile.name, newFile.url, extension, nextProps.isBusy.msg);
                this.setState({ error: false, uploading: false, uploaded: true, fileName: newFile.name });
            }
        }
    }
}

DropboxComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Selected Element Type
     */
    elementSelectedType: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,
    /**
       * Format allowed
       */
    show: PropTypes.any,
    /**
       * Files uploaded to server
       */
    filesUploaded: PropTypes.any,
    /**
       * Server busy
       */
    isBusy: PropTypes.any,
    /**
       * Uploads file to server
       */
    uploadFunction: PropTypes.any,
};
