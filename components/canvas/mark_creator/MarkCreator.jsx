import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class MarkCreator extends Component {

    constructor(props){
        super(props);
        this.state = {
            onCreation: false
        };
    }

    render() {
        /* jshint ignore:start */
        return (null);
        /* jshint ignore:end */
    }

    componentWillUpdate(nextProps){
        if(this.props.content !== undefined){
            let element = this.props.content;
            let dom_element = ReactDOM.findDOMNode(element);
            let dropableElement = dom_element.getElementsByClassName('dropableRichZone')[0];

            this.setState({onCreation: true});
        }
    }

    componentDidUpdate(nextProps){
        if(!this.state.onCreation && nextProps.markCreatorId !== false && this.props.currentId === nextProps.markCreatorId){
            /* find dropableRichZone*/

            let overlay = document.createElement("div");
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.position = "absolute";
            overlay.style.background = 'yellow';
            overlay.style.opacity = '0.35';
            overlay.style.zIndex = 999;
            overlay.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';
            let component = this;
            overlay.onclick = function(e){
                overlay.remove();
                e.preventDefault();
                component.setState({onCreation: false});
            }
            //document.documentElement.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';

            dropableElement.parentElement.appendChild(overlay);
        }
    }

}