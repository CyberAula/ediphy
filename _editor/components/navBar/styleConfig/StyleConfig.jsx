import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import i18n from 'i18next';

import { updateUI, changeStyleConfig } from "../../../../common/actions";
import { connect } from "react-redux";

import ThemePicker from '../../common/themePicker/ThemePicker';
import ColorPicker from '../../common/colorPicker/ColorPicker';
import FontPicker from '../../common/fontPicker/FontPicker';

import { getColor, getThemeColors, getThemes } from "../../../../common/themes/themeLoader";

import Alert from './../../common/alert/Alert';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';

// Styles
import 'react-select/dist/react-select.css';
import './_globalConfig.scss';
import { getThemeFont } from "../../../../common/themes/themeLoader";
import ThemePreview from "../../../../common/themes/ThemePreview";
import TransitionPicker from "../../common/transitionPicker/TransitionPicker";

/**
 * Global course configuration modal
 */
class StyleConfig extends Component {
    state = {
        theme: this.props.styleConfig.theme || 'default',
        font: this.props.styleConfig.font || getThemeFont(this.props.styleConfig.theme) || 'Ubuntu',
        color: getColor(this.props.styleConfig.theme),
        transition: 0,
    };

    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (
            <div>
                <Modal className="pageModal"
                    show={this.props.show}
                    backdrop={'static'} bsSize="large"
                    // aria-labelledby="contained-modal-title-lg"
                    onHide={() => {
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
                        onClose={ok => {
                        // If Accept button clicked, state is saved, otherwise close without saving
                            if(ok) {
                                this.saveState();
                            } else {
                                this.cancel();
                            }
                            // Anyway close the alert
                            this.setState({ showAlert: false });
                        // this.props.close();
                        }}>
                        {i18n.t("globalConfig.prompt")}
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
                                                onChange={this.handleThemeChange}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup onClick={e => e.stopPropagation()}>
                                        <ControlLabel>{i18n.t("Style.accent_color")}</ControlLabel>
                                        <div>
                                            <ColorPicker
                                                color={this.state.color}
                                                value= {this.state.color}
                                                onChange={this.handleColorChange}/>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>{i18n.t("Style.font")}</ControlLabel>
                                        <div className={"apply-font"}>
                                            <FontPicker apiKey={'AIzaSyCnIyhIyDVg6emwq8XigrPKDPgueOrZ4CE'}
                                                activeFont={this.state.font}
                                                onChange={this.handleFontChange}
                                                options={{ themeFont: getThemeFont(this.state.theme) }}
                                            />
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button style={{ width: '100%' }} bsStyle="primary" id="cancel_insert_plugin_config_modal" onClick={() => {
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
                                        />

                                    </div>
                                    <h4>{i18n.t("Style.transitions")}</h4>
                                    <FormGroup>
                                        <TransitionPicker
                                            onClick={this.handleTransitionChange}/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="default" id="cancel_insert_plugin_config_modal"
                            onClick={this.cancel}>
                            {i18n.t("globalConfig.Discard")}
                        </Button>
                        <Button bsStyle="primary" id="insert_plugin_config_modal"
                            onClick={this.saveState}>
                            {i18n.t("globalConfig.Accept")}
                        </Button>{'   '}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    /**
     * Save configuration changes
     */
    saveState = (e) => {
        this.setState({ modifiedState: false });
        this.props.dispatch(changeStyleConfig("STATE", this.state));
        this.close();
        e.preventDefault();
    };

    /**
     * Discard configuration changes
     */
    cancel = (e) => {
        this.setState({
            ...this.props.styleConfig,

        });

        //  Comment the following line if you don't want to exit when changes are discarded
        this.close();

        e.preventDefault();
    };

    close = () => this.props.dispatch(updateUI('showStyleConfig', false));

    handleThemeChange = (id) => {
        let newTheme = getThemes()[id];
        let isFontCustom = this.state.font !== getThemeFont(this.state.theme);
        let isColorCustom = this.state.color !== getThemeColors(this.state.theme).themeColor1;
        this.setState({
            theme: newTheme,
            font: isFontCustom ? this.state.font : getThemeFont(newTheme),
            color: isColorCustom ? this.state.color : getThemeColors(newTheme).themeColor1,
            modifiedState: true });
    };

    handleColorChange = e => this.setState({ font: e.family, modifiedState: true });
    handleFontChange = e => this.setState({ font: e.family, modifiedState: true });
    handleTransitionChange = (index) => this.setState({ transition: index });

}

export default connect(mapStateToProps)(StyleConfig);

function mapStateToProps(state) {
    return {
        show: state.reactUI.showStyleConfig,
        styleConfig: state.undoGroup.present.styleConfig,
    };
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
     * Redux actions trigger
     */
    dispatch: PropTypes.func,
};
