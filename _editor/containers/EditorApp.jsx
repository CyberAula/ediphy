import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { Grid, Col, Row } from 'react-bootstrap';
import {
    addNavItem, selectNavItem, expandNavItem, deleteNavItem, reorderNavItem, toggleNavItem, updateNavItemExtraFiles,
    addBox, selectBox, moveBox, resizeBox, updateBox, deleteBox, reorderSortableContainer, dropBox, increaseBoxLevel,
    resizeSortableContainer, deleteSortableContainer, changeCols, changeRows, changeBackground, changeSortableProps,
    reorderBoxes, verticallyAlignBox, selectIndex,
    toggleTextEditor, toggleTitleMode, pasteBox, changeBoxLayer,
    changeDisplayMode, configScore,
    exportStateAsync, importStateAsync, importState, changeGlobalConfig,
    fetchVishResourcesAsync, uploadVishResourceAsync,
    deleteContainedView, selectContainedView, changeContainedViewName,
    addRichMark, editRichMark, moveRichMark, deleteRichMark, setCorrectAnswer,
    updateViewToolbar, updatePluginToolbar,
    addNavItems } from '../../common/actions';
import EditorCanvas from '../components/canvas/editor_canvas/EditorCanvas';
import ContainedCanvas from '../components/rich_plugins/contained_canvas/ContainedCanvas';
import EditorCarousel from '../components/carousel/editor_carousel/EditorCarousel';
import PluginConfigModal from '../components/plugin_config_modal/PluginConfigModal';
import Visor from '../../_visor/containers/Visor';
import ExternalCatalogModal from '../components/external_provider/ExternalCatalogModal';
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
} from '../../common/utils';
import 'typeface-ubuntu';
import 'typeface-source-sans-pro';
import PropTypes from 'prop-types';

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
            xmlEditorVisible: false,
            richMarksVisible: false,
            markCreatorVisible: false,
            containedViewsVisible: false,
            currentRichMark: null,
            carouselShow: true,
            carouselFull: false,
            serverModal: false,
            catalogModal: false,
            lastAction: "",
            grid: false,
            pluginConfigModal: false,
            accordions: {},
        };
        this.onTextEditorToggled = this.onTextEditorToggled.bind(this);
        this.onRichMarkUpdated = this.onRichMarkUpdated.bind(this);
        this.toolbarUpdated = this.toolbarUpdated.bind(this);
        this.onSortableContainerDeleted = this.onSortableContainerDeleted.bind(this);
    }

    render() {
        const { dispatch, boxes, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            containedViews, containedViewSelected, imagesUploaded, indexSelected, exercises,
            undoDisabled, redoDisabled, displayMode, isBusy, pluginToolbars, viewToolbars, marks, lastActionDispatched, globalConfig, fetchVishResults } = this.props;
        let ribbonHeight = this.state.hideTab === 'hide' ? 0 : 50;
        let title = globalConfig.title || '---';
        let canvasRatio = globalConfig.canvasRatio;
        return (
            <Grid id="app" fluid style={{ height: '100%', overflow: 'hidden' }}>
                <Row className="navBar">
                    {this.state.alert}
                    <EditorNavBar hideTab={this.state.hideTab} boxes={boxes}
                        onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                        globalConfig={globalConfig}
                        changeGlobalConfig={(prop, value) => {dispatch(changeGlobalConfig(prop, value));}}
                        onIndexSelected={(id) => dispatch(selectIndex(id))}
                        onNavItemSelected={id => dispatch(selectNavItem(id))}
                        onNavItemAdded={(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => dispatch(addNavItem(id, name, parent, type, position, background, customSize, hideTitles, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)), sortable_id))}
                        onNavItemsAdded={(navs, parent)=> dispatch(addNavItems(navs, parent))}
                        onToolbarUpdated={this.onToolbarUpdated}
                        undoDisabled={undoDisabled}
                        redoDisabled={redoDisabled}
                        navItemsIds={navItemsIds}
                        navItems={navItems}
                        onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
                        containedViews={containedViews}
                        containedViewSelected={containedViewSelected}
                        navItemSelected={navItemSelected}
                        boxSelected={boxSelected}
                        undo={() => {dispatch(ActionCreators.undo());}}
                        redo={() => {dispatch(ActionCreators.redo());}}
                        visor={() =>{this.setState({ visorVisible: true });}}
                        export={(format) => {
                            if(format === "PDF") {
                                printToPDF(this.props.store.getState().present);
                            } else {
                                Ediphy.Visor.exportsHTML(this.props.store.getState().present);
                            }}}
                        scorm={(is2004) => {Ediphy.Visor.exportScorm(this.props.store.getState().present, is2004);}}
                        save={() => {dispatch(exportStateAsync({ present: this.props.store.getState().present })); }}
                        category={this.state.pluginTab}
                        opens={() => {dispatch(importStateAsync());}}
                        serverModalOpen={()=>{this.setState({ serverModal: true });}}
                        onExternalCatalogToggled={() => this.setState({ catalogModal: true })}
                        setcat={(category) => {this.setState({ pluginTab: category, hideTab: 'show' });}}/>
                    {Ediphy.Config.autosave_time > 1000 &&
                    <AutoSave save={() => {dispatch(exportStateAsync({ present: this.props.store.getState().present }));}}
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
                        onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                        onIndexSelected={(id) => dispatch(selectIndex(id))}
                        onContainedViewNameChanged={(id, titleStr) => dispatch(updateViewToolbar(id, titleStr))}
                        onContainedViewSelected={ (id) => dispatch(selectContainedView(id)) }
                        onContainedViewDeleted={(cvid)=>{
                            let boxesRemoving = [];
                            containedViews[cvid].boxes.map(boxId => {
                                boxesRemoving.push(boxId);
                                boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                            });

                            dispatch(deleteContainedView([cvid], boxesRemoving, containedViews[cvid].parent));
                        }}
                        onNavItemNameChanged={(id, titleStr) => dispatch(updateViewToolbar(id, titleStr))}
                        onNavItemAdded={(id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => dispatch(addNavItem(id, name, parent, type, position, background, customSize, hideTitles, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)), sortable_id))}
                        onNavItemSelected={id => dispatch(selectNavItem(id))}
                        onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                        onNavItemDeleted={(navsel) => {
                            let viewRemoving = [navsel].concat(this.getDescendantViews(navItems[navsel]));
                            let boxesRemoving = [];
                            let containedRemoving = {};
                            viewRemoving.map(id => {
                                navItems[id].boxes.map(boxId => {
                                    boxesRemoving.push(boxId);
                                    boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                                });
                            });
                            let marksRemoving = getDescendantLinkedBoxes(viewRemoving, navItems) || [];
                            dispatch(deleteNavItem(viewRemoving, navItems[navsel].parent, boxesRemoving, containedRemoving, marksRemoving));
                        }}
                        onNavItemReordered={(id, newParent, oldParent, idsInOrder, childrenInOrder) => dispatch(reorderNavItem(id, newParent, oldParent, idsInOrder, childrenInOrder))}
                        onDisplayModeChanged={mode => dispatch(changeDisplayMode(mode))}
                        containedViewsVisible={this.state.containedViewsVisible}
                        onToolbarUpdated={(id, tab, accordion, name, value) => this.dispatchAndSetState(updateToolbar(id, tab, accordion, name, value))}
                        onContainedViewsExpand={()=>{
                            this.setState({ containedViewsVisible: !this.state.containedViewsVisible });
                        }}
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
                                containedViews={containedViews}
                                pluginToolbars={pluginToolbars}
                                onBoxPasted={(ids, box, toolbar, children, index, markList)=>dispatch(pasteBox(ids, box, toolbar, children, index, markList))}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                                onBoxDeleted={(id, parent, container, page)=> {let bx = this.getDescendantBoxes(boxes[id]); dispatch(deleteBox(id, parent, container, bx, boxes[id].containedViews, page));}}
                                ribbonHeight={ribbonHeight + 'px'}/>
                        </Row>

                        <Row id="ribbonRow" style={{ top: '-1px', left: (this.state.carouselShow ? '15px' : '147px') }}>
                            <PluginRibbon disabled={navItemSelected === 0 || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected)) || hasExerciseBox(navItemSelected, navItems, this.state, boxes)} // ADD condition navItemSelected There are extrafiles
                                boxSelected={boxes[boxSelected]}
                                navItemSelected={navItems[navItemSelected]}
                                navItems={navItems}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
                                containedViewSelected={containedViews[containedViewSelected] || containedViewSelected }
                                category={this.state.pluginTab}
                                hideTab={this.state.hideTab}
                                boxes={boxes}
                                ribbonHeight={ribbonHeight + 'px'} />
                        </Row>
                        <Row id="canvasRow" style={{ height: 'calc(100% - ' + ribbonHeight + 'px)' }}>
                            <EditorCanvas boxes={boxes}
                                accordions={this.state.accordions}
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
                                onRichMarkMoved={(mark, value)=>dispatch(moveRichMark(mark, value))}
                                markCreatorId={this.state.markCreatorVisible}
                                onBoxAdded={(ids, draggable, resizable, content, style, state, structure, initialParams) => dispatch(addBox(ids, draggable, resizable, content, style, state, structure, initialParams))}
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
                                onBoxDeleted={(id, parent, container, page)=> {let bx = this.getDescendantBoxes(boxes[id]); dispatch(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/, page));}}
                                onContainedViewSelected={id => dispatch(selectContainedView(id))}
                                onVerticallyAlignBox={(id, verticalAlign)=>dispatch(verticallyAlignBox(id, verticalAlign))}
                                onTextEditorToggled={this.onTextEditorToggled}
                                onBoxesInsideSortableReorder={(parent, container, order) => {dispatch(reorderBoxes(parent, container, order));}}
                                titleModeToggled={(id, value) => dispatch(toggleTitleMode(id, value))}
                                onRichMarksModalToggled={(value) => {
                                    this.setState({ richMarksVisible: !this.state.richMarksVisible, markCursorValue: value });
                                    if(this.state.richMarksVisible) {
                                        this.setState({ currentRichMark: null, value: null });
                                    }
                                }}
                                onViewTitleChanged={(id, titles)=>{dispatch(updateViewToolbar(id, titles));}}
                                onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}/>
                            <ContainedCanvas boxes={boxes}
                                accordions={this.state.accordions}
                                grid={this.state.grid}
                                boxSelected={boxSelected}
                                canvasRatio={canvasRatio}
                                marks={marks}
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
                                onRichMarksModalToggled={(value) => {
                                    this.setState({ richMarksVisible: !this.state.richMarksVisible, markCursorValue: value });
                                    if(this.state.richMarksVisible) {
                                        this.setState({ currentRichMark: null, value: null });
                                    }
                                }}
                                pluginToolbars={pluginToolbars}
                                viewToolbars={viewToolbars}
                                moveRichMark={(id, value)=> dispatch(moveRichMark(id, value))}
                                titleModeToggled={(id, value) => dispatch(toggleTitleMode(id, value))}
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
                                onBoxDeleted={(id, parent, container, page)=> {let bx = this.getDescendantBoxes(boxes[id]); dispatch(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/, page));}}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}
                                onVerticallyAlignBox={(id, verticalAlign)=>dispatch(verticallyAlignBox(id, verticalAlign))}
                                onViewTitleChanged={(id, titles)=>{dispatch(updateViewToolbar(id, titles));}}
                                onTextEditorToggled={this.onTextEditorToggled}
                                onBoxesInsideSortableReorder={(parent, container, order) => {dispatch(reorderBoxes(parent, container, order));}}
                                onTitleChanged={(id, titleStr) => {dispatch(changeGlobalConfig('title', titleStr));}}
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
                    state={this.props.store.getState().present}/>
                <PluginConfigModal
                    id={this.state.pluginConfigModal}
                    name={pluginToolbars[this.state.pluginConfigModal] ? pluginToolbars[this.state.pluginConfigModal].pluginId : ""}
                    state={pluginToolbars[this.state.pluginConfigModal] ? pluginToolbars[this.state.pluginConfigModal].state : {}}
                    closeConfigModal={()=>{ this.setState({ pluginConfigModal: false }); } }
                    updatePluginToolbar={(id, state) => dispatch(updateBox(id, "", pluginToolbars[this.state.pluginConfigModal], state))}
                />
                {Ediphy.Config.external_providers.enable_catalog_modal &&
                <ExternalCatalogModal images={imagesUploaded}
                    visible={this.state.catalogModal}
                    onExternalCatalogToggled={() => this.setState({ catalogModal: !this.state.catalogModal })}/>}
                <RichMarksModal boxSelected={boxSelected}
                    accordions={this.state.accordions}
                    pluginToolbar={pluginToolbars[boxSelected]}
                    navItemSelected={navItemSelected}
                    pluginToolbars={pluginToolbars}
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
                    onRichMarkUpdated={(id, mark) => dispatch(editRichMark(id, mark))}
                    onRichMarksModalToggled={() => {
                        this.setState({ richMarksVisible: !this.state.richMarksVisible });
                        if(this.state.richMarksVisible) {
                            this.setState({ currentRichMark: null, markCursorValue: null });
                        }
                    }}/>
                <Toolbar top={(60 + ribbonHeight) + 'px'}
                    accordions={this.state.accordions}
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
                    fetchResults={fetchVishResults}
                    titleModeToggled={(id, value) => dispatch(toggleTitleMode(id, value))}
                    onContainedViewNameChanged={(id, titleStr) => dispatch(changeContainedViewName(id, titleStr))}
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
                    onBoxDeleted={(id, parent, container)=> {let bx = this.getDescendantBoxes(boxes[id]); dispatch(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/));}}
                    onXMLEditorToggled={() => this.setState({ xmlEditorVisible: !this.state.xmlEditorVisible })}
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
                                let confirmText = i18n.t("messages.confirm_delete_CV_also_1") + containedViews[cvid].name + i18n.t("messages.confirm_delete_CV_also_2");
                                let alertComponent = (<Alert className="pageModal"
                                    show
                                    hasHeader
                                    title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                                    acceptButtonText={i18n.t("messages.OK")}

                                    closeButton onClose={(bool)=>{
                                        dispatch(deleteRichMark(marks[id]));
                                        if (bool) {
                                            let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
                                            if(deleteAlsoCV) {
                                                let boxesRemoving = [];
                                                containedViews[cvid].boxes.map(boxId => {
                                                    boxesRemoving.push(boxId);
                                                    boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                                                });

                                                dispatch(deleteContainedView([cvid], boxesRemoving, thiscv.parent));
                                            }
                                        }
                                        this.setState({ alert: null });}}>
                                    <span> {confirmText} </span><br/>
                                    <ToggleSwitch id="deleteAlsoCv" />
                                    {i18n.t("messages.confirm_delete_cv_as_well")}
                                </Alert>);
                                this.setState({ alert: alertComponent });
                            }
                        } else {
                            dispatch(deleteRichMark(marks[id]));
                        }
                    }}
                    onUploadVishResource={(query) => dispatch(uploadVishResourceAsync(query))}
                    onFetchVishResources={(query) => dispatch(fetchVishResourcesAsync(query))}
                    updateViewToolbar={(id, toolbar)=> dispatch(updateViewToolbar(id, toolbar))}
                />

            </Grid>
        );
    }

    /**
     * Dispatches Redux action and records it in React state as well
     * @param actionCreator
     */
    dispatchAndSetState(actionCreator) {
        let lastAction = this.props.dispatch(actionCreator);
        this.setState({ lastAction: lastAction });
    }

    /**
     * After component mounts
     * Loads plugin API and sets listeners for plugin events, marks and keyboard keys pressed
     */
    componentDidMount() {
        if (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc' && ediphy_editor_json && ediphy_editor_json !== 'undefined') {
            this.props.dispatch(importState(JSON.parse(ediphy_editor_json)));
        }
        window.onkeyup = function(e) {
            let key = e.keyCode ? e.keyCode : e.which;
            // Checks what element has the cursor focus currently
            let focus = document.activeElement.className;
            let notText = !document.activeElement.type && focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1;

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
            if (key === 80 && e.ctrlKey && e.shiftKey) {
                e.cancelBubble = true;
                e.preventDefault();

                e.stopImmediatePropagation();
                printToPDF(this.props.store.getState().present);
            }

            // Supr
            else if (key === 46) {
                if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                    // If it is not an input or any other kind of text edition AND there is a box selected, it deletes said box
                    if (notText) {
                        let box = this.props.boxes[this.props.boxSelected];
                        let toolbar = this.props.pluginToolbars[this.props.boxSelected];
                        if (!toolbar.showTextEditor) {
                            let bx = this.getDescendantBoxes(this.props.boxes[this.props.boxSelected]);
                            this.props.dispatch(deleteBox(box.id, box.parent, box.container, bx, this.props.boxes[this.props.boxSelected].containedViews/* , this.getDescendantContainedViews(box)*/, this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected));
                        }
                    }
                }
            }

        }.bind(this);

    }

    toolbarUpdated(id, tab, accordion, name, value) {
        if (isBox(id) || isSortableBox(id)) {
            let toolbar = this.props.pluginToolbars[id];
            let pluginAPI = Ediphy.Plugins.get(toolbar.pluginId);
            let config = pluginAPI.getConfig();
            if (config.isComplex && accordion === 'state') {
                let newPluginState = JSON.parse(JSON.stringify(toolbar.state));
                newPluginState[name] = value;
                let pluginContainerIds = newPluginState.__pluginContainerIds;
                if (config.flavor !== "react") {
                    let content = pluginAPI.getRenderTemplate(newPluginState);
                    parsePluginContainers(content, pluginContainerIds);
                } else {
                    let content = pluginAPI.getRenderTemplate(newPluginState, { exercises: { correctAnswer: true } });
                    parsePluginContainersReact(content, pluginContainerIds);
                }

                this.props.dispatch(updatePluginToolbar(id, tab, accordion, [name, "__pluginContainerIds"], [value, pluginContainerIds]));
                return;
            }
            this.props.dispatch(updatePluginToolbar(id, tab, accordion, name, value));
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

    getDescendantBoxes(box) {
        let selected = [];

        for (let i = 0; i < box.children.length; i++) {
            for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                let bx = box.sortableContainers[box.children[i]].children[j];
                selected.push(bx);
                selected = selected.concat(this.getDescendantBoxes(this.props.boxes[bx]));
            }
        }
        return selected;
    }

    getDescendantBoxesFromContainer(box, container) {
        let selected = [];

        for (let j = 0; j < box.sortableContainers[container].children.length; j++) {
            let bx = box.sortableContainers[container].children[j];
            selected.push(bx);
            selected = selected.concat(this.getDescendantBoxes(this.props.boxes[bx]));
        }

        for (let i = 0; i < box.containedViews.length; i++) {
            let cv = box.containedViews[i];
            for (let j = 0; j < this.props.containedViews[cv].boxes.length; j++) {
                let bx = this.props.containedViews[cv].boxes[j];
                selected.push(bx);
                selected = selected.concat(this.getDescendantBoxes(this.props.boxes[bx]));
            }
        }
        return selected;
    }

    getDescendantContainedViews(box) {
        let selected = [];

        for (let i = 0; i < box.children.length; i++) {
            for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                let bx = box.sortableContainers[box.children[i]].children[j];
                selected = selected.concat(this.getDescendantContainedViews(this.props.boxes[bx]));
            }
        }
        for (let i = 0; i < box.containedViews.length; i++) {
            let cv = box.containedViews[i];
            selected.push(cv);
            for (let j = 0; j < this.props.containedViews[cv].boxes.length; j++) {
                selected = selected.concat(this.getDescendantContainedViews(this.props.boxes[this.props.containedViews[cv].boxes[j]]));
            }
        }

        return selected;
    }

    getDescendantContainedViewsFromContainer(box, container) {
        let selected = [];

        for (let j = 0; j < box.sortableContainers[container].children.length; j++) {
            let bx = box.sortableContainers[container].children[j];
            selected = selected.concat(this.getDescendantContainedViews(this.props.boxes[bx]));
        }
        for (let i = 0; i < box.containedViews.length; i++) {
            let cv = box.containedViews[i];
            selected.push(cv);
            for (let j = 0; j < this.props.containedViews[cv].boxes.length; j++) {
                selected = selected.concat(this.getDescendantContainedViews(this.props.boxes[this.props.containedViews[cv].boxes[j]]));
            }
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
        let descBoxes = this.getDescendantBoxesFromContainer(boxes[parent], id);
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
        this.props.dispatch(deleteSortableContainer(id, parent, descBoxes, cvs/* , this.getDescendantContainedViewsFromContainer(boxes[parent], id)*/, page));
    }

    buildPluginToolbar(detail) {
        let state = detail.state;
        let styles = {};
        // TODO Revisar
        try {
            Object.keys(detail.toolbar.main.accordions.style.buttons).map((e) => {
                styles[e] = detail.toolbar.main.accordions.style.buttons[e].value;
            });
            // eslint-disable-next-line no-console
        } catch(e) {console.error(e);}
        return { state, styles };
    }
    onTextEditorToggled(caller, value, text, content) {
        let pluginToolbar = this.props.pluginToolbars[caller];
        if(pluginToolbar) {

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
        globalConfig: state.present.globalConfig,
        imagesUploaded: state.present.imagesUploaded,
        boxes: state.present.boxesById,
        boxSelected: state.present.boxSelected,
        boxLevelSelected: state.present.boxLevelSelected,
        indexSelected: state.present.indexSelected,
        navItemsIds: state.present.navItemsIds,
        navItems: state.present.navItemsById,
        navItemSelected: state.present.navItemSelected,
        containedViews: state.present.containedViewsById,
        containedViewSelected: state.present.containedViewSelected,
        undoDisabled: state.past.length === 0,
        redoDisabled: state.future.length === 0,
        displayMode: state.present.displayMode,
        marks: state.present.marksById,
        pluginToolbars: state.present.pluginToolbarsById,
        viewToolbars: state.present.viewToolbarsById,
        exercises: state.present.exercises,
        isBusy: state.present.isBusy,
        fetchVishResults: state.present.fetchVishResults,
        lastActionDispatched: state.present.lastActionDispatched || "",

    };
}

export default connect(mapStateToProps)(EditorApp);

EditorApp.propTypes = {
    globalConfig: PropTypes.object.isRequired,
    imagesUploaded: PropTypes.any,
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
    fetchVishResults: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    store: PropTypes.any,
    lastActionDispatched: PropTypes.object,
};
