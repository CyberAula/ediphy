import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import interact from 'interactjs';
import { connect } from "react-redux";

import Ediphy from '../../../../core/editor/main';
import EditorBox from '../editorBox/EditorBox';
import { RESIZE_SORTABLE_CONTAINER } from '../../../../common/actions';
import { isSortableContainer } from '../../../../common/utils';
import { ID_PREFIX_SORTABLE_CONTAINER } from '../../../../common/constants';

import './_pluginPlaceHolder.scss';
import Cell from "./Cell";
import i18n from "i18next";
import Alert from "../../common/alert/Alert";
import _handlers from "../../../handlers/_handlers";

class PluginPlaceholder extends Component {

    state = { alert: null };
    h = _handlers(this);

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
                                    <Cell key={j}
                                        extraParams={{ i: i, j: j, row: row }}
                                        parentBox={this.props.parentBox}
                                        page={this.props.page}
                                        pluginContainer={this.props.pluginContainer}
                                        showAlert={() => this.setState({ alert: true })}
                                    >
                                        <Alert className="pageModal" show={this.state.alert} hasHeader backdrop={false}
                                            title={<span><i className="material-icons alert-warning" >
                                        warning</i>{i18n.t("messages.alert")}</span>}
                                            closeButton onClose={() => {this.setState({ alert: false });}}>
                                            <span> {i18n.t('messages.instance_limit')} </span>
                                        </Alert>
                                        {container.children.map((idBox, index) => {
                                            if (this.props.boxesById[idBox].col === i && this.props.boxesById[idBox].row === j) {
                                                return (<EditorBox id={idBox}
                                                    key={index}
                                                    page={this.props.page}
                                                    pageType={this.props.pageType}
                                                />);
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
                    let toolbar = this.props.pluginToolbarsById[this.props.parentBox.id];
                    this.h.onSortableContainerResized(this.idConvert(this.props.pluginContainer), this.props.parentBox.id, parseInt(event.target.style.height, 10));
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

function mapStateToProps(state) {
    const { boxesById, boxSelected, boxLevelSelected, containedViewsById, containedViewSelected, pluginToolbarsById,
        marksById, exercises, lastActionDispatched } = state.undoGroup.present;

    return {
        boxesById,
        boxSelected,
        boxLevelSelected,
        containedViewsById,
        containedViewSelected,
        pluginToolbarsById,
        marksById,
        exercises,
        lastActionDispatched,
    };
}

export default connect(mapStateToProps)(PluginPlaceholder);

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
     * Object containing all created boxesById (by id)
     */
    boxesById: PropTypes.object,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbarsById: PropTypes.object,
    /**
     *  View type
     */
    pageType: PropTypes.string,
    /**
     * Current page
     */
    page: PropTypes.any,
};
