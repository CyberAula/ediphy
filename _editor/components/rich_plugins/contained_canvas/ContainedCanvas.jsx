import React, { Component } from 'react';
import { Col } from 'react-bootstrap';
import DaliCanvasSli from '../../canvas/dali_canvas_sli/DaliCanvasSli';
import DaliCanvasDoc from '../../canvas/dali_canvas_doc/DaliCanvasDoc';
import { isSlide } from '../../../../common/utils';

/**
 * Container component to render contained views
 *
 */
export default class ContainedCanvas extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{showTitle: boolean}}
         */
        this.state = {
            showTitle: false,
        };
    }

    /**
     * Render React Component
     * @returns {*}
     */
    render() {
        let canvasContent;
        let containedViewSelected = this.props.containedViewSelected;
        if (containedViewSelected && containedViewSelected !== 0) {
            if (isSlide(containedViewSelected.type)) {
                canvasContent = (<DaliCanvasSli
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    canvasRatio={this.props.canvasRatio}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV
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
            } else {
                canvasContent = (<DaliCanvasDoc
                    addMarkShortcut={this.props.addMarkShortcut}
                    boxes={this.props.boxes}
                    boxSelected={this.props.boxSelected}
                    boxLevelSelected={this.props.boxLevelSelected}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    deleteMarkCreator={this.props.deleteMarkCreator}
                    fromCV
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
            }
        } else {
            canvasContent = (<Col id="containedCanvas"
                md={12}
                xs={12}
                style={{
                    height: "100%",
                    padding: 0,
                    display: this.props.containedViewSelected !== 0 ? 'initial' : 'none',
                }} />);

        }
        return (
            canvasContent
        );
    }

    /**
     * Before component receives props
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
    }

}
