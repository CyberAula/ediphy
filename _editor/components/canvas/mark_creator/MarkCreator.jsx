import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { ID_PREFIX_RICH_MARK, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../constants';
import { nextAvailName } from './../../../../utils';
export default class MarkCreator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onCreation: false,
            triggeredMarkCreator: false,
        };
    }

    render() {
        return (null);
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props.content !== undefined) {
            let element = this.props.content;
            let dom_element = ReactDOM.findDOMNode(element);
            let dropableElement = dom_element.getElementsByClassName('dropableRichZone')[0];

            if(!nextState.onCreation && nextProps.markCreatorId !== false && this.props.currentId === nextProps.markCreatorId) {
                /* find dropableRichZone*/

                let overlay = document.createElement("div");
                overlay.classList.add('overlay');

                /* OVERLAY */
                dropableElement.classList.add("rich_overlay");
                overlay.style.top = dropableElement.offsetTop + "px";
                overlay.style.left = dropableElement.offsetLeft + "px";
                overlay.style.width = dropableElement.offsetWidth + "px";
                overlay.style.height = dropableElement.offsetHeight + "px";

                let cursor_x_offset = 12;
                let cursor_y_offset = 20;

                document.body.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_white_24px.svg") ' + cursor_x_offset + ' ' + cursor_y_offset + ', crosshair';
                /* OVERLAY */

                let component = this;
                let deleteMarkCreator = this.props.deleteMarkCreator;
                let addMarkShortcut = this.props.addMarkShortcut;
                let parseRichMarkInput = this.props.parseRichMarkInput;
                let toolbarState = this.props.toolbarState;
                let onBoxAdded = this.props.onBoxAdded;
                let boxSelected = this.props.boxSelected;
                /* NEW MARK DEFAULT PARAMS*/
                let connectMode = 'new';
                let title = i18n.t('marks.new_mark');
                let type = this.props.pageType;
                let newId = ID_PREFIX_CONTAINED_VIEW + Date.now();
                let pageName = nextAvailName(i18n.t('contained_view'), this.props.containedViews);
                let connection = {
                    id: newId,
                    parent: [this.props.boxSelected],
                    name: pageName,
                    boxes: [],
                    type: type,
                    extraFiles: {},
                    header: {
                        elementContent: {
                            documentTitle: pageName,
                            documentSubTitle: '',
                            numPage: '' },
                        display: {
                            courseTitle: 'hidden',
                            documentTitle: 'expanded',
                            documentSubTitle: 'hidden',
                            breadcrumb: "reduced",
                            pageNumber: "hidden" },
                    },
                };

                let displayMode = 'navigate';

                let keyListener = function(e) {
                    const ESCAPE_KEY_CODE = 27;
                    if (event.keyCode === ESCAPE_KEY_CODE) {
                        exitFunction();
                    }
                };

                let exitFunction = function() {
                    document.body.style.cursor = 'default';
                    window.removeEventListener('keyup', keyListener);
                    overlay.remove();
                    dropableElement.classList.remove('rich_overlay');
                    deleteMarkCreator();
                    component.setState({ onCreation: false });
                };

                window.addEventListener('keyup', keyListener);

                overlay.oncontextmenu = function(event) {
                    exitFunction();
                    event.preventDefault();
                };

                overlay.onclick = function(e) {
                    let square = this.getClientRects()[0];
                    let x = e.clientX - square.left - cursor_x_offset;// e.offsetX;
                    let y = e.clientY - square.top - cursor_y_offset;// e.offsetY;
                    let width = square.right - square.left;
                    let height = square.bottom - square.top;

                    let richMarkValues = [];
                    let promptRes = prompt(i18n.t("marks.create_mark"));
                    if (promptRes === null) {
                        exitFunction();
                        return;
                    }
                    if(toolbarState.__marks) {
                        title = promptRes || nextAvailName(title, toolbarState.__marks, 'title');
                    }

                    pageName = promptRes || pageName;
                    connection.name = pageName;
                    connection.header.elementContent.documentTitle = pageName;

                    let value = parseRichMarkInput(x, y, width, height, richMarkValues, toolbarState);

                    addMarkShortcut({ id: ID_PREFIX_RICH_MARK + Date.now(), title, connectMode, connection, displayMode, value });
                    if(type === PAGE_TYPES.DOCUMENT) {
                        onBoxAdded({ parent: newId, container: 0, id: ID_PREFIX_SORTABLE_BOX + Date.now() }, false, false);
                    }
                    /* This is to delete all elements involved */
                    exitFunction();
                };
                // document.documentElement.style.cursor = 'url("https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_room_black_24px.svg"), default';

                dropableElement.parentElement.appendChild(overlay);
                this.setState({ onCreation: true });

            }
        }
    }

    componentDidUpdate(nextProps) {

    }

}
