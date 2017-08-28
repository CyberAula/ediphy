import React, { Component } from 'react';
import DaliCanvasSli from '../dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../dali_canvas_doc/DaliCanvasDoc';
import { REORDER_SORTABLE_CONTAINER } from '../../../../common/actions';
import { isSlide } from '../../../../common/utils';

require('./_canvas.scss');

/**
 * Container component to render documents or slides
 *
 */
export default class DaliCanvas extends Component {
    /**
     * Constructor
     * @param props React component props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React Component
     * @returns {code} React rendered component
     */
    render() {
        let canvasContent;
        if (isSlide(this.props.navItemSelected.type)) {
            canvasContent = <DaliCanvasSli
                addMarkShortcut={this.props.addMarkShortcut}
                boxes={this.props.boxes}
                boxSelected={this.props.boxSelected}
                boxLevelSelected={this.props.boxLevelSelected}
                canvasRatio={this.props.canvasRatio}
                containedViews={this.props.containedViews}
                containedViewSelected={this.props.containedViewSelected}
                deleteMarkCreator={this.props.deleteMarkCreator}
                fromCV={false}
                lastActionDispatched={this.props.lastActionDispatched}
                markCreatorId={this.props.markCreatorId}
                onBoxAdded={this.props.onBoxAdded}
                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                onBoxSelected={this.props.onBoxSelected}
                onBoxMoved={this.props.onBoxMoved}
                onBoxResized={this.props.onBoxResized}
                onBoxDropped={this.props.onBoxDropped}
                onBoxDeleted={this.props.onBoxDeleted}
                onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                onTextEditorToggled={this.props.onTextEditorToggled}
                onContainedViewSelected={this.props.onContainedViewSelected}
                navItems={this.props.navItems}
                navItemSelected={this.props.navItemSelected}
                title={this.props.title}
                titleModeToggled={this.props.titleModeToggled}
                toolbars={this.props.toolbars}
                showCanvas={this.props.showCanvas}
            />;
        }else{
            canvasContent = <DaliCanvasDoc
                addMarkShortcut={this.props.addMarkShortcut}
                boxes={this.props.boxes}
                boxSelected={this.props.boxSelected}
                boxLevelSelected={this.props.boxLevelSelected}
                containedViews={this.props.containedViews}
                containedViewSelected={this.props.containedViewSelected}
                deleteMarkCreator={this.props.deleteMarkCreator}
                fromCV={false}
                lastActionDispatched={this.props.lastActionDispatched}
                markCreatorId={this.props.markCreatorId}
                onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                onBoxAdded={this.props.onBoxAdded}
                onBoxSelected={this.props.onBoxSelected}
                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                onBoxMoved={this.props.onBoxMoved}
                onBoxResized={this.props.onBoxResized}
                onSortableContainerResized={this.props.onSortableContainerResized}
                onSortableContainerDeleted={this.props.onSortableContainerDeleted}
                onSortableContainerReordered={this.props.onSortableContainerReordered}
                onContainedViewSelected={this.props.onContainedViewSelected}
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
            />;
        }

        return (
            canvasContent
        );
    }

    /**
     * Before component receives props
     * Scrolls to top when the user changes to a different page
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.navItemSelected.id !== nextProps.navItemSelected.id) {
            document.getElementById('maincontent').scrollTop = 0;
        }
    }

    /**
     * After component updates
     * Fixes bug when reordering dalibox sortable CKEDITOR doesn't update otherwise
     * @param prevProps React previous props
     * @param prevState React previous state
     */
    componentDidUpdate(prevProps, prevState) {
        if(this.props.lastActionDispatched.type === REORDER_SORTABLE_CONTAINER) {
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].destroy();
            }
            CKEDITOR.inlineAll();
            for (let editor in CKEDITOR.instances) {
                if (this.props.toolbars[editor].state.__text) {
                    CKEDITOR.instances[editor].setData(decodeURI(this.props.toolbars[editor].state.__text));
                }
            }
        }
    }

}

