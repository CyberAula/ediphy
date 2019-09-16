import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';

import Ediphy from '../../../../core/editor/main';
import EditorBox from '../editorBox/EditorBox';
import { RESIZE_SORTABLE_CONTAINER } from '../../../../common/actions';
import { isSortableContainer } from '../../../../common/utils';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';

import './_pluginPlaceHolder.scss';
import Cell from "./Cell";

export default class PluginPlaceholder extends Component {

    state = {
        alert: null,
    };

    render() {
        let container = this.props.parentBox.sortableContainers[this.idConvert(this.props.pluginContainer)] || {};
        let className = "drg" + this.idConvert(this.props.pluginContainer);
        container.style = container.style || {};
        return (
            <div style={
                Object.assign({}, {
                    width: "100%",
                    height: container.height ? (container.height === 'auto' ? container.height : container.height + 'px') : "",
                    minHeight: '2.3em',
                    textAlign: 'center',
                    lineHeight: '100%',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'table',
                }, container.style)
            }
            id={this.idConvert(this.props.pluginContainer)}
            className={className}>
                {container.colDistribution ? container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (<div key={i}
                            style={{ width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top" }}>
                            {container.cols[i].map((row, j) => {
                                return (
                                    <Cell
                                        {...this.props}
                                        keyCell={j}
                                        row={row}
                                        boxSelected={this.props.boxSelected}
                                        container={container}
                                        extraParams={{ i: i, j: j }}>
                                        {this.state.alert}
                                        {container.children.map((idBox, index) => {
                                            if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                                return (<EditorBox id={idBox}
                                                    key={index}
                                                    boxes={this.props.boxes}
                                                    handleBoxes={this.props.handleBoxes}
                                                    handleMarks={this.props.handleMarks}
                                                    boxSelected={this.props.boxSelected}
                                                    boxLevelSelected={this.props.boxLevelSelected}
                                                    containedViewSelected={this.props.containedViewSelected}
                                                    pluginToolbars={this.props.pluginToolbars}
                                                    lastActionDispatched={this.props.lastActionDispatched}
                                                    markCreatorId={this.props.markCreatorId}
                                                    onSortableContainerResized={this.props.onSortableContainerResized}
                                                    onToolbarUpdated={this.props.onToolbarUpdated}
                                                    page={this.props.page}
                                                    pageType={this.props.pageType}
                                                    marks={this.props.allMarks}
                                                    containedViews={this.props.containedViews}
                                                    setCorrectAnswer={this.props.setCorrectAnswer}
                                                    onTextEditorToggled={this.props.onTextEditorToggled}/>);
                                            } else if (index === container.children.length - 1) {
                                                return (<span><br/><br/></span>);
                                            }
                                            return null;
                                        })}
                                        {container.children.length === 0 ? (<span><br/><br/></span>) : ""}
                                    </Cell>);
                            })}
                        </div>);
                    }
                    return null;
                }) : <div/>}
            </div>
        );
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this)).unset();
        interact(".editorBoxSortableContainer").unset();
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this))
            .resizable({
                enabled: false, // this.props.resizable,
                edges: { left: false, right: false, bottom: true, top: false },
                onmove: (event) => {
                    event.target.style.height = event.rect.height + 'px';
                },
                onend: (event) => {
                    // TODO Revew how to resize sortable containers
                    let toolbar = this.props.pluginToolbars[this.props.parentBox.id];
                    this.props.onSortableContainerResized(this.idConvert(this.props.pluginContainer), this.props.parentBox.id, parseInt(event.target.style.height, 10));
                    Ediphy.Plugins.get(toolbar.pluginId).forceUpdate(toolbar.state, this.props.parentBox.id, RESIZE_SORTABLE_CONTAINER);
                },
            });
    }
    idConvert(id) {
        if (isSortableContainer(id)) {
            return id;
        }
        return ID_PREFIX_SORTABLE_CONTAINER + id;
    }
}

PluginPlaceholder.propTypes = {
    /**
     * Plugins container name
     */
    pluginContainer: PropTypes.string,
    /**
     * Unique identifier of the parent box
     */
    parentBox: PropTypes.any,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any,
    /**
     * Selected box level (only plugins inside plugins)
     */
    boxLevelSelected: PropTypes.any,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Callback for resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func,
    /**
     * Callback for toggling CKEditor
     */
    onTextEditorToggled: PropTypes.func,
    /**
      * Identifier of the box that is creating a mark
      */
    markCreatorId: PropTypes.any,
    /**
     *  View type
     */
    pageType: PropTypes.string,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object,
    /**
     * Sets the correct answer of an exercise
     */
    setCorrectAnswer: PropTypes.func,
    /**
     * Current page
     */
    page: PropTypes.any,
    /**
     * Object containing all the marks in the course
     */
    allMarks: PropTypes.object,
    /**
   * Function that updates the toolbar of a view
   */
    onToolbarUpdated: PropTypes.func,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object,
};
