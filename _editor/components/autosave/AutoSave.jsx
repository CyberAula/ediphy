import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Ediphy from '../../../core/editor/main';
import i18n from 'i18next';
import { CHANGE_DISPLAY_MODE, EXPAND_NAV_ITEM, IMPORT_STATE, INCREASE_LEVEL, INDEX_SELECT, SELECT_BOX, SELECT_NAV_ITEM, SET_BUSY, TOGGLE_TEXT_EDITOR, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES, UPDATE_BOX } from './../../../common/actions';

import { connect } from "react-redux";

/**
 * Component for auto-saving the state of the application periodically and avoid losing changes
 */
class AutoSave extends Component {
    state = {
        displaySave: false,
        modifiedState: false,
    };

    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), Ediphy.Config.autosave_time);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isBusy.value) {
            this.setState({ displaySave: true });
            setTimeout(() => {
                this.setState({ displaySave: false });
            }, 2000);
        }

        const ignoredActions = [
            CHANGE_DISPLAY_MODE,
            EXPAND_NAV_ITEM,
            IMPORT_STATE,
            INCREASE_LEVEL,
            INDEX_SELECT,
            SELECT_BOX,
            SELECT_NAV_ITEM,
            SET_BUSY,
            TOGGLE_TEXT_EDITOR,
            TOGGLE_TITLE_MODE,
            UPDATE_NAV_ITEM_EXTRA_FILES,
            UPDATE_BOX,
        ];

        if (this.state.modifiedState === false && ignoredActions.indexOf(nextProps.lastAction) === -1) {
            // The last action isn't part of the ignored ones
            this.setState({ modifiedState: true });
        }
    }

    /**
     * Function run when time is up. It saves changes.
     */
    timer() {
        if(!this.props.visorVisible && this.state.modifiedState) {
            this.props.save();
        }
    }

    render() {
        return(
            <div className="savingLabel"
                style={{ display: this.state.displaySave ? 'block' : 'none' }}>{i18n.t('messages.saving')}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        lastAction: state.undoGroup.present.lastActionDispatched,
        visorVisible: state.reactUI.visorVisible,
    };
}

export default connect(mapStateToProps)(AutoSave);

AutoSave.propTypes = {
    /**
   * Saves the state
   */
    save: PropTypes.func.isRequired,
    /**
   * Last Redux action dispatched
   */
    lastAction: PropTypes.any,
    /**
   * Indicates if there is a current server operation
   */
    isBusy: PropTypes.any,
    /**
   * Indicates if the preview mode is on or not
   */
    visorVisible: PropTypes.bool,

};
