import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, reorderNavItem, toggleNavItem, updateNavItemExtraFiles,
    changeSectionTitle, changeUnitNumber,
    addBox, changeTitle, selectBox, moveBox, resizeBox, updateBox, duplicateBox, deleteBox, reorderBox, dropBox, increaseBoxLevel,
    resizeSortableContainer, changeCols, changeRows, changeSortableProps, reorderBoxes, verticallyAlignBox,
    toggleTextEditor, toggleTitleMode,
    changeDisplayMode, updateToolbar, updateIntermediateToolbar, collapseToolbar,
    exportStateAsync, importStateAsync,
    fetchVishResourcesSuccess, fetchVishResourcesAsync,
    selectContainedView,
    ADD_BOX, ADD_RICH_MARK, addRichMark, EDIT_RICH_MARK, editRichMark, DELETE_RICH_MARK} from '../actions';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';
import DaliCanvas from '../components/DaliCanvas';
import ContainedCanvas from '../components/rich_plugins/ContainedCanvas';
import DaliCarousel from '../components/DaliCarousel';
import PluginConfigModal from '../components/PluginConfigModal';
import XMLConfigModal from '../components/XMLConfigModal';
import VishSearcher from '../components/VishSearcherModal';
import PluginToolbar from '../components/PluginToolbar';
import Visor from '../components/visor/Visor';
import PluginRibbon from '../components/PluginRibbon';
import DaliNavBar from '../components/DaliNavBar';
import ServerFeedback from '../components/ServerFeedback';
import RichMarksModal from '../components/rich_plugins/RichMarksModal.jsx';
import Dali from './../core/main';


class DaliApp extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            pluginTab: 'text',
            hideTab: 'show',
            visorVisible: false,
            xmlEditorVisible: false,
            vishSearcherVisible: false,
            richMarksVisible: false,
            currentRichMark: null,
            carouselShow: true,
            carouselFull: false,
            serverModal: false,
            lastAction: ""
        };
    }

    render() {
        const { dispatch, boxes, boxesIds, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            containedViews, containedViewSelected,
            undoDisabled, redoDisabled, displayMode, isBusy, toolbars, title, fetchVishResults } = this.props;
        let ribbonHeight = this.state.hideTab === 'hide' ? 0 : 47;
        return (
            /* jshint ignore:start */
            <Grid id="app" fluid={true} style={{height: '100%'}}>
                <Row className="navBar">
                    <DaliNavBar hideTab={this.state.hideTab}
                                undoDisabled={undoDisabled}
                                redoDisabled={redoDisabled}
                                navItemsIds={navItemsIds}
                                title={title}
                                changeTitle={(id, title) => {this.dispatchAndSetState(changeTitle(title))}}
                                navItemSelected={navItemSelected}
                                boxSelected={boxSelected}
                                undo={() => {this.dispatchAndSetState(ActionCreators.undo())}}
                                redo={() => {this.dispatchAndSetState(ActionCreators.redo())}}
                                visor={() =>{this.setState({visorVisible: true })}}
                                export={() => {Dali.Visor.exports(this.props.store.getState().present)}}
                                scorm={() => {Dali.Visor.exportScorm(this.props.store.getState().present)}}
                                categoria={this.state.pluginTab}
                                opens={() => {this.dispatchAndSetState(importStateAsync())}}
                                serverModalOpen={()=>{this.setState({serverModal: true })}}
                                setcat={(categoria) => {this.setState({ pluginTab: categoria, hideTab:'show' })}}/>
                </Row>
                <Row style={{height: 'calc(100% - 60px)'}}>
                    <DaliCarousel boxes={boxes}
                                  title={title}
                                  navItemsIds={navItemsIds}
                                  navItems={navItems}
                                  navItemSelected={navItemSelected}
                                  displayMode={displayMode}
                                  onBoxAdded={(ids, type,  draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                                  onTitleChange={(id, title) => this.dispatchAndSetState(changeSectionTitle(id,title))}
                                  onSectionAdded={(id, name, parent, children, level, type, position, titlesReduced) => this.dispatchAndSetState(addNavItem(id, name, parent, children, level, type, position, titlesReduced))}
                                  onNavItemSelected={id => this.dispatchAndSetState(selectNavItem(id))}
                                  onNavItemExpanded={(id, value) => this.dispatchAndSetState(expandNavItem(id, value))}
                                  onNavItemRemoved={() => {
                                    let viewRemoving = [navItemSelected].concat(this.getDescendantViews(navItems[navItemSelected]));
                                    let boxesRemoving = [];
                                    let containedRemoving = [];
                                    viewRemoving.map(id => {
                                        navItems[id].boxes.map(boxId => {
                                            boxesRemoving.push(boxId);
                                            boxesRemoving = boxesRemoving.concat(this.getDescendantBoxes(boxes[boxId]));
                                            containedRemoving = containedRemoving.concat(this.getDescendantContainedViews(boxes[boxId]));
                                        })
                                    });
                                    this.dispatchAndSetState(removeNavItem(viewRemoving, navItems[navItemSelected].parent, boxesRemoving, containedRemoving))
                                  }}
                                  onNavItemReorded={(itemId,newParent,type,newIndId,newChildrenInOrder) => this.dispatchAndSetState(reorderNavItem(itemId,newParent,type,newIndId,newChildrenInOrder))}
                                  onNavItemToggled={ id => this.dispatchAndSetState(toggleNavItem(id)) }
                                  onDisplayModeChanged={mode => this.dispatchAndSetState(changeDisplayMode(mode))}
                                  carouselShow={this.state.carouselShow}
                                  carouselFull={this.state.carouselFull}
                                  onToggleFull={() => {
                                    if(this.state.carouselFull){
                                        this.setState({carouselFull: false})
                                    }else{
                                        this.setState({carouselFull: true, carouselShow: true})
                                    }
                                  }}
                                  onToggleWidth={()=>{
                                    if(this.state.carouselShow){
                                        this.setState({carouselFull: false, carouselShow: false})
                                    }else{
                                        this.setState({carouselShow: true});
                                    }
                              }}/>

                    <Col id="colRight" xs={12}
                         style={{height: (this.state.carouselFull ? 0 : '100%'), width: (this.state.carouselShow? '83.333333%':'calc(100% - 80px)')}}>
                        <Row id="ribbonRow">
                            <PluginRibbon disabled={navItemSelected === 0}
                                          boxSelected={(boxSelected && boxSelected != -1) ? boxes[boxSelected] : -1}
                                          undoDisabled={undoDisabled}
                                          redoDisabled={redoDisabled}
                                          category={this.state.pluginTab}
                                          hideTab={this.state.hideTab}
                                          undo={() => {this.dispatchAndSetState(ActionCreators.undo())}}
                                          redo={() => {this.dispatchAndSetState(ActionCreators.redo())}}
                                          save={() => {this.dispatchAndSetState(exportStateAsync({present: this.props.store.getState().present}))}}
                                          ribbonHeight={ribbonHeight+'px'}
                                          onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState( duplicateBox( id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendantBoxes(boxes[id]) ), Date.now()-1 ))}
                                          serverModalOpen={()=>{this.setState({serverModal: true })}}/>
                        </Row>
                        <Row id="canvasRow" style={{height: 'calc(100% - '+ribbonHeight+'px)'}}>
                            <DaliCanvas boxes={boxes}
                                        boxesIds={boxesIds}
                                        boxSelected={boxSelected}
                                        boxLevelSelected={boxLevelSelected}
                                        navItems={navItems}
                                        navItemSelected={navItems[navItemSelected]}
                                        containedViewSelected={containedViewSelected}
                                        showCanvas={(navItemSelected !== 0)}
                                        toolbars={toolbars}
                                        title={title}
                                        lastActionDispatched={this.state.lastAction}
                                        onBoxSelected={(id) => this.dispatchAndSetState(selectBox(id))}
                                        onBoxLevelIncreased={() => this.dispatchAndSetState(increaseBoxLevel())}
                                        onBoxMoved={(id, x, y, position) => this.dispatchAndSetState(moveBox(id, x, y, position))}
                                        onBoxResized={(id, width, height) => this.dispatchAndSetState(resizeBox(id, width, height))}
                                        onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                                        onBoxReorder={(ids, parent) => this.dispatchAndSetState(reorderBox(ids, parent))}
                                        onBoxDropped={(id, row, col) => this.dispatchAndSetState(dropBox(id, row, col))}
                                        onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDescendantContainedViews(boxes[id])))}
                                        onVerticallyAlignBox={(id, verticalAlign)=>this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                                        onUnitNumberChanged={(id, value) => this.dispatchAndSetState(changeUnitNumber(id, value))}
                                        onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                        onBoxesInsideSortableReorder={(parent, container, order) => {this.dispatchAndSetState(reorderBoxes(parent, container, order))}}
                                        titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}/>
                            <ContainedCanvas boxes={boxes}
                                             boxSelected={boxSelected}
                                             boxLevelSelected={boxLevelSelected}
                                             containedViews={containedViews}
                                             containedViewSelected={containedViewSelected}
                                             toolbars={toolbars}
                                             lastActionDispatched={this.state.lastAction}
                                             onContainedViewSelected={id => this.dispatchAndSetState(selectContainedView(id))}
                                             onBoxSelected={(id) => this.dispatchAndSetState(selectBox(id))}
                                             onBoxLevelIncreased={() => this.dispatchAndSetState(increaseBoxLevel())}
                                             onBoxMoved={(id, x, y, position) => this.dispatchAndSetState(moveBox(id, x, y, position))}
                                             onBoxResized={(id, width, height) => this.dispatchAndSetState(resizeBox(id, width, height))}
                                             onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                                             onBoxReorder={(ids, parent) => this.dispatchAndSetState(reorderBox(ids, parent))}
                                             onBoxDropped={(id, row, col) => this.dispatchAndSetState(dropBox(id, row, col))}
                                             onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDescendantContainedViews(boxes[id])))}
                                             onVerticallyAlignBox={(id, verticalAlign)=>this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                                             onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                             onBoxesInsideSortableReorder={(parent, container, order) => {this.dispatchAndSetState(reorderBoxes(parent, container, order))}} />
                        </Row>
                    </Col>
                </Row>
                <ServerFeedback show={this.state.serverModal}
                                title={"Server"}
                                isBusy={isBusy}
                                hideModal={() => this.setState({serverModal: false })}/>
                <Visor id="visor"
                       title={title}
                       visorVisible={this.state.visorVisible}
                       onVisibilityToggled={()=> this.setState({visorVisible: !this.state.visorVisible })}
                       state={this.props.store.getState().present}/>
                <PluginConfigModal />
                <XMLConfigModal id={boxSelected}
                                toolbar={toolbars[boxSelected]}
                                visible={this.state.xmlEditorVisible}
                                onXMLEditorToggled={() => this.setState({xmlEditorVisible: !this.state.xmlEditorVisible})}/>
                <RichMarksModal boxSelected={boxSelected}
                                navItems={navItems}
                                navItemsIds={navItemsIds}
                                visible={this.state.richMarksVisible}
                                currentRichMark={this.state.currentRichMark}
                                onRichMarkUpdated={(mark) => {
                                    let toolbar = toolbars[boxSelected];
                                    let state = JSON.parse(JSON.stringify(toolbar.state));
                                    state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
                                    if(mark.connection.id){
                                        state.__marks[mark.id].connection = mark.connection.id;
                                    }
                                    Dali.Plugins.get(toolbar.config.name).forceUpdate(
                                        state,
                                        boxSelected,
                                        this.state.currentRichMark ? editRichMark(boxSelected, state) : addRichMark(boxSelected, mark, state)
                                    );
                                }}
                                onRichMarksModalToggled={() => {
                                    this.setState({richMarksVisible: !this.state.richMarksVisible});
                                    if(this.state.richMarksVisible){
                                        this.setState({currentRichMark: null});
                                    }
                                }}/>
                <PluginToolbar top={(60+ribbonHeight)+'px'}
                               toolbars={toolbars}
                               box={boxes[boxSelected]}
                               boxSelected={boxSelected}
                               navItems={navItems}
                               carouselShow={boxSelected != -1}
                               isBusy={isBusy}
                               fetchResults={fetchVishResults}
                               onNavItemSelected={id => this.dispatchAndSetState(selectNavItem(id))}
                               onContainedViewSelected={id => this.dispatchAndSetState(selectContainedView(id))}
                               onColsChanged={(id, parent, distribution) => this.dispatchAndSetState(changeCols(id, parent, distribution))}
                               onRowsChanged={(id, parent, column, distribution) => this.dispatchAndSetState(changeRows(id, parent, column, distribution))}
                               onBoxResized={(id, width, height) => this.dispatchAndSetState(resizeBox(id, width, height))}
                               onBoxMoved={(id, x, y, position) => this.dispatchAndSetState(moveBox(id, x, y, position))}
                               onVerticallyAlignBox={(id, verticalAlign) => this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                               onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                               onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                               onChangeSortableProps={(id, parent, prop, value) => this.dispatchAndSetState(changeSortableProps(id, parent, prop, value))}
                               onToolbarUpdated={(id, tab, accordion, name, value) => this.dispatchAndSetState(updateToolbar(id, tab, accordion, name, value))}
                               onToolbarIntermediateUpdated={(id, tab, accordion, name, value) => this.dispatchAndSetState(updateIntermediateToolbar(id, tab, accordion, name, value))}
                               onToolbarCollapsed={(id) => this.dispatchAndSetState(collapseToolbar(id))}
                               onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState( duplicateBox( id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendantBoxes(boxes[id]) ), Date.now()-1 ))}
                               onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendantBoxes(boxes[id]), this.getDescendantContainedViews(boxes[id])))}
                               onXMLEditorToggled={() => this.setState({xmlEditorVisible: !this.state.xmlEditorVisible})}
                               onRichMarksModalToggled={() => {
                                    this.setState({richMarksVisible: !this.state.richMarksVisible});
                                    if(this.state.richMarksVisible){
                                        this.setState({currentRichMark: null});
                                    }
                               }}
                               onRichMarkEditPressed={(mark) => {
                                    this.setState({currentRichMark: mark});
                               }}
                               onRichMarkDeleted={id => {
                                    let toolbar = toolbars[boxSelected];
                                    let state = JSON.parse(JSON.stringify(toolbar.state));
                                    delete state.__marks[id];
                                    Dali.Plugins.get(toolbar.config.name).forceUpdate(
                                        state,
                                        boxSelected,
                                        DELETE_RICH_MARK);
                               }}
                               onFetchVishResources={(query) => this.dispatchAndSetState(fetchVishResourcesAsync(query))}
                />
            </Grid>
            /* jshint ignore:end */
        );
    }

    dispatchAndSetState(actionCreator) {
        this.setState({lastAction: this.props.dispatch(actionCreator)});
    }

    componentDidMount() {
        Dali.Plugins.loadAll();
        Dali.API_Private.listenEmission(Dali.API_Private.events.render, e => {
            this.index = 0;
            let newPluginState = {};
            let navItemSelected = this.props.navItems[this.props.navItemSelected];
            if (e.detail.isUpdating) {
                this.parsePluginContainers(e.detail.content, newPluginState);
                e.detail.state.__pluginContainerIds = newPluginState;
                let reason = e.detail.reason;
                if (reason.type === ADD_RICH_MARK) {
                    this.dispatchAndSetState(reason);
                } else if (reason.type === EDIT_RICH_MARK) {
                    this.dispatchAndSetState(reason);
                } else {
                    this.dispatchAndSetState(updateBox(e.detail.ids.id, e.detail.content, e.detail.toolbar, e.detail.state));
                }
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
                if (e.detail.state.__xml_path) {
                    if (!navItemSelected.extraFiles[e.detail.ids.id] || navItemSelected.extraFiles[e.detail.ids.id] !== e.detail.state.__xml_path) {
                        this.dispatchAndSetState(updateNavItemExtraFiles(this.props.navItemSelected, e.detail.ids.id, e.detail.state.__xml_path));
                    }
                }
            } else {
                e.detail.ids.id = ID_PREFIX_BOX + Date.now();
                this.parsePluginContainers(e.detail.content, newPluginState);
                e.detail.state.__pluginContainerIds = newPluginState;
                this.dispatchAndSetState(addBox(
                    {
                        parent: e.detail.ids.parent,
                        id: e.detail.ids.id,
                        container: e.detail.ids.container
                    },
                    BOX_TYPES.NORMAL,
                    true,
                    (!(e.detail.ids.container.length && e.detail.ids.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1)),
                    e.detail.content,
                    e.detail.toolbar,
                    e.detail.config,
                    e.detail.state,
                    e.detail.initialParams));
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
                if (e.detail.state.__xml_path) {
                    if (!navItemSelected.extraFiles[e.detail.ids.id] || navItemSelected.extraFiles[e.detail.ids.id] !== e.detail.state.__xml_path) {
                        this.dispatchAndSetState(updateNavItemExtraFiles(this.props.navItemSelected, e.detail.ids.id, e.detail.state.__xml_path));
                    }
                }
            }
        });
        Dali.API_Private.listenEmission(Dali.API_Private.events.getPluginsInView, e => {
            let plugins = {};
            let ids = [];
            let view = e.detail.view ? e.detail.view : this.props.navItemSelected;

            this.props.navItems[view].boxes.map(id => {
                ids.push(id);
                ids = ids.concat(this.getDescendantBoxes(this.props.boxes[id]));
            });

            ids.map(id => {
                let toolbar = this.props.toolbars[id];
                if (e.detail.getAliasedPugins) {
                    if (id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                        let button = toolbar.controls.other.accordions['~extra'].buttons.alias;
                        if (button.value.length !== 0) {
                            if (!plugins[toolbar.config.name]) {
                                plugins[toolbar.config.name] = [];
                            }
                            plugins[toolbar.config.name].push(button.value);
                        }
                    }
                } else {
                    if (!plugins[toolbar.config.name]) {
                        plugins[toolbar.config.name] = true;
                    }
                }
            });

            Dali.API_Private.answer(Dali.API_Private.events.getPluginsInView, plugins);
        });
        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key === 90 && e.ctrlKey) {
                this.dispatchAndSetState(ActionCreators.undo());
            }
            if (key === 89 && e.ctrlKey) {
                this.dispatchAndSetState(ActionCreators.redo());
            }
            else if (key === 46) {
                let focus = document.activeElement.className;
                if (this.props.boxSelected !== -1 && this.props.boxSelected.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                    if (focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1) {
                        let box = this.props.boxes[this.props.boxSelected];
                        let toolbar = this.props.toolbars[this.props.boxSelected];
                        if (!toolbar.showTextEditor) {
                            this.dispatchAndSetState(deleteBox(box.id, box.parent, box.container, this.getDescendantBoxes(box), this.getDescendantContainedViews(box)));
                        }
                    }
                }
            }
        }.bind(this);
    }

    getDescendantViews(view){
        let selected = [];

        for(let i = 0; i < view.children.length; i++){
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
        for(let i = 0; i < box.containedViews.length; i++){
            let cv = box.containedViews[i];
            for(let j = 0; j < this.props.containedViews[cv].boxes.length; j++){
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
        for(let i = 0; i < box.containedViews.length; i++){
            let cv = box.containedViews[i];
            selected.push(cv);
            for(let j = 0; j < this.props.containedViews[cv].boxes.length; j++){
                selected = selected.concat(this.getDescendantContainedViews(this.props.boxes[this.props.containedViews[cv].boxes[j]]));
            }
        }

        return selected;
    }

    getDuplicatedBoxesIds(descendants) {
        var newIds = {};
        var date = Date.now();
        descendants.map(box => {
            newIds[box.substr(3)] = date++;
        });
        return newIds;
    }

    parsePluginContainers(obj, state) {
        if (obj.child) {
            for (let i = 0; i < obj.child.length; i++) {
                if (obj.child[i].tag && obj.child[i].tag === "plugin") {
                    if (obj.child.length > 1) {
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
                            style: {height: height}
                        };
                    } else {
                        if (!obj.attr.style) {
                            obj.attr.style = {height: height};
                        } else {
                            obj.attr.style.height = height;
                        }
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
                    obj.attr['plugin-data-id'] = ID_PREFIX_SORTABLE_CONTAINER + Date.now() + this.index++;
                }
                if (!obj.attr['plugin-data-height']) {
                    obj.attr['plugin-data-height'] = obj.attr['plugin-data-initial-height'] || (obj.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto");
                }
                if (obj.attr['plugin-data-key'] && !state[obj.attr['plugin-data-key']]) {
                    state[obj.attr['plugin-data-key']] = {
                        id: obj.attr['plugin-data-id'],
                        name: obj.attr['plugin-data-display-name'] || obj.attr['plugin-data-key'],
                        height: obj.attr['plugin-data-height']
                    };
                }
            }
        }
        if (obj.attr && obj.attr.class) {
            obj.attr.className = obj.attr.class.join(' ');
            delete obj.attr.class;
        }
    }

    addDefaultContainerPlugins(eventDetails, obj) {
        if (obj.child) {
            for (let i = 0; i < obj.child.length; i++) {
                this.addDefaultContainerPlugins(eventDetails, obj.child[i]);
            }
        }
        if (obj.tag && obj.tag === "plugin" && obj.attr['plugin-data-default']) {
            if (this.props.boxes[eventDetails.ids.id].sortableContainers[obj.attr['plugin-data-id']].children.length === 0) {
                obj.attr['plugin-data-default'].split(" ").map(name => {
                    if (!Dali.Plugins.get(name)) {
                        console.error("Plugin " + name + " does not exist");
                        return;
                    }
                    Dali.Plugins.get(name).getConfig().callback({
                        parent: eventDetails.ids.id,
                        container: obj.attr['plugin-data-id'],
                        isDefaultPlugin: true
                    }, ADD_BOX);
                });
            }
        }
    }

}


function mapStateToProps(state) {
    return {
        title: state.present.title,
        boxes: state.present.boxesById,
        boxesIds: state.present.boxesIds,
        boxSelected: state.present.boxSelected,
        boxLevelSelected: state.present.boxLevelSelected,
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
        fetchVishResults: state.present.fetchVishResults
    };
}

export default connect(mapStateToProps)(DaliApp);
