import React, {Component} from 'react';

export default class MarkCreator extends Component {

    render() {
        /* jshint ignore:start */
        return (null);
        /* jshint ignore:end */
    }

    componentWillUpdate(nextProps){
        if(nextProps.MarkCreatorId !== false){
            //change to hover
            document.documentElement.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';
        }
    }

}