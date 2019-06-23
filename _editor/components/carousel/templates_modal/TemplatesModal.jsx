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
import { getThemeTemplates } from "../../../../common/themes/theme_loader";

import { connect } from "react-redux";

class TemplatesModal extends Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.templates = templates();
        /**
         * Component's initial state
         */
        this.state = {
            itemSelected: -1,
        };
    }
    render() {
        let templatesCopy = JSON.parse(JSON.stringify(this.templates));
        let themeTemplates = getThemeTemplates(this.props.styleConfig.theme);
        templatesCopy = templatesCopy.concat(themeTemplates);
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
                            style={{ width: '120px', height: '80px', border: this.state.itemSelected === -1 ? "solid #17CFC8 3px" : "solid #eee 1px", position: 'relative' }}
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
                            }}><div className={'template_name'} style={{ display: this.state.itemSelected === -1 ? 'block' : 'none' }}>{i18n.t('templates.template0')}</div>
                        </div>
                        {templatesCopy.map((item, index) => {
                            let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
                            let backgroundColor = item.hasOwnProperty('backgroundColor') ? item.backgroundColor : '#ffffff';
                            return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: '120px', height: '80px', backgroundColor: backgroundColor }}
                                onClick={e => { this.setState({ itemSelected: index });}}
                                onDoubleClick={e => {
                                    this.setState({ itemSelected: index });
                                    this.AddNavItem(index);
                                }}>
                                <TemplateThumbnail key={index} index={index} boxes={item.boxes}/>
                                <div className={'template_name'} style={{ display: this.state.itemSelected === index ? 'block' : 'none' }}>{item.name}</div>
                            </div>
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        this.AddNavItem(this.state.itemSelected); e.preventDefault(); e.stopPropagation();
                    }} onDoubleClick={ (e) => {
                        // this.AddNavItem(this.state.itemSelected);
                        e.preventDefault(); e.stopPropagation();
                    }}>{i18n.t("importFile.footer.ok")}</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Close modal
     */
    closeModal() {
        // reset state
        this.setState({ itemSelected: -1 });
        this.props.close();
    }
    /**
     * Add Slide
     */
    AddNavItem(template) {
        let templatesCopy = JSON.parse(JSON.stringify(this.templates));
        let themeTemplates = getThemeTemplates(this.props.styleConfig.theme);
        templatesCopy = templatesCopy.concat(themeTemplates);

        let newId = ID_PREFIX_PAGE + Date.now();
        if (this.props.show) {
            this.props.onNavItemAdded(
                newId,
                i18n.t("slide"),
                // this.getParent().id,// Calculated in CarrouselButtons
                PAGE_TYPES.SLIDE,
                // this.props.calculatePosition(), // Calculated in CarrouselButtons
                template + 1,
                0,
                template !== -1,
                false
            );
            if (template !== -1) {
                let selectedTemplate = templatesCopy[template];
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
                    createBox(initialParams, item.toolbar.name, true, this.props.onBoxAdded, this.props.boxes, item.toolbar.style);
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
}
export default connect(mapStateToProps)(TemplatesModal);

function mapStateToProps(state) {
    return {
        styleConfig: state.undoGroup.present.styleConfig,
    };
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
     * Function for adding a new view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Function for adding a new box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     *  General style config
     */
    styleConfig: PropTypes.object,
};
