import React, { Component } from 'react';
import Dali from './../../../core/main';
import { CHANGE_DISPLAY_MODE, EXPAND_NAV_ITEM, IMPORT_STATE, INCREASE_LEVEL, INDEX_SELECT, SELECT_BOX, SELECT_NAV_ITEM, SET_BUSY, TOGGLE_TEXT_EDITOR, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES, UPDATE_BOX } from './../../../common/actions';

/** *
 * Component for auto-saving the state of the application periodically and avoid losing changes
 */
export default class AutoSave extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
        /** *
         * Component's initial state
         * @type {{displaySave: boolean Info displayed to user}}
         */
        this.state = {
            displaySave: false,
            modifiedState: false,
        };
    }

    /**
     * After component mounts
     * Sets up timer for autosaving
     */
    componentDidMount() {
        /** *
         * Timer function set up
         * @type {js timer}
         */
        this.intervalId = setInterval(this.timer.bind(this), Dali.Config.autosave_time);
    }

    /**
     * Before component unmounts
     * Clears timer
     */
    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.intervalId);
    }

    /**
     * Before component receives props
     * Displays message to user for 2 seconds
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.isBusy.value) {
            this.setState({ displaySave: true });
            setTimeout(() => {
                this.setState({ displaySave: false });
            }, 2000);
        }

        if (this.state.modifiedState === false) {
            switch(nextProps.lastAction) {
            case CHANGE_DISPLAY_MODE:
            case EXPAND_NAV_ITEM:
            case IMPORT_STATE:
            case INCREASE_LEVEL:
            case INDEX_SELECT:
            case SELECT_BOX:
            case SELECT_NAV_ITEM:
            case SET_BUSY:
            case TOGGLE_TEXT_EDITOR:
            case TOGGLE_TITLE_MODE:
            case UPDATE_NAV_ITEM_EXTRA_FILES:
            case UPDATE_BOX:
                return;
            default:
                this.setState({ modifiedState: true });
            }
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

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        return(
            <div className="savingLabel"
                style={{ display: this.state.displaySave ? 'block' : 'none' }}>{'Guardando...'}
            </div>
        );
    }
}
