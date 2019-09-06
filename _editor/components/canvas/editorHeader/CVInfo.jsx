import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import i18n from 'i18next';
import { isSortableBox, isBox, isCanvasElement, isContainedView } from '../../../../common/utils';

/**
 *  Contained View mark information
 *  It shows the current contained view's origin (page, plugin and mark)
 */
export default class CVInfo extends Component {
    render() {
        let cvList = [];
        let marks = this.props.marks;
        let containedView = this.props.containedView;
        let mark_views = Object.keys(marks).map(mark => {
            if(marks[mark].connection === containedView.id) {
                return marks[mark].id;
            }
            return 0;
        }).filter(item => typeof item === 'string');
        let boxMarks = {};
        for (let id in containedView.parent) {
            boxMarks[containedView.parent[id]] = [...(boxMarks[containedView.parent[id]] || []), id];
        }
        let at = '@';
        for (let box in boxMarks) {
            let el = this.props.boxes[box];
            let from = "unknown";
            let markName = "";
            for (let m in boxMarks[box]) {
                markName += marks[boxMarks[box][m]].title + ', ';
            }
            markName = markName.slice(0, markName.length - 2) + " " + at + " ";
            let parentName;
            if (isSortableBox(el.parent)) {
                let origin = this.props.boxes[el.parent].parent;
                from = this.props.viewToolbars[origin].viewName;
            } else if (isBox(el.parent) && this.props.boxes[el.parent].resizable) {
                let origin = this.props.boxes[el.parent].parent;
                from = this.props.viewToolbars[origin].viewName;
            } else if (isBox(el.parent) && !this.props.boxes[el.parent].resizable) {
                let origin = this.props.boxes[this.props.boxes[el.parent].parent].parent;
                from = this.props.viewToolbars[origin].viewName;
            } else if (isCanvasElement(el.parent)) {
                from = this.props.viewToolbars[el.parent].viewName;
            } else {
                break;
            }
            let pluginName = Ediphy.Plugins.get(this.props.pluginToolbars[el.id].pluginId).getConfig().displayName;
            cvList.push(<span className="cvList"
                key={box}>{markName}<b>{pluginName}</b> {' (' + from + ')'}</span>);

        }

        return (<OverlayTrigger placement="bottom" overlay={
            <Popover className="cvPopover" id="popover-positioned-bottom" title={ i18n.t("contained_view_popover") }>
                {cvList && cvList.length > 0 && cvList.map(it => { return it; }) }
                {!cvList || cvList.length === 0 ? (<span className="cvList">{i18n.t("contained_view_nowhere")}</span>) : null}
            </Popover>}>
            <i className="material-icons infoIcon" >info</i>
        </OverlayTrigger>);

    }
}

CVInfo.propTypes = {
    /**
     * Current contained view (by ID)
     */
    containedView: PropTypes.any.isRequired,
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * View toolbars
     */
    viewToolbars: PropTypes.object,
    /**
   * Plugin toolbars
   */
    pluginToolbars: PropTypes.object,
};
