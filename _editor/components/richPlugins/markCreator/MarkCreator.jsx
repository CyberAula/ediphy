import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { findBox } from '../../../../common/commonTools';
import { connect } from 'react-redux';
import _handlers from "../../../handlers/_handlers";

/**
 * Mark Creator overlay component
 */
class MarkCreator extends React.Component {

    state = {
        onCreation: false,
        triggeredMarkCreator: false,
        value: 0,
        promptRes: "",
        modalToggled: false,
    };

    h = _handlers(this);

    /**
     * React render component
     * @returns {code}
     */
    render() {
        return null;
    }

    /**
     * Before component updates
     * @param nextProps
     * @param nextState
     */
    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if(!this.state.modalToggled) {
            let element = findBox(this.props.currentId);
            let dom_element = ReactDOM.findDOMNode(element);
            let dropableElement = dom_element.getElementsByClassName('dropableRichZone')[0];

            if(!nextState.onCreation && nextProps.markCreatorVisible !== false && this.props.currentId === nextProps.markCreatorVisible) {
                /* find dropableRichZone*/

                let overlay = document.createElement("div");
                overlay.classList.add('overlay');
                overlay.id = 'markOverlay';

                /* OVERLAY */
                dropableElement.classList.add("rich_overlay");
                overlay.style.top = dropableElement.offsetTop + "px";
                overlay.style.left = dropableElement.offsetLeft + "px";
                overlay.style.width = dropableElement.offsetWidth + "px";
                overlay.style.height = dropableElement.offsetHeight + "px";

                let cursor_x_offset = 12;
                let cursor_y_offset = 20;
                let cursorStyle = 'url("/images/mark.svg") ' + cursor_x_offset + ' ' + cursor_y_offset + ', crosshair !important';
                let thisBox = findBox(this.props.markCreatorVisible);
                if (thisBox) {
                    thisBox.style.cursor = cursorStyle;
                }

                document.body.style.cursor = cursorStyle;
                // overlay.parentNode.style.cursor = cursorStyle;
                let boxSelected = nextProps.boxSelected;
                /* OVERLAY */

                let component = this;

                let parseRichMarkInput = this.props.parseRichMarkInput;
                let toolbarState = this.props.toolbar.state;

                /* NEW MARK DEFAULT PARAMS*/
                document.documentElement.addEventListener('mouseup', this.clickOutside, true);
                window.addEventListener('keyup', component.keyListener);

                overlay.oncontextmenu = function(event) {
                    component.exitFunction();
                    event.preventDefault();
                };

                overlay.onmouseup = function(e) {
                    if (e.which === 3) {
                        component.exitFunction();
                        return;
                    }
                    let square = this.getClientRects()[0];
                    let x = e.clientX - square.left - cursor_x_offset;// e.offsetX;
                    let y = e.clientY - square.top - cursor_y_offset;// e.offsetY;
                    let width = square.right - square.left;
                    let height = square.bottom - square.top;

                    let value = parseRichMarkInput(x, y, width, height, toolbarState, boxSelected);
                    component.setState({ value: value });
                    component.h.onRichMarksModalToggled(value, boxSelected);
                    component.exitFunction();
                };

                // document.documentElement.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';
                dropableElement.parentElement.appendChild(overlay);
                this.setState({ onCreation: true });

            }
        }
    }

    clickOutside = (e) => {
        // this function will be always called if a click happens,
        // even if stopImmediatePropagation is used on the event target
        if (e.target && (e.target.id === 'markOverlay' || e.target.id === 'markCreatorButton' || (e.target.classList?.contains('popupFooterButton')))) {
            return;
        }

        this.exitFunction();
    };

    /**
     * After mark is created, overlay disappears
     */
    exitFunction = () => {
        let element = findBox(this.props.currentId);
        let dom_element = ReactDOM.findDOMNode(element);
        let dropableElement = dom_element.getElementsByClassName('dropableRichZone')[0];
        let overlay = document.getElementById('markOverlay');
        document.body.style.cursor = 'default';
        window.removeEventListener('keyup', this.keyListener);
        document.documentElement.removeEventListener('mouseup', this.clickOutside, true);
        if (overlay) {
            overlay.remove();
        }
        dropableElement.classList.remove('rich_overlay');
        this.h.deleteMarkCreator();
        this.setState({ onCreation: false, promptRes: "" });
    };

    /**
     * Key pressed callback
     * @param event
     */
    keyListener = (event) => {
        const ESCAPE_KEY_CODE = 27;
        if (event.keyCode === ESCAPE_KEY_CODE) {
            this.exitFunction();
        }
    };
}

function mapStateToProps(state) {
    return {
        boxes: state.undoGroup.present.boxesById,
        reactUI: state.reactUI,
    };
}
export default connect(mapStateToProps)(MarkCreator);

MarkCreator.propTypes = {
    /**
     * Selected box
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Box selected Toolbar
     */
    toolbar: PropTypes.object.isRequired,
    /**
     * Transforms mouse position into coordinates, according to the function described in the plugin definition
     */
    parseRichMarkInput: PropTypes.func.isRequired,
    /**
     * Marks creator identifier
     */
    markCreatorVisible: PropTypes.any.isRequired,
    /**
     * Selected box
     */
    currentId: PropTypes.any.isRequired,
};
