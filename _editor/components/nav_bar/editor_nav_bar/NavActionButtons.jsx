import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import screenfull from 'screenfull';

import Ediphy from '../../../../core/editor/main';
import { isSection } from '../../../../common/utils';

/**
 * Action buttons in the editor's navbar
 */
export default class NavActionButtons extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);

        /**
         * Component's initial state
         */
        this.state = {
            isFullScreenOn: screenfull.isFullscreen,

        };

        /**
         * Binded function
         */
        this.checkFullScreen = this.checkFullScreen.bind(this);
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        return (
            <div className="navButtons">
                <button className="navButton"
                    title={i18n.t("messages.fullscreen")}
                    onClick={() => {
                        screenfull.toggle(document.documentElement);
                    }}>
                    {this.state.isFullScreenOn ?
                        (<i className="material-icons">fullscreen_exit</i>) :
                        (<i className="material-icons">fullscreen</i>)}
                    <br/>
                    <span className="hideonresize">{i18n.t('fullscreen')}</span>
                </button>
                <button className="navButton"
                    title="Undo"
                    disabled={this.props.undoDisabled}
                    onClick={() => this.props.undo()}>
                    <i className="material-icons">undo</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Undone')}</span>
                </button>
                <button className="navButton"
                    title="Redo"
                    disabled={this.props.redoDisabled}
                    onClick={() => this.props.redo()}>
                    <i className="material-icons">redo</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Redone')}</span>
                </button>
                { (!Ediphy.Config.disable_save_button && (Ediphy.Config.publish_button === undefined || !Ediphy.Config.publish_button)) &&
                <button className="navButton"
                    title={i18n.t('Save')}
                    disabled={this.props.undoDisabled}
                    onClick={() => {
                        this.props.save();
                        this.props.serverModalOpen();
                    }}>
                    <i className="material-icons">save</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Save')}</span>
                </button>
                }
                { Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "draft" &&
                <button className="navButton"
                    title={i18n.t('Publish')}
                    disabled={this.props.undoDisabled}
                    onClick={() => {
                        this.props.changeGlobalConfig("status", "final");
                        this.props.save();
                        this.props.serverModalOpen();
                    }}>
                    <i className="material-icons">publish</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Publish')}</span>
                </button>
                }
                { Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "final" &&
                <button className="navButton"
                    title={i18n.t('Unpublish')}
                    disabled={this.props.undoDisabled}
                    onClick={() => {
                        this.props.changeGlobalConfig("status", "draft");
                        this.props.save();
                        this.props.serverModalOpen();
                    }}>
                    <i className="material-icons">no_sim</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Unpublish')}</span>
                </button>
                }
                <button className="navButton"
                    title={i18n.t('Preview')}
                    disabled={((this.props.navItemSelected === 0 || (this.props.navItemSelected && !Ediphy.Config.sections_have_content && isSection(this.props.navItemSelected))))}
                    onClick={() =>
                    { if (this.props.boxSelected !== 0) {
                        this.props.onTextEditorToggled(this.props.boxSelected, false);
                    }
                    this.props.visor();
                    }}><i className="material-icons">visibility</i>
                    <br/>
                    <span className="hideonresize">{i18n.t('Preview')}</span>
                </button>
            </div>
        );
    }

    /**
     * Adds fullscreen listeners
     */
    componentDidMount() {
        screenfull.on('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, true);

    }

    /**
     * Removes fullscreen listeners
     */
    componentWillUnmount() {
        screenfull.off('change', this.checkFullScreen);
        // fullScreenListener(this.checkFullScreen, false);

    }

    /**
     * Checks if the browser is in fullscreen mode and updates the state
     */
    checkFullScreen(e) {
        this.setState({ isFullScreenOn: screenfull.isFullscreen });
    }
}

NavActionButtons.propTypes = {
    /**
     * Selected box in the editor
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Modifies the course's global configuration
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Object that cointains the course's global configuration, stored in the Redux state
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Identifies the contained view that is being edited
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Closes the current text edition
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Re-applies the last change
     */
    redo: PropTypes.func.isRequired,
    /**
     * Toggles the "redo" feature
     */
    redoDisabled: PropTypes.bool,
    /**
     * Stores the changes in the remote server
     */
    save: PropTypes.func.isRequired,
    /**
     * Popup that indicates whether the import/export to the server was successful or not
     */
    serverModalOpen: PropTypes.func.isRequired,
    /**
     * Undoes the last change
     */
    undo: PropTypes.func.isRequired,
    /**
     * Allows using the "undo" feature
     */
    undoDisabled: PropTypes.bool,
    /**
     * Enables the preview mode
     */
    visor: PropTypes.func.isRequired,
};
