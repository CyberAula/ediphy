import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, reorderNavItem, toggleNavItem, updateNavItemExtraFiles,
    changeSectionTitle, changeUnitNumber,
    addBox, changeTitle, selectBox, moveBox, resizeBox, updateBox, duplicateBox, deleteBox, reorderBox, dropBox, increaseBoxLevel,
    resizeSortableContainer, changeCols, changeRows, changeSortableProps, reorderBoxes, verticallyAlignBox,
    togglePageModal, toggleTextEditor, toggleTitleMode,
    changeDisplayMode, updateToolbar, updateIntermediateToolbar, collapseToolbar,
    exportStateAsync, importStateAsync,
    fetchVishResourcesSuccess, fetchVishResourcesAsync} from '../actions';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import PageModal from '../components/PageModal';
import PluginConfigModal from '../components/PluginConfigModal';
import XMLConfigModal from '../components/XMLConfigModal';
import VishSearcher from '../components/VishSearcherModal';
import PluginToolbar from '../components/PluginToolbar';
import Visor from '../components/visor/Visor';
import PluginRibbon from '../components/PluginRibbon';
import DaliNavBar from '../components/DaliNavBar';
import ServerFeedback from '../components/ServerFeedback';
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
            carouselShow: true,
            carouselFull: false,
            serverModal: false,
            lastAction: ""
        };
    }

    render() {
        const { dispatch, boxes, boxesIds, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            pageModalToggled, undoDisabled, redoDisabled, displayMode, isBusy, toolbars, title, fetchVishResults } = this.props;
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
                                setcat={(categoria) => {
                                 /* if(this.state.pluginTab == categoria && this.state.hideTab == 'show'){
                                      this.setState({ hideTab:'hide'})
                                  } else {*/
                                      this.setState({ pluginTab: categoria, hideTab:'show' });
                                 /* }*/
                              }}/>
                </Row>
                <Row style={{height: 'calc(100% - 60px)'}}>
                    <DaliCarousel boxes={boxes}
                                  title={title}
                                  navItemsIds={navItemsIds}
                                  navItems={navItems}
                                  navItemSelected={navItemSelected}
                                  displayMode={displayMode}
                                  onBoxAdded={(ids, type,  draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                                  onPageAdded={(caller, value) => this.dispatchAndSetState(togglePageModal(caller, value))}
                                  onTitleChange={(id, title) => this.dispatchAndSetState(changeSectionTitle(id,title))}
                                  onSectionAdded={(id, name, parent, children, level, type, position, titlesReduced) => this.dispatchAndSetState(addNavItem(id, name, parent, children, level, type, position, titlesReduced))}
                                  onNavItemSelected={id => this.dispatchAndSetState(selectNavItem(id))}
                                  onNavItemExpanded={(id, value) => this.dispatchAndSetState(expandNavItem(id, value))}
                                  onNavItemRemoved={(ids, parent, boxes) => {
                                    // if(navItemsIds.length == ids.length){
                                    //  this.setState({hideTab: 'hide'})
                                    // }
                                    this.dispatchAndSetState(removeNavItem(ids, parent, boxes));
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
                                          navItemSelected={navItemSelected}
                                          onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState( duplicateBox( id, parent, container, this.getDescendants(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendants(boxes[id]) ), Date.now()-1 ))}
                                          boxSelected={(boxSelected && boxSelected != -1) ? boxes[boxSelected] : -1}
                                          category={this.state.pluginTab}
                                          hideTab={this.state.hideTab}
                                          undoDisabled={undoDisabled}
                                          redoDisabled={redoDisabled}
                                          undo={() => {this.dispatchAndSetState(ActionCreators.undo())}}
                                          redo={() => {this.dispatchAndSetState(ActionCreators.redo())}}
                                          save={() => {this.dispatchAndSetState(exportStateAsync({present: this.props.store.getState().present}))}}
                                          ribbonHeight={ribbonHeight+'px'}
                                          serverModalOpen={()=>{this.setState({serverModal: true })}}/>
                        </Row>
                        <Row id="canvasRow" style={{height: 'calc(100% - '+ribbonHeight+'px)'}}>
                            <DaliCanvas boxes={boxes}
                                        boxesIds={boxesIds}
                                        boxSelected={boxSelected}
                                        boxLevelSelected={boxLevelSelected}
                                        navItems={navItems}
                                        navItemSelected={navItems[navItemSelected]}
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
                                        onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendants(boxes[id])))}
                                        onVerticallyAlignBox={(id, verticalAlign)=>this.dispatchAndSetState(verticallyAlignBox(id, verticalAlign))}
                                        onUnitNumberChanged={(id, value) => this.dispatchAndSetState(changeUnitNumber(id, value))}
                                        onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                        onBoxesInsideSortableReorder={(parent, container, order) => {this.dispatchAndSetState(reorderBoxes(parent, container, order))}}
                                        titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}/>
                        </Row>
                    </Col>
                </Row>
                <ServerFeedback show={this.state.serverModal}
                                title={"Server"}
                                isBusy={isBusy}
                                hideModal={() => this.setState({serverModal: false })}/>
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           navItems={navItems}
                           navItemsIds={navItemsIds}
                           onBoxAdded={(ids, type,  draggable, resizable, content, toolbar, config, state) => this.dispatchAndSetState(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                           onVisibilityToggled={(caller, value) => this.dispatchAndSetState(togglePageModal(caller, value))}
                           onPageAdded={(id, name, parent, children, level, type, position, titlesReduced) => this.dispatchAndSetState(addNavItem(id, name, parent, children, level, type, position, titlesReduced))}/>
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
                <PluginToolbar top={(60+ribbonHeight)+'px'}
                               toolbars={toolbars}
                               box={boxes[boxSelected]}
                               boxSelected={boxSelected}
                               carouselShow={boxSelected != -1}
                               isBusy={isBusy}
                               fetchResults={fetchVishResults}
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
                               onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState( duplicateBox( id, parent, container, this.getDescendants(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendants(boxes[id]) ), Date.now()-1 ))}
                               onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendants(boxes[id])))}
                               onXMLEditorToggled={() => this.setState({xmlEditorVisible: !this.state.xmlEditorVisible})}
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
                this.dispatchAndSetState(updateBox(e.detail.ids.id, e.detail.content, e.detail.toolbar, e.detail.state));
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
                if(e.detail.state.__xml_path){
                    if(!navItemSelected.extraFiles[e.detail.ids.id] || navItemSelected.extraFiles[e.detail.ids.id] !== e.detail.state.__xml_path){
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
                    (e.detail.ids.container === 0),
                    e.detail.content,
                    e.detail.toolbar,
                    e.detail.config,
                    e.detail.state,
                    e.detail.initialParams));
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
                if(e.detail.state.__xml_path){
                    if(!navItemSelected.extraFiles[e.detail.ids.id] || navItemSelected.extraFiles[e.detail.ids.id] !== e.detail.state.__xml_path){
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
                ids = ids.concat(this.getDescendants(this.props.boxes[id]));
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
                            this.dispatchAndSetState(deleteBox(box.id, box.parent, box.container, this.getDescendants(box)));
                        }
                    }
                }
            }
        }.bind(this);
    }

    getDescendants(box) {
        let selected = [];

        for (let i = 0; i < box.children.length; i++) {
            for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                selected.push(box.sortableContainers[box.children[i]].children[j]);
                selected = selected.concat(this.getDescendants(this.props.boxes[box.sortableContainers[box.children[i]].children[j]]));
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
                    });
                });
            }
        }
    }

}


function mapStateToProps(state) {
    return {
        title: state.present.title,
        boxes: state.present.boxesById,
        boxesIds: state.present.boxes,
        boxSelected: state.present.boxSelected,
        boxLevelSelected: state.present.boxLevelSelected,
        navItemsIds: state.present.navItemsIds,
        navItems: state.present.navItemsById,
        navItemSelected: state.present.navItemSelected,
        pageModalToggled: state.present.pageModalToggled,
        undoDisabled: state.past.length === 0,
        redoDisabled: state.future.length === 0,
        displayMode: state.present.displayMode,
        toolbars: state.present.toolbarsById,
        isBusy: state.present.isBusy,
        fetchVishResults: state.present.fetchVishResults
    };
}

export default connect(mapStateToProps)(DaliApp);
