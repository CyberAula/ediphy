import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Ediphy from '../../../../core/editor/main';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { UPDATE_BOX } from '../../../../common/actions';
import i18n from 'i18next';
import { isSortableBox, isSortableContainer } from '../../../../common/utils';
import { findBox } from '../../../../common/common_tools';

/**
 * EditorShortcuts component
 * Floating tools that help edit EditorBoxes more easily
 */
export default class EditorShortcuts extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         */
        this.state = {
            left: 0,
            top: 0,
            width: 0,
        };
        /**
         * Resize function binded
         */
        this.resizeAndSetState = this.resizeAndSetState.bind(this);
    }

    /**
     * Renders react component
     * @returns {code}
     */
    render() {
        let box = this.props.box;
        let toolbar = this.props.pluginToolbar;

        if (!box || !toolbar) {
            return null;
        }
        let apiPlugin = Ediphy.Plugins.get(toolbar.pluginId);
        let config = apiPlugin.getConfig();
        console.log('shortcuts', toolbar, config, apiPlugin);
        let boxEl = findBox((box ? box.id : ''));

        return (
            <div id={this.props.isContained ? "contained_editorBoxIcons" : "editorBoxIcons"}
                className=""
                ref="container"
                style={{
                    display: (box && box.id && isSortableBox(box.id)) || !box || !box.id ? 'none' : 'block',
                    position: 'absolute',
                    left: this.state.left + 10,
                    top: this.state.top,
                    // width: this.state.width !== 0 ? this.state.width : "auto"
                }}>
                <div ref="innerContainer" style={{ display: "inline-block", minWidth: "150px", overflow: 'hidden', height: '37px' }}>
                    <span className="namePlugin">{config.displayName || ""}</span>
                    {
                        config.isRich ?
                            (<OverlayTrigger placement="top"
                                overlay={
                                    <Tooltip id="richMark">{i18n.t('messages.add_new_mark')}</Tooltip>
                                }>
                                <button id="markCreatorButton" className="editorTitleButton" onMouseDown={(e)=>{
                                    this.props.onMarkCreatorToggled(box.id);
                                }}>
                                    <i id="markCreatorButton" className="material-icons">room</i>
                                </button>
                            </OverlayTrigger>)
                            : <span />
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
                                            let currentHeight = toolbar.structure.height;
                                            if(currentWidth === "100%") {
                                                if(config.needsTextEdition) {
                                                    currentWidth = "auto";
                                                }else{
                                                    currentWidth = '20%';
                                                }
                                            }else{
                                                currentWidth = '100%';
                                            }
                                            this.props.onBoxResized(toolbar.id, currentWidth, currentHeight);
                                        }
                                    }}>
                                    <i className="material-icons">code</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <span />
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
                                        this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);
                                        e.stopPropagation();
                                    }}>
                                    <i className="material-icons">mode_edit</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <span />
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
                                        // Ediphy.Plugins.get(toolbar.pluginId).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                                    }}>
                                    <i className="material-icons">build</i>
                                </button>
                            </OverlayTrigger>
                        ) : (
                            <span />
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
                            <span />
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

    resizeAndSetState(fromUpdate, newProps) {
        let { width, top, left } = this.resize(fromUpdate, newProps);
        this.setState({ left: left, top: top, width: width });
    }
    /**
     * Resize callback for when either the window or the parent container change their size
     * @param fromUpdate
     * @param newProps
     */
    resize(fromUpdate, newProps) {
        let nextProps = (fromUpdate === 'fromUpdate') ? newProps : this.props;
        if (nextProps && nextProps.box) {
            let box = findBox(nextProps.box.id);
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
                box.classList.remove('norotate');

                return { left, top, width };
                // this.setState({ left: left, top: top, width: width });

            }
        }
        return { left: 0, top: 0, width: 0 };
    }

    /**
     * Before component receives props
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            if (nextProps.box) {
                this.resizeAndSetState("fromUpdate", nextProps);
                // this.setState({ left: left, top: top, width: width });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let { width, top, left } = this.resize();

        if (this.state.width !== width || this.state.top !== top || this.state.left !== left) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ left: left, top: top, width: width });
        }
    }

    /** *
     * Before component updates
     * Removes pointer events allowance when box is changed
     * @param nextProps
     */
    componentWillUpdate(nextProps) {
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

    /**
     * After component is mounted
     * Sets resize listeners
     */
    componentDidMount() {
        window.addEventListener('resize', this.resizeAndSetState);
        if (this.props && this.props.box) {
            let boxObj = findBox(this.props.box.id);
            if(boxObj) {
                boxObj.addEventListener('resize', this.resizeAndSetState);
            }

        }
    }

    /**
     * Before component unmounts
     * Remove resize listeners
     */
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

EditorShortcuts.propTypes = {
    /**
     * Caja seleccionada
     */
    box: PropTypes.any,
    /**
     * Vista contenida seleccionada
     */
    containedViewSelected: PropTypes.any,
    /**
     * Si se renderiza el componente desde una vista contenida (true) o una normal (false)
     */
    isContained: PropTypes.bool,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Muestra/oculta el overlay de creación de marcas
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Borra una caja
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Redimensiona una caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Toolbar seleccionada
     */
    toolbar: PropTypes.object,
    /**
     * Activa la funcionalidad de manipular el plugin con el ratón/dedo
     */
    pointerEventsCallback: PropTypes.func,
    /**
       * Selected page
       */
    navItemSelected: PropTypes.any,
};
