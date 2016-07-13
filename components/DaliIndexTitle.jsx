import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

  

export default class DaliIndexTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            currentValue: this.props.title
        };
    }

    render() {
        return (<span>
            {!this.state.editing ? 
                (<span className="actualSectionTitle">{this.props.title} </span>) : 
                (<FormControl 
                    type="text"
                    className="editSectionTitle" 
                    value={this.state.currentValue} 
                    onChange={e => 
                        {this.setState({currentValue: e.target.value})} 
                    } 
                    onBlur={e => 
                        {this.setState({editing: !this.state.editing})} 
                    } />)
            }

            <i  className="material-icons editIndexTitleIcon" 
                onClick={() => {
                    this.setState({ editing: !this.state.editing });
                    if (this.state.editing) {
                        this.props.onTitleChange(this.props.id, this.state.currentValue);
                    } else {
                        this.setState({currentValue: this.props.title});
                    }
                }} >
                {this.state.editing ? 'check':'edit'}
            </i>
        </span>)
         
    }

 

}