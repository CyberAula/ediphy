import React, {Component} from 'react';
import ReactDOM from 'react-dom';
require('./_click_n_hold.scss')
/*
* <ClickNHold onClickNHold={e=>{...}} // callback
*             time={2}>   // time to hold (secs)
*           <Component1/><Component2/>...  //Children
*  </ClickNHold>
* */
export default class ClickNHold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holding: false,
            start: 0,
            ended: false
        }
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.timeout = this.timeout.bind(this);
        this.overlay = this.overlay.bind(this);
    }

    start(e){
        console.log('start')
        let ended = this.state.ended;
        this.setState({start: Date.now(), holding: true, ended: false});
        if(!ended) {
            setTimeout(this.timeout, this.props.time*1000+1);
        }
    }
    end(e) {
       /* console.log('end')
        let endTime = Date.now();
        let minDiff = this.props.time*1000; // In seconds
        let startTime = this.state.start;
        let diff = endTime - startTime;
        let isEnough = diff >= minDiff; // It has been held for enough time*/
        this.setState({start: 0, holding: false, ended: true});
            /*if (isEnough) {
                this.props.onClickNHold(e);
            }*/
        // e.stopPropagation()
    }
    timeout(e){
        if (!this.state.ended){
            if(this.props.onClickNHold){
                this.props.onClickNHold(e);
                this.setState({ended: false, holding: false, editing: true});
                this.overlay(e);
                return;
            }
        }
        this.setState({ended: false, editing: false});

    }
    render() {
        let classList = '';
        classList += this.state.holding ? 'holding ':'';
        classList += this.state.ended ? 'ended ':'';
        classList += this.state.editing ? 'editing':'';
        return (
            <div className={classList}
                     onMouseDown={this.start}
                     onTouchStart={this.start}
                     onMouseUp={this.end}
                     onTouchCancel={this.end}
                     onTouchEnd={this.end}>
                {this.props.children}
            </div>);
    }
    overlay(e) {
        let myself = ReactDOM.findDOMNode(this);
        let dropableElement = this.findParentBySelector(myself, '.dropableRichZone');
        let overlay = document.createElement("div");

        /* OVERLAY */
        dropableElement.classList.add("rich_overlay");
        overlay.style.top = dropableElement.offsetTop + "px";
        overlay.style.left = dropableElement.offsetLeft + "px";
        overlay.style.width = dropableElement.offsetWidth + "px";
        overlay.style.height = dropableElement.offsetHeight + "px";
        overlay.style.position = "absolute";
        overlay.style.pointerEvents = "all";
        overlay.style.background = 'yellow';
        overlay.style.opacity = '0.35';
        overlay.style.zIndex = 999;

        let cursor_x_offset = 12;
        let cursor_y_offset = 20;
        let component = this;
        overlay.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_white_24px.svg") ' + cursor_x_offset + ' ' + cursor_y_offset + ', crosshair';
        let base = this.props.base;
        let toolbarState = base.getState();
        let parseRichMarkInput = this.props.base.parseRichMarkInput;
        let id = this.props.mark;
        overlay.onclick = function(e){
            let square = this.getClientRects()[0];
            let marks = Object.assign({}, toolbarState.__marks);
            let x = e.clientX - square.left  - cursor_x_offset;//e.offsetX;
            let y = e.clientY - square.top - cursor_y_offset ;//e.offsetY;
            let width = square.right - square.left;
            let height =  square.bottom - square.top;


            let value = parseRichMarkInput(x, y, width, height, [], toolbarState);
            if (marks[id]) {
                marks[id].value = value;
            }
            overlay.remove();
            dropableElement.classList.remove("rich_overlay");
            component.setState({editing: false});
            base.setState('__marks', marks);
            base.render("UPDATE_BOX");
        };
        dropableElement.parentElement.appendChild(overlay);
        /* OVERLAY */

    }


     collectionHas(a, b) { //helper function (see below)
        for(var i = 0, len = a.length; i < len; i ++) {
            if(a[i] == b) return true;
        }
        return false;
    }

    findParentBySelector(elm, selector) {
        var all = document.querySelectorAll(selector);
        var cur = elm.parentNode;
        while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
            cur = cur.parentNode; //go up
        }
        return cur; //will return null if not found
    }
}