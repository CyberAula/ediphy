import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';
import ReactResizeDetector from 'react-resize-detector';
import i18n from 'i18next';

import EditorBox from '../editorBox/EditorBox';
import EditorShortcuts from '../editorShortcuts/EditorShortcuts';
import Alert from './../../common/alert/Alert';
import EditorHeader from '../editorHeader/EditorHeader';
import { getTitles, isSlide } from '../../../../common/utils';
import { aspectRatio as aspectRatioFunction, createBox, instanceExists, changeFontBase } from '../../../../common/commonTools';
import Ediphy from '../../../../core/editor/main';
import { SnapGrid } from './SnapGrid';
import { ID_PREFIX_BOX } from '../../../../common/constants';

import { getThemeColors } from '../../../../common/themes/themeLoader';
import ThemeCSS from '../../../../common/themes/ThemeCSS';
import { loadBackgroundStyle } from "../../../../common/themes/backgroundLoader";

import { connect } from "react-redux";
import _handlers from "../../../handlers/_handlers";
import { AirLayer, Canvas, InnerCanvas } from "../editorCanvas/Styles";

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

    h = _handlers(this);

    render() {
        // eslint-disable-next-line no-shadow
        const { boxSelected, containedViewsById, containedViewSelected, fromCV, grid, globalConfig, navItemSelected,
            navItemsById, pluginToolbarsById, styleConfig, viewToolbarsById } = this.props;

        const itemSelected = fromCV ? containedViewsById[containedViewSelected] : navItemsById[navItemSelected];
        const titles = getTitles(itemSelected, viewToolbarsById, navItemsById, fromCV);
        const title = globalConfig.title || '---';
        const aspectRatio = globalConfig.canvasRatio;
        const overlayHeight = this.getOverlayHeight(fromCV);
        const showCanvas = navItemSelected !== 0;

        let toolbar = viewToolbarsById[itemSelected.id];
        let theme = toolbar && toolbar.theme ? toolbar.theme : styleConfig && styleConfig.theme ? styleConfig.theme : 'default';
        let itemBoxes = itemSelected ? itemSelected.boxes : [];

        let gridOn = grid && ((containedViewSelected !== 0) === fromCV);
        return (
            <Canvas id={fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12}
                className="canvasSliClass safeZone"
                onMouseDown={this.deselectBoxes}
                style={{
                    display: containedViewSelected !== 0 && !fromCV ? 'none' : 'initial',
                    fontSize: this.state.fontBase ? (this.state.fontBase + 'px') : '14px',
                }}>
                <AirLayer id={fromCV ? 'airlayer_cv' : 'airlayer'} slide
                    className={'slide_air parentRestrict'}
                    style={{
                        margin: 'auto', visibility: (showCanvas ? 'visible' : 'hidden'),
                        width: this.state.width, height: this.state.height, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom,
                    }}>
                    <InnerCanvas id={fromCV ? "contained_maincontent" : "maincontent"}
                        ref="slideDropZone"
                        onMouseDown={this.hideTitle}
                        className={'innercanvas sli ' + theme}
                        style={itemSelected.id !== 0 ? loadBackgroundStyle(showCanvas, toolbar, styleConfig, false, aspectRatio, itemSelected.background) : {}}
                    >
                        {this.state.alert}
                        {gridOn ? <div style={{ zIndex: '-1' }} onClick={this.deselectBoxes}><SnapGrid key={fromCV} /></div> : null}
                        <EditorHeader
                            titles={titles}
                            courseTitle={title}
                        />

                        <br />

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
                                themeColors={toolbar.colors ? toolbar.colors : getThemeColors(theme)}
                                theme={theme}
                                pageType={itemSelected.type || 0}
                            />;
                        })}
                    </InnerCanvas>
                </AirLayer>
                <ThemeCSS
                    aspectRatio={aspectRatio}
                    styleConfig={styleConfig}
                    theme={theme}
                    toolbar={{ ...toolbar, colors: toolbar && toolbar.colors ? toolbar.colors : {} }}
                />
                <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                <EditorShortcuts
                    openConfigModal={this.h.openConfigModal}
                    isContained={fromCV}
                    onTextEditorToggled={this.h.onTextEditorToggled}
                    onBoxResized={this.h.onBoxResized}
                    onBoxDeleted={this.h.onBoxDeleted}
                    onToolbarUpdated={this.h.onToolbarUpdated}
                    openFileModal={this.h.openFileModal}
                    pointerEventsCallback={
                        pluginToolbarsById[boxSelected]
                            && pluginToolbarsById[boxSelected].config
                            && pluginToolbarsById[boxSelected].config.name
                            && Ediphy.Plugins.get(pluginToolbarsById[boxSelected].config.name)
                            ? Ediphy.Plugins.get(pluginToolbarsById[boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.h.onMarkCreatorToggled}
                />
            </Canvas>
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

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        if (this.props.globalConfig.canvasRatio !== nextProps.globalConfig.canvasRatio || this.props.navItemSelected !== nextProps.navItemSelected) {
            window.canvasRatio = nextProps.globalConfig.canvasRatio;
            let calculated = this.aspectRatio(nextProps, nextState);
            this.setState({ fontBase: changeFontBase(calculated.width) });
        }

    }

    aspectRatioListener = () => {
        let calculated = this.aspectRatio();
        this.setState({ fontBase: changeFontBase(calculated.width) });
    };

    aspectRatio = (props = this.props, state = this.state) => {
        let ar = props.globalConfig.canvasRatio;
        let fromCV = props.fromCV;
        let itemSelected = props.fromCV ? props.containedViewsById[props.containedViewSelected] : props.navItemsById[props.navItemSelected];
        let customSize = itemSelected.customSize;
        let calculated = aspectRatioFunction(ar, fromCV ? 'airlayer_cv' : 'airlayer', fromCV ? 'containedCanvas' : 'canvas', customSize);
        let { width, height, marginTop, marginBottom } = state;
        let current = { width, height, marginTop, marginBottom };
        if (JSON.stringify(calculated) !== JSON.stringify(current)) {
            this.setState({ ...calculated });
        }
        return calculated;
    };

    getOverlayHeight = (fromCV) => {
        let mainContent = document.getElementById(fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (mainContent) {
            actualHeight = parseInt(mainContent.scrollHeight, 10);
            actualHeight = (parseInt(mainContent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        return actualHeight ? actualHeight : '100%';
    };

    hideTitle = e => {
        if (e.target === e.currentTarget) {
            this.deselectBoxes();
            this.setState({ showTitle: false });
        }
        e.stopPropagation();
    };

    interactDrop = event => {

        let mc = this.props.fromCV ? document.getElementById("contained_maincontent") : document.getElementById('maincontent');
        // let al = this.props.fromCV ? document.getElementById('airlayer_cv') : document.getElementById('airlayer');
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
                        closeButton onClose={() => { this.setState({ alert: null }); }}>
                        <span> {i18n.t('messages.instance_limit')} </span>
                    </Alert>);
                    this.setState({ alert: alert });
                    return;
                }
            }
            let itemSelected = this.props.fromCV ? this.props.containedViewsById[this.props.containedViewSelected] : this.props.navItemsById[this.props.navItemSelected];
            let page = itemSelected.id;
            let ids = {
                parent: page,
                container: 0,
                position: position,
                id: (ID_PREFIX_BOX + Date.now()),
                page: page,
            };
            createBox(ids, name, true, this.h.onBoxAdded, this.props.boxesById);

        } else {
            let boxDragged = this.props.boxesById[this.props.boxSelected];
            let itemSelected = this.props.fromCV ? this.props.containedViewsById[this.props.containedViewSelected] : this.props.navItemsById[this.props.navItemSelected];
            if (boxDragged.parent !== itemSelected.id && (itemSelected.id !== boxDragged.parent || !isSlide(itemSelected.id))) {
                this.h.onBoxDropped(this.props.boxSelected,
                    0, 0, itemSelected.id, 0, boxDragged.parent, boxDragged.container, position);
            }
            let clone = document.getElementById('clone');
            if (clone) {
                clone.parentElement.removeChild(clone);
            }
        }
        event.dragEvent.stopPropagation();
    };

    onResize = () => {
        let calculated = this.aspectRatio(this.props, this.state);
        this.setState({ fontBase: changeFontBase(calculated.width) });
    };

    deselectBoxes = () => {
        this.h.onBoxSelected(-1);
    }
}

export default connect(mapStateToProps)(EditorCanvasSli);

function mapStateToProps(state) {
    const { styleConfig } = state.undoGroup.present;
    return {
        styleConfig,
    };
}
EditorCanvasSli.propTypes = {
    /**
     * Check if component rendered from contained view
     */
    fromCV: PropTypes.bool,
    /**
     *  Object containing all created boxes (by id)
     */
    boxesById: PropTypes.object.isRequired,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (by id)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbarsById: PropTypes.object.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
     * Style config params
     */
    styleConfig: PropTypes.object,
    /**
     * Config
     */
    globalConfig: PropTypes.object,
};
