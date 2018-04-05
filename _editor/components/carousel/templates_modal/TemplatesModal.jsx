import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Row, Col, FormGroup, ControlLabel, FormControl, InputGroup, Radio, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { ID_PREFIX_BOX, ID_PREFIX_PAGE, PAGE_TYPES } from '../../../../common/constants';
import i18n from 'i18next';
import { templates } from "./templates/templates";
import './_templatesModal.scss';
import { isSection } from "../../../../common/utils";
import Ediphy from "../../../../core/editor/main";
import { ADD_BOX } from "../../../../common/actions";
import TemplateThumbnail from "./TemplateThumbnail";
import { createBox } from "../../../../common/common_tools";

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
            itemSelected: -1,
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
                    <div className="items_container">
                        <div id="empty"
                            className="template_item"
                            key="-1"
                            style={{ width: '120px', height: '80px', border: this.state.itemSelected === -1 ? "solid orange 3px" : "solid #eee 1px", padding: '30px 25px' }}
                            onClick={e => {
                                this.setState({
                                    itemSelected: -1,
                                });
                            }}
                            onDoubleClick={e => {
                                this.setState({
                                    itemSelected: -1,
                                });
                                this.AddNavItem(-1);
                            }}
                        />
                        {this.templates.map((item, index) => {
                            let border = this.state.itemSelected === index ? "solid orange 3px" : "solid #eee 1px";
                            return (
                                <TemplateThumbnail key={index} index={index} className="template_item" image={item.image}
                                    style={{ position: 'relative', border: border, width: '120px', height: '80px' }}
                                    onClick={e => { this.setState({ itemSelected: index });}}
                                    onDoubleClick={e => {
                                        this.setState({ itemSelected: index });
                                        this.AddNavItem(index);
                                    }}
                                    boxes={item.boxes}/>
                            );
                        })}
                    </div>
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
     * Get the parent of the currently selected navItem
     * @returns {*}
     */
    getParent() {
        if (!this.props.indexSelected || this.props.indexSelected === -1) {
            return { id: 0 };
        }
        // If the selected navItem is not a section, it cannot have children -> we return it's parent
        if (isSection(this.props.indexSelected)) {
            return this.props.navItems[this.props.indexSelected];
        }
        return this.props.navItems[this.props.navItems[this.props.indexSelected].parent] || this.props.navItems[0];
    }

    /**
     * Close modal
     */
    closeModal() {
        // reset state
        this.setState({
            itemSelected: -1,
        });
        this.props.close();
    }
    /**
     * Add Slide
     */
    AddNavItem(template) {
        let newId = ID_PREFIX_PAGE + Date.now();
        this.props.onNavItemAdded(
            newId,
            i18n.t("slide"),
            this.getParent().id,
            PAGE_TYPES.SLIDE,
            this.props.calculatePosition,
            "rgb(255,255,255)",
            0,
            template !== -1,
            false
        );
        if (template !== -1) {
            let selectedTemplate = this.templates[template];
            let boxes = selectedTemplate.boxes;

            boxes.map((item, index) => {
                let position = {
                    x: item.box.x,
                    y: item.box.y,
                    type: 'absolute',
                };
                let initialParams = {
                    id: ID_PREFIX_BOX + Date.now() + "_" + index,
                    parent: newId,
                    container: 0,
                    col: 0, row: 0,
                    width: item.box.width,
                    height: item.box.height,
                    position: position,
                    name: item.toolbar.name,
                    isDefaultPlugin: true,
                    page: newId,
                };
                if (item.toolbar.text) {
                    initialParams.text = item.toolbar.text;
                } else if (item.toolbar.url) {
                    initialParams.url = item.toolbar.url;
                }
                createBox(initialParams, item.toolbar.name, true, this.props.onBoxAdded, this.props.boxes);
            });
        }
        // reset state
        this.setState({
            itemSelected: -1,
        });
        // this.props.onIndexSelected(newId);
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
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object.isRequired,
    /**
     *
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     *
     */
    // onIndexSelected: PropTypes.func.isRequired,
    /**
     *
     */
    calculatePosition: PropTypes.func.isRequired,
};
