import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { findParentBySelector } from '../../../../common/utils';
import './_click_n_hold.scss';
/*
* Component wrapper for editing marks by dragging them
* @example <ClickNHold onClickNHold={e=>{...}} // callback
*             time={2}>   // time to hold (secs)
*           <Component1/><Component2/>...  //Children
*  </ClickNHold>
*
*/
export default class ClickNHold extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{holding: boolean, start: number, ended: boolean}}
         */
        this.state = {
            holding: false,
            start: 0,
            ended: false,
        };
        /**
         * Binded function
         */
        this.start = this.start.bind(this);
        /**
         * Binded function
         */
        this.end = this.end.bind(this);
        /**
         * Binded function
         */
        this.timeout = this.timeout.bind(this);
        /**
         * Binded function
         */
        this.overlay = this.overlay.bind(this);
        /**
         * Binded function
         */
        this.mouseLeave = this.mouseLeave.bind(this);
    }

    /**
     * Drag start callback
     * @param e Event
     */
    start(e) {
        let ended = this.state.ended;
        let start = Date.now();
        this.setState({ start: start, holding: true, ended: false });
        let time = this.props.time;
        setTimeout(function() {this.timeout(start);}.bind(this), 1 /* time * 100 + 1 */);
        e.stopPropagation();
    }

    /**
     * Drag end callback
     * @param e Event
     */
    end(e) {
        this.setState({ start: 0, holding: false, ended: true });
        // e.stopPropagation()
    }

    /**
     * Timeout callback
     * @param start
     */
    timeout(start) {
        // Only edit mark if enough time has passed
        if (this.state.holding && this.state.start === start) {
            if (this.props.onClickNHold) {
                this.props.onClickNHold(start);
            }
            this.setState({ ended: true, holding: false, editing: true });
            this.overlay();
            return;

        }
        this.setState({ ended: true, editing: false });

    }

    /**
     * Mouse leave callback
     * @param e Event
     */
    mouseLeave(e) {
        if (this.state.holding) {
            this.end(e);
        }
    }

    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let classList = '';
        classList += this.state.holding ? 'holding ' : '';
        classList += this.state.ended ? 'ended ' : '';
        classList += this.state.editing ? 'editing' : '';
        return (
            <div draggable="true"
                className={classList}
                style={this.props.style}
                onMouseDown={this.start}
                onTouchStart={this.start}
                onMouseUp={()=>{console.log(0); this.end();}}
                onMouseEnter={(e)=>{
                    this.props.base.pointerEventsCallback('mouseenter', this.props.base.getState());
                }}
                onMouseLeave={(e)=>{
                    let bool = findParentBySelector(ReactDOM.findDOMNode(this), '.pointerEventsEnabled');
                    this.props.base.pointerEventsCallback('mouseleave_' + (bool && !this.state.editing ? 'true' : 'false'), this.props.base.getState());
                    this.mouseLeave(e);
                }}
                onTouchCancel={this.end}
                onTouchEnd={this.end}
                onDoubleClick={(e) => e.stopPropagation()}
                onDrag={(e)=>e.stopPropagation()} >
                {this.props.children}
            </div>
        );
    }

    /**
     * Overlay creation
     */
    overlay() {
        let myself = ReactDOM.findDOMNode(this);
        let dropableElement = findParentBySelector(myself, '.dropableRichZone');
        let boxStyle = findParentBySelector(myself, '.boxStyle');
        boxStyle.classList.add('norotate');
        let overlay = document.createElement("div");
        overlay.classList.add('overlay');
        overlay.id = 'overlay';

        /* OVERLAY */
        dropableElement.classList.add("rich_overlay");
        overlay.style.top = dropableElement.offsetTop + "px";
        overlay.style.left = dropableElement.offsetLeft + "px";
        overlay.style.width = dropableElement.offsetWidth + "px";
        overlay.style.height = dropableElement.offsetHeight + "px";

        let cursor_x_offset = 12;
        let cursor_y_offset = 20;
        let component = this;
        overlay.style.cursor = 'url("/images/mark.svg") ' + cursor_x_offset + ' ' + cursor_y_offset + ', crosshair !important';
        document.body.style.cursor = 'url("/images/mark.svg") ' + cursor_x_offset + ' ' + cursor_y_offset + ', crosshair !important';
        let base = this.props.base;
        let toolbarState = base.getState();
        let parseRichMarkInput = base.parseRichMarkInput;
        let editing = this.state.editing;
        const id = this.props.mark;

        let keyListener = function(e) {
            const ESCAPE_KEY_CODE = 27;
            if (e.keyCode === ESCAPE_KEY_CODE) {
                exitFunction();
            }
        };

        let exitFunction = function() {
            document.body.style.cursor = 'default';
            boxStyle.classList.remove('norotate');
            window.removeEventListener('keyup', keyListener);
            document.documentElement.removeEventListener('mouseup', clickOutside);
            if (overlay) {
                overlay.remove();
            }
            dropableElement.classList.remove('rich_overlay');
            /* if(component) {
                component.setState({ editing: false });
            }*/
            base.render('UPDATE_BOX');
        };

        let clickOutside = function(e) {
            // this function will be always called if a click happens,
            // even if stopImmediatePropagation is used on the event target
            if (e.target && e.target.id === 'overlay') {
                return;
            }
            exitFunction();

        };
        document.documentElement.addEventListener('mouseup', clickOutside, true);
        window.addEventListener('keyup', keyListener);

        overlay.oncontextmenu = function(event) {
            exitFunction();
            event.preventDefault();
        };

        overlay.onmouseup = function(event) {
            if (event.which === 3) {
                exitFunction();
                return;
            }
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
            document.body.style.cursor = 'default';
            boxStyle.classList.remove('norotate');
            document.documentElement.removeEventListener('mouseup', clickOutside, true);
            window.removeEventListener('keyup', keyListener);
            overlay.remove();
            dropableElement.classList.remove('rich_overlay');
            if (component) {
                component.setState({ editing: false });
            }
            base.setState('__marks', marks);
            base.render('UPDATE_BOX');
        };
        dropableElement.parentElement.appendChild(overlay);

    }

}

