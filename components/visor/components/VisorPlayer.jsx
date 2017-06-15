import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import i18n from 'i18next';

export default class VisorPlayer extends Component {
    constructor(props) {
        super(props);  
    }

    render() {
        let navItemsIds = this.props.navItemsIds;        
        let navItemsById = this.props.navItemsById;
        let navItemSelected = this.props.navItemSelected;

        let index = navItemsIds.indexOf(navItemSelected);
        let maxIndex = navItemsIds.length;

        return( 
            /* jshint ignore:start */
            <div id="player">
                <Button className="playerButton" 
                        bsStyle="primary" 
                        disabled={maxIndex==0}
                        onClick={(e)=>{this.props.changePage(navItemsIds[0])}}>
                    <i className="material-icons">first_page</i>
                </Button>
                <Button className="playerButton" 
                        bsStyle="primary" 
                        disabled={index==0 || maxIndex==0} 
                        onClick={(e)=>{this.props.changePage(navItemsIds[Math.max(index-1, 0)])}}>
                    <i className="material-icons">chevron_left</i>
                </Button>
                <Button className="playerButton" 
                        bsStyle="primary"
                        disabled={index==maxIndex-1 || maxIndex==0} 
                        onClick={(e)=>{this.props.changePage(navItemsIds[Math.min(index+1, maxIndex-1)])}}>
                    <i className="material-icons">chevron_right</i>
                </Button>                
                <Button className="playerButton" 
                        bsStyle="primary" 
                        disabled={maxIndex==0}
                        onClick={(e)=>{this.props.changePage(navItemsIds[maxIndex-1])}}>
                    <i className="material-icons">last_page</i>
                </Button>
            </div>
            /* jshint ignore:end */
        );
    }
}
