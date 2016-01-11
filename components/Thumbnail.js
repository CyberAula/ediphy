import React, {Component} from 'react';
import {Button, ButtonGroup} from 'react-bootstrap';

export default class Thumbnail extends Component{
    render(){
        let border = (this.props.isSelected) ? "2px solid red" : "";
        return(
            <div style={{backgroundColor: 'gray', width: '100%', height: '12.5%', minHeight: '120px', marginTop: '3%', border: border, boxSizing: 'border-box', position: 'relative'}}
                 onClick={(e) => this.props.onNavItemSelected(this.props.id)}>
                <div>
                    <p>{this.props.id}</p>
                </div>
                <ButtonGroup vertical style={{visibility: (this.props.isSelected ? 'visible' : 'hidden'), position: 'absolute', top: 0}}>
                    <Button><i className="fa fa-trash-o"></i></Button>
                    <Button><i className="fa fa-files-o"></i></Button>
                </ButtonGroup>
            </div>
        );
    }
}
