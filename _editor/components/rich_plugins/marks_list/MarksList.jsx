import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
export default class MarksList extends Component {
    render() {
        return (
            <div>
                <Button
                    className='toolbarButton marksListButton'
                    onClick={e => {
                        this.props.onRichMarksModalToggled();
                        e.stopPropagation();
                    }}>
                    {i18n.t("marks.add_mark")}
                </Button>
                <br/>
                {
                    Object.keys(this.props.state).map(id => {
                        let mark = this.props.state[id];
                        let name = mark.connection;
                        let color = mark.color || '#337ab7';
                        let widthScroll = Math.max(mark.title.length / 11 * 100, 100);
                        try {
                            name = this.props.toolbars[mark.connection.id || mark.connection] ?
                                this.props.toolbars[mark.connection.id || mark.connection].controls.main.accordions.basic.buttons.navitem_name.value :
                                mark.connection;
                        } catch(e) { }
                        return (
                            <div className="markListBox" key={id}>
                                {mark.connection ? (
                                    <OverlayTrigger placement="top" overlay={(<Tooltip id={"markToolTip-" + id}>{i18n.t('marks.hover_message') + "\"" + name + "\""}</Tooltip>)}>
                                        <i style={{ color: color }} className="material-icons marklist main">room</i>
                                    </OverlayTrigger>) :
                                    (<i style={{ color: color }} className="material-icons marklist">room</i>)}
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

                                {/* <span className="markValueInToolbar">{mark.value}</span>*/}

                                <i className="material-icons marklist" style={{ float: 'right' }}
                                    onClick={() => {
                                        this.props.onRichMarkDeleted(id);
                                    }}>delete</i>
                                <i className="material-icons marklist" style={{ float: 'right' }}
                                    onClick={() => {
                                        this.props.onRichMarkEditPressed(mark);
                                        this.props.onRichMarksModalToggled();
                                    }}>edit</i><br/>

                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

MarksList.propTypes = {
    /*
     * Objeto de marcas del estado del plugin
     */
    state: PropTypes.object.isRequired,
    /*
     * Diccionario que incluye las toolbars
     */
    toolbars: PropTypes.object.isRequired,
    /*
     * Muestra/oculta el modal de edición de marcas
     */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /*
     * Comienza la edición de una marca
     */
    onRichMarkEditPressed: PropTypes.func.isRequired,
    /*
     * Borra una marca
     */
    onRichMarkDeleted: PropTypes.func.isRequired,

};
