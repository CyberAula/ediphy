import React, { Component } from 'react';
import Dali from './../../../core/main';
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
        this.state = { displaySave: false };
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
    }

    /**
     * Function run when time is up. It saves changes.
     */
    timer() {
        if(!this.props.visorVisible) {
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
