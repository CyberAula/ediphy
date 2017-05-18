import React, {Component} from 'react';


export default class AutoSave extends Component {
    constructor(props){
        super(props);
        this.state = {displaySave: false};
    }


    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), 10000);
    }

    componentWillUnmount() {
        // use intervalId from the state to clear the interval
        clearInterval(this.intervalId);
    }

    timer() {

        this.setState({
            displaySave: true
        });
        this.props.save();
        //this.props.serverModalOpen();
        this.setState({
            displaySave: false
        });

    }
    render(){
        return(
            /* jshint ignore:start */
            <div className="savingLabel"
                style={{display:(this.state.displaySave) ? 'block' : 'none'}}>{'Guardando...'}</div>
            /* jshint ignore:end */
        );
    }
}