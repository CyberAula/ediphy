import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { ID_PREFIX_RICH_MARK, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../common/constants';
import { nextAvailName } from '../../../../common/utils';
import { findBox } from '../../../../common/commonTools';

/**
 * Mark Creator overlay component
 */
export default class MarkCreator extends Component {

    state = {
        onCreation: false,
        triggeredMarkCreator: false,
        value: 0,
        promptRes: "",
        modalToggled: false,
    };

    /**
     * React render component
     * @returns {code}
     */
    render() {
        return (
            null
        );
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

            if(!nextState.onCreation && nextProps.markCreatorId !== false && this.props.currentId === nextProps.markCreatorId) {
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
                let thisBox = findBox(this.props.markCreatorId);
                if (thisBox) {
                    thisBox.style.cursor = cursorStyle;
                }
                let markCreatorId = this.props.markCreatorId;

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

                    let richMarkValues = [];
                    let value = parseRichMarkInput(x, y, width, height, toolbarState, boxSelected);
                    component.setState({ value: value });
                    component.props.onRichMarksModalToggled(value, boxSelected);
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
        if (e.target && (e.target.id === 'markOverlay' || e.target.id === 'markCreatorButton' || (e.target.classList && e.target.classList.contains('popupFooterButton') !== -1))) {
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
        this.props.deleteMarkCreator();
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

    /**
     * Mark name entered callback
     * @param exit
     */
    processPrompt = (exit) => {
        let connectMode = 'new';
        let title = i18n.t('marks.new_mark');
        let type = this.props.pageType;
        let newId = ID_PREFIX_CONTAINED_VIEW + Date.now();
        let markId = ID_PREFIX_RICH_MARK + Date.now();
        let marksType = this.props.toolbar && this.props.toolbar.config && this.props.toolbar.config.marksType ? this.props.toolbar.config.marksType : {};
        let color = marksType.defaultColor || '#222222'; // default dark grey
        let pageName = nextAvailName(i18n.t('contained_view'), this.props.containedViews);
        let connection = {
            id: newId,
            parent: { [this.props.boxSelected]: [markId] },
            name: pageName,
            boxes: [],
            type: type,
            extraFiles: {},
            header: {
                elementContent: {
                    documentTitle: pageName,
                    documentSubtitle: '',
                    numPage: '' },
                display: {
                    courseTitle: 'hidden',
                    documentTitle: 'expanded',
                    documentSubtitle: 'hidden',
                    breadcrumb: "hidden",
                    pageNumber: "hidden" },
            },
        };

        let displayMode = 'navigate';

        let promptRes = this.state.promptRes;// prompt(i18n.t("marks.create_mark"));
        if (promptRes === null || !exit) {
            this.exitFunction();
            return;
        }
        if(this.props.toolbar && this.props.toolbar.state && this.props.toolbar.state.__marks) {
            title = promptRes || nextAvailName(title, this.props.toolbar.state.__marks, 'title');
        }

        pageName = promptRes || pageName;
        connection.name = pageName;
        connection.header.elementContent.documentTitle = pageName;

        let value = this.state.value;
        this.props.addMarkShortcut({ id: markId, title, connectMode, connection, displayMode, value, color });
        if(type === PAGE_TYPES.DOCUMENT) {
            this.props.onBoxAdded({ parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now() }, false, false);
        }
        /* This is to delete all elements involved */
        this.exitFunction();
    };

}

MarkCreator.propTypes = {
    /**
     * Add a new mark
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Add a new box (used to add an EditorBoxSortable if a document contained view is created)
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selected box
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Box selected Toolbar
     */
    toolbar: PropTypes.object.isRequired,
    /**
     * Deletes marks creation overlay
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Transforms mouse position into coordinates, according to the function described in the plugin definition
     */
    parseRichMarkInput: PropTypes.func.isRequired,
    /**
     * Marks creator identifier
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Selected box
     */
    currentId: PropTypes.any.isRequired,
    /**
     * Type of current page
     */
    pageType: PropTypes.string.isRequired,
};
