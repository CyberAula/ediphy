import React, {Component} from 'react';
import {FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import Dali from './../../../core/main';

require('./_daliIndexTitle.scss');

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
                (<span className="actualSectionTitle"
                        style={{textDecoration: this.props.hidden ? "line-through" : "initial"}}
                        onDoubleClick={e => {
                            this.setState({ editing: !this.state.editing });
                            if (this.state.editing) { /*Save changes to Redux state*/
                                this.props.onTitleChange(this.props.id, this.state.currentValue);
                            // Synchronize current component state with Redux state when entering edition mode
                            } else {
                                this.setState({currentValue: this.props.title});
                            }
                     }}>
                    {Dali.Config.show_numbers_before_navitems ? this.props.index : ""} {this.props.title}
                </span>) :
                (<FormControl
                    type="text"
                    ref="titleIndex"
                    className={this.props.id ? "editSectionTitle" : "editTitle"}
                    value={this.state.currentValue}
                    autoFocus
                    onKeyDown={e=> {
                        if (e.keyCode == 13) { // Enter Key
                            this.setState({ editing: !this.state.editing });
                            this.props.onTitleChange(this.props.id, this.state.currentValue);
                        }
                        if (e.keyCode == 27) { // Escape key
                            this.setState({editing: !this.state.editing});
                        }
                    }}
                    onFocus={e => {
                        /*Select all the content when enter edition mode*/
                        e.target.setSelectionRange(0, e.target.value.length);
                    }}
                    onChange={e => {
                        /*Save it on component state, not Redux*/
                        this.setState({currentValue: e.target.value});
                    }}
                    onBlur={e => {
                        /*Change to non-edition mode*/
                        this.setState({editing: !this.state.editing});
                        this.props.onTitleChange(this.props.id, this.state.currentValue);
                    }} />
                )
            }
            </span>
            /* jshint ignore:end */
        );
    }
}
