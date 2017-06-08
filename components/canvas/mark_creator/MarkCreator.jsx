import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class MarkCreator extends Component {

    render() {
        /* jshint ignore:start */
        return (null);
        /* jshint ignore:end */
    }

    componentWillUpdate(nextProps){
        if(nextProps.MarkCreatorId !== false){
            /* find dropableRichZone*/
            let markPlugin = ReactDOM.findDOMNode(document.getElementById(nextProps.MarkCreatorId)).getElementsByClassName("dropableRichZone");


            //markPlugin.children
            //change to hover
            //document.documentElement.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';
        }
    }

}