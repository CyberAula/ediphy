import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ReactDOM from 'react-dom';


export default class DaliIndexTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            currentValue: this.props.title
        };
    }

    render() {
        return (
            /* jshint ignore:start */
            <span>
            {!this.state.editing ?
                (<span className="actualSectionTitle">{this.props.title} </span>) :
                (<FormControl
                    type="text"
                    ref="titleIndex"
                    className="editSectionTitle"
                    value={this.state.currentValue}
                    autoFocus
                    onKeyDown={e=>{
                        if (e.keyCode == 13) { // Enter Key
                            this.setState({ editing: !this.state.editing });
                            this.props.onTitleChange(this.props.id, this.state.currentValue); 
                        }  
                        if (e.keyCode == 27) { // Escape key
                            this.setState({editing: !this.state.editing});                         
                        }  
                    }}
                    onFocus={e => /*Select all the content when enter edition mode*/
                        {e.target.setSelectionRange(0, e.target.value.length)} 
                    }
                    onChange={e => /*Save it on component state, not Redux*/
                        {this.setState({currentValue: e.target.value})} 
                    }
                    onBlur={e => /*Change to non-edition mode*/
                        {this.setState({editing: !this.state.editing})} 
                    }/>)
            }
                <i className="material-icons editIndexTitleIcon"
                   onClick={() => {
                    this.setState({ editing: !this.state.editing });
                    if (this.state.editing) { /*Save changes to Redux state*/
                        this.props.onTitleChange(this.props.id, this.state.currentValue);
                    } else { /*Synchronize current component state with Redux state when entering edition mode*/
                        this.setState({currentValue: this.props.title});
                     }
                }}>
                    {this.state.editing ? 'check' : 'edit'  /*ICON*/}
                </i>
        </span>
            /* jshint ignore:end */
        );
    }

    componentDidUpdate(prevProps, prevState) {

    }

}