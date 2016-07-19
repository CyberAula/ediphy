import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, reorderNavItem, changeSectionTitle,
    addBox, changeTitle, selectBox, moveBox, resizeBox, updateBox, duplicateBox, deleteBox, reorderBox, dropBox, increaseBoxLevel,
    addSortableContainer, resizeSortableContainer, changeCols, changeRows, changeSortableProps, 
    togglePageModal, toggleTextEditor, toggleTitleMode, 
    changeDisplayMode, exportStateAsync, importStateAsync, updateToolbar, collapseToolbar} from '../actions';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import PageModal from '../components/PageModal';
import PluginConfigModal from '../components/PluginConfigModal';
import XMLConfigModal from '../components/XMLConfigModal';
import PluginToolbar from '../components/PluginToolbar';
import Visor from '../components/visor/Visor';
import PluginRibbon from '../components/PluginRibbon';
import DaliNavBar from '../components/DaliNavBar';
import ServerFeedback from '../components/ServerFeedback';
require('../sass/style.scss');


class DaliApp extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            pluginTab: 'text',
            hideTab: 'show',
            visorVisible: false,
            xmlEditorVisible: false,
            carouselShow: true,
            serverModal: false,
            lastAction: "",
        };
    }

    render() {
        const { dispatch, boxes, boxesIds, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            pageModalToggled, undoDisabled, redoDisabled, displayMode, isBusy, toolbars, title } = this.props;
        let ribbonHeight = this.state.hideTab == 'hide' ? 0 : 47;
        return (
            <Grid id="app" fluid={true} style={{height: '100%'}}>
                <Row className="navBar">
                    <DaliNavBar isBusy={isBusy}
                                hideTab={this.state.hideTab}
                                undoDisabled={undoDisabled}
                                redoDisabled={redoDisabled}
                                navItemsIds={navItemsIds}
                                title={title}
                                changeTitle={(title) => this.dispatchAndSetState(changeTitle(title))}
                                navItemSelected={navItemSelected}
                                boxSelected={boxSelected}
                                undo={() => {this.dispatchAndSetState(ActionCreators.undo())}}
                                redo={() => {this.dispatchAndSetState(ActionCreators.redo())}}
                                visor={() =>{this.setState({visorVisible: true })}}
                                export={() => {DaliVisor.exports(this.props.store.getState().present)}}
                                scorm={() => {DaliVisor.exportScorm(this.props.store.getState().present)}}
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
                                  onDisplayModeChanged={mode => this.dispatchAndSetState(changeDisplayMode(mode))}
                                  carouselShow={this.state.carouselShow}
                                  onToggleWidth={()=>{
                                this.setState({carouselShow: !this.state.carouselShow})
                              }}/>

                    <Col id="colRight" xs={12} style={{height: '100%', width: (this.state.carouselShow? '83.333333%':'calc(100% - 80px)')}}>
                        <Row id="ribbonRow">
                            <PluginRibbon disabled={navItemsIds.length === 0 ? true : false}
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
                                          serverModalOpen={()=>{this.setState({serverModal: true })}} />
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
                                        onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                                        titleModeToggled={(id, value) => this.dispatchAndSetState(toggleTitleMode(id, value))}/>
                        </Row>
                    </Col>
                </Row>
                <ServerFeedback show={this.state.serverModal}
                                title={"Server"}
                                content={isBusy}
                                hideModal={() => this.setState({serverModal: false })} />
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
                                onXMLEditorToggled={() => this.setState({xmlEditorVisible: !this.state.xmlEditorVisible})} />

                <PluginToolbar top={(60+ribbonHeight)+'px'}
                               toolbars={toolbars}
                               box={boxes[boxSelected]}
                               boxSelected={boxSelected}
                               carouselShow={boxSelected != -1}
                               onColsChanged={(id, parent, distribution) => this.dispatchAndSetState(changeCols(id, parent, distribution))}
                               onRowsChanged={(id, parent, column, distribution) => this.dispatchAndSetState(changeRows(id, parent, column, distribution))}
                               onBoxResized={(id, width, height) => this.dispatchAndSetState(resizeBox(id, width, height))}
                               onBoxMoved={(id, x, y, position) => this.dispatchAndSetState(moveBox(id, x, y, position))}
                               onTextEditorToggled={(caller, value) => this.dispatchAndSetState(toggleTextEditor(caller, value))}
                               onSortableContainerResized={(id, parent, height) => this.dispatchAndSetState(resizeSortableContainer(id, parent, height))}
                               onChangeSortableProps={(id, parent, prop, value) => this.dispatchAndSetState(changeSortableProps(id, parent, prop, value))}
                               onToolbarUpdated={(id, tab, accordion, name, value) => this.dispatchAndSetState(updateToolbar(id, tab, accordion, name, value))}
                               onToolbarCollapsed={(id) => this.dispatchAndSetState(collapseToolbar(id))}
                               onBoxDuplicated={(id, parent, container)=> this.dispatchAndSetState( duplicateBox( id, parent, container, this.getDescendants(boxes[id]), this.getDuplicatedBoxesIds(this.getDescendants(boxes[id]) ), Date.now()-1 ))}
                               onBoxDeleted={(id, parent, container)=> this.dispatchAndSetState(deleteBox(id, parent, container, this.getDescendants(boxes[id])))}
                               onXMLEditorToggled={() => this.setState({xmlEditorVisible: !this.state.xmlEditorVisible})}
                />

            </Grid>
        );
    }

    dispatchAndSetState(actionCreator){
        this.setState({lastAction: this.props.dispatch(actionCreator)});
    }

    componentDidMount() {
        Dali.Plugins.loadAllAsync().then(pluginsLoaded => {
            pluginsLoaded.map((plugin) => {
                if (plugin) {
                    Dali.Plugins.get(plugin).init();
                }
            })
        });
        Dali.API.Private.listenEmission(Dali.API.Private.events.render, e => {
            this.index = 0;
            let newPluginState = {};
            if (e.detail.isUpdating) {
                this.parsePluginContainers(e.detail.content, newPluginState);
                e.detail.state["__pluginContainerIds"] = newPluginState;
                this.dispatchAndSetState(updateBox(e.detail.ids.id, e.detail.content, e.detail.toolbar, e.detail.state));
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
            } else {
                e.detail.ids.id = ID_PREFIX_BOX + Date.now();
                this.parsePluginContainers(e.detail.content, newPluginState);
                e.detail.state["__pluginContainerIds"] = newPluginState;
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
            }
        });
        Dali.API.Private.listenEmission(Dali.API.Private.events.getPluginsInView, e => {
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
                    if(id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                        let button = toolbar.controls.other.accordions['~extra'].buttons.alias;
                        if (button.value.length !== 0) {
                            if(!plugins[toolbar.config.name]){
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

            Dali.API.Private.answer(Dali.API.Private.events.getPluginsInView, plugins);
        });
        window.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 90 && e.ctrlKey) {
                this.dispatchAndSetState(ActionCreators.undo())
            }
            if (key == 89 && e.ctrlKey) {
                this.dispatchAndSetState(ActionCreators.redo())
            }
            else if (key == 46) {
              let focus = document.activeElement.className;
              if (this.props.boxSelected != -1 && boxSelected.indexOf(ID_PREFIX_SORTABLE_BOX) == -1)  {
                if( focus.indexOf('form-control') == -1 && focus.indexOf('tituloCurso') == -1 && focus.indexOf('cke_editable') == -1) {
                  let box = this.props.boxes[this.props.boxSelected];
                  let toolbar = this.props.toolbars[this.props.boxSelected];
                  if(!toolbar.showTextEditor){
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
        return newIds
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
                        } else if (child.attr['plugin-data-initialHeight']) {
                            height = child.attr['plugin-data-initialHeight'];
                        } else {
                            height = child.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto";
                        }
                    }
                    if (!obj.attr) {
                        obj.attr = {
                            style: {height: height}
                        }
                    } else {
                        if (!obj.attr.style) {
                            obj.attr.style = {height: height}
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
                } else {

                }
                if (!obj.attr['plugin-data-height']) {
                    obj.attr['plugin-data-height'] = obj.attr['plugin-data-initialHeight'] || (obj.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "100px");
                }
                if (obj.attr['plugin-data-key'] && !state[obj.attr['plugin-data-key']]) {
                    state[obj.attr['plugin-data-key']] = {
                        id: obj.attr['plugin-data-id'],
                        height: obj.attr['plugin-data-height']
                    }
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
                })
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
        isBusy: state.present.isBusy
    }
}

export default connect(mapStateToProps)(DaliApp);