import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'react-bootstrap';
import i18n from 'i18next';

export default class VisorPlayer extends Component {
    constructor(props) {
        super(props);
         
    }

    render() {
         return( 
            /* jshint ignore:start */
            <div id="player">
                <Button bsStyle="primary">
                    <i className="material-icons">first_page</i>
                </Button>
                <Button bsStyle="primary">
                    <i className="material-icons">chevron_left</i>
                </Button>
                <Button bsStyle="primary">
                    <i className="material-icons">chevron_right</i>
                </Button>                
                <Button bsStyle="primary">
                    <i className="material-icons">last_page</i>
                </Button>
            </div>
            /* jshint ignore:end */
            );
    }
}
