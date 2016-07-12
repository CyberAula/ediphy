import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

  

export default class DaliIndexTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false 
        };
    }

    render() {
        return (<span>
            {!this.state.editing ? 
                (<span className="actualSectionTitle">{this.props.title} </span>) : 
                (<FormControl 
                    type="text"
                    className="editSectionTitle" 
                    value={this.props.title} 
                    onChange={e => 
                        {this.props.onTitleChange(this.props.id, e.target.value)}
                    } 
                    onBlur={e => 
                        {this.setState({editing: !this.state.editing})} 
                    } />)
            }

            <i className="material-icons editIndexTitleIcon" onClick={()=>this.setState({editing: !this.state.editing})} >edit</i>
        </span>)
         
    }

}