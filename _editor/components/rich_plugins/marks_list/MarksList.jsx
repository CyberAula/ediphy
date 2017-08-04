import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
export default class MarksList extends Component {
    render() {

        return (
            /* jshint ignore: start */
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
                    Object.keys(this.props.state.__marks).map(id => {
                        let mark = this.props.state.__marks[id];
                        let name = mark.connection;
                        try {
                            name = this.props.toolbars[mark.connection.id || mark.connection] ? this.props.toolbars[mark.connection.id || mark.connection].controls.main.accordions.basic.buttons.navitem_name.value : mark.connection;
                        } catch(e) { }
                        return (
                            <div className="markListBox" key={id}>
                                {mark.connection ? (
                                    <OverlayTrigger placement="top" overlay={(<Tooltip id={"markToolTip-" + id}>{i18n.t('marks.hover_message') + "\"" + name + "\""}</Tooltip>)}>
                                        <i className="material-icons marklist main">room</i>
                                    </OverlayTrigger>) :
                                    (<i className="material-icons marklist">room</i>)}
                                <div className="markNameInToolbar">{mark.title}</div>
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
            /* jshint ignore: end */
        );
    }
}
