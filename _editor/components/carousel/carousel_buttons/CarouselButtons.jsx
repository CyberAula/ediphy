import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, Button, OverlayTrigger, Popover, Overlay } from 'react-bootstrap';

import { ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../common/constants';
import { isSection, isContainedView, calculateNewIdOrder } from '../../../../common/utils';
import Ediphy from '../../../../core/editor/main';

import './_carouselButtons.scss';
import TemplatesModal from "../templates_modal/TemplatesModal";

/**
 * Ediphy CarouselButtons Component
 * Buttons at the bottom of the carousel, that allow creating new views and removing existing ones
 */
export default class CarouselButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
            showTemplates: false,
        };
        this.toggleTemplatesModal = this.toggleTemplatesModal.bind(this);
        this.expandSiblings = this.expandSiblings.bind(this);
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
     * Expand siblings of added navItem
     */
    expandSiblings(parentId) {
        const children = this.props.navItems[parentId].children;

        for (let child of children) {
            if (this.props.navItems[child].type !== 'section') {
                this.props.onNavItemExpanded(child, true);
            }
        }
    }

    /**
     * Calculate a new navItem's position on the index
     * @returns {*}
     */
    calculatePosition() {
        let parent = this.getParent();
        let ids = this.props.navItemsIds;
        // If we are at top level, the new navItem it's always going to be in last position
        if(parent.id === 0) {
            return ids.length;
        }

        // Starting after item's parent, if level is the same or lower -> we found the place we want
        for(let i = ids.indexOf(parent.id) + 1; i < ids.length; i++) {
            if(ids[i]) {
                if(this.props.navItems[ids[i]].level <= parent.level) {
                    return i;
                }
            }
        }

        // If we arrive here it means we were adding a new child to the last navItem
        return ids.length;
    }

    /**
     * Checks if contained view leaves orphan marks
     * @param id Contained view id
     * @returns {*}
     */
    canDeleteContainedView(id) {
        if (id !== 0 && isContainedView(id)) {
            let thisPage = this.props.containedViews[id];
            let boxes = this.props.boxes;
            let parent = thisPage.parent;
            let boxDoesntExistAnyMore = parent && !boxes[parent];
            let deletedMark = parent && boxes[parent] && boxes[parent].containedViews && boxes[parent].containedViews.indexOf(id) === -1;
            return boxDoesntExistAnyMore || deletedMark;
        }

        return false;
    }

    /**
    * Render React Component
    * @returns {code}
    */
    render() {
        return (
            <div id="addbuttons" className="bottomGroup" style={{ display: this.props.carouselShow ? 'block' : 'none' }}>
                <div className="bottomLine" />
                <OverlayTrigger placement="top" overlay={(<Tooltip id="newFolderTooltip">{i18n.t('create new folder')}</Tooltip>)}>
                    <Button className="carouselButton"
                        name="newFolder"
                        disabled={ this.props.indexSelected === -1 || isContainedView(this.props.indexSelected) || this.props.navItems[this.props.indexSelected].level >= 10}
                        onClick={e => {
                            let idnuevo = ID_PREFIX_SECTION + Date.now();
                            this.props.onNavItemAdded(
                                idnuevo,
                                i18n.t("section"),
                                this.getParent().id,
                                PAGE_TYPES.SECTION,
                                this.calculatePosition()
                            );

                            this.expandSiblings(this.getParent().id);

                            e.stopPropagation();

                        }}><i className="material-icons">create_new_folder</i>
                    </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="newDocumentTooltip">{i18n.t('create new document')}
                    </Tooltip>}>
                    <Button className="carouselButton"
                        name="newDocument"
                        disabled={isContainedView(this.props.indexSelected)}
                        onClick={e =>{
                            let newId = ID_PREFIX_PAGE + Date.now();
                            this.props.onNavItemAdded(
                                newId,
                                i18n.t("page"),
                                this.getParent().id,
                                PAGE_TYPES.DOCUMENT,
                                this.calculatePosition(),
                                "#ffffff",
                                0,
                                false,
                                false,
                                ID_PREFIX_SORTABLE_BOX + Date.now(),
                            );
                            this.expandSiblings(this.getParent().id);

                        }}><i className="material-icons">note_add</i></Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="newSlideTooltip">{i18n.t('create new slide')}
                    </Tooltip>}>
                    <Button className="carouselButton"
                        name="newSlide"
                        disabled={isContainedView(this.props.indexSelected)}
                        onClick={e => {
                            this.toggleTemplatesModal();
                        }}><i className="material-icons">slideshow</i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="duplicateNavTooltip">{i18n.t('DuplicateNavItem')}
                    </Tooltip>}>
                    <Button className="carouselButton"
                        name="duplicateNav"
                        disabled={ this.props.indexSelected === 0 || isContainedView(this.props.indexSelected) || isSection(this.props.indexSelected)}
                        onClick={e => {
                            this.props.onNavItemDuplicated(this.props.indexSelected);
                        }}>
                        <i className="material-icons">control_point_duplicate </i>
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={
                    <Tooltip id="deleteTooltip">{i18n.t('delete')}
                    </Tooltip>}>
                    <Button className="carouselButton"
                        name="delete"
                        disabled={this.props.indexSelected === 0}
                        onClick={() => this.setState({ showOverlay: true })}
                        ref={button => {this.overlayTarget = button;}}
                        style={{ float: 'right' }}>
                        <i className="material-icons">delete</i>
                    </Button>
                </OverlayTrigger>

                <Overlay rootClose
                    name="confirmationOverlay"
                    show={this.state.showOverlay}
                    placement='top'
                    target={() => ReactDOM.findDOMNode(this.overlayTarget)}
                    onHide={() => this.setState({ showOverlay: false })}>
                    <Popover id="popov" title={
                        isSection(this.props.indexSelected) ? i18n.t("delete_section") :
                            isContainedView(this.props.indexSelected) ? i18n.t('delete_contained_canvas') :
                                i18n.t("delete_page")}>
                        <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                        {isSection(this.props.indexSelected) ? i18n.t("messages.delete_section") :
                            (isContainedView(this.props.indexSelected) && !this.canDeleteContainedView(this.props.indexSelected)) ? i18n.t("messages.delete_busy_cv") : i18n.t("messages.delete_page")}
                        <br/>
                        <br/>
                        <Button className="popoverButton"
                            name="popoverCancelButton"
                            disabled={this.props.indexSelected === 0}
                            onClick={() => this.setState({ showOverlay: false })}
                            style={{ float: 'right' }} >
                            {i18n.t("Cancel")}
                        </Button>

                        <Button className="popoverButton"
                            name="popoverAcceptButton"
                            disabled={/* (isContainedView(this.props.indexSelected) && !this.canDeleteContainedView(this.props.indexSelected)) || */this.props.indexSelected === 0}
                            style={{ float: 'right' }}
                            onClick={(e) => {
                                if(this.props.indexSelected !== 0) {
                                    if (isContainedView(this.props.indexSelected) /* && this.canDeleteContainedView(this.props.indexSelected)*/) {
                                        this.props.onContainedViewDeleted(this.props.indexSelected);
                                    } else {
                                        this.props.onNavItemDeleted(this.props.indexSelected);
                                    }
                                }
                                this.props.onIndexSelected(0);
                                this.setState({ showOverlay: false });}}>

                            {i18n.t("Accept")}
                        </Button>
                        <div style={{ clear: "both" }} />
                    </Popover>
                </Overlay>
                <TemplatesModal
                    show={this.state.showTemplates}
                    close={this.toggleTemplatesModal}
                    styleConfig={this.props.styleConfig}
                    navItems={this.props.navItems}
                    boxes={this.props.boxes}
                    onNavItemAdded={(id, name, type, color, num, extra)=> {this.props.onNavItemAdded(id, name, this.getParent().id, type, this.calculatePosition(), color, num, extra); this.expandSiblings(this.getParent().id);}}
                    onIndexSelected={this.props.onIndexSelected}
                    indexSelected={this.props.indexSelected}
                    onBoxAdded={this.props.onBoxAdded}
                    calculatePosition={this.calculatePosition}/>
            </div>
        );
    }
    /**
     * Shows/Hides the Import file modal
     */
    toggleTemplatesModal() {
        this.setState((prevState, props) => ({
            showTemplates: !prevState.showTemplates,
        }));
    }
}

CarouselButtons.propTypes = {
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Array containing all created views, each identified by its *id*
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Adds a view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Selects a view/contained view in the index's context
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Removes a contained view
     */
    onContainedViewDeleted: PropTypes.func.isRequired,
    /**
     * Removes a view
     */
    onNavItemDeleted: PropTypes.func.isRequired,
    /**
     * Expands navItem children when parent is expanded
     */
    onNavItemExpanded: PropTypes.func.isRequired,
    /**
     * Index displayed indicator
     */
    carouselShow: PropTypes.bool.isRequired,
    /**
     * Duplicate nav item
     */
    onNavItemDuplicated: PropTypes.func.isRequired,
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
};
