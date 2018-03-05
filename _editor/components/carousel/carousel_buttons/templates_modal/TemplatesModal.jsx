import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { ID_PREFIX_PAGE, PAGE_TYPES } from "../../../../../common/constants";
import i18n from 'i18next';
import { templates } from "./templates/templates";

export default class TemplatesModal extends Component {
    /**
     * Constructor
     */
    constructor(props) {
        super(props);
        /**
         * Index
         * @type {number}
         */
        this.index = 0;
        this.templates = templates();
        /**
         * Component's initial state
         */
        this.state = {
            itemSelected: 0,
        };
    }
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
                    <div id="empty"
                        key="-1"
                        style={{ background: '#eee', width: '120px', height: '80px', border: this.state.itemSelected === -1 ? "solid orange 3px" : "solid transparent 3px", padding: '30px 25px' }}
                        onClick={e => {
                            this.setState({
                                itemSelected: -1,
                            });
                        }}
                    />
                    {this.templates.map((item, index) => {
                        let border = this.state.itemSelected === index ? "solid orange 3px" : "solid transparent 3px";
                        return (
                            <img key={index}
                                style={{
                                    border: border,
                                    width: '120px',
                                    height: '80px',
                                }}
                                src={item.image}
                                onClick={e => {
                                    this.setState({
                                        itemSelected: index,
                                    });
                                }}
                            />
                        );
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        this.AddNavItem(this.state.itemSelected); e.preventDefault();
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
    AddNavItem(template) {
        console.log(template);
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
        // if (template !== -1){ console.log("apply template"); }

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
