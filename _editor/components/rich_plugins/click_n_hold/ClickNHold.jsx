import React, { Component } from 'react';
import ReactDOM from 'react-dom';

require('./_click_n_hold.scss');
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
            ended: false,
        };
        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.timeout = this.timeout.bind(this);
        this.overlay = this.overlay.bind(this);
    }

    start(e) {
        let ended = this.state.ended;
        let start = Date.now();
        this.setState({ start: start, holding: true, ended: false });
        let time = this.props.time;
        setTimeout(function() {this.timeout(start);}.bind(this), time * 1000 + 1);
    }

    end() {
        this.setState({ start: 0, holding: false, ended: true });
        // e.stopPropagation()
    }

    timeout(start) {
        if (this.state.holding && this.state.start === start) {
            if (this.props.onClickNHold) {
                this.props.onClickNHold(start);
                this.setState({ ended: false, holding: false, editing: true });
                this.overlay();
                return;
            }
        }
        this.setState({ ended: false, editing: false });

    }

    render() {
        let classList = '';
        classList += this.state.holding ? 'holding ' : '';
        classList += this.state.ended ? 'ended ' : '';
        classList += this.state.editing ? 'editing' : '';

        return (
            <div className={classList}
                onMouseDown={this.start}
                onTouchStart={this.start}
                onMouseUp={this.end}
                onMouseLeave={this.end}
                onTouchCancel={this.end}
                onTouchEnd={this.end}
                onDoubleClick={(e)=>e.stopPropagation()}
                onDrag={(e)=>e.stopPropagation()} >
                {this.props.children}
            </div>
        );
    }

    overlay() {
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
        const id = this.props.mark;
        overlay.oncontextmenu = function(event) {
            overlay.remove();
            dropableElement.classList.remove('rich_overlay');
            component.setState({ editing: false });
            base.render('UPDATE_BOX');
            event.stopPropagation();
        };
        overlay.onclick = function(event) {
            const square = this.getClientRects()[0];
            let marks = Object.assign({}, toolbarState.__marks);
            const x = event.clientX - square.left - cursor_x_offset;// event.offsetX;
            const y = event.clientY - square.top - cursor_y_offset;// event.offsetY;
            const width = square.right - square.left;
            const height = square.bottom - square.top;
            const value = parseRichMarkInput(x, y, width, height, [], toolbarState);
            if (marks[id]) {
                marks[id].value = value;
            }
            overlay.remove();
            dropableElement.classList.remove('rich_overlay');
            component.setState({ editing: false });
            base.setState('__marks', marks);
            base.render('UPDATE_BOX');
        };
        dropableElement.parentElement.appendChild(overlay);
        /* OVERLAY */

    }

    collectionHas(a, b) { // helper function (see below)
        for (let i = 0, len = a.length; i < len; i++) {
            if (a[i] === b) {
                return true;
            }
        }
        return false;
    }

    findParentBySelector(elm, selector) {
        const all = document.querySelectorAll(selector);
        let cur = elm.parentNode;
        while (cur && !this.collectionHas(all, cur)) {// keep going up until you find a match
            cur = cur.parentNode;// go up
        }
        return cur;// will return null if not found
    }
}

