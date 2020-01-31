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
import { EDModal } from "../../../../sass/general/EDModal";
import { ItemsContainer, TemplateItem, TemplateName } from "./Styles";
import _handlers from "../../../handlers/_handlers";

class TemplatesModal extends Component {

    state = {
        itemSelected: -1,
    };

    index = 0;
    templates = templates();

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
            <EDModal className="pageModal" id="TemplatesModal" show={this.props.show}>
                <Modal.Header>
                    <Modal.Title><span id="previewTitle">Elige una plantilla</span></Modal.Title>
                </Modal.Header>
                <Modal.Body className="gcModalBody" style={{ overFlowY: 'auto' }}>
                    <ItemsContainer>
                        <TemplateItem id="empty" selected={this.state.itemSelected === -1}
                            key="-1"
                            onClick={this.unselect}
                            onDoubleClick={this.doubleClickAdd}>
                            <TemplateName selected={this.state.itemSelected === -1}
                                children={i18n.t('templates.template0')}/>
                        </TemplateItem>
                        {templatesCopy.map((item, index) => {
                            let backgroundColor = item.hasOwnProperty('backgroundColor') ? item.backgroundColor : '#ffffff';
                            return (<TemplateItem key={index} selected={this.state.itemSelected === index}
                                backgroundColor={backgroundColor}
                                onClick={() => this.setState({ itemSelected: index })}
                                onDoubleClick={() => {
                                    this.setState({ itemSelected: index });
                                    this.AddNavItem(index);
                                }}>
                                <TemplateThumbnail key={index} index={index} boxes={item.boxes}/>
                                <TemplateName selected={this.state.itemSelected === index} children={item.name}/>
                            </TemplateItem>
                            );
                        })}
                    </ItemsContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="default" id="import_file_button" onClick={ e => {
                        this.closeModal(); e.preventDefault();
                    }}>{i18n.t("importFile.footer.cancel")}</Button>
                    <Button bsStyle="primary" id="cancel_button" onClick={ (e) => {
                        if(this.props.fromRich) {
                            this.getBoxes(this.state.itemSelected, templatesCopy);
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
            </EDModal>
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

    getBoxes(itemSelected, themeTemplates) {
        let boxes = [];
        if (itemSelected !== -1) {
            let selectedTemplate = themeTemplates[itemSelected];
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

                makeBoxes(boxes, newId, this.props, this.props.onBoxAdded);
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
