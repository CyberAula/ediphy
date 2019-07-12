import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EditorBox from '../editor_box/EditorBox';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import Alert from './../../common/alert/Alert';
import { Col, Button } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import interact from 'interactjs';
import { getTitles, isSlide } from '../../../../common/utils';
import { aspectRatio, createBox, instanceExists, changeFontBase } from '../../../../common/common_tools';
import Ediphy from '../../../../core/editor/main';
import ReactResizeDetector from 'react-resize-detector';
import i18n from 'i18next';
import { SnapGrid } from './SnapGrid';
import { ID_PREFIX_BOX } from '../../../../common/constants';

import { getThemeColors } from '../../../../common/themes/theme_loader';
import ThemeCSS from '../../../../common/themes/ThemeCSS';
import { loadBackgroundStyle } from "../../../../common/themes/background_loader";

import { connect } from "react-redux";

/**
 * EditorCanvasSli component
 * Canvas component to display slides
 */
class EditorCanvasSli extends Component {

    state = {
        alert: null,
        width: 0, height: 0, marginTop: 0, marginBottom: 0,
        fontBase: 14,
    };

    render() {
        // eslint-disable-next-line no-shadow
        const { aspectRatio, boxSelected, containedViewSelected, fromCV, grid, navItemSelected, navItems, onToolbarUpdated, pluginToolbars,
            setCorrectAnswer, showCanvas, styleConfig, title, viewToolbars } = this.props;

        const { onBoxSelected, onBoxResized, onBoxDeleted } = this.props.handleBoxes;
        const { onMarkCreatorToggled } = this.props.handleMarks;
        const { openConfigModal, openFileModal } = this.props.handleModals;
        const { onTextEditorToggled, onTitleChanged, onViewTitleChanged } = this.props.handleCanvas;

        const itemSelected = fromCV ? containedViewSelected : navItemSelected;
        const titles = getTitles(itemSelected, viewToolbars, navItems, fromCV);
        const overlayHeight = this.getOverlayHeight(fromCV);

        let toolbar = viewToolbars[itemSelected.id];
        let theme = toolbar && toolbar.theme ? toolbar.theme : styleConfig && styleConfig.theme ? styleConfig.theme : 'default';
        let itemBoxes = itemSelected ? itemSelected.boxes : [];

        let gridOn = grid && ((containedViewSelected !== 0) === fromCV);
        return (
            <Col id={fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12}
                className="canvasSliClass safeZone"
                onMouseDown={this.deselectBoxes}
                style={{ display: containedViewSelected !== 0 && !fromCV ? 'none' : 'initial',
                    fontSize: this.state.fontBase ? (this.state.fontBase + 'px') : '14px',
                }}>
                <div id={fromCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air parentRestrict'}
                    style={{ margin: 'auto', visibility: (showCanvas ? 'visible' : 'hidden'),
                        width: this.state.width, height: this.state.height, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom,
                    }}>
                    <div id={fromCV ? "contained_maincontent" : "maincontent"}
                        ref="slideDropZone"
                        onMouseDown={this.hideTitle}
                        className={'innercanvas sli ' + theme}
                        style={ itemSelected.id !== 0 ? loadBackgroundStyle(showCanvas, toolbar, styleConfig, false, aspectRatio, itemSelected.background) : {} }
                    >
                        {this.state.alert}
                        {gridOn ? <div style={{ zIndex: '-1' }} onClick={this.deselectBoxes}><SnapGrid key={fromCV}/></div> : null}
                        <EditorHeader
                            titles={titles}
                            onBoxSelected={onBoxSelected}
                            courseTitle={title}
                            onTitleChanged={onTitleChanged}
                            onViewTitleChanged={onViewTitleChanged}
                        />

                        <br/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            display: 'none',
                            visibility: "collapse",
                        }} />

                        {itemBoxes.map(id => {
                            return <EditorBox
                                key={id} id={id} grid={gridOn}
                                page={itemSelected ? itemSelected.id : 0}
                                handleMarks={this.props.handleMarks}
                                handleBoxes={this.props.handleBoxes}
                                onToolbarUpdated={onToolbarUpdated}
                                onTextEditorToggled={onTextEditorToggled}
                                setCorrectAnswer={setCorrectAnswer}
                                themeColors={toolbar.colors ? toolbar.colors : getThemeColors(theme)}
                                pageType={itemSelected.type || 0}
                            />;
                        })}
                    </div>
                </div>
                <ThemeCSS
                    aspectRatio = {aspectRatio}
                    styleConfig={styleConfig}
                    theme={ theme }
                    toolbar = {{ ...toolbar, colors: toolbar && toolbar.colors ? toolbar.colors : {} }}
                />
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                <EditorShortcuts
                    openConfigModal={openConfigModal}
                    isContained={fromCV}
                    onTextEditorToggled={onTextEditorToggled}
                    onBoxResized={onBoxResized}
                    onBoxDeleted={onBoxDeleted}
                    onToolbarUpdated={onToolbarUpdated}
                    openFileModal={openFileModal}
                    pointerEventsCallback={
                        pluginToolbars[boxSelected]
                        && pluginToolbars[boxSelected].config
                        && pluginToolbars[boxSelected].config.name
                        && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name)
                            ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={onMarkCreatorToggled}
                />
            </Col>
        );
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).dropzone({
            accept: '.floatingEditorBox, .dnd',
            overlap: 'pointer',
            ondropactivate: function(event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: this.interactDrop,
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            },
        });
        let calculated = this.aspectRatio(this.props, this.state);
        this.setState({ fontBase: changeFontBase(calculated.width) });

        window.addEventListener("resize", this.aspectRatioListener);
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).unset();
        window.removeEventListener("resize", this.aspectRatioListener);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.aspectRatio !== nextProps.aspectRatio || this.props.navItemSelected !== nextProps.navItemSelected) {
            window.canvasRatio = nextProps.aspectRatio;
            let calculated = this.aspectRatio(nextProps, nextState);
            this.setState({ fontBase: changeFontBase(calculated.width) });
        }

    }

    aspectRatioListener = () => {
        let calculated = this.aspectRatio();
        this.setState({ fontBase: changeFontBase(calculated.width) });
    };

    aspectRatio = (props = this.props, state = this.state) => {
        let ar = props.aspectRatio;
        let fromCV = props.fromCV;
        let itemSelected = fromCV ? props.containedViewSelected : props.navItemSelected;
        let customSize = itemSelected.customSize;
        let calculated = aspectRatio(ar, fromCV ? 'airlayer_cv' : 'airlayer', fromCV ? 'containedCanvas' : 'canvas', customSize);
        let { width, height, marginTop, marginBottom } = state;
        let current = { width, height, marginTop, marginBottom };
        if (JSON.stringify(calculated) !== JSON.stringify(current)) {
            this.setState({ ...calculated });
        }
        return calculated;
    };

    getOverlayHeight = (fromCV) => {
        let maincontent = document.getElementById(fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        return actualHeight ? actualHeight : '100%';
    };

    hideTitle = e => {
        if (e.target === e.currentTarget) {
            this.props.handleBoxes.onBoxSelected(-1);
            this.setState({ showTitle: false });
        }
        e.stopPropagation();
    };

    interactDrop = event => {

        let mc = this.props.fromCV ? document.getElementById("contained_maincontent") : document.getElementById('maincontent');
        let al = this.props.fromCV ? document.getElementById('airlayer_cv') : document.getElementById('airlayer');
        let rect = event.target.getBoundingClientRect();
        let x = (event.dragEvent.clientX - rect.left - mc.offsetLeft) * 100 / mc.offsetWidth;
        let y = (event.dragEvent.clientY - rect.top + mc.scrollTop /* - parseFloat(al.style.marginTop)*/) * 100 / mc.offsetHeight;
        let config = Ediphy.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig();
        let w = parseFloat(config.initialWidthSlide ? config.initialWidthSlide : (config.initialWidth ? config.initialWidth : '25%'));
        let h = parseFloat(config.initialHeightSlide ? config.initialHeightSlide : (config.initialHeight ? config.initialHeight : '30%'));
        if ((w + x) > 100) {
            x = 100 - w;
        }
        if ((h + y) > 100) {
            y = 100 - h;
        }
        let position = {
            x: x + "%",
            y: y + "%",
            type: 'absolute',
        };
        if (event.relatedTarget.classList.contains('rib')) {
            let name = event.relatedTarget.getAttribute("name");
            let apiPlugin = Ediphy.Plugins.get(name);
            if (!apiPlugin) {
                return;
            }
            config = apiPlugin.getConfig();

            if (config.limitToOneInstance) {
                if (instanceExists(event.relatedTarget.getAttribute("name"))) {
                    let alert = (<Alert className="pageModal"
                        show
                        hasHeader
                        backdrop={false}
                        title={<span><i className="material-icons alert-warning" >
                                        warning</i>{i18n.t("messages.alert")}</span>}
                        closeButton onClose={() => {this.setState({ alert: null });}}>
                        <span> {i18n.t('messages.instance_limit')} </span>
                    </Alert>);
                    this.setState({ alert: alert });
                    return;
                }
            }
            let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
            let page = itemSelected.id;
            let ids = {
                parent: page,
                container: 0,
                position: position,
                id: (ID_PREFIX_BOX + Date.now()),
                page: page,
            };
            createBox(ids, name, true, this.props.handleBoxes.onBoxAdded, this.props.boxes);

        } else {
            let boxDragged = this.props.boxes[this.props.boxSelected];
            let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
            if (boxDragged.parent !== itemSelected.id && (itemSelected.id !== boxDragged.parent || !isSlide(itemSelected.id))) {
                this.props.handleBoxes.onBoxDropped(this.props.boxSelected,
                    0, 0, itemSelected.id, 0, boxDragged.parent, boxDragged.container, position);
            }
            let clone = document.getElementById('clone');
            if (clone) {
                clone.parentElement.removeChild(clone);
            }
        }
        event.dragEvent.stopPropagation();
    };

    onResize = e => {
        let calculated = this.aspectRatio(this.props, this.state);
        this.setState({ fontBase: changeFontBase(calculated.width) });
    };

    deselectBoxes = () => this.props.handleBoxes.onBoxSelected(-1);
}

export default connect(mapStateToProps)(EditorCanvasSli);

function mapStateToProps(state) {
    return {
        styleConfig: state.undoGroup.present.styleConfig,
    };
}
EditorCanvasSli.propTypes = {
    /**
     * Check if component rendered from contained view
     */
    fromCV: PropTypes.bool,
    /**
     * Canvas show flag in current selected view
     */
    showCanvas: PropTypes.bool,
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Course title
     */
    title: PropTypes.string.isRequired,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
   * Function for setting the right answer of an exercise
   */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
   * Function that updates the toolbar of a view
   */
    onToolbarUpdated: PropTypes.func,
    /**
     * Aspect ratio of slides
     */
    aspectRatio: PropTypes.number,
    /**
     * Style config params
     */
    styleConfig: PropTypes.object,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for modals handling
     */
    handleModals: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for text and titles handling
     */
    handleCanvas: PropTypes.object.isRequired,
};
