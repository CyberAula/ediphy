import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import DaliCanvasSli from '../dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../dali_canvas_doc/DaliCanvasDoc';
import interact from 'interact.js';
import {ADD_BOX,REORDER_SORTABLE_CONTAINER} from '../../../actions';
import Dali from './../../../core/main';
import {isSlide} from './../../../utils';

require('./_canvas.scss');

export default class DaliCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showTitle: false
        };
    }

    render() {


        let canvasContent;
        if (isSlide(this.props.navItemSelected.type)) {
            /* jshint ignore:start */
            canvasContent = <DaliCanvasSli navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           lastActionDispatched={this.props.lastActionDispatched}
                                           onBoxSelected={this.props.onBoxSelected}
                                           onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                           onBoxMoved={this.props.onBoxMoved}
                                           onBoxResized={this.props.onBoxResized}
                                           onBoxDropped={this.props.onBoxDropped}
                                           onBoxDeleted={this.props.onBoxDeleted}
                                           onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                           onTextEditorToggled={this.props.onTextEditorToggled}
                                           titleModeToggled={this.props.titleModeToggled}
                                           showCanvas={this.props.showCanvas}
                                           containedViewSelected={this.props.containedViewSelected}/>;

            /* jshint ignore:end */
        }else{
            /* jshint ignore:start */
            canvasContent = <DaliCanvasDoc navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           lastActionDispatched={this.props.lastActionDispatched}
                                           onBoxSelected={this.props.onBoxSelected}
                                           onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                           onBoxMoved={this.props.onBoxMoved}
                                           onBoxResized={this.props.onBoxResized}
                                           onSortableContainerResized={this.props.onSortableContainerResized}
                                           onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                                           onSortableContainerReordered={this.props.onSortableContainerReordered}
                                           onBoxDropped={this.props.onBoxDropped}
                                           onBoxDeleted={this.props.onBoxDeleted}
                                           onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                           onTextEditorToggled={this.props.onTextEditorToggled}
                                           onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                           titleModeToggled={this.props.titleModeToggled}
                                           showCanvas={this.props.showCanvas}
                                           containedViewSelected={this.props.containedViewSelected}/>;
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
        if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        //Fixes bug when reordering dalibox sortable CKEDITOR doesn't update otherwise
        if(this.props.lastActionDispatched.type === REORDER_SORTABLE_CONTAINER){
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances){
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
    }

}

