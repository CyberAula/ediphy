import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EditorBox from '../editor_box/EditorBox';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import Alert from './../../common/alert/Alert';
import { Col, Button } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import interact from 'interactjs';
import { ADD_BOX, changeGlobalConfig, changeNavItemName } from '../../../../common/actions';
import { isSlide, isSortableBox } from '../../../../common/utils';
import { aspectRatio, createBox, instanceExists, changeFontBase } from '../../../../common/common_tools';
import Ediphy from '../../../../core/editor/main';
import ReactResizeDetector from 'react-resize-detector';
import i18n from 'i18next';
import { SnapGrid } from './SnapGrid';
import { ID_PREFIX_BOX } from '../../../../common/constants';

import { loadTheme, getThemeColors } from '../../../../common/themes/theme_loader';
import ThemeCSS from '../../../../common/themes/ThemeCSS';
import { loadBackground, loadBackgroundStyle } from "../../../../common/themes/background_loader";

/**
 * EditorCanvasSli component
 * Canvas component to display slides
 */
export default class EditorCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            width: 0, height: 0, marginTop: 0, marginBottom: 0,
            fontBase: 14,
        };
        this.aspectRatio = this.aspectRatio.bind(this);
    }

    render() {
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        let titles = [];
        if (itemSelected && itemSelected.id !== 0) {
            let initialTitle = this.props.viewToolbars[itemSelected.id].viewName;
            titles.push(initialTitle);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.viewToolbars[parent].viewName);
                    parent = this.props.navItems[parent].parent;
                }
            }
            titles.reverse();
        }

        let maincontent = document.getElementById(this.props.fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let styleConfig = this.props.styleConfig;
        let toolbar = this.props.viewToolbars[itemSelected.id];
        let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;
        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = itemSelected ? itemSelected.boxes : [];

        let gridOn = this.props.grid && ((this.props.containedViewSelected !== 0) === this.props.fromCV);
        return (
            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12}
                className="canvasSliClass safeZone" onMouseDown={()=>{this.props.onBoxSelected(-1);}}
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial',
                    fontSize: this.state.fontBase ? (this.state.fontBase + 'px') : '14px',
                }}>
                <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air parentRestrict'}
                    style={{ margin: 'auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden'),
                        width: this.state.width, height: this.state.height, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom,
                    }}>
                    <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                        ref="slideDropZone"
                        onMouseDown={e => {
                            if (e.target === e.currentTarget) {
                                this.props.onBoxSelected(-1);
                                this.setState({ showTitle: false });
                            }

                            e.stopPropagation();
                        }}
                        className={'innercanvas sli ' + theme}
                        style={ itemSelected.id !== 0 ? loadBackgroundStyle(this.props.showCanvas, toolbar, styleConfig, false, this.props.aspectRatio, itemSelected.background) : {} }
                    >
                        {this.state.alert}
                        {gridOn ? <div style={{ zIndex: '-1' }} onClick={()=>{this.props.onBoxSelected(-1);}}><SnapGrid key={this.props.fromCV}/></div> : null}
                        <EditorHeader titles={titles}
                            onBoxSelected={this.props.onBoxSelected}
                            courseTitle={this.props.title}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            marks={this.props.marks}
                            pluginToolbars={this.props.pluginToolbars}
                            containedView={this.props.containedViewSelected}
                            containedViews={this.props.containedViews}
                            viewToolbars={this.props.viewToolbars}
                            boxes={this.props.boxes}
                            onTitleChanged={this.props.onTitleChanged}
                            onViewTitleChanged={this.props.onViewTitleChanged}
                        />

                        <br/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            display: 'none', // (this.props.boxLevelSelected > 0) ? "block" : "none",
                            visibility: "collapse", // (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                        }} />

                        {boxes.map(id => {
                            let box = boxes[id];
                            return <EditorBox key={id}
                                id={id}
                                grid={gridOn}
                                page={itemSelected ? itemSelected.id : 0}
                                addMarkShortcut={this.props.addMarkShortcut}
                                boxes={this.props.boxes}
                                boxSelected={this.props.boxSelected}
                                boxLevelSelected={this.props.boxLevelSelected}
                                containedViews={this.props.containedViews}
                                containedViewSelected={this.props.containedViewSelected}
                                marks={this.props.marks}
                                pluginToolbars={this.props.pluginToolbars}
                                lastActionDispatched={this.props.lastActionDispatched}
                                deleteMarkCreator={this.props.deleteMarkCreator}
                                markCreatorId={this.props.markCreatorId}
                                onBoxAdded={this.props.onBoxAdded}
                                onBoxSelected={this.props.onBoxSelected}
                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                onBoxMoved={this.props.onBoxMoved}
                                onToolbarUpdated={this.props.onToolbarUpdated}
                                exercises={itemSelected ? (this.props.exercises[itemSelected.id].exercises[id]) : undefined}
                                onBoxResized={this.props.onBoxResized}
                                onRichMarkMoved={this.props.onRichMarkMoved}
                                onSortableContainerResized={this.props.onSortableContainerResized}
                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                onBoxDropped={this.props.onBoxDropped}
                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                onTextEditorToggled={this.props.onTextEditorToggled}
                                setCorrectAnswer={this.props.setCorrectAnswer}
                                themeColors={toolbar.colors ? toolbar.colors : getThemeColors(theme)}
                                pageType={itemSelected.type || 0}
                            />;
                        })}

                    </div>

                </div>
                <ThemeCSS
                    aspectRatio = {this.props.aspectRatio}
                    styleConfig={this.props.styleConfig}
                    theme={ theme }
                    toolbar = {{ ...toolbar, colors: toolbar && toolbar.colors ? toolbar.colors : {} }}
                />
                <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{
                    let calculated = this.aspectRatio(this.props, this.state);
                    this.setState({ fontBase: changeFontBase(calculated.width) });
                }} />
                <EditorShortcuts
                    openConfigModal={this.props.openConfigModal}
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    navItemSelected={this.props.navItemSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onToolbarUpdated={this.props.onToolbarUpdated}
                    fileModalResult={this.props.fileModalResult}
                    openFileModal={this.props.openFileModal}
                    pointerEventsCallback={this.props.pluginToolbars[this.props.boxSelected] && this.props.pluginToolbars[this.props.boxSelected].config && this.props.pluginToolbars[this.props.boxSelected].config.name && Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name) ? Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    pluginToolbar={this.props.pluginToolbars[this.props.boxSelected]}/>
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
            ondrop: function(event) {

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
                    createBox(ids, name, true, this.props.onBoxAdded, this.props.boxes);

                } else {
                    let boxDragged = this.props.boxes[this.props.boxSelected];
                    let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
                    if (boxDragged.parent !== itemSelected.id && (itemSelected.id !== boxDragged.parent || !isSlide(itemSelected.id))) {
                        this.props.onBoxDropped(this.props.boxSelected,
                            0, 0, itemSelected.id, 0, boxDragged.parent, boxDragged.container, position);
                    }
                    let clone = document.getElementById('clone');
                    if (clone) {
                        clone.parentElement.removeChild(clone);
                    }
                }
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            },
        });
        let calculated = this.aspectRatio(this.props, this.state);
        this.setState({ fontBase: changeFontBase(calculated.width) });

        window.addEventListener("resize", this.aspectRatioListener.bind(this));
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).unset();
        window.removeEventListener("resize", this.aspectRatioListener.bind(this));
    }
    aspectRatioListener() {
        let calculated = this.aspectRatio();
        this.setState({ fontBase: changeFontBase(calculated.width) });
    }
    aspectRatio(props = this.props, state = this.state) {
        let ar = props.canvasRatio;
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
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.canvasRatio !== nextProps.canvasRatio || this.props.navItemSelected !== nextProps.navItemSelected) {
            window.canvasRatio = nextProps.canvasRatio;
            let calculated = this.aspectRatio(nextProps, nextState);
            this.setState({ fontBase: changeFontBase(calculated.width) });
        }

    }
}
EditorCanvasSli.propTypes = {
    /**
     * Check if component rendered from contained view
     */
    fromCV: PropTypes.bool,
    /**
     * Slides aspect ratio
     */
    canvasRatio: PropTypes.number.isRequired,
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
     * Selected box level (only plugins inside plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
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
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Callback for adding a mark shortcut
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Callback for deleting mark creator overlay
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identifier of the box that is creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Callback for toggling creation mark overlay
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Callback for deleting a box
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Callback for selecting a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Callback for increasing box level selected (only plugins inside plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Callback for moving a box
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Callback for resizing a box
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Callback for dropping a box
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     *  Callback for vertically aligning boxes inside a container
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Callback for reordering boxes inside a container
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Callback for resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Callback for toggling CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
      * Callback for toggling rich marks modal creator
      */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
     * Callback for moving marks
     */
    onRichMarkMoved: PropTypes.func.isRequired,
    /**
     * Callback for modify course title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Callback for modify navitem title and subtitle
     */
    onViewTitleChanged: PropTypes.func.isRequired,
    /**
   * Object containing all exercises
   */
    exercises: PropTypes.object,
    /**
   * Function for setting the right answer of an exercise
   */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,
    /**
   * Function that updates the toolbar of a view
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
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
    /**
     * Aspect ratio of slides
     */
    aspectRatio: PropTypes.number,
};
