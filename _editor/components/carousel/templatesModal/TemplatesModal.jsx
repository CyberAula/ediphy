import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import i18n from 'i18next';
import { connect } from "react-redux";

import { ID_PREFIX_PAGE, PAGE_TYPES } from '../../../../common/constants';
import { templates } from "./templates/templates";
import { makeBoxes } from "../../../../common/utils";
import TemplateThumbnail from "./TemplateThumbnail";

import { getThemeTemplates } from "../../../../common/themes/themeLoader";
import './_templatesModal.scss';
import handleNavItems from "../../../handlers/handleNavItems";

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

        this.hN = handleNavItems(this);
    }

    unselect = () => this.setState({ itemSelected: -1 });
    doubleClickAdd = () => {
        this.unselect();
        this.AddNavItem(-1);
    };
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
                            onClick={() => {
                                this.setState({
                                    itemSelected: -1,
                                });
                            }}
                            onDoubleClick={this.doubleClickAdd}>
                            <div className={'template_name'} style={{ display: this.state.itemSelected === -1 ? 'block' : 'none' }}>{i18n.t('templates.template0')}</div>
                        </div>
                        {templatesCopy.map((item, index) => {
                            let border = this.state.itemSelected === index ? "solid #17CFC8 3px" : "solid #eee 1px";
                            let backgroundColor = item.hasOwnProperty('backgroundColor') ? item.backgroundColor : '#ffffff';
                            return (<div key={index} className="template_item" style={{ position: 'relative', border: border, width: '120px', height: '80px', backgroundColor: backgroundColor }}
                                onClick={() => { this.setState({ itemSelected: index });}}
                                onDoubleClick={() => {
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
                        if(this.props.fromRich) {
                            this.getBoxes(this.state.itemSelected);
                            this.closeModal();
                        } else {
                            this.AddNavItem(this.state.itemSelected);
                        }
                        e.preventDefault(); e.stopPropagation();
                    }} onDoubleClick={ (e) => {
                        e.preventDefault();
                        e.stopPropagation();
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

    getBoxes(itemSelected) {
        let boxes = [];
        if (itemSelected !== -1) {
            let selectedTemplate = this.templates[itemSelected];
            boxes = selectedTemplate.boxes;
        }
        this.props.templateClick(boxes);
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

                makeBoxes(boxes, newId, this.props);
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
    const { indexSelected, navItemsIds, styleConfig } = state.undoGroup.present;
    return {
        indexSelected,
        navItemsIds,
        styleConfig,
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
     *  General style config
     */
    styleConfig: PropTypes.object,
    /**
     * Function for getting template ID
     */
    templateClick: PropTypes.func,
    /**
     * Comes from RichMarks Modal
     */
    fromRich: PropTypes.bool,
    /**
     * Add nav item
     */
    onNavItemAdded: PropTypes.func,
};
