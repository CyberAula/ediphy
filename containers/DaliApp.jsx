import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem, reorderNavItem,
    addBox, selectBox, moveBox, resizeBox, updateBox, deleteBox, reorderBox, dropBox, increaseBoxLevel,
    addSortableContainer, resizeSortableContainer, changeCols, changeRows,
    togglePageModal, toggleTextEditor, toggleTitleMode,
    changeDisplayMode, exportStateAsync, importStateAsync, updateToolbar, collapseToolbar} from '../actions';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import PageModal from '../components/PageModal';
import PluginConfigModal from '../components/PluginConfigModal';
import PluginToolbar from '../components/PluginToolbar';
import Visor from '../components/visor/Visor';
import PluginRibbon from '../components/PluginRibbon';
import DaliNavBar from '../components/DaliNavBar';
require('../sass/style.scss');

class DaliApp extends Component{
    constructor(props) {
        super(props);
        this.index = 0;
        this.state = {
            pluginTab: 'all',
            hideTab: 'hide',
            visor: false,
            carouselShow: true
        };
    }
    render(){
        const{ dispatch, boxes, boxesIds, boxSelected, boxLevelSelected, navItemsIds, navItems, navItemSelected,
            pageModalToggled, undoDisabled, redoDisabled, displayMode, isBusy, toolbars } = this.props;
            var ribbonHeight = this.state.hideTab == 'hide' ? '0px' : '60px';
        return(
            <Grid id="app" fluid={true} style={{height: '100%'}} >
               <Row className="navBar">
                  <DaliNavBar isBusy={isBusy}
                              hideTab = {this.state.hideTab}
                              undoDisabled = {undoDisabled}
                              redoDisabled = {redoDisabled}
                              navItemsIds = {navItemsIds}
                              navItemSelected = {navItemSelected}
                              boxSelected = {boxSelected}
                              undo = {() => {dispatch(ActionCreators.undo())}}
                              redo = {() => {dispatch(ActionCreators.redo())}}
                              visor = {() =>{this.setState({visor:true })}}
                              export = {() => {DaliVisor.exports(this.props.store.getState())}}
                              scorm = {() => {DaliScorm.exports(this.props.store.getState())}}
                              save = {() => {dispatch(exportStateAsync(this.props.store.getState()))}}
                              categoria={this.state.pluginTab}
                              opens = {() => {dispatch(importStateAsync())}}
                              setcat={(categoria) => {
                                  if(this.state.pluginTab == categoria && this.state.hideTab == 'show'){
                                      this.setState({ hideTab:'hide'})
                                  } else {
                                      this.setState({pluginTab:categoria, hideTab:'show'})
                                  }
                              }}/>
              </Row>
              <Row style={{height: 'calc(100% - 39px)'}}>
                <DaliCarousel boxes={boxes}
                              navItemsIds={navItemsIds}
                              navItems={navItems}
                              navItemSelected={navItemSelected}
                              displayMode={displayMode}
                              onPageAdded={(caller, value) => dispatch(togglePageModal(caller, value))}
                              onSectionAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))}
                              onNavItemSelected={id => dispatch(selectNavItem(id))}
                              onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                              onNavItemRemoved={(ids, parent,boxes) => {
                                if(navItemsIds.length == ids.length){
                                  this.setState({hideTab: 'hide'})
                                }
                                dispatch(removeNavItem(ids, parent, boxes));
                              }}
                              onNavItemReorded={(itemId,newParent,type,newIndId,newChildrenInOrder) => dispatch(reorderNavItem(itemId,newParent,type,newIndId,newChildrenInOrder))}
                              onDisplayModeChanged={mode => dispatch(changeDisplayMode(mode))} 
                              carouselShow={this.state.carouselShow}
                              onToggleWidth={()=>{
                                this.setState({carouselShow: !this.state.carouselShow})
                              }}  />

                <Col  id="colRight"  xs={this.state.carouselShow? 10:12}  style={{height: '100%'}}>
                  <Row id="ribbonRow">
                    <PluginRibbon disabled = {navItemsIds.length === 0 ? true : false}
                                navItemSelected={navItemSelected}
                                category={this.state.pluginTab}
                                hideTab={this.state.hideTab} 
                                ribbonHeight={ribbonHeight}/>
                  </Row>
                  <Row id="canvasRow" style={{height: 'calc(100% - '+ribbonHeight+')'}} > 
                    <DaliCanvas boxes={boxes}
                                  boxesIds={boxesIds}
                                  boxSelected={boxSelected}
                                  boxLevelSelected={boxLevelSelected}
                                  navItems={navItems}
                                  navItemSelected={navItems[navItemSelected]}
                                  showCanvas={(navItemsIds.length !== 0)}
                                  toolbars={toolbars}
                                  onBoxSelected={(id) => dispatch(selectBox(id))}
                                  onBoxLevelIncreased={() => dispatch(increaseBoxLevel())}
                                  onBoxMoved={(id, x, y) => dispatch(moveBox(id, x, y))}
                                  onBoxResized={(id, width, height) => dispatch(resizeBox(id, width, height))}
                                  onSortableContainerResized={(id, parent, height) => dispatch(resizeSortableContainer(id, parent, height))}
                                  onBoxReorder={(ids, parent) => dispatch(reorderBox(ids, parent))}
                                  onBoxDropped={(id, row, col) => dispatch(dropBox(id, row, col))}
                                  onTextEditorToggled={(caller, value, text) => dispatch(toggleTextEditor(caller, value, text))}
                                  titleModeToggled={(id, value) => dispatch(toggleTitleMode(id, value))}  />
                  </Row>
                </Col>
               </Row>
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           navItems={navItems}
                           navItemsIds={navItemsIds}
                           onBoxAdded={(ids, type,  draggable, resizable, content, toolbar, config, state) => dispatch(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                           onVisibilityToggled={(caller, value) => dispatch(togglePageModal(caller, value))}
                           onPageAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))} />
                <Visor id="visor"
                       visor={this.state.visor}
                       onVisibilityToggled={()=> this.setState({visor:!this.state.visor })}
                       state={this.props.store.getState().present} />
                <PluginConfigModal />

                <PluginToolbar toolbars={toolbars}
                               box={boxes[boxSelected]}
                               boxSelected={boxSelected}
                               onColsChanged={(id, parent, distribution) => dispatch(changeCols(id, parent, distribution))}
                               onRowsChanged={(id, parent, column, distribution) => dispatch(changeRows(id, parent, column, distribution))}
                               onBoxResized={(id, width, height) => dispatch(resizeBox(id, width, height))}
                               onTextEditorToggled={(caller, value, text) => dispatch(toggleTextEditor(caller, value, text))}
                               onToolbarUpdated={(id, tab, accordion, name, value) => dispatch(updateToolbar(id, tab, accordion, name, value))}
                               onToolbarCollapsed={(id) => dispatch(collapseToolbar(id))}
                               onBoxDeleted={()=> this.props.dispatch(deleteBox(boxSelected, boxes[boxSelected].parent, boxes[boxSelected].container, this.getDescendants(boxes[boxSelected]))) } />
            </Grid>
        );
    }

    componentWillReceiveProps(nextProps){
        if(this.props.navItemsIds.length !== 0 && nextProps.navItemsIds.length === 0){
            this.setState({hideTab: 'hide'})
        }
    }

    componentDidMount(){
        Dali.Plugins.loadAllAsync().then(pluginsLoaded => {
            pluginsLoaded.map((plugin) => {
                Dali.Plugins.get(plugin).init();
            })
        });

        Dali.API.Private.listenEmission(Dali.API.Private.events.render, e => {
            if(e.detail.isUpdating) {
                this.index = 0;
                this.parsePluginContainers(e.detail.content, e.detail.state);
                this.props.dispatch(updateBox(e.detail.ids.id, e.detail.content, e.detail.state));
                this.addDefaultContainerPlugins(e.detail, e.detail.content);
            }else {
                e.detail.ids.id = ID_PREFIX_BOX + Date.now();
                this.index = 0;
                this.parsePluginContainers(e.detail.content, e.detail.state);
                this.props.dispatch(addBox(
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

        window.onkeyup = function(e) {
          var key = e.keyCode ? e.keyCode : e.which;
          if (key == 90 && e.ctrlKey){
            this.props.dispatch(ActionCreators.undo())
          }
          if (key == 89 && e.ctrlKey){
            this.props.dispatch(ActionCreators.redo())
          }
          else if (key == 46) {
              if ( this.props.boxSelected != -1){
                let box =  this.props.boxes[ this.props.boxSelected];
                this.props.dispatch(deleteBox(box.id, box.parent, box.container, this.getDescendants(box)));
              }
          }  
        }.bind(this);
    }

    getDescendants(box){
        let selected = [];

        if(box.children) {
            for (let i = 0; i < box.children.length; i++) {
                for (let j = 0; j < box.sortableContainers[box.children[i]].children.length; j++) {
                    selected.push(box.sortableContainers[box.children[i]].children[j]);
                    selected = selected.concat(this.getDescendants(this.props.boxes[box.sortableContainers[box.children[i]].children[j]]));
                }
            }
        }
        return selected;
    }

    parsePluginContainers(obj, state){
        if(obj.child){
            for(let i = 0; i < obj.child.length; i++){
                this.parsePluginContainers(obj.child[i], state);
            }
        }
        if(obj.tag && obj.tag === "plugin"){
            if(obj.attr && !obj.attr['plugin-data-id']){
                obj.attr['plugin-data-id'] = ID_PREFIX_SORTABLE_CONTAINER + Date.now() + this.index++;
            }
            if(obj.attr['plugin-data-key'] && !state['__pluginContainerIds'][obj.attr['plugin-data-key']]){
                state['__pluginContainerIds'][obj.attr['plugin-data-key']] = {
                    id: obj.attr['plugin-data-id'],
                    height: parseInt(obj.attr['plugin-data-initialHeight']) || 150
                }
            }
        }
        if(obj.attr && obj.attr.class){
            obj.attr.className = obj.attr.class.join(' ');
            delete obj.attr.class;
        }
    }

    addDefaultContainerPlugins(eventDetails, obj){
        if(obj.child){
            for(let i = 0; i < obj.child.length; i++){
                this.addDefaultContainerPlugins(eventDetails, obj.child[i]);
            }
        }
        if(obj.tag && obj.tag === "plugin" && obj.attr['plugin-data-default']) {
            obj.attr['plugin-data-default'].split(" ").map(name => {
                if(!this.props.boxes[eventDetails.ids.id].sortableContainers[obj.attr['plugin-data-id']]) {
                    if(!Dali.Plugins.get(name)){
                        console.error("Plugin " + name + " does not exist");
                        return;
                    }
                    Dali.Plugins.get(name).getConfig().callback({
                        parent: eventDetails.ids.id,
                        container: obj.attr['plugin-data-id'],
                    });
                }
            })
        }
    }
}

function mapStateToProps(state){
    return{
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