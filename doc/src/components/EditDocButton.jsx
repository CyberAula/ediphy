import editIcon from '../img/edit.svg';
import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import i18n from 'i18next';
/* eslint-disable react/prop-types */
export default class EditDocButton extends Component {
    render() {
        const tooltip = <Tooltip id="tooltip">{i18n.t("EditDocs")}</Tooltip>;
        return (
            <OverlayTrigger placement="bottom" overlay={tooltip}>
                <span className="editIcon"
                    style={{ display: this.props.show ? 'inline-block' : 'none' }}>
                    <a href={this.props.link}><img style={{ width: '25px' }} src={editIcon}/></a>
                </span>
            </OverlayTrigger>);
    }
}
/* eslint-enable react/prop-types */
