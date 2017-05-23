import React, {Component} from 'react';
import Dali from './../../core/main';

export default class AutoSave extends Component {

    constructor(props){
        super(props);
        this.state = {displaySave: false};
    }

    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), Dali.Config.autosave_time);
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.isBusy.value){
            this.setState({displaySave: true});
            setTimeout(() => {
                this.setState({displaySave: false});
            }, 2000);
        }
    }

    timer() {
        this.props.save();
    }

    render(){
        return(
            /* jshint ignore:start */
            <div className="savingLabel"
                style={{display: this.state.displaySave ? 'block' : 'none'}}>{'Guardando...'}</div>
            /* jshint ignore:end */
        );
    }
}