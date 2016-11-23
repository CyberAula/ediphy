import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliBox from '../DaliBox';
import DaliBoxSortable from '../DaliBoxSortable';
import DaliShortcuts from '../DaliShortcuts';
import {Col, Button} from 'react-bootstrap';
import interact from 'interact.js';
import {ADD_BOX} from '../../actions';
import {ID_PREFIX_SORTABLE_BOX} from '../../constants';
import Dali from '../../core/main';

export default class ContainedCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
    }

    render() {
        let containedView = this.props.containedViews[this.props.containedViewSelected];
        if (!containedView) {
            containedView = {boxes: []};
        }

        let paddings = /*(this.props.navItemSelected.type!= "slide") ? (*/'5px 5px 5px 5px';
        /*) : ('30px 0px 30px 0px')*/

        /*
         let maincontent = document.getElementById('maincontent');
         let actualHeight;
         if (maincontent) {
         actualHeight = parseInt(maincontent.scrollHeight);
         actualHeight = (parseInt(maincontent.clientHeight) < actualHeight) ? (actualHeight) + 'px' : '100%';
         }

         let overlayHeight = actualHeight ? actualHeight : '100%';
         */
        let overlayHeight = '100%';

        return (
            /* jshint ignore:start */
            <Col id="containedCanvas"
                 md={12}
                 xs={12}
                 style={{
                    height:"100%",
                    padding: 0,
                    display: this.props.containedViewSelected !== 0 ? 'initial' : 'none'
                 }}>
                <div className="outter canvaseditor"
                     style={{position: 'absolute', width: '100%', height:'100%', padding: (paddings)}}>
                    <div id="contained_maincontent"
                         onClick={e => {
                            this.props.onBoxSelected(-1);
                            e.stopPropagation();
                         }}
                         className={containedView.type === 'slide' ? 'innercanvas sli':'innercanvas doc'}>

                        <Button style={{margin: "10px 0px 0px 10px"}}
                                onClick={e => {
                                    this.props.onContainedViewSelected(0);
                                    e.stopPropagation();
                                }}>X</Button>

                        <DaliShortcuts
                            box={this.props.boxes[this.props.boxSelected]}
                            containedViewSelected={this.props.containedViewSelected}
                            isContained={true}
                            onTextEditorToggled={this.props.onTextEditorToggled}
                            onBoxResized={this.props.onBoxResized}
                            onBoxDeleted={this.props.onBoxDeleted}
                            toolbar={this.props.toolbars[this.props.boxSelected]}/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse"
                            }}>
                        </div>
                        {containedView.boxes.map(id => {
                            let box = this.props.boxes[id];
                            if (box.id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                                return <DaliBox key={id}
                                                id={id}
                                                boxes={this.props.boxes}
                                                boxSelected={this.props.boxSelected}
                                                boxLevelSelected={this.props.boxLevelSelected}
                                                containedViewSelected={this.props.containedViewSelected}
                                                toolbars={this.props.toolbars}
                                                lastActionDispatched={this.props.lastActionDispatched}
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
                                />
                            } else {
                                return <DaliBoxSortable key={id}
                                                        id={id}
                                                        boxes={this.props.boxes}
                                                        boxSelected={this.props.boxSelected}
                                                        boxLevelSelected={this.props.boxLevelSelected}
                                                        containedViewSelected={this.props.containedViewSelected}
                                                        toolbars={this.props.toolbars}
                                                        lastActionDispatched={this.props.lastActionDispatched}
                                                        onBoxSelected={this.props.onBoxSelected}
                                                        onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                                        onBoxMoved={this.props.onBoxMoved}
                                                        onBoxResized={this.props.onBoxResized}
                                                        onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                                        onSortableContainerResized={this.props.onSortableContainerResized}
                                                        onBoxReorder={this.props.onBoxReorder}
                                                        onBoxDropped={this.props.onBoxDropped}
                                                        onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                                        onBoxModalToggled={this.props.onBoxModalToggled}
                                                        onTextEditorToggled={this.props.onTextEditorToggled}/>
                            }
                        })}
                    </div>
                </div>
            </Col>
            /* jshint ignore:end */
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({showTitle: false});
        }
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this)).dropzone({
            accept: '.rib',
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
                    x: event.dragEvent.clientX - event.target.getBoundingClientRect().left - document.getElementById('contained_maincontent').offsetLeft,
                    y: event.dragEvent.clientY - event.target.getBoundingClientRect().top + document.getElementById('contained_maincontent').scrollTop,
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
    }
}