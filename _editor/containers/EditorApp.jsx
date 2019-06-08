import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { Grid, Col, Row, Modal } from 'react-bootstrap';
import {
    addNavItem, selectNavItem, expandNavItem, deleteNavItem, reorderNavItem, toggleNavItem, updateNavItemExtraFiles,
    addBox, selectBox, moveBox, resizeBox, updateBox, deleteBox, reorderSortableContainer, dropBox, increaseBoxLevel,
    resizeSortableContainer, deleteSortableContainer, changeCols, changeRows, changeBackground, changeSortableProps,
    reorderBoxes, verticallyAlignBox, selectIndex, duplicateNavItem,
    toggleTextEditor, pasteBox, changeBoxLayer,
    configScore, exportStateAsync, importStateAsync, importState, changeGlobalConfig, changeStyleConfig,
    uploadVishResourceAsync, importEdi,
    deleteContainedView, selectContainedView,
    addRichMark, editRichMark, moveRichMark, deleteRichMark, setCorrectAnswer,
    updateViewToolbar, updatePluginToolbar,
    addNavItems, uploadEdiphyResourceAsync, deleteRemoteFileVishAsync, deleteRemoteFileEdiphyAsync,
} from '../../common/actions';
import EditorCanvas from '../components/canvas/editor_canvas/EditorCanvas';
import ContainedCanvas from '../components/rich_plugins/contained_canvas/ContainedCanvas';
import EditorCarousel from '../components/carousel/editor_carousel/EditorCarousel';
import PluginConfigModal from '../components/plugin_config_modal/PluginConfigModal';
import Visor from '../../_visor/containers/Visor';
import PluginRibbon from '../components/nav_bar/plugin_ribbon/PluginRibbon';
import ActionsRibbon from '../components/nav_bar/actions_ribbon/ActionsRibbon';
import EditorNavBar from '../components/nav_bar/editor_nav_bar/EditorNavBar';
import ServerFeedback from '../components/server_feedback/ServerFeedback';
import Toolbar from '../components/toolbar/toolbar/Toolbar';
import RichMarksModal from '../components/rich_plugins/rich_marks_modal/RichMarksModal';
import AutoSave from '../components/autosave/AutoSave';
import Alert from '../components/common/alert/Alert';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import i18n from 'i18next';
import { parsePluginContainers, parsePluginContainersReact, hasExerciseBox } from '../../common/plugins_inside_plugins';
import Ediphy from '../../core/editor/main';
import printToPDF from '../../core/editor/print';
import {
    isSortableBox, isSection, isContainedView,
    getDescendantLinkedBoxes, isBox,
    getDescendantBoxes, getDescendantBoxesFromContainer,
} from '../../common/utils';
import 'typeface-ubuntu';
import 'typeface-source-sans-pro';
import PropTypes from 'prop-types';
import { ID_PREFIX_BOX } from '../../common/constants';
import { createBox } from '../../common/common_tools';
import FileModal from '../components/external_provider/file_modal/FileModal';
import EdiphyTour from '../components/joyride/EdiphyTour';
import { serialize } from '../../reducers/serializer';
import screen from '../components/joyride/pantalla.svg';
import help from '../components/joyride/help.svg';
import Cookies from 'universal-cookie';
import ExitModal from "../components/exit_modal/ExitModal";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import toMoodleXML from "../../core/editor/moodle_xml.es6";
const cookies = new Cookies();

/**
 * EditorApp. Main application component that renders everything else
 */
class EditorApp extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.severalBoxes = 0;
        this.state = {
            alert: null,
            pluginTab: '',
            hideTab: 'show',
            visorVisible: false,
            richMarksVisible: false,
            markCreatorVisible: false,
            currentRichMark: null,
            carouselShow: true,
            carouselFull: false,
            serverModal: false,
            catalogModal: false,
            grid: false,
            pluginConfigModal: false,
            publishing: false,
            showGlobalConfig: false, // cookies.get("ediphy_visitor"),
            showStyleConfig: false,
            blockDrag: false,
            showFileUpload: false,
            fileUploadTab: 0,
            showExitModal: false,
            showTour: false,
            showHelpButton: false,
            fileModalResult: { id: undefined, value: undefined },
            initModal: cookies.get("ediphy_visitor") === undefined,
        };
        this.onTextEditorToggled = this.onTextEditorToggled.bind(this);
        this.onRichMarkUpdated = this.onRichMarkUpdated.bind(this);
        this.toolbarUpdated = this.toolbarUpdated.bind(this);
        this.onBoxDeleted = this.onBoxDeleted.bind(this);
        this.onSortableContainerDeleted = this.onSortableContainerDeleted.bind(this);
        this.keyListener = this.keyListener.bind(this);
        this.beforeUnloadAlert = this.beforeUnloadAlert.bind(this);
        this.duplicateNavItem = this.duplicateNavItem.bind(this);
        this.dropListener = (ev) => {
            if (ev.target.tagName === 'INPUT' && ev.target.type === 'file') {
            } else {
                ev.preventDefault();
            }
            this.setState({ blockDrag: false });
        };
        this.dragListener = (ev) => {
            if (!this.state.showFileUpload && !this.state.blockDrag) {
                this.setState({ showFileUpload: "*", fileModalResult: { id: undefined, value: undefined }, fileUploadTab: 0 });
            }
            if (this.state.showFileUpload && this.state.fileUploadTab !== 0) {
                this.setState({ fileUploadTab: 0 });
            }
            ev.preventDefault();
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.add('dragging');
            }
        };
        this.dragExitListener = (ev) => {
            ev.preventDefault();
            // this.setState({ blockDrag: false });
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.remove('dragging');
            }
        };

        this.dragStartListener = (ev) => {
            this.setState({ blockDrag: true });
        };
        this.createHelpModal = this.createHelpModal.bind(this);
        this.createInitModal = this.createInitModal.bind(this);
        this.showTour = this.showTour.bind(this);
        this.exitListener = (ev) => {
            alert('Please press the Logout button to logout.');
        };
    }

    render() {
        const { dispatch, boxes, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            containedViews, containedViewSelected, filesUploaded, indexSelected, exercises,
            undoDisabled, redoDisabled, displayMode, isBusy, pluginToolbars, viewToolbars, marks, lastActionDispatched, globalConfig, styleConfig } = this.props;
        let ribbonHeight = this.state.hideTab === 'hide' ? 0 : 50;
        let title = globalConfig.title || '---';
        let status = this.props.status;
        let everPublished = this.props.everPublished;
        let canvasRatio = globalConfig.canvasRatio;
        let disabled = (navItemSelected === 0 && containedViewSelected === 0) || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected));
        let uploadFunction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
        let deleteFunction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc') ? deleteRemoteFileVishAsync : deleteRemoteFileEdiphyAsync;
        return (
            <Grid id="app" fluid style={{ height: '100%', overflow: 'hidden' }} ref={'app'}>
                <Row className="navBar">
                    {this.state.showTour ? <EdiphyTour toggleTour={(showTour)=>{this.setState({ showTour });}} showTour={this.state.showTour}/> : null}
                    {this.createHelpModal()}
                    {this.createInitModal()}
                    {this.state.alert}
                    <EditorNavBar hideTab={this.state.hideTab} boxes={boxes} isBusy={isBusy}
                        onBoxSelected={(id) => dispatch(selectBox(id, boxes[id]))}
                        showGlobalConfig={this.state.showGlobalConfig}
                        toggleGlobalConfig={()=>{this.setState({ showGlobalConfig: !this.state.showGlobalConfig });}}
                        showStyleConfig={this.state.showStyleConfig}
                        toggleStyleConfig={()=>{this.setState({ showStyleConfig: !this.state.showStyleConfig });}}
                        onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                        globalConfig={{ ...globalConfig, status, everPublished }}
                        styleConfig={{ ...styleConfig }}
                        changeGlobalConfig={(prop, value) => {dispatch(changeGlobalConfig(prop, value));}}
                        changeStyleConfig={(prop, value) => {dispatch(changeStyleConfig(prop, value));}}
                        onIndexSelected={(id) => dispatch(selectIndex(id))}
                        onNavItemSelected={id => dispatch(selectNavItem(id))}
                        onNavItemAdded={(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => dispatch(addNavItem(id, name, parent, type, position, background, customSize, hideTitles, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)), sortable_id))}
                        onNavItemsAdded={(navs, parent)=> dispatch(addNavItems(navs, parent))}
                        onToolbarUpdated={this.onToolbarUpdated}
                        onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
                        undoDisabled={undoDisabled}
                        redoDisabled={redoDisabled}
                        navItemsIds={navItemsIds}
                        navItems={navItems}
                        containedViews={containedViews}
                        containedViewSelected={containedViewSelected}
                        navItemSelected={navItemSelected}
                        boxSelected={boxSelected}
                        undo={() => {dispatch(ActionCreators.undo());}}
                        redo={() => {dispatch(ActionCreators.redo());}}
                        visor={() =>{this.setState({ visorVisible: true });}}
                        publishing={() =>this.setState({ publishing: true })}
                        openExitModal={()=>this.setState({ showExitModal: true })}
                        openTour={()=>{this.setState({ showHelpButton: true });}}
                        uploadFunction={(query, keywords, callback) => dispatch(uploadFunction(query, keywords, callback))}
                        export={(format, callback, options = false) => {
                            if(format === "PDF") {
                                printToPDF(this.props.store.getState().undoGroup.present, callback, options);
                            } else if (format === "MoodleXML") {
                                console.log(this.props.store.getState().undoGroup.present);
                                toMoodleXML(this.props.store.getState().undoGroup.present, callback, options);
                            } else if (format === "edi") {
                                Ediphy.Visor.exportsEDI({ ...this.props.store.getState().undoGroup.present, filesUploaded: this.props.store.getState().filesUploaded }, callback);
                            } else {
                                Ediphy.Visor.exportsHTML({ ...this.props.store.getState().undoGroup.present, filesUploaded: this.props.store.getState().filesUploaded }, callback, options);
                            }}}
                        scorm={(is2004, callback, selfContained = false) => {Ediphy.Visor.exportScorm({ ...this.props.store.getState().undoGroup.present, filesUploaded: this.props.store.getState().filesUploaded, status: this.props.store.getState().status }, is2004, callback, selfContained);}}
                        save={(win) => {dispatch(exportStateAsync({ ...this.props.store.getState() }, win)); }}
                        category={this.state.pluginTab}
                        opens={() => {dispatch(importStateAsync());}}
                        serverModalOpen={()=>{this.setState({ serverModal: true });}}
                        fileModalResult={this.state.fileModalResult}
                        toggleFileUpload={(id, accept)=>{this.setState({ showFileUpload: accept, fileModalResult: { id: id, value: undefined }, fileUploadTab: 0 });}}
                        onExternalCatalogToggled={() => this.setState({ catalogModal: true })}
                        setcat={(category) => {this.setState({ pluginTab: category, hideTab: 'show' });}}/>
                    {Ediphy.Config.autosave_time > 1000 &&
                    <AutoSave save={() => {dispatch(exportStateAsync({ ...this.props.store.getState() }));}}
                        isBusy={isBusy}
                        lastAction={lastActionDispatched}
                        visorVisible={this.state.visorVisible}/>})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel boxes={boxes}
                        globalConfig={globalConfig}
                        onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig(id, titleStr));}}
                        title={title}
                        containedViews={containedViews}
                        containedViewSelected={containedViewSelected}
                        indexSelected={indexSelected}
                        navItemsIds={navItemsIds}
                        navItems={navItems}
                        navItemSelected={navItemSelected}
                        displayMode={displayMode}
                        viewToolbars={viewToolbars}
                        styleConfig={styleConfig}
                        onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                        onIndexSelected={(id) => dispatch(selectIndex(id))}
                        onContainedViewNameChanged={(id, titleStr) => dispatch(updateViewToolbar(id, titleStr))}
                        onContainedViewSelected={ (id) => dispatch(selectContainedView(id)) }
                        onContainedViewDeleted={(cvid)=>{
                            let boxesRemoving = [];
                            containedViews[cvid].boxes.map(boxId => {
                                boxesRemoving.push(boxId);
                                boxesRemoving = boxesRemoving.concat(getDescendantBoxes(boxes[boxId], boxes));
                            });

                            dispatch(deleteContainedView([cvid], boxesRemoving, containedViews[cvid].parent));
                        }}
                        onNavItemNameChanged={(id, titleStr) => dispatch(updateViewToolbar(id, titleStr))}
                        onNavItemAdded={(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => {dispatch(addNavItem(id, name, parent, type, position, background, customSize, hideTitles, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)), sortable_id)); }}
                        onNavItemSelected={id => dispatch(selectNavItem(id))}
                        onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                        onNavItemDuplicated={(id)=> { this.duplicateNavItem(id);}}
                        onNavItemDeleted={(navsel) => {
                            let viewRemoving = [navsel].concat(this.getDescendantViews(navItems[navsel]));
                            let boxesRemoving = [];
                            let containedRemoving = {};
                            viewRemoving.map(id => {
                                navItems[id].boxes.map(boxId => {
                                    boxesRemoving.push(boxId);
                                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(boxes[boxId], boxes));
                                });
                            });
                            let marksRemoving = getDescendantLinkedBoxes(viewRemoving, navItems) || [];
                            dispatch(deleteNavItem(viewRemoving, navItems[navsel].parent, boxesRemoving, containedRemoving, marksRemoving));
                        }}
                        onNavItemReordered={(id, newParent, oldParent, idsInOrder, childrenInOrder) => dispatch(reorderNavItem(id, newParent, oldParent, idsInOrder, childrenInOrder))}
                        carouselShow={this.state.carouselShow}
                        carouselFull={this.state.carouselFull}
                        onToggleFull={() => {
                            if(this.state.carouselFull) {
                                this.setState({ carouselFull: false });
                            }else{
                                this.setState({ carouselFull: true, carouselShow: true });
                            }
                        }}
                        onToggleWidth={()=>{
                            if(this.state.carouselShow) {
                                this.setState({ carouselFull: false, carouselShow: false });
                            }else{
                                this.setState({ carouselShow: true });
                            }
                        }}/>

                    <Col id="colRight" xs={12}
                        style={{ height: (this.state.carouselFull ? 0 : '100%'),
                            width: (this.state.carouselShow ? 'calc(100% - 212px)' : 'calc(100% - 80px)') }}>
                        <Row id="actionsRibbon">
                            <ActionsRibbon onGridToggle={()=> {this.setState({ grid: !this.state.grid });}}
                                grid={this.state.grid}
                                onBoxLayerChanged={(id, parent, container, value, boxes_array) => dispatch(changeBoxLayer(id, parent, container, value, boxes_array))}
                                navItemSelected={navItemSelected}
                                containedViewSelected={containedViewSelected}
                                boxSelected={boxSelected}
                                boxes={boxes}
                                navItems={navItems}
                                marks={marks}
                                exercises={exercises}
                                containedViews={containedViews}
                                pluginToolbars={pluginToolbars}
                                onBoxPasted={(ids, box, toolbar, children, index, markList, score)=>dispatch(pasteBox(ids, box, toolbar, children, index, markList, score))}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                                onBoxDeleted={this.onBoxDeleted}
                                uploadFunction={(query, keywords, callback) => dispatch(uploadFunction(query, keywords, callback))}
                                ribbonHeight={ribbonHeight + 'px'}/>
                        </Row>

                        <Row id="ribbonRow" style={{ top: '-1px', left: (this.state.carouselShow ? '15px' : '147px') }}>
                            <PluginRibbon disabled={disabled}
                                boxSelected={boxes[boxSelected]}
                                navItemSelected={navItems[navItemSelected]}
                                navItems={navItems}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                                containedViewSelected={containedViews[containedViewSelected] || containedViewSelected }
                                category={this.state.pluginTab}
                                hideTab={this.state.hideTab}
                                onTabHide={()=>{this.setState({ pluginTab: "" });}}
                                boxes={boxes}
                                ribbonHeight={ribbonHeight + 'px'} />
                        </Row>
                        <Row id="canvasRow" style={{ height: 'calc(100% - ' + ribbonHeight + 'px)' }}>
                            <EditorCanvas boxes={boxes}
                                grid={this.state.grid}
                                canvasRatio={canvasRatio}
                                boxSelected={boxSelected}
                                boxLevelSelected={boxLevelSelected}
                                marks={marks}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                containedViews={containedViews}
                                containedViewSelected={containedViews[containedViewSelected] || 0}
                                showCanvas={(navItemSelected !== 0)}
                                pluginToolbars={pluginToolbars}
                                viewToolbars={viewToolbars}
                                title={title}
                                aspectRatio={globalConfig.canvasRatio}
                                styleConfig={{ ...styleConfig }}
                                onToolbarUpdated={this.toolbarUpdated}
                                onRichMarkMoved={(mark, value)=>dispatch(moveRichMark(mark, value))}
                                markCreatorId={this.state.markCreatorVisible}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => {dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams)); document.body.scrollTo(0, 0);}}
                                setCorrectAnswer={(id, correctAnswer, page) => { dispatch(setCorrectAnswer(id, correctAnswer, page));}}
                                addMarkShortcut= {(mark) => {
                                    let state = JSON.parse(JSON.stringify(toolbars[boxSelected].state));
                                    state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                                    if(mark.connection.id) {
                                        state.__marks[mark.id].connection = mark.connection.id;
                                    }
                                    dispatch(addRichMark(boxSelected, mark, state));
                                }}
                                deleteMarkCreator={()=>this.setState({ markCreatorVisible: false })}
                                exercises={exercises}
                                openConfigModal={(id)=>{ this.setState({ pluginConfigModal: id }); } }
                                lastActionDispatched={lastActionDispatched}
                                onBoxSelected={(id) => dispatch(selectBox(id, boxes[id]))}
                                onBoxLevelIncreased={() => dispatch(increaseBoxLevel())}
                                onBoxMoved={(id, x, y, position, parent, container) => dispatch(moveBox(id, x, y, position, parent, container))}
                                onBoxResized={(id, structure) => dispatch(resizeBox(id, structure))}
                                onSortableContainerResized={(id, parent, height) => dispatch(resizeSortableContainer(id, parent, height))}
                                onSortableContainerDeleted={(id, parent) => this.onSortableContainerDeleted(id, parent)}
                                moveRichMark={(id, value)=> dispatch(moveRichMark(id, value))}
                                onSortableContainerReordered={(ids, parent) => dispatch(reorderSortableContainer(ids, parent))}
                                onBoxDropped={(id, row, col, parent, container, oldParent, oldContainer, position, index) => dispatch(dropBox(id, row, col, parent, container, oldParent, oldContainer, position, index))}
                                onBoxDeleted={this.onBoxDeleted}
                                onContainedViewSelected={id => dispatch(selectContainedView(id))}
                                onVerticallyAlignBox={(id, verticalAlign)=>dispatch(verticallyAlignBox(id, verticalAlign))}
                                onTextEditorToggled={this.onTextEditorToggled}
                                onBoxesInsideSortableReorder={(parent, container, order) => {dispatch(reorderBoxes(parent, container, order));}}
                                onRichMarksModalToggled={(value, boxId = -1) => {
                                    this.setState({ richMarksVisible: !this.state.richMarksVisible, markCursorValue: value });
                                    if(this.state.richMarksVisible) {
                                        this.setState({ currentRichMark: null, value: null });
                                    }
                                    dispatch(selectBox(boxId, boxes[boxId]));
                                }}
                                onViewTitleChanged={(id, titles)=>{dispatch(updateViewToolbar(id, titles));}}
                                onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
                                fileModalResult={this.state.fileModalResult}
                                openFileModal={(id, accept)=>{ this.setState({ fileModalResult: { id, value: undefined }, showFileUpload: accept, fileUploadTab: 1 });}}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}/>
                            <ContainedCanvas boxes={boxes}
                                grid={this.state.grid}
                                boxSelected={boxSelected}
                                canvasRatio={canvasRatio}
                                marks={marks}
                                onToolbarUpdated={this.toolbarUpdated}
                                exercises={exercises}
                                boxLevelSelected={boxLevelSelected}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                containedViews={containedViews}
                                setCorrectAnswer={(id, correctAnswer, page) => { dispatch(setCorrectAnswer(id, correctAnswer, page));}}
                                containedViewSelected={containedViews[containedViewSelected] || 0}
                                markCreatorId={this.state.markCreatorVisible}
                                openConfigModal={(id)=>{ this.setState({ pluginConfigModal: id }); } }
                                addMarkShortcut= {(mark) => {
                                    let toolbar = pluginToolbars[boxSelected];
                                    let state = JSON.parse(JSON.stringify(toolbar.state));
                                    state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                                    if(mark.connection.id) {
                                        state.__marks[mark.id].connection = mark.connection.id;
                                    }
                                    dispatch(addRichMark(boxSelected, mark, state));
                                }}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                                deleteMarkCreator={()=>this.setState({ markCreatorVisible: false })}
                                title={title}
                                onRichMarksModalToggled={(value, boxId = -1) => {
                                    this.setState({ richMarksVisible: !this.state.richMarksVisible, markCursorValue: value });
                                    if(this.state.richMarksVisible) {
                                        this.setState({ currentRichMark: null, value: null });
                                    }
                                    dispatch(selectBox(boxId, boxes[boxId]));
                                }}
                                pluginToolbars={pluginToolbars}
                                onRichMarkMoved={(mark, value)=>dispatch(moveRichMark(mark, value))}
                                viewToolbars={viewToolbars}
                                moveRichMark={(id, value)=> dispatch(moveRichMark(id, value))}
                                lastActionDispatched={lastActionDispatched}
                                onContainedViewSelected={id => dispatch(selectContainedView(id))}
                                onBoxSelected={(id) => dispatch(selectBox(id, boxes[id]))}
                                onBoxLevelIncreased={() => dispatch(increaseBoxLevel())}
                                onBoxMoved={(id, x, y, position, parent, container) => dispatch(moveBox(id, x, y, position, parent, container))}
                                onBoxResized={(id, structure) => dispatch(resizeBox(id, structure))}
                                onSortableContainerResized={(id, parent, height) => dispatch(resizeSortableContainer(id, parent, height))}
                                onSortableContainerDeleted={(id, parent) => {this.onSortableContainerDeleted(id, parent);}}
                                onSortableContainerReordered={(ids, parent) => dispatch(reorderSortableContainer(ids, parent))}
                                onBoxDropped={(id, row, col, parent, container, oldParent, oldContainer, position, index) => dispatch(dropBox(id, row, col, parent, container, oldParent, oldContainer, position, index))}
                                onBoxDeleted={this.onBoxDeleted}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}
                                onVerticallyAlignBox={(id, verticalAlign)=>dispatch(verticallyAlignBox(id, verticalAlign))}
                                onViewTitleChanged={(id, titles)=>{dispatch(updateViewToolbar(id, titles));}}
                                onTextEditorToggled={this.onTextEditorToggled}
                                onBoxesInsideSortableReorder={(parent, container, order) => {dispatch(reorderBoxes(parent, container, order));}}
                                onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
                                fileModalResult={this.state.fileModalResult}
                                openFileModal={(id, accept)=>{ this.setState({ fileModalResult: { id, value: undefined }, showFileUpload: accept, fileUploadTab: 1 });}}
                                showCanvas={(containedViewSelected !== 0)}/>
                        </Row>
                    </Col>
                </Row>
                <ServerFeedback show={this.state.serverModal}
                    title={"Guardar cambios"}
                    isBusy={isBusy}
                    hideModal={() => this.setState({ serverModal: false })}/>
                <Visor id="visor"
                    title={title}
                    visorVisible={this.state.visorVisible}
                    onVisibilityToggled={()=> this.setState({ visorVisible: !this.state.visorVisible })}
                    filesUploaded={this.props.store.getState().filesUploaded }
                    state={{ ...this.props.store.getState().undoGroup.present, filesUploaded: this.props.store.getState().filesUploaded, status: this.props.store.getState().status }}/>
                <PluginConfigModal
                    id={this.state.pluginConfigModal}
                    fileModalResult={this.state.fileModalResult}
                    openFileModal={(id, accept)=>{ this.setState({ fileModalResult: { id, value: undefined }, showFileUpload: accept, fileUploadTab: 0 });}}
                    name={pluginToolbars[this.state.pluginConfigModal] ? pluginToolbars[this.state.pluginConfigModal].pluginId : ""}
                    state={pluginToolbars[this.state.pluginConfigModal] ? pluginToolbars[this.state.pluginConfigModal].state : {}}
                    closeConfigModal={()=>{ this.setState({ pluginConfigModal: false }); } }
                    updatePluginToolbar={(id, state) => dispatch(updateBox(id, "", pluginToolbars[this.state.pluginConfigModal], state))}
                />
                {Ediphy.Config.external_providers.enable_catalog_modal &&
                <ExternalCatalogModal images={filesUploaded}
                    visible={this.state.catalogModal}
                    onExternalCatalogToggled={() => this.setState({ catalogModal: !this.state.catalogModal })}/>}
                <RichMarksModal boxSelected={boxSelected}
                    pluginToolbar={pluginToolbars[boxSelected]}
                    navItemSelected={navItemSelected}
                    pluginToolbars={pluginToolbars}
                    viewToolbars={viewToolbars}
                    markCursorValue={this.state.markCursorValue}
                    containedViewSelected={containedViewSelected}
                    containedViews={containedViews}
                    marks={marks}
                    navItems={navItems}
                    navItemsIds={navItemsIds}
                    visible={this.state.richMarksVisible}
                    currentRichMark={this.state.currentRichMark}
                    defaultValueMark={pluginToolbars[boxSelected] && pluginToolbars[boxSelected].config && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name) ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).getConfig().defaultMarkValue : 0}
                    validateValueInput={pluginToolbars[boxSelected] && pluginToolbars[boxSelected].config && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name) ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).validateValueInput : null}
                    onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                    onRichMarkAdded={(mark, view, viewToolbar)=> dispatch(addRichMark(mark, view, viewToolbar))}
                    onRichMarkUpdated={(mark, view, viewToolbar) => dispatch(editRichMark(mark, view, viewToolbar))}
                    onRichMarksModalToggled={() => {
                        this.setState({ richMarksVisible: !this.state.richMarksVisible });
                        if(this.state.richMarksVisible) {
                            this.setState({ currentRichMark: null, markCursorValue: null });
                        }
                    }}/>
                <Toolbar top={(60 + ribbonHeight) + 'px'}
                    pluginToolbars={pluginToolbars}
                    openConfigModal={(id)=>{ this.setState({ pluginConfigModal: id }); } }
                    viewToolbars={viewToolbars}
                    box={boxes[boxSelected]}
                    boxSelected={boxSelected}
                    containedViews={containedViews}
                    containedViewSelected={containedViewSelected}
                    navItemSelected={containedViewSelected !== 0 ? containedViewSelected : navItemSelected}
                    navItems={containedViewSelected !== 0 ? containedViews : navItems}
                    carouselShow={this.state.carouselShow}
                    isBusy={isBusy}
                    marks={marks}
                    exercises={exercises}
                    styleConfig={{ ...styleConfig }}
                    onContainedViewNameChanged={(id, titleStr) => dispatch(updateViewToolbar(id, titleStr))}
                    onBackgroundChanged={(id, background) => dispatch(changeBackground(id, background))}
                    onNavItemToggled={ id => dispatch(toggleNavItem(navItemSelected)) }
                    onNavItemSelected={id => dispatch(selectNavItem(id))}
                    onNavItemNameChanged={(id, titleStr) => dispatch(changeNavItemName(id, titleStr))}
                    onContainedViewSelected={id => dispatch(selectContainedView(id))}
                    onColsChanged={(id, parent, distribution, boxesAffected) => dispatch(changeCols(id, parent, distribution, boxesAffected))}
                    onRowsChanged={(id, parent, column, distribution, boxesAffected) => dispatch(changeRows(id, parent, column, distribution, boxesAffected))}
                    onBoxResized={(id, structure) => dispatch(resizeBox(id, structure))}
                    onBoxMoved={(id, x, y, position, parent, container) => dispatch(moveBox(id, x, y, position, parent, container))}
                    onVerticallyAlignBox={(id, verticalAlign) => dispatch(verticallyAlignBox(id, verticalAlign))}
                    onTextEditorToggled={this.onTextEditorToggled}
                    onSortableContainerResized={(id, parent, height) => dispatch(resizeSortableContainer(id, parent, height))}
                    onSortableContainerDeleted={(id, parent) => {this.onSortableContainerDeleted(id, parent);}}
                    onSortablePropsChanged={(id, parent, prop, value) => dispatch(changeSortableProps(id, parent, prop, value))}
                    onToolbarUpdated={this.toolbarUpdated}
                    onScoreConfig={(id, button, value, page)=>{dispatch(configScore(id, button, value, page));}}
                    onBoxDeleted={this.onBoxDeleted}
                    onRichMarksModalToggled={() => {
                        this.setState({ richMarksVisible: !this.state.richMarksVisible });
                        if(this.state.richMarksVisible) {
                            this.setState({ currentRichMark: null });
                        }
                    }}
                    onRichMarkEditPressed={(mark) => {
                        this.setState({ currentRichMark: mark });
                    }}
                    onRichMarkDeleted={id => {

                        let cvid = marks[id].connection;
                        // This checks if the deleted mark leaves an orphan contained view, and displays a message asking if the user would like to delete it as well
                        if (isContainedView(cvid)) {
                            let thiscv = containedViews[cvid];
                            if (Object.keys(thiscv.parent).length === 1) {
                                let confirmText = i18n.t("messages.confirm_delete_CV_also_1") + viewToolbars[cvid].viewName + i18n.t("messages.confirm_delete_CV_also_2");
                                let alertComponent = (<Alert className="pageModal"
                                    show
                                    hasHeader
                                    title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                                    cancelButton
                                    acceptButtonText={i18n.t("messages.OK")}
                                    onClose={(bool)=>{
                                        if (bool) {
                                            dispatch(deleteRichMark(marks[id]));
                                            let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
                                            if(deleteAlsoCV) {
                                                let boxesRemoving = [];
                                                containedViews[cvid].boxes.map(boxId => {
                                                    boxesRemoving.push(boxId);
                                                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(boxes[boxId], this.props.boxes));
                                                });

                                                dispatch(deleteContainedView([cvid], boxesRemoving, thiscv.parent));
                                            }
                                        } else {

                                        }
                                        this.setState({ alert: null });}}>
                                    <span> {confirmText} </span><br/>
                                    <ToggleSwitch id="deleteAlsoCv" style={{ margin: '10px' }}/>
                                    {i18n.t("messages.confirm_delete_cv_as_well")}
                                </Alert>);
                                this.setState({ alert: alertComponent });
                                return;
                            }

                        }
                        dispatch(deleteRichMark(marks[id]));
                    }}
                    fileModalResult={this.state.fileModalResult}
                    openFileModal={(id, accept)=>{ this.setState({ fileModalResult: { id, value: undefined }, showFileUpload: accept, fileUploadTab: 1 });}}
                    updateViewToolbar={(id, toolbar)=> dispatch(updateViewToolbar(id, toolbar))}
                />
                <FileModal visible={this.state.showFileUpload} disabled={disabled}
                    onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => { dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams));}}
                    boxSelected={boxSelected}
                    boxes={boxes}
                    isBusy={isBusy}
                    importEdi={(state) => dispatch(serialize(importEdi(state)))}
                    fileModalResult={this.state.fileModalResult}
                    navItemsIds={navItemsIds}
                    navItems={navItems}
                    onNavItemSelected={id => dispatch(selectNavItem(id))}
                    containedViews={containedViews}
                    containedViewSelected={containedViewSelected}
                    navItemSelected={navItemSelected}
                    filesUploaded={filesUploaded}
                    pluginToolbars={pluginToolbars}
                    marks={marks}
                    deleteFileFromServer={(id, url, callback) => dispatch(deleteFunction(id, url, callback))}
                    onIndexSelected={(id) => dispatch(selectIndex(id))}
                    fileUploadTab={this.state.fileUploadTab}
                    onNavItemAdded={(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => dispatch(addNavItem(id, name, parent, type, position, background, customSize, hideTitles, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)), sortable_id))}
                    onNavItemsAdded={(navs, parent)=> dispatch(addNavItems(navs, parent))}
                    uploadFunction={(query, keywords, callback) => dispatch(uploadFunction(query, keywords, callback))}
                    close={(fileModalResult)=>{this.setState({ fileModalResult: fileModalResult ? fileModalResult : { id: undefined, value: undefined }, showFileUpload: false, fileUploadTab: 0 });}} />
                <ExitModal
                    showExitModal={this.state.showExitModal}
                    closeExitModal={()=>{this.setState({ showExitModal: false });}}
                    status={status}
                    publishing={(value) =>this.setState({ publishing: value })}
                    save={(win, url) => {dispatch(exportStateAsync({ ...this.props.store.getState() }, win, url)); }}
                />
            </Grid>
        );
    }

    /* Help Modal */
    createHelpModal() {
        return <Modal className="pageModal welcomeModal helpModal"
            show={this.state.showHelpButton}
            cancelButton
            acceptButtonText={i18n.t("joyride.start")}
            onHide={(bool)=>{
                if (bool) {
                    this.setState({ showHelpButton: false });
                } else {
                    this.setState({ showHelpButton: false });
                }
            }}>
            <Modal.Header closeButton>
                <Modal.Title>{i18n.t("messages.help")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ width: '100%' }}>
                    <h2>{i18n.t('messages.help_modal_text')}</h2>
                    <img src={help} alt="" style={{ width: '100%' }}/>
                </div>
                <div className={"help_options"}>
                    <button onClick={()=>{this.showTour();}} className={"help_item"}>Paseo de bienvenida a EDiphy</button>
                    <a href="http://ging.github.io/ediphy/#/manual" target="_blank"><div className={"help_item"}>
                        Si después del paseo inicial te ha quedado alguna duda, consulta nuestro manual de usuario
                    </div></a>
                    <a href="http://ging.github.io/ediphy/#/docs" target="_blank"><div className={"help_item"}>
                        Si eres desarrollador, echa un ojo a la documentación
                    </div></a>
                </div>
            </Modal.Body>

        </Modal>;
    }
    showTour() {
        this.setState({ showTour: true, showHelpButton: false });
    }
    createInitModal() {
        return <Alert className="pageModal welcomeModal"
            show={this.state.initModal}
            hasHeader={false}
            title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
            cancelButton
            acceptButtonText={i18n.t("joyride.start")}
            onClose={(bool)=>{
                if (bool) {
                    this.setState({ showTour: true, initModal: false });
                } else {
                    this.setState({ initModal: false });
                }
            }}>
            <div className="welcomeModalDiv">
                <img src={screen} alt="" style={{ width: '100%' }}/>
                <h1>{i18n.t('joyride.welcome')}<strong style={{ color: '#17CFC8' }}>Ediphy</strong>!</h1>
                <p>{i18n.t('joyride.ediphy_description')}</p>
                <p><strong>{i18n.t('joyride.need_help')}</strong></p>
            </div>
            {/*  {i18n.t('joyride.manual')}<a href="http://ging.github.io/ediphy/#/manual" target="_blank">{i18n.t('joyride.manual2')}</a>*/}
            {/* i18n.t('Want some help?')*/}
        </Alert>;
    }
    /**
     * After component mounts
     * Loads plugin API and sets listeners for plugin events, marks and keyboard keys pressed
     */
    componentDidMount() {
        if (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc' && ediphy_editor_json && ediphy_editor_json !== 'undefined') {
            this.props.dispatch(importState(serialize(JSON.parse(ediphy_editor_json))));

        }
        if (process.env.NODE_ENV === 'production' && process.env.DOC === 'doc') {
            // window.parent.addEventListener("beforeunload", this.beforeUnloadAlert); // it is done outside
            window.oncontextmenu = function() {
                return false;
            };
        }
        // setTimeout(()=>{this.setState({ showHelpButton: false });}, 30000);
        document.addEventListener('keydown', this.keyListener);
        document.addEventListener('dragover', this.dragListener);
        document.addEventListener('dragleave', this.dragExitListener);
        document.addEventListener('drop', this.dropListener);
        document.addEventListener('dragstart', this.dragStartListener);
        // document.addEventListener('onbeforeunload', this.exitListener);

        if(cookies.get("ediphy_visitor") === undefined) {
            cookies.set("ediphy_visitor", true);
        }

    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyListener);
        document.removeEventListener('dragover', this.dragListener);
        document.removeEventListener('dragleave', this.dragExitListener);
        document.removeEventListener('drop', this.dropListener);
        document.removeEventListener('dragstart', this.dragStartListener);
        // document.removeEventListener('onbeforeunload', this.exitListener);

    }

    beforeUnloadAlert() {
        if(!this.state.publishing) {
            return i18n.t('messages.exit_page');
        }
        return undefined;
    }

    keyListener(e) {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 9) {
            e.preventDefault();
            return;
        }
        // Checks what element has the cursor focus currently
        let focus = document.activeElement.className;
        let notText = (!document.activeElement.type || focus.indexOf('rib') !== -1) && focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1;

        // Ctrl + Z
        if (key === 90 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.undo());
            }
        }
        // Ctrl + Y
        if (key === 89 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.redo());
            }
        }
        // Ctrl + A
        if (key === 192 && e.ctrlKey) {
            this.duplicateNavItem(this.props.navItemSelected);
        }

        if (key === 80 && e.ctrlKey && e.shiftKey) {
            e.cancelBubble = true;
            e.preventDefault();

            e.stopImmediatePropagation();
            printToPDF(this.props.store.getState().undoGroup.present, (b)=>{if(b) {alert('Error');}});
        }

        // Supr
        else if (key === 46 || key === 8) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
            // If it is not an input or any other kind of text edition AND there is a box selected, it deletes said box
                if (notText) {
                    let box = this.props.boxes[this.props.boxSelected];
                    let toolbar = this.props.pluginToolbars[this.props.boxSelected];
                    if (!toolbar.showTextEditor) {
                        this.onBoxDeleted(box.id, box.parent, box.container, this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected);
                    }
                }
            }
        }

        if (key === 112) {
            e.preventDefault();
            this.setState({ showHelpButton: true });
        }
        if (key === 113) {
            e.preventDefault();
            this.setState({ visorVisible: true });
        }
    }
    onBoxDeleted(id, parent, container, page) {
        let bx = getDescendantBoxes(this.props.boxes[id], this.props.boxes);
        let cvs = [...this.props.boxes[id].containedViews];
        bx.map(box=>{
            cvs = [...cvs, ...this.props.boxes[box].containedViews];
        });
        this.props.dispatch(deleteBox(id,
            parent,
            container,
            bx,
            cvs,
            page));
    }

    duplicateNavItem(id) {
        if (id && this.props.navItems[id]) {
            let newBoxes = [];
            let navItem = this.props.navItems[id];
            let linkedCVs = {};
            if (navItem.boxes) {
                newBoxes = newBoxes.concat(navItem.boxes);
                navItem.boxes.forEach(b => {
                    let box = this.props.boxes[b];
                    if (box.sortableContainers) {
                        for (let sc in box.sortableContainers) {
                            if (box.sortableContainers[sc].children) {
                                newBoxes = newBoxes.concat(box.sortableContainers[sc].children);
                                box.sortableContainers[sc].children.forEach(bo => {
                                    let bx = this.props.boxes[bo];
                                    if (bx.sortableContainers) {
                                        for (let scc in bx.sortableContainers) {
                                            if (bx.sortableContainers[scc].children) {
                                                newBoxes = newBoxes.concat(bx.sortableContainers[scc].children);

                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
            let newBoxesMap = {};
            newBoxes.map(box => {
                linkedCVs[box] = [...this.props.boxes[box].containedViews];
                newBoxesMap[box] = box + Date.now(); });

            this.props.dispatch(duplicateNavItem(id, id + Date.now(), newBoxesMap, Date.now(), linkedCVs));
        }
    }

    toolbarUpdated(id, tab, accordion, name, value) {
        if (isBox(id) || isSortableBox(id)) {
            let toolbar = this.props.pluginToolbars[id];
            let pluginAPI = Ediphy.Plugins.get(toolbar.pluginId);
            let config = pluginAPI.getConfig();
            let deletedBoxes = [];
            if (config.isComplex && accordion === 'state') {
                let newPluginState = JSON.parse(JSON.stringify(toolbar.state));
                newPluginState[name] = value;
                let pluginContainerIds = {};// newPluginState.__pluginContainerIds;
                let defaultBoxes = {};
                if (config.flavor !== "react") {
                    let content = pluginAPI.getRenderTemplate(newPluginState);
                    parsePluginContainers(content, pluginContainerIds);
                } else {
                    let content = pluginAPI.getRenderTemplate(newPluginState, { exercises: { correctAnswer: true } });
                    parsePluginContainersReact(content, pluginContainerIds, defaultBoxes);
                }
                if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length < Object.keys(pluginContainerIds).length)) {
                    for (let s in pluginContainerIds) {
                        if (!toolbar.state.__pluginContainerIds[s]) {
                            if (defaultBoxes[s]) {
                                let page = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
                                this.props.dispatch(updatePluginToolbar(id, tab, accordion,
                                    [name, "__pluginContainerIds"],
                                    [value, pluginContainerIds]));
                                defaultBoxes[s].map((newBox, ind) => {
                                    createBox({
                                        parent: id,
                                        page,
                                        container: s,
                                        isDefaultPlugin: true,
                                        initialState: newBox.initialState,
                                        id: ID_PREFIX_BOX + Date.now() + '_' + ind,
                                        draggable: true,
                                        resizable: this.props.boxes[id].resizable,
                                    }, newBox.type, false,
                                    (ids, draggable, resizable, content, style, state, structure, initialParams)=>{this.props.dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams));},
                                    this.props.boxes);
                                });

                            }
                        }
                    }
                    return;
                } else if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length > Object.keys(pluginContainerIds).length)) {
                    for (let s in toolbar.state.__pluginContainerIds) {
                        if (!pluginContainerIds[s]) {
                            if (this.props.boxes[id].sortableContainers[s].children) {
                                deletedBoxes = deletedBoxes.concat(this.props.boxes[id].sortableContainers[s].children);
                            }
                        }
                    }
                }
                this.props.dispatch(updatePluginToolbar(id, tab, accordion,
                    [name, "__pluginContainerIds"],
                    [value, pluginContainerIds], deletedBoxes));
                return;
            }
            this.props.dispatch(updatePluginToolbar(id, tab, accordion, name, value, deletedBoxes));
        } else {
            this.props.dispatch(updateViewToolbar(id, tab, accordion, name, value));
        }
    }

    getDescendantViews(view) {
        let selected = [];

        for (let i = 0; i < view.children.length; i++) {
            let vw = view.children[i];
            selected.push(vw);
            selected = selected.concat(this.getDescendantViews(this.props.navItems[vw]));
        }

        return selected;
    }

    onRichMarkUpdated(mark, createNew) {
        let boxSelected = this.props.boxSelected;
        let mark_exist = this.props.marks[mark.id] !== undefined;
        if (mark_exist) {

        }

        let oldConnection = state.__marks[mark.id] ? state.__marks[mark.id].connection : 0;
        state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
        let newConnection = mark.connection;
        if (mark.connection.id) {
            newConnection = mark.connection.id;
            state.__marks[mark.id].connection = mark.connection.id;
        }

        this.props.dispatch(editRichMark(boxSelected, state, mark, oldConnection, newConnection));

    }

    onSortableContainerDeleted(id, parent) {
        let boxes = this.props.boxes;
        let containedViews = this.props.containedViews;
        let page = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
        let descBoxes = getDescendantBoxesFromContainer(boxes[parent], id, this.props.boxes, this.props.containedViews);
        let cvs = {};
        for (let b in descBoxes) {
            let box = boxes[descBoxes[b]];
            for (let cv in box.containedViews) {
                if (!cvs[box.containedViews[cv]]) {
                    cvs[box.containedViews[cv]] = [box.id];
                } else if (cvs[containedViews[cv]].indexOf(box.id) === -1) {
                    cvs[box.containedViews[cv]].push(box.id);
                }
            }
        }
        this.props.dispatch(deleteSortableContainer(id, parent, descBoxes, cvs, page));
    }

    onTextEditorToggled(caller, value, text, content) {
        let pluginToolbar = this.props.pluginToolbars[caller];
        if(pluginToolbar && pluginToolbar.pluginId !== "sortable_container") {
            let state = Object.assign({}, pluginToolbar.state, { __text: text });
            let toolbar = Ediphy.Plugins.get(pluginToolbar.pluginId).getToolbar(state);

            this.props.dispatch(toggleTextEditor(caller, value));
            if (!value && text && content) {
                this.props.dispatch(updateBox(caller, content, toolbar, state));
            }
        }

    }

}

function mapStateToProps(state) {
    return {
        version: state.undoGroup.present.version,
        status: state.status,
        everPublished: state.everPublished,
        globalConfig: state.undoGroup.present.globalConfig,
        styleConfig: state.undoGroup.present.styleConfig,
        filesUploaded: state.filesUploaded,
        boxes: state.undoGroup.present.boxesById,
        boxSelected: state.undoGroup.present.boxSelected,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        indexSelected: state.undoGroup.present.indexSelected,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        undoDisabled: state.undoGroup.past.length === 0,
        redoDisabled: state.undoGroup.future.length === 0,
        displayMode: state.undoGroup.present.displayMode,
        marks: state.undoGroup.present.marksById,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        exercises: state.undoGroup.present.exercises,
        isBusy: state.undoGroup.present.isBusy,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched || "",

    };
}

// EditorApp = DragDropContext(HTML5Backend)(EditorApp);
export default connect(mapStateToProps)(EditorApp);

// export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(EditorApp));

EditorApp.propTypes = {
    globalConfig: PropTypes.object.isRequired,
    styleConfig: PropTypes.object,
    filesUploaded: PropTypes.any,
    boxes: PropTypes.object.isRequired,
    boxSelected: PropTypes.any,
    boxLevelSelected: PropTypes.any,
    indexSelected: PropTypes.any,
    marks: PropTypes.object,
    navItemsIds: PropTypes.array.isRequired,
    navItems: PropTypes.object.isRequired,
    navItemSelected: PropTypes.any,
    containedViews: PropTypes.object.isRequired,
    containedViewSelected: PropTypes.any,
    pluginToolbars: PropTypes.object,
    undoDisabled: PropTypes.bool,
    redoDisabled: PropTypes.bool,
    displayMode: PropTypes.string,
    viewToolbars: PropTypes.object.isRequired,
    exercises: PropTypes.object,
    isBusy: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    store: PropTypes.any,
    lastActionDispatched: PropTypes.string,
    status: PropTypes.string,
    everPublished: PropTypes.bool,
};
