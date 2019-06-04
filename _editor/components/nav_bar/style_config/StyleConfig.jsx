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
import ThemeCSS from "../../../../common/themes/ThemeCSS";
import ThemePreview from "../../../../common/themes/ThemePreview";
import TransitionPicker from "../../common/transition-picker/TransitionPicker";

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
            transition: 0,
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
                        <Modal.Title><span id="previewTitle">{i18n.t("Style.style_configuration")}</span></Modal.Title>
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
                                    <h4>{i18n.t("Style.appearance")}</h4>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t("Style.theme")}</ControlLabel>
                                        <div className="sc-theme-picker">
                                            <ThemePicker
                                                fromStyleConfig
                                                currentTheme={this.state.theme}
                                                onChange={(id)=>{
                                                    let newTheme = getThemes()[id];
                                                    let isFontCustom = this.state.font !== getThemeFont(this.state.theme);
                                                    let isColorCustom = this.state.color !== getThemeColors(this.state.theme).themeColor1;
                                                    this.setState({
                                                        theme: newTheme,
                                                        font: isFontCustom ? this.state.font : getThemeFont(newTheme),
                                                        color: isColorCustom ? this.state.color : getThemeColors(newTheme).themeColor1,
                                                        modifiedState: true });
                                                }}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup onClick={e => e.stopPropagation()}>
                                        <ControlLabel>{i18n.t("Style.accent_color")}</ControlLabel>
                                        <div>
                                            <ColorPicker
                                                color={this.state.color}
                                                value= {this.state.color}
                                                onChange={(e)=>{
                                                    this.setState({ color: e.color, modifiedState: true });
                                                }}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t("Style.font")}</ControlLabel>
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
                                    <FormGroup>
                                        <Button style={{ width: '100%' }} bsStyle="primary" id="cancel_insert_plugin_config_modal" onClick={e => {
                                            this.setState({ modifiedState: true, font: getThemeFont(this.state.theme), color: getThemeColors(this.state.theme).themeColor1 });
                                            document.activeElement.blur();
                                        }}>{i18n.t("Style.restore_theme_setup")}</Button>
                                    </FormGroup>
                                </Col>
                                <Col xs={12} md={6} lg={6}><br/>
                                    <div className={"Preview"}>
                                        <h4>{i18n.t("Style.preview")}</h4>
                                        <ThemePreview
                                            styleConfig={ this.state}
                                            theme={ this.state.modifiedState ? this.state.theme : this.props.styleConfig.theme }
                                            // font={ this.state.modifiedState ? this.state.font : this.props.styleConfig.font }
                                            // color={ this.state.modifiedState ? this.state.color : this.props.styleConfig.color }
                                        />

                                    </div>
                                    <h4>{i18n.t("Style.transitions")}</h4>
                                    <FormGroup>
                                        <TransitionPicker
                                            onClick={(index) => this.setState({ transition: index })}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" id="cancel_insert_plugin_config_modal" onClick={e => {
                            this.cancel(); e.preventDefault();
                        }}>{i18n.t("global_config.Discard")}
                        </Button>
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
            ...this.props.styleConfig,

        });

        //  Comment the following line if you don't want to exit when changes are discarded
        this.props.close();

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
    changeStyleConfig: PropTypes.func.isRequired,
    /**
     * Closes course configuration modal
     */
    close: PropTypes.func.isRequired,
};
