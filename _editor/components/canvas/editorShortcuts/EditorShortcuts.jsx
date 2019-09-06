import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Ediphy from '../../../../core/editor/main';
import { Tooltip, OverlayTrigger, Button, Popover, Overlay } from 'react-bootstrap';
import { UPDATE_BOX } from '../../../../common/actions';
import i18n from 'i18next';
import { isSortableBox, isSortableContainer } from '../../../../common/utils';
import { blurCKEditor, findBox } from '../../../../common/commonTools';
import { connect } from "react-redux";

/**
 * EditorShortcuts component
 * Floating tools that help edit EditorBoxes more easily
 */
class EditorShortcuts extends Component {
    state = { left: 0, top: 0, width: 0, open: false, showOverlay: false, urlValue: "" };

    render() {
        let box = this.props.box;
        let toolbar = this.props.pluginToolbar;

        if (!box || !toolbar || toolbar.pluginId === "sortable_container") {
            return null;
        }
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        if (!apiPlugin) {
            return null;
        }
        let config = apiPlugin.getConfig();
        let hasURL = false;
        let hasURLnotextprov = false;
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
            callback: ()=>{ this.props.onToolbarUpdated(box.id, "main", "state", 'nBoxes', toolbar.state.nBoxes + 1);},
        }, {
            i18nKey: 'remove_answer',
            icon: 'delete_sweep',
            callback: ()=>{if (toolbar.state.nBoxes > 1) {
                this.props.onToolbarUpdated(box.id, "main", "state", 'nBoxes', toolbar.state.nBoxes - 1);}
            },
        }];
        return (
            <div id={this.props.isContained ? "contained_editorBoxIcons" : "editorBoxIcons"}
                className=""
                onClick={(e)=>{e.stopPropagation();}}
                onMouseDown={(e)=>{e.stopPropagation();}}
                ref="container"
                style={{
                    display: (box && box.id && isSortableBox(box.id)) || !box || !box.id ? 'none' : 'block',
                    position: 'absolute',
                    left: this.state.left + 10,
                    top: this.state.top,
                    transform: 'rotate(' + (toolbar.structure.rotation || 0) + 'deg)',
                    transformOrigin: '0px 100%',
                    // width: this.state.width !== 0 ? this.state.width : "auto"
                }}>
                <div ref="innerContainer" style={{ display: "inline-block", minWidth: "50px", overflow: 'hidden', height: '37px' }}>
                    <span className="namePlugin">{config.displayName || ""}</span>
                    <Overlay rootClose
                        name="urlOverlay"
                        show={this.state.showOverlay} placement='top'
                        target={() => ReactDOM.findDOMNode(this.overlayTarget)}
                        onHide={() => this.setState({ showOverlay: false })}>
                        <Popover id="popov" title={i18n.t('messages.popoverUrlTitle')} className="popoverURL">
                            <input type="text" className="form-control" ref={'url_input'} placeholder={'http://... '} onKeyDown={e=>{
                                if (e.keyCode === 13) {this.hideOverlay();}
                            }}/>
                            <Button className="popoverButton"
                                name="popoverAcceptButton"
                                // disabled={ this.state.urlValue === ""}
                                onClick={this.hideOverlay}>
                                {i18n.t("Accept")}
                            </Button>
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
                                <button id="open_conf" className={"editorTitleButton"}
                                    ref={ button => {this.overlayTarget = button;}}
                                    onClick={this.showOverlay}>
                                    <i className="material-icons">search</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        (hasURL) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="config">
                                        {i18n.t('messages.Change_source')}
                                    </Tooltip>
                                }>
                                <button id="open_conf" className={"editorTitleButton"}
                                    onClick={(e) => {
                                        this.props.openFileModal(box.id, accept);
                                        this.setState({ open: true, callbackKey });
                                    }}>
                                    <i className="material-icons">search</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        config.isRich ?
                            (<OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="richMark">{i18n.t('messages.add_new_mark')}</Tooltip>
                                }>
                                <button id="markCreatorButton" className="editorTitleButton" onMouseDown={(e)=>{
                                    e.preventDefault();
                                    this.props.onMarkCreatorToggled(box.id);
                                }}>
                                    <i id="markCreatorButton" className="material-icons">room</i>
                                </button>
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
                                <button className="editorTitleButton"
                                    onClick={(e) => {
                                        if (toolbar && toolbar.structure) {
                                            let currentWidth = toolbar.structure.width;
                                            let currentWidthUnit = toolbar.structure.widthUnit;
                                            if(currentWidth === "100" && currentWidthUnit === '%') {
                                                if(config.needsTextEdition) {
                                                    currentWidth = "auto";
                                                }else{
                                                    currentWidth = '20';
                                                    currentWidthUnit = '%';
                                                }
                                            }else{
                                                currentWidth = '100';
                                                currentWidthUnit = '%';
                                            }
                                            this.props.onBoxResized(toolbar.id, { width: currentWidth, widthUnit: currentWidthUnit });
                                        }
                                    }}>
                                    <i className="material-icons">code</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        (config && config.needsTextEdition) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="editartexto">
                                        {i18n.t('messages.edit_text')}
                                    </Tooltip>
                                }>
                                <button className="editorTitleButton"
                                    onClick={(e) => {
                                        blurCKEditor(toolbar.id, (text, content)=>{
                                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor, text, content);});
                                        e.stopPropagation();
                                    }}>
                                    <i className="material-icons">mode_edit</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        (config && config.needsConfigModal) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="config">
                                        {i18n.t('open_conf')}
                                    </Tooltip>
                                }>
                                <button id="open_conf" className={"editorTitleButton"}
                                    onClick={(e) => {
                                        // TODO Cambiar!
                                        this.props.openConfigModal(toolbar.id);
                                        // Ediphy.Plugins.get(toolbar.pluginId).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                                    }}>
                                    <i className="material-icons">build</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        (toolbar && config && config.needsPointerEventsAllowed) ? (
                            <OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="editartexto">
                                        {i18n.t('messages.pointer_events')}
                                    </Tooltip>
                                }>
                                <button id="pebutton" className={boxEl && boxEl.classList.contains('pointerEventsEnabled') ? "editorTitleButton dtbSelected" : "editorTitleButton"}
                                    onClick={(e) => {
                                        boxEl.classList.toggle('pointerEventsEnabled');
                                        let but = document.getElementById('pebutton');
                                        e.stopPropagation();
                                        let bool = boxEl.classList.contains('pointerEventsEnabled');
                                        if (this.props.pointerEventsCallback) {
                                            this.props.pointerEventsCallback(bool ? 'enableAll' : 'disableAll', ttoolbar);
                                        }
                                        bool && but ? but.classList.add('dtbSelected') : but.classList.remove('dtbSelected');
                                    }}>
                                    <i className="material-icons">pan_tool</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            null
                        )
                    }
                    {
                        (toolbar && toolbar.state && toolbar.state.nBoxes) ? (
                            nBoxes.map((nBox, i)=>{ return (
                                <OverlayTrigger key={i} placement="top"
                                    overlay={
                                        <Tooltip id="editartexto">
                                            {i18n.t('messages.' + nBox.i18nKey)}
                                        </Tooltip>
                                    }>
                                    <button id="pebutton" className={"editorTitleButton"}
                                        onClick={(e) => {
                                            nBox.callback();
                                            e.stopPropagation();
                                        }}>
                                        <i className="material-icons">{nBox.icon}</i>
                                    </button>
                                </OverlayTrigger>);})
                        ) : (
                            null
                        )
                    }
                    <OverlayTrigger placement="top"
                        overlay={
                            <Tooltip id="borrarcaja">
                                {i18n.t('messages.erase_plugin')}
                            </Tooltip>
                        }>
                        <button className="editorTitleButton"
                            onClick={(e) => {
                                let page = this.props.containedViewSelected === 0 ? this.props.navItemSelected : this.props.containedViewSelected;
                                this.props.onBoxDeleted(box.id, box.parent, box.container, page && page.id ? page.id : 0);
                                e.stopPropagation();
                            }}>
                            <i className="material-icons">delete</i>
                        </button>
                    </OverlayTrigger>
                </div>
            </div>
        );
    }
    // handleChange(e) {
    //     this.setState({ urlValue: e.target.value });
    // }
    resizeAndSetState = (fromUpdate, newProps) => {
        let { width, top, left } = this.resize(fromUpdate, newProps);
        this.setState({ left: left, top: top, width: width });
    };

    hideOverlay = () => {
        let val = this.refs.url_input.value;
        if (val && val !== '') {
            this.props.onToolbarUpdated(toolbar.id, "main", "state", "url", this.refs.url_input.value);
        }
        this.setState({ showOverlay: false });
    };

    showOverlay = () => this.setState({ showOverlay: true });

    resize = (fromUpdate, newProps) => {
        let nextProps = (fromUpdate === 'fromUpdate') ? newProps : this.props;
        if (nextProps && nextProps.box) {
            let box = findBox(nextProps.box.id);
            let toolbar = nextProps.pluginToolbar;
            let rotation = toolbar.structure.rotation;
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
                let canvas = this.props.containedViewSelected === 0 ?
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
                let w = boxRect.width / 2;
                let h = boxRect.height / 2;
                let R = 1 / 2 * Math.sqrt(h * h + w * w);
                // left = left + w / 2 - R * Math.cos(rotation * Math.PI / 180 + Math.atan2(h, w));

                box.classList.remove('norotate');

                return { left, top, width };
                // this.setState({ left: left, top: top, width: width });
            }
        }
        return { left: 0, top: 0, width: 0 };
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            if (nextProps.box) {
                this.resizeAndSetState("fromUpdate", nextProps);
                // this.setState({ left: left, top: top, width: width });
            }
        }

        if(this.props.fileModalResult &&
            nextProps.fileModalResult && nextProps.box && this.props.box &&
            nextProps.box.id === nextProps.fileModalResult.id
            && nextProps.fileModalResult.value &&
            this.state.open && this.props.fileModalResult.value !== nextProps.fileModalResult.value) {
            this.props.onToolbarUpdated(nextProps.box.id, "main", "state", this.state.callbackKey || 'url', nextProps.fileModalResult.value);
            this.setState({ open: false, callbackKey: undefined });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        let { width, top, left } = this.resize();
        if (this.state.width !== width || this.state.top !== top || this.state.left !== left) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ left: left, top: top, width: width });
        }
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (nextProps !== this.props) {
            if (nextProps.box) {
                // this.resize("fromUpdate", nextProps);
                // Removes pointer events allowance when box is changed
                if (!this.props.box || nextProps.box.id !== this.props.box.id) {
                    let boxEl = findBox((this.props.box ? this.props.box.id : ''));
                    if (boxEl) {
                        if (this.props.pointerEventsCallback) {
                            this.props.pointerEventsCallback('disableAll', this.props.pluginToolbar);
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
        window.addEventListener('resize', this.resizeAndSetState);
        if (this.props && this.props.box) {
            let boxObj = findBox(this.props.box.id);
            if(boxObj) {
                boxObj.addEventListener('resize', this.resizeAndSetState);
            }

        }
    }

    componentWillUnmount() {
        let boxEl = findBox((this.props.box ? this.props.box.id : ''));
        if (boxEl) {
            let bool = boxEl.classList.contains('pointerEventsEnabled');
            if (this.props.pointerEventsCallback) {
                this.props.pointerEventsCallback('disableAll', this.props.pluginToolbar);
            }
            boxEl.classList.remove('pointerEventsEnabled');
        }

        window.removeEventListener('resize', this.resizeAndSetState);
        if (this.props && this.props.box) {
            let boxObj = findBox(this.props.box.id);
            if(boxObj) {
                boxObj.removeEventListener('resize', this.resizeAndSetState);
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        box: state.undoGroup.present.boxesById[state.undoGroup.present.boxSelected],
        containedViewSelected: state.undoGroup.present.containedViewsById[state.undoGroup.present.containedViewSelected] || 0,
        navItemSelected: state.undoGroup.present.navItemsById[state.undoGroup.present.navItemSelected],
        fileModalResult: state.reactUI.fileModalResult,
        pluginToolbar: state.undoGroup.present.pluginToolbarsById[state.undoGroup.present.boxSelected],

    };
}
export default connect(mapStateToProps)(EditorShortcuts);

EditorShortcuts.propTypes = {
    /**
     * Selected box
     */
    box: PropTypes.any,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Check if component is rendered from contained view
     */
    isContained: PropTypes.bool,
    /**
     * Callback for toggling CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Callback for toggling creation mark overlay
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Callback for deleting a box
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Callback for resizing a box
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     *  Callback for enabling pointer events
     */
    pointerEventsCallback: PropTypes.func,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Object containing all the plugins' toolbars
     */
    pluginToolbar: PropTypes.object,
    /**
     * Function that opens a configuration modal
     */
    openConfigModal: PropTypes.func.isRequired,
    /**
     * Function for updating the box's toolbar
     */
    onToolbarUpdated: PropTypes.func,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Function that opens the file search modal
     */
    openFileModal: PropTypes.func.isRequired,
};
