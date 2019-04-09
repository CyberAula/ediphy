import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import i18n from 'i18next';

import ThemePicker from '../../common/theme-picker/ThemePicker';
import ColorPicker from '../../common/color-picker/ColorPicker';
import FontPicker from '../../common/font-picker/FontPicker';

import { getColor, getThemeColors, getThemes } from "../../../../common/themes/theme_loader";

import Alert from './../../common/alert/Alert';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
const img_place_holder = "data:image/png;base64,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";

// Styles
import 'react-select/dist/react-select.css';
import './_globalConfig.scss';
import './_reactTags.scss';
import FileInput from "../../common/file-input/FileInput";
import { getThemeFont } from "../../../../common/themes/theme_loader";

/**
 * Global course configuration modal
 */
export default class StyleConfig extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /* State from props is an anti-pattern*/
        this.state = {
            theme: this.props.styleConfig.theme || 'default',
            font: this.props.styleConfig.font || getThemeFont(this.props.styleConfig.theme) || 'Ubuntu',
            color: getColor(this.props.styleConfig.theme),

        };
    }

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        const { title, author, canvasRatio, age, hideGlobalScore, typicalLearningTime, minTimeProgress, difficulty, rights, visorNav, description, language, thumbnail, keywords, version, status, context, allowDownload, allowClone, allowComments } = this.state;
        return (
            <Modal className="pageModal"
                show={this.props.show}
                backdrop={'static'} bsSize="large"
                aria-labelledby="contained-modal-title-lg"
                onHide={e => {
                    // If anything has changed after last save show an alert, otherwise just leave
                    if (this.state.modifiedState) {
                        this.setState({ showAlert: true });
                    } else {
                        this.cancel();
                    }
                }}>
                <Modal.Header closeButton>
                    <Modal.Title><span id="previewTitle">&& Style Configuration</span></Modal.Title>
                </Modal.Header>
                <Alert className="pageModal"
                    show={this.state.showAlert}
                    hasHeader
                    title={i18n.t("messages.save_changes")}
                    closeButton
                    cancelButton
                    acceptButtonText={'OK'}
                    onClose={(bool) => {
                        // If Accept button clicked, state is saved, otherwise close without saving
                        bool ? this.saveState() : this.cancel();
                        // Anyway close the alert
                        this.setState({ showAlert: false });
                        // this.props.close();
                    }}>
                    {i18n.t("global_config.prompt")}
                </Alert>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <Grid>
                        <form>
                            {/* <Row>*/}
                            {/* <Col xs={12} md={12} lg={12}>*/}
                            {/* <div style={{width: '32em', height: '18em', backgroundColor: 'red' }}>Preview</div>*/}
                            {/* </Col>*/}
                            {/* </Row>*/}
                            <Row>
                                <Col xs={12} md={6} lg={6}><br/>
                                    <h4>&& Appearance </h4>
                                    <FormGroup>
                                        <ControlLabel> && Theme </ControlLabel>
                                        <div className="cont_avatar">
                                            <ThemePicker
                                                fromStyleConfig
                                                currentTheme={this.state.theme}
                                                onChange={(id)=>{
                                                    let newTheme = getThemes()[id];
                                                    let isFontCustom = this.state.font !== getThemeFont(this.state.theme);
                                                    this.setState({
                                                        theme: newTheme,
                                                        font: isFontCustom ? this.state.font : getThemeFont(newTheme),
                                                        modifiedState: true });
                                                }}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>&& Accent color</ControlLabel>
                                        <ColorPicker
                                            key={'color-picker-style-config'}
                                            onChange={(e)=>{
                                                this.setState({ color: e.color, modifiedState: true });
                                            }}
                                            value={this.state.color}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>&& Font</ControlLabel>
                                        <FontPicker apiKey={'AIzaSyCnIyhIyDVg6emwq8XigrPKDPgueOrZ4CE'}
                                            activeFont={this.state.font}
                                            onChange={(e)=>{
                                                this.setState({ font: e.family, modifiedState: true });
                                            }}
                                            options={{ themeFont: 'ubuntu' }}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={5} lg={5}><br/>
                                    <h4>&& Transitions </h4>
                                    <FormGroup>
                                        <ControlLabel>&& Accent color</ControlLabel>
                                        <FormControl type="text"
                                            value={title}
                                            placeholder={i18n.t('global_config.course_title')}
                                            onChange={e => {this.setState({ modifiedState: true, title: e.target.value });}}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </form>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="cancel_insert_plugin_config_modal" onClick={e => {
                        this.cancel(); e.preventDefault();
                    }}>{i18n.t("global_config.Discard")}</Button>
                    <Button bsStyle="primary" id="insert_plugin_config_modal" onClick={e => {
                        this.saveState(); e.preventDefault();
                    }}>{i18n.t("global_config.Accept")}</Button>{'   '}
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Save configuration changes
     */
    saveState() {
        this.setState({ modifiedState: false });
        this.props.changeStyleConfig("STATE", this.state);
        this.props.close();
    }

    /**
     * Discard configuration changes
     */
    cancel() {
        this.setState({
            theme: this.props.styleConfig.theme,

        });

        //  Comment the following line if you don't want to exit when changes are discarded
        this.props.close();

    }

    /**
     * If title is changed from outside
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
    //     if (this.props.globalConfig.title !== nextProps.globalConfig.title) {
    //         this.setState({
    //             title: nextProps.globalConfig.title || "",
    //         });
    //     }
    //     if (this.props.globalConfig.status !== nextProps.globalConfig.status) {
    //         this.setState({
    //             status: nextProps.globalConfig.status || "draft",
    //         });
    //     }
    //     if (this.props.fileModalResult &&
    //       nextProps.fileModalResult &&
    //       nextProps.fileModalResult.value !== this.props.fileModalResult.value &&
    //       nextProps.fileModalResult.value &&
    //       nextProps.fileModalResult.id === 'avatar') {
    //         this.setState({
    //             thumbnail: nextProps.fileModalResult.value, modifiedState: true,
    //         });
    //     }
    //
    //     if (!this.props.show && nextProps.show) {
    //         this.setState({
    //             title: nextProps.globalConfig.title || "",
    //             author: nextProps.globalConfig.author || "",
    //             canvasRatio: nextProps.globalConfig.canvasRatio || 16 / 9,
    //             age: nextProps.globalConfig.age || { min: 0, max: 0 },
    //             typicalLearningTime: nextProps.globalConfig.typicalLearningTime || { h: 0, m: 0, s: 0 },
    //             difficulty: nextProps.globalConfig.difficulty,
    //             rights: nextProps.globalConfig.rights || 1,
    //             description: nextProps.globalConfig.description || '',
    //             thumbnail: nextProps.globalConfig.thumbnail || img_place_holder,
    //             language: nextProps.globalConfig.language,
    //             keywords: nextProps.globalConfig.keywords || [],
    //             version: nextProps.globalConfig.version || '0.0.0',
    //             status: nextProps.globalConfig.status || 'draft',
    //             context: nextProps.globalConfig.context,
    //             allowComments: nextProps.globalConfig.allowComments ? true : nextProps.globalConfig.allowComments === undefined,
    //             allowClone: nextProps.globalConfig.allowClone ? true : nextProps.globalConfig.allowClone === undefined,
    //             allowDownload: nextProps.globalConfig.allowDownload ? true : nextProps.globalConfig.allowDownload === undefined,
    //             hideGlobalScore: nextProps.globalConfig.hideGlobalScore || false,
    //             minTimeProgress: nextProps.globalConfig.minTimeProgress || 3,
    //             visorNav: { ...(nextProps.globalConfig.visorNav || {}),
    //                 player: nextProps.globalConfig.visorNav.player === undefined ? true : nextProps.globalConfig.visorNav.player,
    //                 sidebar: nextProps.globalConfig.visorNav.sidebar === undefined ? true : nextProps.globalConfig.visorNav.sidebar,
    //                 keyBindings: nextProps.globalConfig.visorNav.keyBindings === undefined ? true : nextProps.globalConfig.visorNav.keyBindings,
    //                 fixedPlayer: nextProps.globalConfig.visorNav.fixedPlayer === undefined ? true : nextProps.globalConfig.visorNav.fixedPlayer,
    //             },
    //             modifiedState: false,
    //             showAlert: false,
    //             everPublished: nextProps.globalConfig.everPublished,
    //
    //         });
    //     }
    }

}

StyleConfig.propTypes = {
    /**
     * Indicates whether the course configuration modal should be shown or hidden
     */
    show: PropTypes.bool,
    /**
     * Configuration course dictionary. Object identical to Redux state ***globalConfig*** .
     */
    styleConfig: PropTypes.object.isRequired,
    /**
     * Saves new configuration
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Closes course configuration modal
     */
    close: PropTypes.func.isRequired,
    /**
     * Callback for opening the file upload modal
     */
    toggleFileUpload: PropTypes.func.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     *  Function for uploading a file to the server
     */
    uploadFunction: PropTypes.func.isRequired,
};
