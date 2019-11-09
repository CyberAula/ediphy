import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import i18n from 'i18next';
import { connect } from 'react-redux';

import { isSortableBox, isBox, isCanvasElement } from '../../../../common/utils';

/**
 *  Contained View mark information
 *  It shows the current contained view's origin (page, plugin and mark)
 */
class CVInfo extends Component {
    render() {
        let cvList = [];
        let marks = this.props.marksById;
        let containedView = this.props.containedViewsById[this.props.containedViewSelected];
        let boxMarks = {};
        for (let id in containedView.parent) {
            boxMarks[containedView.parent[id]] = [...(boxMarks[containedView.parent[id]] || []), id];
        }
        let at = '@';
        for (let box in boxMarks) {
            let el = this.props.boxesById[box];
            let from = "unknown";
            let markName = "";
            for (let m in boxMarks[box]) {
                markName += marks[boxMarks[box][m]].title + ', ';
            }
            markName = markName.slice(0, markName.length - 2) + " " + at + " ";
            if (isSortableBox(el.parent)) {
                let origin = this.props.boxesById[el.parent].parent;
                from = this.props.viewToolbarsById[origin].viewName;
            } else if (isBox(el.parent) && this.props.boxesById[el.parent].resizable) {
                let origin = this.props.boxesById[el.parent].parent;
                from = this.props.viewToolbarsById[origin].viewName;
            } else if (isBox(el.parent) && !this.props.boxesById[el.parent].resizable) {
                let origin = this.props.boxesById[this.props.boxesById[el.parent].parent].parent;
                from = this.props.viewToolbarsById[origin].viewName;
            } else if (isCanvasElement(el.parent)) {
                from = this.props.viewToolbarsById[el.parent].viewName;
            } else {
                break;
            }
            let pluginName = Ediphy.Plugins.get(this.props.pluginToolbarsById[el.id].pluginId).getConfig().displayName;
            cvList.push(<span className="cvList"
                key={box}>{markName}<b>{pluginName}</b> {' (' + from + ')'}</span>);

        }

        return (<OverlayTrigger placement="bottom" overlay={
            <Popover className="cvPopover" id="popover-positioned-bottom" title={ i18n.t("containedViewPopover") }>
                {cvList && cvList.length > 0 && cvList.map(it => { return it; }) }
                {!cvList || cvList.length === 0 ? (<span className="cvList">{i18n.t("contained_view_nowhere")}</span>) : null}
            </Popover>}>
            <i className="material-icons infoIcon" >info</i>
        </OverlayTrigger>);

    }
}

function mapStateToProps(state) {
    const { containedViewsById, containedViewSelected, boxesById, marksById, viewToolbarsById, pluginToolbarsById } = state.undoGroup.present;
    return{
        boxesById, containedViewsById, containedViewSelected, marksById, pluginToolbarsById, viewToolbarsById,
    };
}
export default connect(mapStateToProps)(CVInfo);
CVInfo.propTypes = {
    /**
     * Contained views (by ID)
     */
    containedViewsById: PropTypes.any.isRequired,
    /**
     * Current contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     *  Object containing all created boxes (by id)
     */
    boxesById: PropTypes.object.isRequired,
    /**
     * Object containing box marks
     */
    marksById: PropTypes.object,
    /**
     * View toolbars
     */
    viewToolbarsById: PropTypes.object,
    /**
   * Plugin toolbars
   */
    pluginToolbarsById: PropTypes.object,
};
