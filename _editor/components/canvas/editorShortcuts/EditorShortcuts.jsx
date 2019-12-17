import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Tooltip, OverlayTrigger, Overlay } from 'react-bootstrap';
import i18n from 'i18next';
import { connect } from "react-redux";

import Ediphy from '../../../../core/editor/main';
import { isSortableBox, isSortableContainer } from '../../../../common/utils';
import { blurCKEditor, findBox } from '../../../../common/commonTools';
import _handlers from "../../../handlers/_handlers";
import { IconsContainer, TitleButton } from "./Styles";
import { PopoverButton } from '../../carousel/Styles';
import { Popover } from "react-bootstrap";

/**
 * EditorShortcuts component
 * Floating tools that help edit EditorBoxes more easily
 */
class EditorShortcuts extends Component {

    state = { left: 0, top: 0, width: 0, open: false, showOverlay: false, urlValue: "" };
    h = _handlers(this);

    render() {
        let box = this.props.boxesById[this.props.boxSelected];
        let toolbar = this.props.pluginToolbarsById[this.props.boxSelected];

        if (!box || !toolbar || toolbar.pluginId === "sortable_container") {
            return null;
        }
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        if (!apiPlugin) {
            return null;
        }
        let config = apiPlugin.getConfig();
        let { hasURL, hasURLnotextprov } = false;
        let accept = '*';
        let callbackKey = "url";
        let createFromLibrary = config.createFromLibrary;
        let searchIcon = config.searchIcon;
        if (searchIcon) {

            if (searchIcon === 'type') {
                hasURLnotextprov = true;
            } else {
                hasURL = (searchIcon && searchIcon instanceof Array && searchIcon.length > 1) ? searchIcon : ((createFromLibrary && createFromLibrary instanceof Array && createFromLibrary.length > 1) ? createFromLibrary : ["*", "url"]);
                accept = hasURL[0];
                callbackKey = hasURL[1];
            }
        }
        let boxEl = findBox((box ? box.id : ''));
        let nBoxes = [{
            i18nKey: 'add_answer',
            icon: 'playlist_add',
            callback: () => { this.h.onToolbarUpdated(box.id, "main", "state", 'nBoxes', toolbar.state.nBoxes + 1); },
        }, {
            i18nKey: 'remove_answer',
            icon: 'delete_sweep',
            callback: () => {
                if (toolbar.state.nBoxes > 1) {
                    this.h.onToolbarUpdated(box.id, "main", "state", 'nBoxes', toolbar.state.nBoxes - 1);
                }
            },
        }];
        return (
            <IconsContainer id={this.props.isContained ? "contained_editorBoxIcons" : "editorBoxIcons"}
                onClick={(e) => { e.stopPropagation(); }}
                onMouseDown={(e) => { e.stopPropagation(); }}
                ref="container"
                style={{
                    display: (box && box.id && isSortableBox(box.id)) || !box || !box.id ? 'none' : 'block',
                    left: this.state.left + 10,
                    top: this.state.top,
                    transform: 'rotate(' + (toolbar.structure.rotation || 0) + 'deg)',
                }}>
                <div ref="innerContainer" style={{ display: "inline-block", minWidth: "50px", overflow: 'hidden', height: '37px' }}>
                    <Overlay rootClose
                        name="urlOverlay"
                        show={this.state.showOverlay} placement='top'
                        target={() => ReactDOM.findDOMNode(this.overlayTarget)}
                        onHide={() => this.setState({ showOverlay: false })}>
                        <Popover id="popov" title={i18n.t('messages.popoverUrlTitle')} className="popoverURL">
                            <input type="text" className="form-control" ref={'url_input'} placeholder={'http://... '} onKeyDown={e => {
                                if (e.keyCode === 13) { this.hideOverlay(); }
                            }} />
                            <PopoverButton
                                popoverURLChildren
                                // disabled={ this.state.urlValue === ""}
                                onClick={this.hideOverlay}>
                                {i18n.t("Accept")}
                            </PopoverButton>
                        </Popover>
                    </Overlay>
                    {
                        (hasURLnotextprov) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="config">
                                        {i18n.t('messages.Change_source')}
                                    </Tooltip>
                                }>
                                <TitleButton id="open_conf"
                                    ref={button => { this.overlayTarget = button; }}
                                    onClick={this.showOverlay}>
                                    <i className="material-icons">search</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        (hasURL) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="config">
                                        {i18n.t('messages.Change_source')}
                                    </Tooltip>
                                }>
                                <TitleButton id="open_conf"
                                    onClick={() => {
                                        this.props.openFileModal(box.id, accept);
                                        this.setState({ open: true, callbackKey });
                                    }}>
                                    <i className="material-icons">search</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        config.isRich ?
                            (<OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="richMark">{i18n.t('messages.add_new_mark')}</Tooltip>
                                }>
                                <TitleButton id="markCreatorButton" onMouseDown={(e) => {
                                    e.preventDefault();
                                    this.h.onMarkCreatorToggled(box.id);
                                }}>
                                    <i id="markCreatorButton" className="material-icons">room</i>
                                </TitleButton>
                            </OverlayTrigger>)
                            : null
                    }
                    {
                        isSortableContainer(box.container) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="ajustaradocumento">
                                        {i18n.t('messages.adjust_to_document')}
                                    </Tooltip>
                                }>
                                <TitleButton
                                    onClick={() => {
                                        if (toolbar && toolbar.structure) {
                                            let currentWidth = toolbar.structure.width;
                                            let currentWidthUnit = toolbar.structure.widthUnit;
                                            if (currentWidth === "100" && currentWidthUnit === '%') {
                                                if (config.needsTextEdition) {
                                                    currentWidth = "auto";
                                                } else {
                                                    currentWidth = '20';
                                                    currentWidthUnit = '%';
                                                }
                                            } else {
                                                currentWidth = '100';
                                                currentWidthUnit = '%';
                                            }
                                            this.h.onBoxResized(toolbar.id, { width: currentWidth, widthUnit: currentWidthUnit });
                                        }
                                    }}>
                                    <i className="material-icons">code</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        (config && config.needsTextEdition) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="editartexto">
                                        {i18n.t('messages.edit_text')}
                                    </Tooltip>
                                }>
                                <TitleButton
                                    onClick={(e) => {
                                        blurCKEditor(toolbar.id, (text, content) => {
                                            this.h.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, text, content);
                                        });
                                        e.stopPropagation();
                                    }}>
                                    <i className="material-icons">mode_edit</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        (config && config.needsConfigModal) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="config">
                                        {i18n.t('open_conf')}
                                    </Tooltip>
                                }>
                                <TitleButton id="open_conf"
                                    onClick={() => {
                                        this.props.openConfigModal(toolbar.id);
                                    }}>
                                    <i className="material-icons">build</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        (toolbar && config && config.needsPointerEventsAllowed) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="editartexto">
                                        {i18n.t('messages.pointer_events')}
                                    </Tooltip>
                                }>
                                <TitleButton id="pebutton" className={boxEl && boxEl.classList.contains('pointerEventsEnabled') ? "dtbSelected" : ""}
                                    onClick={(e) => {
                                        boxEl.classList.toggle('pointerEventsEnabled');
                                        let but = document.getElementById('pebutton');
                                        e.stopPropagation();
                                        let bool = boxEl.classList.contains('pointerEventsEnabled');
                                        if (this.props.pointerEventsCallback) {
                                            this.props.pointerEventsCallback(bool ? 'enableAll' : 'disableAll', toolbar);
                                        }
                                        if (bool && but) {
                                            but.classList.add('dtbSelected');
                                        } else {
                                            but.classList.remove('dtbSelected');
                                        }
                                    }}>
                                    <i className="material-icons">pan_tool</i>
                                </TitleButton>
                            </OverlayTrigger>
                        ) : null
                    }
                    {
                        (toolbar && toolbar.state && toolbar.state.nBoxes) ? (
                            nBoxes.map((nBox, i) => {
                                return (
                                    <OverlayTrigger key={i} placement="top"
                                        overlay={
                                            <Tooltip id="editartexto">
                                                {i18n.t('messages.' + nBox.i18nKey)}
                                            </Tooltip>
                                        }>
                                        <TitleButton id="pebutton"
                                            onClick={(e) => {
                                                nBox.callback();
                                                e.stopPropagation();
                                            }}>
                                            <i className="material-icons">{nBox.icon}</i>
                                        </TitleButton>
                                    </OverlayTrigger>);
                            })
                        ) : null
                    }
                    <OverlayTrigger placement="top"
                        overlay={
                            <Tooltip id="borrarcaja">
                                {i18n.t('messages.erase_plugin')}
                            </Tooltip>
                        }>
                        <TitleButton
                            onClick={this.onDelete}>
                            <i className="material-icons">delete</i>
                        </TitleButton>
                    </OverlayTrigger>
                </div>
            </IconsContainer>
        );
    }

    resizeAndSetState = (fromUpdate, newProps) => {
        let { width, top, left } = this.resize(fromUpdate, newProps);
        this.setState({ left: left, top: top, width: width });
    };

    hideOverlay = () => {
        let val = this.refs.url_input.value;
        if (val && val !== '') {
            this.h.onToolbarUpdated(toolbar.id, "main", "state", "url", this.refs.url_input.value);
        }
        this.setState({ showOverlay: false });
    };

    showOverlay = () => this.setState({ showOverlay: true });

    onDelete = e => {
        const containedViewSelected = this.props.containedViewsById[this.props.containedViewSelected] || 0;
        const navItemSelected = this.props.navItemsById[this.props.navItemSelected];
        const page = containedViewSelected === 0 ? navItemSelected : containedViewSelected;
        const box = this.props.boxesById[this.props.boxSelected];

        this.h.onBoxDeleted(box.id, box.parent, box.container, page && page.id ? page.id : 0);
        e.stopPropagation();
    };
    resize = (fromUpdate, newProps) => {
        let nextProps = (fromUpdate === 'fromUpdate') ? newProps : this.props;
        const containedViewSelected = this.props.containedViewsById[this.props.containedViewSelected] || 0;
        let nextBox = nextProps ?.boxesById ?.[nextProps ?.boxSelected];
        if (nextBox) {
            let box = findBox(nextBox.id);
            // box = box && box.parentNode ? box.parentNode : box;
            let element = ReactDOM.findDOMNode(this.refs.innerContainer);
            let left = 0;
            let top = 0;
            let width = 0;
            if (box) {
                // This is added so the position of the box is calculated on the non-rotated box, preventing the shortcuts from moving when the box is rotated.
                // Do not forget to remove this class later
                box.classList.add('norotate');
                let boxRect = box.getBoundingClientRect();
                let canvas = containedViewSelected === 0 ?
                    document.getElementById('canvas') :
                    document.getElementById('containedCanvas');
                let canvasRect = canvas.getBoundingClientRect();

                left = (boxRect.left - canvasRect.left);
                top = (boxRect.top - canvasRect.top + canvas.scrollTop);
                if (element) {
                    let elementRect = element.getBoundingClientRect();
                    width = boxRect.width < elementRect.width ? elementRect.width : boxRect.width;
                    if ((left + elementRect.width + 15) > (canvasRect.width)) {
                        left = (canvasRect.width) - (elementRect.width) - 15;
                    }
                } else {
                    width = box.getBoundingClientRect().width;
                }
                box.classList.remove('norotate');

                return { left, top, width };
            }
        }
        return { left: 0, top: 0, width: 0 };
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const box = this.props.boxesById[this.props.boxSelected];
        const nextBox = nextProps.boxesById[nextProps.boxSelected];

        if (nextProps !== this.props) {
            if (box) {
                this.resizeAndSetState("fromUpdate", nextProps);
            }
        }

        if (this.props.fileModalResult &&
            nextProps.fileModalResult && nextBox && box &&
            nextBox.id === nextProps.fileModalResult.id
            && nextProps.fileModalResult.value &&
            this.state.open && this.props.fileModalResult.value !== nextProps.fileModalResult.value) {
            this.h.onToolbarUpdated(nextBox.id, "main", "state", this.state.callbackKey || 'url', nextProps.fileModalResult.value);
            this.setState({ open: false, callbackKey: undefined });
        }
    }
    componentDidUpdate() {
        let { width, top, left } = this.resize();
        if (this.state.width !== width || this.state.top !== top || this.state.left !== left) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ left: left, top: top, width: width });
        }
    }

    UNSAFE_componentWillUpdate(nextProps) {
        const box = this.props.boxesById[this.props.boxSelected];
        const nextBox = nextProps.boxesById[nextProps.boxSelected];
        const toolbar = this.props.pluginToolbarsById[this.props.boxSelected];

        if (nextProps !== this.props) {
            if (nextBox) {
                // Removes pointer events allowance when box is changed
                if (!box || nextBox.id !== box.id) {
                    let boxEl = findBox((box ?.id ?? ''));
                    if (boxEl) {
                        if (this.props.pointerEventsCallback) {
                            this.props.pointerEventsCallback('disableAll', toolbar);
                        }
                        boxEl.classList.remove('pointerEventsEnabled');
                    }
                    let pebutton = document.getElementById('pebutton');
                    if (pebutton) {
                        pebutton.classList.remove('dtbSelected');
                    }
                }
            }
        }
    }

    componentDidMount() {
        const box = this.props.boxesById[this.props.boxSelected];
        window.addEventListener('resize', this.resizeAndSetState);
        if (box) {
            let boxObj = findBox(box.id);
            if (boxObj) {
                boxObj.addEventListener('resize', this.resizeAndSetState);
            }

        }
    }

    componentWillUnmount() {
        const box = this.props.boxesById[this.props.boxSelected];
        const boxEl = findBox((box ?.id ?? ''));
        if (boxEl) {
            if (this.props.pointerEventsCallback) {
                this.props.pointerEventsCallback('disableAll', this.props.pluginToolbarsById[this.props.boxSelected]);
            }
            boxEl.classList.remove('pointerEventsEnabled');
        }

        window.removeEventListener('resize', this.resizeAndSetState);
        if (box) {
            let boxObj = findBox(box.id);
            if (boxObj) {
                boxObj.removeEventListener('resize', this.resizeAndSetState);
            }
        }
    }
}

function mapStateToProps(state) {

    const { boxesById, boxSelected, containedViewsById, containedViewSelected, navItemsById, navItemSelected, pluginToolbarsById } = state.undoGroup.present;
    return {
        boxesById,
        boxSelected,
        containedViewsById,
        containedViewSelected,
        navItemsById,
        navItemSelected,
        fileModalResult: state.reactUI.fileModalResult,
        pluginToolbarsById,

    };
}
export default connect(mapStateToProps)(EditorShortcuts);

EditorShortcuts.propTypes = {
    /**
     * Object containing all boxes (by ID)
     */
    boxesById: PropTypes.any,
    /**
     * Object containing all boxes (by ID)
     */
    boxSelected: PropTypes.any,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all contained views (by ID)
     */
    containedViewsById: PropTypes.any,
    /**
     * Check if component is rendered from contained view
     */
    isContained: PropTypes.bool,
    /**
     *  Callback for enabling pointer events
     */
    pointerEventsCallback: PropTypes.func,
    /**
     * Object containing all views (by ID)
     */
    navItemsById: PropTypes.any,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Object containing all the plugins' toolbars
     */
    pluginToolbarsById: PropTypes.object,
    /**
     * Function that opens a configuration modal
     */
    openConfigModal: PropTypes.func.isRequired,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Function that opens the file search modal
     */
    openFileModal: PropTypes.func.isRequired,
};
