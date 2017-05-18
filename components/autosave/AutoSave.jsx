import React, {Component} from 'react';

export default class AutoSave extends Component {

    constructor(props){
        super(props);
        this.state = {displaySave: false};
    }

    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), 30000);
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.intervalId);
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.isBusy.value){
            this.setState({displaySave: true});
        }else{
            this.setState({displaySave: false});
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