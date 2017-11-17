import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { Grid, Col, Row } from 'react-bootstrap';
import { addNavItem, selectNavItem, expandNavItem, deleteNavItem, reorderNavItem, toggleNavItem, updateNavItemExtraFiles,
    changeNavItemName, changeUnitNumber, selectIndex,
    addBox, selectBox, moveBox, resizeBox, updateBox, duplicateBox, deleteBox, reorderSortableContainer, dropBox, increaseBoxLevel,
    resizeSortableContainer, deleteSortableContainer, changeCols, changeRows, changeSortableProps, reorderBoxes, verticallyAlignBox,
    toggleTextEditor, toggleTitleMode,
    changeDisplayMode, updateToolbar,
    exportStateAsync, importStateAsync, importState, changeGlobalConfig,
    fetchVishResourcesSuccess, fetchVishResourcesAsync, uploadVishResourceAsync,
    deleteContainedView, selectContainedView, changeContainedViewName,
    addRichMark, editRichMark, deleteRichMark,
    ADD_BOX, EDIT_PLUGIN_TEXT, DELETE_CONTAINED_VIEW, DELETE_NAV_ITEM, DELETE_RICH_MARK, UPDATE_BOX, UPDATE_TOOLBAR } from '../../common/actions';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../common/constants';
import EditorCanvas from '../components/canvas/editor_canvas/EditorCanvas';
import ContainedCanvas from '../components/rich_plugins/contained_canvas/ContainedCanvas';
import EditorCarousel from '../components/carrousel/editor_carrousel/EditorCarousel';
import PluginConfigModal from '../components/plugin_config_modal/PluginConfigModal';
import XMLConfigModal from '../components/xml_config_modal/XMLConfigModal';
import PluginToolbar from '../components/toolbar/plugin_toolbar/PluginToolbar';
import Visor from '../../_visor/containers/Visor';
import ExternalCatalogModal from '../components/external_provider/ExternalCatalogModal';
import PluginRibbon from '../components/nav_bar/plugin_ribbon/PluginRibbon';
import EditorNavBar from '../components/nav_bar/editor_nav_bar/EditorNavBar';
import ServerFeedback from '../components/server_feedback/ServerFeedback';
import RichMarksModal from '../components/rich_plugins/rich_marks_modal/RichMarksModal';
import AutoSave from '../components/autosave/AutoSave';
import Alert from '../components/common/alert/Alert';
import i18n from 'i18next';
import Ediphy from '../../core/editor/main';
import { isSortableBox, isSection, isContainedView, isSortableContainer } from '../../common/utils';
import 'typeface-ubuntu';
import 'typeface-source-sans-pro';

/**
 * EditorApp. Main application component that renders everything else
 */
class EditorApp extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Plugin index. It means that it will start in the first category available (text)
         * @type {number}
         */
        this.index = 0;
        /**
         * @TODO Comment
         * @type {number}
         */
        this.severalBoxes = 0;
        /**
         * Component's initial state
         * @type {{alert: null, pluginTab: string, hideTab: string, visorVisible: boolean, xmlEditorVisible: boolean, richMarksVisible: boolean, markCreatorVisible: boolean, containedViewsVisible: boolean, currentRichMark: null, carouselShow: boolean, carouselFull: boolean, serverModal: boolean, catalogModal: boolean, lastAction: string}}
         */
        this.state = {
            alert: null,
            pluginTab: 'text',
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
        };
    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        const { dispatch, boxes, boxesIds, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            containedViews, containedViewSelected, imagesUploaded, indexSelected,
            undoDisabled, redoDisabled, displayMode, isBusy, toolbars, globalConfig, fetchVishResults } = this.props;
        let ribbonHeight = this.state.hideTab === 'hide' ? 0 : 47;
        let title = globalConfig.title || '---';
        let canvasRatio = globalConfig.canvasRatio;
        return (
            <Grid id="app" fluid style={{ height: '100%' }}>
                <Row className="navBar">
                    {this.state.alert}
                    <EditorNavBar hideTab={this.state.hideTab}
                        globalConfig={globalConfig}
                        changeGlobalConfig={(prop, value) => {this.dispatchAndSetState(changeGlobalConfig(prop, value));}}
                        undoDisabled={undoDisabled}
                        redoDisabled={redoDisabled}
                        navItemsIds={navItemsIds}
                        navItems={navItems}
                        onTitleChanged={(id, titleStr) => {this.dispatchAndSetState(changeGlobalConfig('title', titleStr));}}
                        containedViewSelected={containedViewSelected}
                        navItemSelected={navItemSelected}
                        boxSelected={boxSelected}
                        onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                        undo={() => {this.dispatchAndSetState(ActionCreators.undo());}}
                        redo={() => {this.dispatchAndSetState(ActionCreators.redo());}}
                        visor={() =>{this.setState({ visorVisible: true });}}
                        export={() => {Ediphy.Visor.exports(this.props.store.getState().present);}}
                        scorm={() => {Ediphy.Visor.exportScorm(this.props.store.getState().present);}}
                        save={() => {this.dispatchAndSetState(exportStateAsync({ present: this.props.store.getState().present })); }}
                        category={this.state.pluginTab}
                        opens={() => {this.dispatchAndSetState(importStateAsync());}}
                        serverModalOpen={()=>{this.setState({ serverModal: true });}}
                        onExternalCatalogToggled={() => this.setState({ catalogModal: true })}
                        setcat={(category) => {this.setState({ pluginTab: category, hideTab: 'show' });}}/>
                    {Ediphy.Config.autosave_time > 1000 &&
                    <AutoSave save={() => {this.dispatchAndSetState(exportStateAsync({ present: this.props.store.getState().present }));}}
                        isBusy={isBusy}
                        lastAction={this.state.lastAction}
                        visorVisible={this.state.visorVisible}/>})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel boxes={boxes}
                        title={title}
                        containedViews={containedViews}
                        containedViewSelected={containedViewSelected}
                        indexSelected={indexSelected}
                        navItemsIds={navItemsIds}
                        navItems={navItems}
                        navItemSelected={navItemSelected}
                        displayMode={displayMode}
                        onBoxAdded={(ids, draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, draggable, resizable, content, toolbar, config, state))}
                        onIndexSelected={(id) => this.dispatchAndSetState(selectIndex(id))}
                        onContainedViewNameChanged={(id, titleStr) => this.dispatchAndSetState(changeContainedViewName(id, titleStr))}
                        onContainedViewSelected={ (id) => this.dispatchAndSetState(selectContainedView(id)) }
                        onContainedViewDeleted={(cvid)=>{
                            let boxesRemoving = [];
                            containedViews[cvid].boxes.map(boxId => {
                                boxesRemoving.push(boxId);
                                boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                            });

                            this.dispatchAndSetState(deleteContainedView([cvid], boxesRemoving, containedViews[cvid].parent));

                            Object.keys(containedViews[cvid].parent).forEach((el)=>{
                                if (toolbars[el] && toolbars[el].state && toolbars[el].state.__marks) {
                                    Ediphy.Plugins.get(toolbars[el].config.name).forceUpdate(
                                        toolbars[el].state,
                                        el,
                                        DELETE_CONTAINED_VIEW
                                    );
                                }
                            });
                        }}
                        onNavItemNameChanged={(id, titleStr) => this.dispatchAndSetState(changeNavItemName(id, titleStr))}
                        onNavItemAdded={(id, name, parent, type, position) => this.dispatchAndSetState(addNavItem(id, name, parent, type, position, (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content))))}
                        onNavItemSelected={id => this.dispatchAndSetState(selectNavItem(id))}
                        onNavItemExpanded={(id, value) => this.dispatchAndSetState(expandNavItem(id, value))}
                        onNavItemDeleted={(navsel) => {
                            let viewRemoving = [navsel].concat(this.getDescendantViews(navItems[navsel]));
                            let boxesRemoving = [];
                            let containedRemoving = {};
                            viewRemoving.map(id => {
                                navItems[id].boxes.map(boxId => {
                                    boxesRemoving.push(boxId);
                                    boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                                    // containedRemoving = containedRemoving.concat(this.getDescendantContainedViews(boxes[boxId]));
                                });
                            });
                            let marksRemoving = this.getDescendantLinkedBoxes(viewRemoving, navItems) || [];
                            this.dispatchAndSetState(deleteNavItem(viewRemoving, navItems[navsel].parent, boxesRemoving, containedRemoving, marksRemoving));
                        }}
                        onNavItemReordered={(id, newParent, oldParent, idsInOrder, childrenInOrder) => this.dispatchAndSetState(reorderNavItem(id, newParent, oldParent, idsInOrder, childrenInOrder))}
                        onDisplayModeChanged={mode => this.dispatchAndSetState(changeDisplayMode(mode))}
                        containedViewsVisible={this.state.containedViewsVisible}
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
                        <Row id="ribbonRow">
                            <PluginRibbon disabled={navItemSelected === 0 || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected)) || this.hasExerciseBox(navItemSelected, navItems, this.state, boxes)} // ADD condition navItemSelected There are extrafiles
                                boxSelected={boxes[boxSelected]}
                                navItemSelected={navItems[navItemSelected]}
                                containedViewSelected={containedViewSelected}
                                category={this.state.pluginTab}
                                hideTab={this.state.hideTab}
                                ribbonHeight={ribbonHeight + 'px'} />
                        </Row>
                        <Row id="canvasRow" style={{ height: 'calc(100% - ' + ribbonHeight + 'px)' }}>
                            <EditorCanvas boxes={boxes}
                                canvasRatio={canvasRatio}
                                boxSelected={boxSelected}
                                boxLevelSelected={boxLevelSelected}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                containedViews={containedViews}
                                containedViewSelected={containedViews[containedViewSelected] || 0}
                                showCanvas={(navItemSelected !== 0)}
                                toolbars={toolbars}
                                title={title}
                                markCreatorId={this.state.markCreatorVisible}
                                onBoxAdded={(ids, draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, draggable, resizable, content, toolbar, config, state))}
                                addMarkShortcut= {(mark) => {
                                    let state = JSON.parse(JSON.stringify(toolbars[boxSelected].state));
                                    state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                                    if(mark.connection.id) {
                                        state.__marks[mark.id].connection = mark.connection.id;
                                    }
                                    this.dispatchAndSetState(addRichMark(boxSelected, mark, state));
                                }}
                                deleteMarkCreator={()=>this.setState({ markCreatorVisible: false })}
                                lastActionDispatched={this.state.lastAction}
                                onBoxSelected={(id) => this.dispatchAndSetState(selectBox(id))}
                                onBoxLevelIncreased={() => this.dispatchAndSetState(increaseBoxLevel())}
                                onBoxMoved={(id, x, y, position, parent, container) => this.dispatchAndSetState(moveBox(id, x, y, position, parent, container))}
                                onBoxResized={(id, widthButton, heightButton) => this.dispatchAndSetState(resizeBox(id, widthButton, heightButton))}
                                onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                                onSortableContainerDeleted={(id, parent) => {
                                    let descBoxes = this.getDescendantBoxesFromContainer(boxes[parent], id);
                                    let cvs = { };
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
                                    this.dispatchAndSetState(deleteSortableContainer(id, parent, descBoxes, cvs/* , this.getDescendantContainedViewsFromContainer(boxes[parent], id)*/));
                                }}
                                onSortableContainerReordered={(ids, parent) => this.dispatchAndSetState(reorderSortableContainer(ids, parent))}
                                onBoxDropped={(id, row, col) => this.dispatchAndSetState(dropBox(id, row, col))}
                                onBoxDeleted={(id, parent, container)=> {let bx = this.getDescendantBoxes(boxes[id]); this.dispatchAndSetState(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/));}}
                                onContainedViewSelected={id => this.dispatchAndSetState(selectContainedView(id))}
                                onVerticallyAlignBox={(id, verticalAlign)=>this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                                onUnitNumberChanged={(id, value) => this.dispatchAndSetState(changeUnitNumber(id, value))}
                                onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                onBoxesInsideSortableReorder={(parent, container, order) => {this.dispatchAndSetState(reorderBoxes(parent, container, order));}}
                                titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}/>
                            <ContainedCanvas boxes={boxes}
                                boxSelected={boxSelected}
                                canvasRatio={canvasRatio}
                                boxLevelSelected={boxLevelSelected}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                containedViews={containedViews}
                                containedViewSelected={containedViews[containedViewSelected] || 0}
                                markCreatorId={this.state.markCreatorVisible}
                                addMarkShortcut= {(mark) => {
                                    let toolbar = toolbars[boxSelected];
                                    let state = JSON.parse(JSON.stringify(toolbar.state));
                                    state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                                    if(mark.connection.id) {
                                        state.__marks[mark.id].connection = mark.connection.id;
                                    }
                                    this.dispatchAndSetState(addRichMark(boxSelected, mark, state));
                                }}
                                onBoxAdded={(ids, draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, draggable, resizable, content, toolbar, config, state))}
                                deleteMarkCreator={()=>this.setState({ markCreatorVisible: false })}
                                title={title}
                                toolbars={toolbars}
                                titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}
                                lastActionDispatched={this.state.lastAction}
                                onContainedViewSelected={id => this.dispatchAndSetState(selectContainedView(id))}
                                onBoxSelected={(id) => this.dispatchAndSetState(selectBox(id))}
                                onBoxLevelIncreased={() => this.dispatchAndSetState(increaseBoxLevel())}
                                onBoxMoved={(id, x, y, position, parent, container) => this.dispatchAndSetState(moveBox(id, x, y, position, parent, container))}
                                onBoxResized={(id, widthButton, heightButton) => this.dispatchAndSetState(resizeBox(id, widthButton, heightButton))}
                                onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                                onSortableContainerDeleted={(id, parent) => {
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
                                    this.dispatchAndSetState(deleteSortableContainer(id, parent, descBoxes, cvs/* , this.getDescendantContainedViewsFromContainer(boxes[parent], id)*/));
                                }}
                                onSortableContainerReordered={(ids, parent) => this.dispatchAndSetState(reorderSortableContainer(ids, parent))}
                                onBoxDropped={(id, row, col) => this.dispatchAndSetState(dropBox(id, row, col))}
                                onBoxDeleted={(id, parent, container)=> {let bx = this.getDescendantBoxes(boxes[id]); this.dispatchAndSetState(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/));}}
                                onMarkCreatorToggled={(id) => this.setState({ markCreatorVisible: id })}
                                onVerticallyAlignBox={(id, verticalAlign)=>this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                                onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                onBoxesInsideSortableReorder={(parent, container, order) => {this.dispatchAndSetState(reorderBoxes(parent, container, order));}}
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
                <PluginConfigModal />
                <XMLConfigModal id={boxSelected}
                    toolbar={toolbars[boxSelected]}
                    visible={this.state.xmlEditorVisible}
                    onXMLEditorToggled={() => this.setState({ xmlEditorVisible: !this.state.xmlEditorVisible })}/>
                {Ediphy.Config.external_providers.enable_catalog_modal &&
                <ExternalCatalogModal images={imagesUploaded}
                    visible={this.state.catalogModal}
                    onExternalCatalogToggled={() => this.setState({ catalogModal: !this.state.catalogModal })}/>}
                <RichMarksModal boxSelected={boxSelected}
                    pluginToolbar={toolbars[boxSelected]}
                    navItemSelected={navItemSelected}
                    toolbars={toolbars}
                    containedViewSelected={containedViewSelected}
                    containedViews={containedViews}
                    navItems={navItems}
                    navItemsIds={navItemsIds}
                    visible={this.state.richMarksVisible}
                    currentRichMark={this.state.currentRichMark}
                    defaultValueMark={toolbars[boxSelected] && toolbars[boxSelected].config && Ediphy.Plugins.get(toolbars[boxSelected].config.name) ? Ediphy.Plugins.get(toolbars[boxSelected].config.name).getConfig().defaultMarkValue : 0}
                    validateValueInput={toolbars[boxSelected] && toolbars[boxSelected].config && Ediphy.Plugins.get(toolbars[boxSelected].config.name) ? Ediphy.Plugins.get(toolbars[boxSelected].config.name).validateValueInput : null}
                    onBoxAdded={(ids, draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, draggable, resizable, content, toolbar, config, state))}
                    onRichMarkUpdated={(mark, createNew) => {
                        let toolbar = toolbars[boxSelected];
                        let state = JSON.parse(JSON.stringify(toolbar.state));
                        let oldConnection = state.__marks[mark.id] ? state.__marks[mark.id].connection : 0;
                        state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                        let newConnection = mark.connection;
                        if (mark.connection.id) {
                            newConnection = mark.connection.id;
                            state.__marks[mark.id].connection = mark.connection.id;
                        }

                        if (!this.state.currentRichMark && createNew) {
                            this.dispatchAndSetState(addRichMark(boxSelected, mark, state));
                        } else {
                            this.dispatchAndSetState(editRichMark(boxSelected, state, mark, oldConnection, newConnection));
                        }

                    }}
                    onRichMarksModalToggled={() => {
                        this.setState({ richMarksVisible: !this.state.richMarksVisible });
                        if(this.state.richMarksVisible) {
                            this.setState({ currentRichMark: null });
                        }
                    }}/>
                <PluginToolbar top={(60 + ribbonHeight) + 'px'}
                    toolbars={toolbars}
                    box={boxes[boxSelected]}
                    boxSelected={boxSelected}
                    containedViews={containedViews}
                    navItemSelected={containedViewSelected !== 0 ? containedViewSelected : navItemSelected}
                    navItems={containedViewSelected !== 0 ? containedViews : navItems}
                    carouselShow={this.state.carouselShow}
                    isBusy={isBusy}
                    fetchResults={fetchVishResults}
                    titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}
                    onContainedViewNameChanged={(id, titleStr) => this.dispatchAndSetState(changeContainedViewName(id, titleStr))}
                    onNavItemToggled={ id => this.dispatchAndSetState(toggleNavItem(navItemSelected)) }
                    onNavItemSelected={id => this.dispatchAndSetState(selectNavItem(id))}
                    onNavItemNameChanged={(id, titleStr) => this.dispatchAndSetState(changeNavItemName(id, titleStr))}
                    onContainedViewSelected={id => this.dispatchAndSetState(selectContainedView(id))}
                    onColsChanged={(id, parent, distribution, boxesAffected) => this.dispatchAndSetState(changeCols(id, parent, distribution, boxesAffected))}
                    onRowsChanged={(id, parent, column, distribution, boxesAffected) => this.dispatchAndSetState(changeRows(id, parent, column, distribution, boxesAffected))}
                    onBoxResized={(id, widthButton, heightButton) => this.dispatchAndSetState(resizeBox(id, widthButton, heightButton))}
                    onBoxMoved={(id, x, y, position, parent, container) => this.dispatchAndSetState(moveBox(id, x, y, position, parent, container))}
                    onVerticallyAlignBox={(id, verticalAlign) => this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                    onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                    onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                    onSortableContainerDeleted={(id, parent) => {
                        let descBoxes = this.getDescendantBoxesFromContainer(boxes[parent], id);
                        let cvs = { };
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
                        this.dispatchAndSetState(deleteSortableContainer(id, parent, descBoxes, cvs/* , this.getDescendantContainedViewsFromContainer(boxes[parent], id)*/));
                    }}
                    onSortablePropsChanged={(id, parent, prop, value) => this.dispatchAndSetState(changeSortableProps(id, parent, prop, value))}
                    onToolbarUpdated={(id, tab, accordion, name, value) => this.dispatchAndSetState(updateToolbar(id, tab, accordion, name, value))}
                    onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState(duplicateBox(id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendantBoxes(boxes[id])), Date.now() - 1))}
                    onBoxDeleted={(id, parent, container)=> {let bx = this.getDescendantBoxes(boxes[id]); this.dispatchAndSetState(deleteBox(id, parent, container, bx, boxes[id].containedViews /* , this.getDescendantContainedViews(boxes[id])*/));}}
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
                        let toolbar = toolbars[boxSelected];
                        let state = JSON.parse(JSON.stringify(toolbar.state));
                        let cvid = state.__marks[id].connection;

                        delete state.__marks[id];
                        this.dispatchAndSetState(deleteRichMark(id, boxSelected, cvid, state));
                        // This checks if the deleted mark leaves an orphan contained view, and displays a message asking if the user would like to delete it as well
                        if (isContainedView(cvid)) {
                            let thiscv = containedViews[cvid];
                            if(thiscv && Object.keys(thiscv.parent).indexOf(boxSelected) !== -1) {
                                let remainingMarks = [];
                                for (let linkedbox in thiscv.parent) {
                                    if (toolbars[linkedbox] && toolbars[linkedbox].state && toolbars[linkedbox].state.__marks) {
                                        for (let i in toolbars[linkedbox].state.__marks) {
                                            let mark = toolbars[linkedbox].state.__marks[i];
                                            if (mark.connection === cvid) {
                                                remainingMarks.push(cvid);
                                            }
                                        }
                                    }
                                }

                                if (remainingMarks.length === 1) {
                                    let confirmText = i18n.t("messages.confirm_delete_CV_also_1") + containedViews[cvid].name + i18n.t("messages.confirm_delete_CV_also_2");
                                    let alertComponent = (<Alert className="pageModal"
                                        show
                                        hasHeader
                                        title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                                        acceptButtonText={i18n.t("messages.confirm_delete_cv_as_well")}
                                        cancelButton
                                        cancelButtonText={i18n.t("messages.confirm_delete_cv_not")}
                                        closeButton onClose={(bool)=>{
                                            if (bool) {
                                                let boxesRemoving = [];
                                                containedViews[cvid].boxes.map(boxId => {
                                                    boxesRemoving.push(boxId);
                                                    boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                                                });

                                                this.dispatchAndSetState(deleteContainedView([cvid], boxesRemoving, thiscv.parent));
                                            }
                                            this.setState({ alert: null });}}>
                                        <span> {confirmText} </span>
                                    </Alert>);
                                    this.setState({ alert: alertComponent });
                                }
                            }
                        }

                    }}
                    onUploadVishResource={(query) => this.dispatchAndSetState(uploadVishResourceAsync(query))}
                    onFetchVishResources={(query) => this.dispatchAndSetState(fetchVishResourcesAsync(query))}
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

        Ediphy.Plugins.loadAll();
        Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.render, e => {
            this.index = 0;
            let newPluginState = {};
            let navItemSelected = this.props.navItems[this.props.navItemSelected];

            if (e.detail.config.flavor !== "react") {
                this.parsePluginContainers(e.detail.content, newPluginState);
                e.detail.state.__pluginContainerIds = newPluginState;
            }

            let reason = e.detail.reason;
            if (reason.type) {
                reason = reason.type;
            }

            switch (reason) {
            case ADD_BOX:
                if(this.severalBoxes === 0) {
                    this.severalBoxes = Date.now() + this.index++;
                }
                e.detail.ids.id = (this.severalBoxes !== 0) ? ID_PREFIX_BOX + this.severalBoxes++ : ID_PREFIX_BOX + Date.now() + this.index++;
                this.dispatchAndSetState(addBox(
                    {
                        parent: e.detail.ids.parent,
                        id: e.detail.ids.id,
                        container: e.detail.ids.container,
                    },
                    true,
                    !isSortableContainer(e.detail.ids.container),
                    e.detail.content,
                    e.detail.toolbar,
                    e.detail.config,
                    e.detail.state,
                    e.detail.initialParams
                ));
                break;

            // case DELETE_RICH_MARK:
            case DELETE_NAV_ITEM:
            case DELETE_CONTAINED_VIEW:
            case EDIT_PLUGIN_TEXT:
            case UPDATE_BOX:
            case UPDATE_TOOLBAR:
                this.dispatchAndSetState(updateBox(
                    e.detail.ids.id || this.props.boxSelected,
                    e.detail.content,
                    e.detail.toolbar,
                    e.detail.state
                ));
                break;
            default:
                // eslint-disable-next-line no-console
                console.error("I don't know how to manage this");
            }

            if (e.detail.config.flavor !== "react") {
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
            }
            if (e.detail.state.__xml_path) {
                if (!navItemSelected.extraFiles[e.detail.ids.id] || navItemSelected.extraFiles[e.detail.ids.id] !== e.detail.state.__xml_path) {
                    this.dispatchAndSetState(updateNavItemExtraFiles(this.props.navItemSelected, e.detail.ids.id, e.detail.state.__xml_path));
                }
            }
        });
        Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.getPluginsInView, e => {
            let plugins = {};
            let ids = [];
            let view = e.detail.view ? e.detail.view : this.props.navItemSelected;

            this.props.navItems[view].boxes.map(id => {
                ids.push(id);
                ids = ids.concat(this.getDescendantBoxes(this.props.boxes[id]));
            });

            ids.map(id => {
                let toolbar = this.props.toolbars[id];
                if (e.detail.getAliasedPlugins) {
                    if (!isSortableBox(id)) {
                        let button = toolbar.controls.main.accordions.z__extra.buttons.alias;
                        if (button.value.length !== 0) {
                            if (!plugins[toolbar.config.name]) {
                                plugins[toolbar.config.name] = [];
                            }
                            plugins[toolbar.config.name].push(button.value);
                        }
                    }
                } else if (plugins[toolbar.config.name]) {
                    plugins[toolbar.config.name] = true;
                }
            });

            Ediphy.API_Private.answer(Ediphy.API_Private.events.getPluginsInView, plugins);
        });

        Ediphy.API_Private.listenEmission(Ediphy.API_Private.events.editRichMark, e => {
            let newState = JSON.parse(JSON.stringify(this.props.toolbars[e.detail.box].state));
            newState.__marks[e.detail.id].value = e.detail.value;
            this.dispatchAndSetState(editRichMark(e.detail.box, newState, newState.__marks[e.detail.id], false, false));

        });

        window.onkeyup = function(e) {
            let key = e.keyCode ? e.keyCode : e.which;
            // Checks what element has the cursor focus currently
            let focus = document.activeElement.className;

            // Ctrl + Z
            if (key === 90 && e.ctrlKey) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                    this.dispatchAndSetState(ActionCreators.undo());
                }
            }
            // Ctrl + Y
            if (key === 89 && e.ctrlKey) {
                if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                    this.dispatchAndSetState(ActionCreators.redo());
                }
            }

            // Supr
            else if (key === 46) {
                if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                    // If it is not an input or any other kind of text edition AND there is a box selected, it deletes said box
                    if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                        let box = this.props.boxes[this.props.boxSelected];
                        let toolbar = this.props.toolbars[this.props.boxSelected];
                        if (!toolbar.showTextEditor) {
                            let bx = this.getDescendantBoxes(this.props.boxes[this.props.boxSelected]);
                            this.dispatchAndSetState(deleteBox(box.id, box.parent, box.container, bx, this.props.boxes[this.props.boxSelected].containedViews/* , this.getDescendantContainedViews(box)*/));
                        }
                    }
                }
            }
        }.bind(this);
    }

    /**
     * Views that hang from the given view
     * @param view
     * @returns {Array}
     */
    getDescendantViews(view) {
        let selected = [];

        for (let i = 0; i < view.children.length; i++) {
            let vw = view.children[i];
            selected.push(vw);
            selected = selected.concat(this.getDescendantViews(this.props.navItems[vw]));
        }

        return selected;
    }

    /**
     * Children boxes of a given box
     * @param box
     * @returns {Array}
     */
    getDescendantBoxes(box) {
        let selected = [];

        for (let i = 0; i < box.children.length; i++) {
            for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                let bx = box.sortableContainers[box.children[i]].children[j];
                selected.push(bx);
                selected = selected.concat(this.getDescendantBoxes(this.props.boxes[bx]));
            }
        }
        /* for (let i = 0; i < box.containedViews.length; i++) {
            let cv = box.containedViews[i];
            for (let j = 0; j < this.props.containedViews[cv].boxes.length; j++) {
                let bx = this.props.containedViews[cv].boxes[j];
                selected.push(bx);
                selected = selected.concat(this.getDescendantBoxes(this.props.boxes[bx]));
            }
        }*/
        return selected;
    }

    /**
     * Children boxes of a given container
     * @param box
     * @param container
     * @returns {Array}
     */
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

    /**
     * Get descendant contained views from a given box
     * @param box
     * @returns {Array}
     */
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

    /**
     * Boxes that link to the given views
     * @param ids Views ids
     * @param navs navItemsById
     * @returns {{}}
     */
    getDescendantLinkedBoxes(ids, navs) {
        let boxes = {};

        ids.forEach((nav) => {
            for (let lb in navs[nav].linkedBoxes) {
                boxes[lb] = [(boxes[lb] || []), ...navs[nav].linkedBoxes[lb]];
            }
            // boxes = [...new Set([...boxes, ...navs[nav].linkedBoxes])];
            // boxes.concat(navs[nav].linkedBoxes);
        });
        return boxes;
    }

    /**
     * Container's linked contained views
     * @param box EditorBoxSortable
     * @param container SortableContainer
     * @returns {Array}
     */
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

    /**
     * Get descendants of duplicated boxes
     * @param descendants
     * @returns {{}}
     */
    getDuplicatedBoxesIds(descendants) {
        let newIds = {};
        let date = Date.now();
        descendants.map(box => {
            newIds[box.substr(3)] = date++;
        });
        return newIds;
    }

    /**
     *
     * @param obj
     * @param state
     */
    parsePluginContainers(obj, state) {
        if (obj.child) {
            for (let i = 0; i < obj.child.length; i++) {
                if (obj.child[i].tag && obj.child[i].tag === "plugin") {
                    if (obj.child.length > 1) {
                        // eslint-disable-next-line no-console
                        console.error("A plugin tag must not have siblings. Please check renderTemplate method");
                    }
                    let height = "auto";
                    let child = obj.child[i];
                    if (child.attr) {
                        if (child.attr['plugin-data-height']) {
                            height = child.attr['plugin-data-height'];
                        } else if (child.attr['plugin-data-initial-height']) {
                            height = child.attr['plugin-data-initial-height'];
                        } else {
                            height = child.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto";
                        }
                    }
                    if (!obj.attr) {
                        obj.attr = {
                            style: { height: height },
                        };
                    } else if (!obj.attr.style) {
                        obj.attr.style = { height: height };
                    } else {
                        obj.attr.style.height = height;
                    }
                    if (obj.attr.style.minHeight) {
                        delete obj.attr.style.minHeight;
                    }
                }
                this.parsePluginContainers(obj.child[i], state);
            }
        }
        if (obj.tag && obj.tag === "plugin") {
            if (obj.attr) {
                if (!obj.attr['plugin-data-id']) {
                    obj.attr['plugin-data-id'] = ID_PREFIX_SORTABLE_CONTAINER + Date.now() + this.index++ + new Date().getUTCMilliseconds();
                }
                if (!obj.attr['plugin-data-height']) {
                    obj.attr['plugin-data-height'] = obj.attr['plugin-data-initial-height'] || (obj.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto");
                }
                if (obj.attr['plugin-data-key'] && !state[obj.attr['plugin-data-key']]) {
                    state[obj.attr['plugin-data-key']] = {
                        id: obj.attr['plugin-data-id'],
                        name: obj.attr['plugin-data-display-name'] || obj.attr['plugin-data-key'],
                        height: obj.attr['plugin-data-height'],
                    };
                }
            }
        }
        if (obj.attr && obj.attr.class) {
            if(!Array.isArray(obj.attr.class) && typeof obj.attr.class === "string") {
                obj.attr.class = [obj.attr.class];
            }
            obj.attr.className = obj.attr.class.join(' ');
            delete obj.attr.class;
        }
    }

    hasExerciseBox(navItemId, navItems, state, boxes) {
        if(state.pluginTab === "exercises" && (navItems[navItemId].boxes.length > 1 || boxes[navItems[navItemId].boxes[0]].children.length !== 0)) {
            return true;
        }
        if(navItems[navItemId] && Object.keys(navItems[navItemId].extraFiles).length !== 0) {
            return true;
        }
        return false;
    }

    addDefaultContainerPlugins(eventDetails, obj) {
        if (obj.child) {
            for (let i = 0; i < obj.child.length; i++) {
                this.addDefaultContainerPlugins(eventDetails, obj.child[i]);
            }
        }
        if (obj.tag && obj.tag === "plugin" && obj.attr['plugin-data-default']) {
            let boxes = this.props.store.getState().present.boxesById;
            let plug_children = boxes[eventDetails.ids.id].sortableContainers[obj.attr['plugin-data-id']];
            if (plug_children && plug_children.children && plug_children.children.length === 0) {
                obj.attr['plugin-data-default'].split(" ").map(name => {
                    if (!Ediphy.Plugins.get(name)) {
                        // eslint-disable-next-line no-console
                        console.error("Plugin " + name + " does not exist");
                        return;
                    }
                    Ediphy.Plugins.get(name).getConfig().callback({
                        parent: eventDetails.ids.id,
                        container: obj.attr['plugin-data-id'],
                        isDefaultPlugin: true,
                    }, ADD_BOX);
                });
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
        toolbars: state.present.toolbarsById,
        isBusy: state.present.isBusy,
        fetchVishResults: state.present.fetchVishResults,
    };
}

export default connect(mapStateToProps)(EditorApp);
