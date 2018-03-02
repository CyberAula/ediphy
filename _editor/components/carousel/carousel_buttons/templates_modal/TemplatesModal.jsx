import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { ID_PREFIX_PAGE, PAGE_TYPES } from "../../../../../common/constants";
import i18n from 'i18next';

export default class TemplatesModal extends Component {
    /**
     * Renders React component
     * @returns {code}
     */
    render() {
        return (
            <Modal className="pageModal" id="TemplatesModal" show={this.props.show}>
                <Modal.Header>
                    <Modal.Title><span id="previewTitle">Elige una plantilla</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <div style={{ width: '120px', height: '80px', border: '1px solid red', padding: '30px 25px' }}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        this.AddNavItem(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.ok")}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    /**
     * Close modal
     */
    closeModal() {
        this.props.close();
    }
    /**
     * Close modal
     */
    AddNavItem() {
        let newId = ID_PREFIX_PAGE + Date.now();
        this.props.onNavItemAdded(
            newId,
            i18n.t("slide"),
            this.props.parent,
            PAGE_TYPES.SLIDE,
            this.props.calculatePosition,
            "rgb(255,255,255)",
            0,
        );
        this.props.onIndexSelected(newId);
        this.props.close();
    }
}
TemplatesModal.propTypes = {
    /**
     * Whether the import file modal should be shown or hidden
     */
    show: PropTypes.bool,
    /**
     * Closes import file modal
     */
    close: PropTypes.func.isRequired,
    /**
     *
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     *
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     *
     */
    parent: PropTypes.string.isRequired,
    /**
     *
     */
    calculatePosition: PropTypes.func.isRequired,
};
