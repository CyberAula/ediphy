import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../../canvas/dali_box/DaliBox';
import DaliBoxSortable from '../../canvas/dali_box_sortable/DaliBoxSortable';
import DaliShortcuts from '../../canvas/dali_shortcuts/DaliShortcuts';
import {Col, Button} from 'react-bootstrap';
import DaliCanvasSli from '../../canvas/dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../../canvas/dali_canvas_doc/DaliCanvasDoc';
import {ADD_BOX} from '../../../actions';
import Dali from '../../../core/main';
import {isSortableBox, isSlide} from './../../../utils';

export default class ContainedCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
    }

    render() {
        let canvasContent;
        let containedViewSelected = this.props.containedViewSelected;
        if (containedViewSelected && containedViewSelected !== 0){
            if (isSlide(containedViewSelected.type)) {
                /* jshint ignore:start */
                canvasContent = (<DaliCanvasSli
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    canvasRatio={this.props.canvasRatio}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV={true}
                    lastActionDispatched={this.props.lastActionDispatched}
                    markCreatorId={this.props.markCreatorId}
                    onBoxAdded={this.props.onBoxAdded}
                    onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                    onBoxSelected={this.props.onBoxSelected}
                    onBoxMoved={this.props.onBoxMoved}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDropped={this.props.onBoxDropped}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onContainedViewSelected={this.props.onContainedViewSelected}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    title={this.props.title}
                    titleModeToggled={this.props.titleModeToggled}
                    toolbars={this.props.toolbars}
                    showCanvas={this.props.showCanvas}
                />);


                /* jshint ignore:end */
            }else{
                /* jshint ignore:start */
                canvasContent = (<DaliCanvasDoc
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV={true}
                    lastActionDispatched={this.props.lastActionDispatched}
                    markCreatorId={this.props.markCreatorId}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    onBoxAdded={this.props.onBoxAdded}
                    onBoxSelected={this.props.onBoxSelected}
                    onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                    onBoxMoved={this.props.onBoxMoved}
                    onBoxResized={this.props.onBoxResized}
                    onContainedViewSelected={this.props.onContainedViewSelected}
                    onSortableContainerResized={this.props.onSortableContainerResized}
                    onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                    onSortableContainerReordered={this.props.onSortableContainerReordered}
                    onBoxDropped={this.props.onBoxDropped}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    toolbars={this.props.toolbars}
                    showCanvas={this.props.showCanvas}
                    titleModeToggled={this.props.titleModeToggled}
                    title={this.props.title}
                />);
                /* jshint ignore:end */
            }
        } else {
            /* jshint ignore:start */
            canvasContent =   (<Col id="containedCanvas"
                                    md={12}
                                    xs={12}
                                    style={{
                                        height:"100%",
                                        padding: 0,
                                        display: this.props.containedViewSelected !== 0 ? 'initial' : 'none'
                                     }}></Col>);
            /* jshint ignore:end */
                
        }
        return (
            /* jshint ignore:start */
            canvasContent
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({showTitle: false});
        }
        /*if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById('contained_maincontent').scrollTop = 0;
        }*/
    }



    /*componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.floatingDaliBox',
            //overlap: 'pointer',
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
                    x: (event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('contained_maincontent').offsetLeft)/document.getElementById('containedCanvas').offsetWidth*100 + '%',
                    y: (event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('contained_maincontent').scrollTop)/document.getElementById('containedCanvas').offsetHeight*100 + '%',
                    type: 'absolute'
                };
                let initialParams = {
                    parent: this.props.containedViews[this.props.containedViewSelected].parent,
                    container: this.props.containedViewSelected,
                    position: position
                };
                Dali.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig().callback(initialParams, ADD_BOX);
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function (event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            }
        });
    }*/
}