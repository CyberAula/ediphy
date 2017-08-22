import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../dali_box/DaliBox';
import DaliBoxSortable from '../dali_box_sortable/DaliBoxSortable';
import DaliShortcuts from '../dali_shortcuts/DaliShortcuts';
import { Col, Button } from 'react-bootstrap';
import DaliHeader from '../dali_header/DaliHeader';
import interact from 'interact.js';
import { ADD_BOX } from '../../../../common/actions';
import Dali from './../../../../core/main';
import { isSortableBox } from '../../../../common/utils';

export default class DaliCanvasDoc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false,
        };
    }

    render() {
        let titles = [];
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        if (itemSelected.id !== 0) {
            titles.push(itemSelected.name);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.navItems[parent].name);
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

        let overlayHeight = actualHeight ? actualHeight : '100%';
        /* let isSection = this.props.navItemSelected.id.toString().indexOf('se') !== -1;
        let contentAllowedInSections = Dali.Config.sections_have_content;
        let showCanvas = (!isSection || (isSection && contentAllowedInSections));*/
        let boxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;
        return (
            /* jshint ignore:start */

            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12} className="canvasDocClass"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>

                <div className="scrollcontainer" style={{ backgroundColor: show ? 'white' : 'transparent', display: show ? 'block' : 'none' }}>
                    <DaliHeader titles={titles}
                        showButtons={this.state.showTitle}
                        onShowTitle={()=>this.setState({ showTitle: true })}
                        onBoxSelected={this.props.onBoxSelected}
                        courseTitle={this.props.title}
                        title={itemSelected.name}
                        navItem={this.props.navItemSelected}
                        navItems={this.props.navItems}
                        containedView={this.props.containedViewSelected}
                        containedViews={this.props.containedViews}
                        titleModeToggled={this.props.titleModeToggled}
                        onUnitNumberChanged={this.props.onUnitNumberChanged}
                        toolbars={this.props.toolbars}
                        boxes={this.props.boxes}
                        showButton
                    />
                    <div className="outter canvaseditor" style={{ display: show ? 'block' : 'none' }}>
                        {/*
                    {this.props.fromCV ?  (<button className="btnOverBar cvBackButton" style={{margin: "10px 0px 0px 10px"}}
                             onClick={e => {
                                 this.props.onContainedViewSelected(0);
                                 e.stopPropagation();
                             }}><i className="material-icons">undo</i></button>):(<br/>)}
                     */}

                        <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={'doc_air'}
                            style={{ visibility: (show ? 'visible' : 'hidden') }}>

                            <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                                onClick={e => {
                                    this.props.onBoxSelected(-1);
                                    this.setState({ showTitle: false });
                                    e.stopPropagation();
                                }}
                                className={'innercanvas doc'}
                                style={{ visibility: (show ? 'visible' : 'hidden') }}>

                                <br/>

                                <div id={this.props.fromCV ? "contained_canvas_boxes" : "canvas_boxes"}
                                    style={{
                                        width: "100%",
                                        background: "black",
                                        height: overlayHeight,
                                        position: "absolute",
                                        top: 0,
                                        opacity: 0.4,
                                        display: (this.props.boxLevelSelected > 0) ? "block" : "none",
                                        visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                                    }} />

                                {boxes.map(id => {
                                    let box = boxes[id];
                                    if (!isSortableBox(id)) {
                                        return <DaliBox key={id}
                                            id={id}
                                            addMarkShortcut={this.props.addMarkShortcut}
                                            boxes={this.props.boxes}
                                            boxSelected={this.props.boxSelected}
                                            boxLevelSelected={this.props.boxLevelSelected}
                                            containedViews={this.props.containedViews}
                                            containedViewSelected={this.props.containedViewSelected}
                                            deleteMarkCreator={this.props.deleteMarkCreator}
                                            lastActionDispatched={this.props.lastActionDispatched}
                                            markCreatorId={this.props.markCreatorId}
                                            onBoxAdded={this.props.onBoxAdded}
                                            onBoxSelected={this.props.onBoxSelected}
                                            onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                            onBoxMoved={this.props.onBoxMoved}
                                            onBoxResized={this.props.onBoxResized}
                                            onSortableContainerResized={this.props.onSortableContainerResized}
                                            onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                            onBoxDropped={this.props.onBoxDropped}
                                            onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                            onBoxModalToggled={this.props.onBoxModalToggled}
                                            onTextEditorToggled={this.props.onTextEditorToggled}
                                            toolbars={this.props.toolbars}
                                            pageType={itemSelected.type || 0}/>;
                                    }
                                    return <DaliBoxSortable key={id}
                                        id={id}
                                        addMarkShortcut={this.props.addMarkShortcut}
                                        boxes={this.props.boxes}
                                        boxSelected={this.props.boxSelected}
                                        boxLevelSelected={this.props.boxLevelSelected}
                                        containedViews={this.props.containedViews}
                                        containedViewSelected={this.props.containedViewSelected}
                                        toolbars={this.props.toolbars}
                                        lastActionDispatched={this.props.lastActionDispatched}
                                        deleteMarkCreator={this.props.deleteMarkCreator}
                                        markCreatorId={this.props.markCreatorId}
                                        onBoxAdded={this.props.onBoxAdded}
                                        onBoxSelected={this.props.onBoxSelected}
                                        onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                        onBoxMoved={this.props.onBoxMoved}
                                        onBoxResized={this.props.onBoxResized}
                                        onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                        onSortableContainerResized={this.props.onSortableContainerResized}
                                        onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                                        onSortableContainerReordered={this.props.onSortableContainerReordered}
                                        onBoxDropped={this.props.onBoxDropped}
                                        onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                        onBoxModalToggled={this.props.onBoxModalToggled}
                                        onTextEditorToggled={this.props.onTextEditorToggled}
                                        pageType={itemSelected.type || 0}/>;

                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <DaliShortcuts
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    pointerEventsCallback={this.props.toolbars[this.props.boxSelected] && this.props.toolbars[this.props.boxSelected].config && this.props.toolbars[this.props.boxSelected].config.name && Dali.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name) ? Dali.Plugins.get(this.props.toolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    toolbar={this.props.toolbars[this.props.boxSelected]}/>
            </Col>
            /* jshint ignore:end */
        );
    }

    componentWillUnmount() {
        // interact(ReactDOM.findDOMNode(this)).unset();
    }

    componentDidMount() {
        /*
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.floatingDaliBox',
            overlap: 'pointer',
            ondropactivate: function (event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function (event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function (event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function (event) {
                let position = {
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('maincontent').offsetLeft)*100/event.target.parentElement.offsetWidth + "%",
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('maincontent').scrollTop) + 'px',
                    type: 'absolute'
                };
                let initialParams = {
                    parent: this.props.fromCV ? this.props.containedViewSelected.id:this.props.navItemSelected.id,
                    container: 0,
                    position: position
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });*/
    }

}
