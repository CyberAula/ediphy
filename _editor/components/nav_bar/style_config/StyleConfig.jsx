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

// Styles
import 'react-select/dist/react-select.css';
import './_globalConfig.scss';
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
            <div>
                <Modal className="pageModal"
                    show={this.props.show}
                    backdrop={'static'} bsSize="large"
                    // aria-labelledby="contained-modal-title-lg"
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
                                                    let isColorCustom = this.state.color !== getThemeColors(this.state.theme).themePrimaryColor;
                                                    this.setState({
                                                        theme: newTheme,
                                                        font: isFontCustom ? this.state.font : getThemeFont(newTheme),
                                                        color: isColorCustom ? this.state.color : getThemeColors(newTheme).themePrimaryColor,
                                                        modifiedState: true });
                                                }}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup onClick={e => e.stopPropagation()}>
                                        <ControlLabel>&& Accent color</ControlLabel>
                                        <div style={{ zIndex: 3000 }} onClick={e => e.stopPropagation()}>
                                            <ColorPicker
                                                color={this.state.color}
                                                value= {this.state.color}
                                                onChange={(e)=>{
                                                    this.setState({ color: e.color, modifiedState: true });
                                                }}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>&& Font</ControlLabel>
                                        <div className={"apply-font"}>
                                            <FontPicker apiKey={'AIzaSyCnIyhIyDVg6emwq8XigrPKDPgueOrZ4CE'}
                                                activeFont={this.state.font}
                                                onChange={(e)=>{
                                                    this.setState({ font: e.family, modifiedState: true });
                                                }}
                                                options={{ themeFont: getThemeFont(this.state.theme) }}
                                            />
                                        </div>
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
            </div>
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
