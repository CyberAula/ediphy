import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
import { MarkListBox } from "./Styles";
import { ToolbarButton } from "../../toolbar/toolbarComponents/Styles";

export default class MarksList extends Component {
    render() {
        return (
            <div>
                <ToolbarButton
                    className='marksListButton'
                    onClick={e => {
                        this.props.onRichMarksModalToggled(0, this.props.boxId);
                        e.stopPropagation();
                    }}>
                    {i18n.t("marks.add_mark")}
                </ToolbarButton>
                <br/>
                {this.props.state !== undefined &&
                    Object.keys(this.props.state).map(id => {
                        let mark = this.props.state[id];
                        if(this.props.boxId !== mark.origin) {
                            return null;
                        }
                        let name = mark.connection;
                        let color = mark.color || "#337ab7";
                        let hasImage = mark.markType === "image";
                        let text = hasImage ? "image" : mark.content.selectedIcon || "room";
                        let widthScroll = Math.max(mark.title.length / 11 * 100, 100);
                        try {
                            switch (mark.connectMode) {
                            case "new":
                                name = this.props.viewToolbarsById[mark.connection].viewName;
                                break;
                            case "existing":
                                name = this.props.viewToolbarsById[mark.connection].viewName;
                                break;
                            case "external":
                                name = mark.connection.length > 25 ? (mark.connection.substring(0, 25) + '...') : mark.connection;
                                break;
                            case "popup":
                                name = "PopUp";
                                break;
                            }
                        } catch(e) { return null;}
                        return (
                            <MarkListBox key={id}>
                                {mark.connection ? (
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={(<Tooltip id={"markToolTip-" + id}>
                                            {i18n.t('marks.hover_message') + "\"" + name + "\""}
                                        </Tooltip>)}>
                                        <i style={{ color: color }} className="material-icons marklist main">{text}</i>
                                    </OverlayTrigger>) :
                                    (<i style={{ color: color }} className="material-icons marklist">{text}</i>)}
                                <div className="markNameInToolbarContainer"
                                    onMouseOver={() =>{
                                        let markEl = document.getElementById('mark_' + id);
                                        markEl.style.transitionDuration = widthScroll / 100 + 's';
                                        markEl.style.width = widthScroll + '%';
                                        markEl.style.left = '-' + (widthScroll - 100) + '%';
                                    }}
                                    onMouseOut={() =>{
                                        let markEl = document.getElementById('mark_' + id);
                                        markEl.style.width = '100%';
                                        markEl.style.left = '0%';
                                    }}>
                                    <div id={'mark_' + id} className="markNameInToolbar">
                                        {mark.title}
                                    </div>
                                </div>
                                <i className="material-icons marklist" style={{ float: 'right' }}
                                    onClick={() => {
                                        this.props.onRichMarkDeleted(id);
                                    }}>delete</i>
                                <i className="material-icons marklist" style={{ float: 'right' }}
                                    onClick={() => {
                                        this.props.onRichMarkEditPressed(mark);
                                        this.props.onRichMarksModalToggled(mark.value, mark.origin);
                                    }}>edit</i><br/>

                            </MarkListBox>
                        );
                    })
                }
            </div>
        );
    }
}

MarksList.propTypes = {
    /**
     * Id of the box to which the marks belong
     */
    boxId: PropTypes.any,
    /**
     *  State marks object
     */
    state: PropTypes.object.isRequired,
    /**
     * Object including view toolbars (identified by its *id*)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Muestra/oculta el modal de edición de marcas
     */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
     * Comienza la edición de una marca
     */
    onRichMarkEditPressed: PropTypes.func.isRequired,
    /**
     * Borra una marca
     */
    onRichMarkDeleted: PropTypes.func.isRequired,
};
