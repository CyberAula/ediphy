import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import i18n from 'i18next';
import { isSortableBox, isCanvasElement, isContainedView } from '../../../../common/utils';

/**
 *  Contained View mark information
 *  It shows the current contained view's origin (page, plugin and mark)
 */
export default class CVInfo extends Component {
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        let cvList = [];
        for (let id in this.props.containedView.parent) {
            if (this.props.toolbars[id]) {
                let el = this.props.boxes[id];
                let from = "unknown";
                let markName = "";
                if (this.props.toolbars[id].state && this.props.toolbars[id].state.__marks) {
                    let at = '@';
                    for (let mark in this.props.toolbars[id].state.__marks) {
                        if (this.props.toolbars[id].state.__marks[mark].connection === this.props.containedView.id) {
                            markName += this.props.toolbars[id].state.__marks[mark].title + ', ';
                        }
                    }
                    markName = markName.slice(0, markName.length - 2) + " " + at + " ";
                }

                if (isSortableBox(el.parent)) {
                    let origin = this.props.boxes[el.parent].parent;
                    from = isContainedView(origin) ? this.props.containedViews[origin].name : this.props.navItems[origin].name;
                } else if (isCanvasElement(el.parent)) {
                    from = isContainedView(el.parent) ? this.props.containedViews[el.parent].name : this.props.navItems[el.parent].name;
                } else {
                    break;
                }
                cvList.push(<span className="cvList" key={id}>{markName}<b>{this.props.viewToolbars[id].config.displayName}</b> { ' (' + from + ')'}</span>);
            }
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
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Vista contenida actual, identificada por su *id*
     */
    containedView: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todas las toolbars, accesibles por el *id* de su caja/vista
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
};
