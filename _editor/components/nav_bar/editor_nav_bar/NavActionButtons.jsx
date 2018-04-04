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
    constructor(props) {
        super(props);

        this.state = {
            isFullScreenOn: screenfull.isFullscreen,

        };

        this.checkFullScreen = this.checkFullScreen.bind(this);
        this.getButtons = this.getButtons.bind(this);
    }

    getButtons() {
        return [
            {
                name: 'fullscreen',
                description: i18n.t('fullscreen'),
                tooltip: i18n.t('messages.fullscreen'),
                display: true,
                disabled: false,
                icon: this.state.isFullScreenOn ? 'fullscreen_exit' : 'fullscreen',
                onClick: () => {
                    screenfull.toggle(document.documentElement);
                },
            },
            {
                name: 'undo',
                description: i18n.t('Undo'),
                tooltip: i18n.t('messages.undo'),
                display: true,
                disabled: this.props.undoDisabled,
                icon: 'undo',
                onClick: this.props.undo,
            },
            {
                name: 'redo',
                description: i18n.t('Redo'),
                tooltip: i18n.t('messages.redo'),
                display: true,
                disabled: this.props.redoDisabled,
                icon: 'redo',
                onClick: this.props.redo,
            },
            {
                name: 'save',
                description: i18n.t('Save'),
                tooltip: i18n.t('messages.save_changes'),
                display: (!Ediphy.Config.disable_save_button && (Ediphy.Config.publish_button === undefined || !Ediphy.Config.publish_button)),
                disabled: false,
                icon: 'save',
                onClick: () => {
                    this.props.save();
                    this.props.serverModalOpen();
                },
            },
            {
                name: 'publish',
                description: i18n.t('Publish'),
                tooltip: i18n.t('messages.publish'),
                display: (Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "draft"),
                disabled: false,
                icon: 'publish',
                onClick: () => {
                    this.props.changeGlobalConfig("status", "final");
                    this.props.save();
                    this.props.serverModalOpen();
                },
            },
            {
                name: 'unpublish',
                description: i18n.t('Unpublish'),
                tooltip: i18n.t('messages.unpublish'),
                display: (Ediphy.Config.publish_button !== undefined && Ediphy.Config.publish_button && this.props.globalConfig.status === "final"),
                disabled: false,
                icon: 'no_sim',
                onClick: () => {
                    this.props.changeGlobalConfig("status", "draft");
                    this.props.save();
                    this.props.serverModalOpen();
                },
            },
            {
                name: 'preview',
                description: i18n.t('Preview'),
                tooltip: i18n.t('messages.preview'),
                display: true,
                disabled: ((this.props.navItemSelected === 0 || (!this.props.navItems[this.props.navItemSelected] || this.props.navItems[this.props.navItemSelected].hidden) || (this.props.navItemSelected && !Ediphy.Config.sections_have_content && isSection(this.props.navItemSelected)))),
                icon: 'visibility',
                onClick: () => {
                    /* if (this.props.boxSelected !== 0) {
                        this.props.onTextEditorToggled(this.props.boxSelected, false);
                    }*/
                    this.props.visor();
                },
            },
        ];
    }
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let buttons = this.getButtons();

        return (
            <div className="navButtons">
                {buttons.map((item, index) => {
                    if (!item.display) { return null; }
                    return (
                        <button className="navButton"
                            disabled={item.disabled}
                            key={item.name}
                            name={item.name}
                            onClick={item.onClick}
                            title={item.tooltip} >
                            <i className="material-icons">{item.icon}</i>
                            <br />
                            <span className="hideonresize">{item.description}</span>
                        </button>
                    );
                })}
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
     * Modifies the course's global configuration
     */
    changeGlobalConfig: PropTypes.func.isRequired,
    /**
     * Object that cointains the course's global configuration, stored in the Redux state
     */
    globalConfig: PropTypes.object.isRequired,
    /**
     * Identifies the view that is being edited
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object that contains all created views (identified by its *id*)
     */
    navItems: PropTypes.object.isRequired,
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
