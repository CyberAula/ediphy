import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import { isAncestorOrSibling, isSortableContainer } from '../../../common/utils';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../common/constants';

export default class VisorPluginPlaceholder extends Component {
    idConvert(id) {
        if (isSortableContainer(id)) {
            return id;
        }
        return ID_PREFIX_SORTABLE_CONTAINER + id;

    }
    render() {
        let idContainer = this.idConvert(this.props.pluginContainer);
        let container = this.props.parentBox.sortableContainers[idContainer];
        let className = "drg" + this.props.idContainer;
        if(this.props.boxLevelSelected - this.props.parentBox.level === 1 &&
           isAncestorOrSibling(this.props.parentBox.id, this.props.boxSelected, this.props.boxes)) {
            className += " childBoxSelected";
        }
        return (
            <div style={
                Object.assign({}, {
                    width: "100%",
                    height: container.height === 'auto' ? container.height : container.height + 'px',
                    minHeight: '2em',
                    textAlign: 'center',
                    // lineHeight: '100%',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'table',
                }, container.style)
            }
            id={idContainer}
            className={className}>
                {container.colDistribution.map((col, i) => {
                    if (container.cols[i]) {
                        return (<div key={i}
                            style={{ width: col + "%", height: '100%', display: "table-cell", verticalAlign: "top" }}>
                            {container.cols[i].map((row, j) => {
                                return (<div key={j}
                                    style={{ width: "100%", height: row + "%", position: 'relative' }}
                                >
                                    {container.children.map((idBox, index) => {
                                        if (this.props.boxes[idBox].col === i && this.props.boxes[idBox].row === j) {
                                            return (<VisorBox id={idBox}
                                                key={index}
                                                boxes={this.props.boxes}
                                                changeCurrentView={this.props.changeCurrentView}
                                                currentView={this.props.currentView}
                                                toolbars={this.props.toolbars}
                                                fromScorm={this.props.fromScorm}
                                                marks={this.props.allMarks}
                                                show={this.props.show}
                                                onMarkClicked={this.props.onMarkClicked}
                                                richElementsState={this.props.richElementsState}/>);

                                        } else if (index === container.children.length - 1) {
                                            return (<span><br/><br/></span>);
                                        }
                                        return null;
                                    })}
                                    {container.children.length === 0 ? (<span><br/><br/></span>) : ""}
                                </div>);
                            })}
                        </div>);
                    }
                    return null;
                })}
            </div>
        );
    }

}

VisorPluginPlaceholder.propTypes = {
    /**
   * Show the current view
   */
    show: PropTypes.bool,
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
   * Selected box
   */
    boxSelected: PropTypes.any,
    /**
      * Box level selected
     */
    boxLevelSelected: PropTypes.any,
    /**
     * Changes current view
     */
    changeCurrentView: PropTypes.func,
    /**
     * Whether the app is in SCORM mode or not
     */
    fromScorm: PropTypes.bool,
    /**
     * Contains all toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Rich plugin state during transition
     */
    richElementsState: PropTypes.object,
    /**
   * Container id
   */
    idContainer: PropTypes.string,
    /**
   * Selected view
   */
    currentView: PropTypes.string,
    /**
    * All marks
    */
    allMarks: PropTypes.object,
    /**
     * Function that triggers a mark
     */
    onMarkClicked: PropTypes.func,
};
