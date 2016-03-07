import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {ActionCreators} from 'redux-undo';
import {Grid, Col, Row, Button, OverlayTrigger, Popover} from 'react-bootstrap';
import {addNavItem, selectNavItem, expandNavItem, removeNavItem,
    addBox, selectBox, moveBox, resizeBox, updateBox, deleteBox, reorderBox, addSortableContainer,
    togglePluginModal, togglePageModal, toggleTextEditor, toggleTitleMode,
    changeDisplayMode, exportStateAsync, importStateAsync, updateToolbar} from '../actions';
import {ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER, BOX_TYPES} from '../constants';
import DaliCanvas from '../components/DaliCanvas';
import DaliCarousel from '../components/DaliCarousel';
import BoxModal from '../components/BoxModal';
import PageModal from '../components/PageModal';
import PluginConfigModal from '../components/PluginConfigModal';
import PluginToolbar from '../components/PluginToolbar';
require('../sass/style.scss');

class DaliApp extends Component{

    render(){

        const{ dispatch, boxes, boxesIds, boxSelected, navItemsIds, navItems, navItemSelected,
            boxModalToggled, pageModalToggled, undoDisabled, redoDisabled, displayMode, isBusy, toolbars } = this.props;
        return(
            <Grid fluid={true} style={{height: '100%'}} >
                <Row style={{height: '100%'}}>
                    <Col md={2} xs={2} style={{padding: 0, height: '100%'}}>
                        <DaliCarousel boxes={boxes}
                                      navItemsIds={navItemsIds}
                                      navItems={navItems}
                                      navItemSelected={navItemSelected}
                                      displayMode={displayMode}
                                      onPageAdded={(caller, value) => dispatch(togglePageModal(caller, value))}
                                      onSectionAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))}
                                      onNavItemSelected={id => dispatch(selectNavItem(id))}
                                      onNavItemExpanded={(id, value) => dispatch(expandNavItem(id, value))}
                                      onNavItemRemoved={(ids, parent,boxes) => dispatch(removeNavItem(ids, parent, boxes))}
                                      onDisplayModeChanged={mode => dispatch(changeDisplayMode(mode))} />
                    </Col>

                    <Col md={10} xs={10} className="outter" style={{ padding:(navItems[navItemSelected].type!= "slide") ? '39px 0px 0px 0px' : '50px 0px 30px 0px '}} >
                        <DaliCanvas boxes={boxes}
                                    boxesIds={boxesIds}
                                    boxSelected={boxSelected}
                                    navItems={navItems}
                                    navItemSelected={navItems[navItemSelected]}
                                    showCanvas={(navItemsIds.length !== 0)}
                                    toolbars={toolbars}
                                    onBoxSelected={(id) => dispatch(selectBox(id))}
                                    onBoxMoved={(id, x, y) => dispatch(moveBox(id, x, y))}
                                    onBoxResized={(id, width, height) => dispatch(resizeBox(id, width, height))}
                                    onBoxDeleted={(id,parent) => dispatch(deleteBox(id, parent))} 
                                    onBoxReorder={(ids,parent) => dispatch(reorderBox(ids,parent))}
                                    onVisibilityToggled={(caller, fromSortable, container) => dispatch(togglePluginModal(caller, fromSortable, container))}
                                    onTextEditorToggled={(caller, value) => dispatch(toggleTextEditor(caller, value))}
                                    titleModeToggled={(id, value) => dispatch(toggleTitleMode(id, value))} />
                    </Col>
                </Row>
                <BoxModal caller={boxModalToggled.caller}
                          fromSortable={boxModalToggled.fromSortable}
                          container={boxModalToggled.container}
                          navItemSelected={navItemSelected}
                          onBoxAdded={(ids, type, draggable, resizable, content, toolbar, config, state) => dispatch(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                          onVisibilityToggled={(caller, fromSortable, container) => dispatch(togglePluginModal(caller, fromSortable, container))}/>
                <PageModal visibility={pageModalToggled.value}
                           caller={pageModalToggled.caller}
                           navItems={navItems}
                           navItemsIds={navItemsIds}
                           onBoxAdded={(ids, type,  draggable, resizable, content, toolbar, config, state) => dispatch(addBox(ids, type, draggable, resizable, content, toolbar, config, state))}
                           onVisibilityToggled={(caller, value) => dispatch(togglePageModal(caller, value))}
                           onPageAdded={(id, name, parent, children, level, type, position) => dispatch(addNavItem(id, name, parent, children, level, type, position))} />
                <PluginConfigModal />
                <div className="navBar">
                    <Col mdOffset={2} xsOffset={2}>
                        <button className="navButton" disabled={(navItemsIds.length === 0 ? true : false)} onClick={() => dispatch(togglePluginModal(navItemSelected, false, 0))}><i className="fa fa-plus fa-1 "></i>  Add</button>
                        <button className="navButton" disabled={undoDisabled} onClick={() => dispatch(ActionCreators.undo())}><i className="fa fa-mail-reply fa-1"></i>  Undo</button>
                        <button className="navButton" disabled={redoDisabled} onClick={() => dispatch(ActionCreators.redo())}><i className="fa fa-mail-forward fa-1 "></i>  Redo</button>
                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="is_busy_popover">{isBusy}</Popover>}>
                            <button  className="navButton" onClick={() => {
                                let state = this.props.store.getState();
                                dispatch(exportStateAsync(state));
                            }}><i className="fa fa-save fa-1 "></i>  Save</button>
                        </OverlayTrigger>
                        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="is_busy_popover">{isBusy}</Popover>}>
                            <button  className="navButton" onClick={() => {
                                dispatch(importStateAsync());
                            }}><i className="fa fa-folder-open fa-1 "></i>  Load</button>
                        </OverlayTrigger>
                    </Col>
                </div>
                <PluginToolbar toolbars={toolbars}
                               boxSelected={boxSelected}
                               onTextEditorToggled={(caller, value) => dispatch(toggleTextEditor(caller, value))}
                               onToolbarUpdated={(caller, index, name, value) => dispatch(updateToolbar(caller, index, name, value))} />
            </Grid>
        );
    }

    componentDidMount(){
        Dali.Plugins.loadAllAsync().then(values => {
            values.map((id, index) =>{
                Dali.Plugins.get(id).init();
            })
        });

        Dali.API.Private.listenEmission(Dali.API.Private.events.render, e => {
            if(e.detail.isUpdating) {
                this.props.dispatch(updateBox(e.detail.id, e.detail.content, e.detail.state));
            }else {
                let id = ID_PREFIX_BOX + Date.now();
                let parsedContent = e.detail.content.split(/(<plugin[-\w\s="']*\/>)/g).map((string, index) =>{
                    if(index % 2 === 0){
                        return string;
                    }

                    let pluginId;
                    try {
                        pluginId = /plugin-data-id=["|']([\w]*)["|']/g.exec(string)[1];
                    }catch(ex){
                        pluginId = Date.now() + "-" + index;
                        console.error("Plugin id not assignated");
                    }
                    return "<button style=\"width: 100%;height: 100%;background-color: transparent;border: 1px dotted black;\" onclick=\"Dali.API.addSubplugin('" + id + "',false,'" + pluginId + "'); event.stopPropagation();\"><i class=\"fa fa-plus\"></i></button>";
                }).join('');

                this.props.dispatch(addBox({
                    parent: this.props.boxModalToggled.caller,
                    id: id,
                    container: (this.props.boxModalToggled.fromSortable ? ID_PREFIX_SORTABLE_CONTAINER + Date.now() : this.props.boxModalToggled.container)
                }, BOX_TYPES.NORMAL, true, true, parsedContent, e.detail.toolbar, e.detail.config, e.detail.state));
            }

        });

        Dali.API.Private.listenEmission(Dali.API.Private.events.addSubplugin, e => {
           this.props.dispatch(togglePluginModal(e.detail.caller, e.detail.fromSortable, e.detail.container));
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
                let caja =  this.props.boxes[ this.props.boxSelected]
                let parent= caja.parent
                this.props.dispatch(deleteBox( this.props.boxSelected, parent ));
              }
          }  
        }.bind(this)
           
    }


}

function mapStateToProps(state){
    return{
        boxes: state.present.boxesById,
        boxesIds: state.present.boxes,
        boxSelected: state.present.boxSelected,
        navItemsIds: state.present.navItemsIds,
        navItems: state.present.navItemsById,
        navItemSelected: state.present.navItemSelected,
        boxModalToggled: state.present.boxModalToggled,
        pageModalToggled: state.present.pageModalToggled,
        undoDisabled: state.past.length === 0,
        redoDisabled: state.future.length === 0,
        displayMode: state.present.displayMode,
        toolbars: state.present.toolbarsById,
        isBusy: state.present.isBusy
    }
}

export default connect(mapStateToProps)(DaliApp);