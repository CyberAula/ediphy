import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Tooltip, Button, OverlayTrigger, Popover, Overlay } from 'react-bootstrap';
import {
    addNavItem,
    selectIndex,
    deleteContainedView, deleteNavItem } from '../../../../common/actions';

import { ID_PREFIX_PAGE, ID_PREFIX_SECTION, ID_PREFIX_SORTABLE_BOX, PAGE_TYPES } from '../../../../common/constants';
import { isSection, isContainedView, getDescendantLinkedBoxes, getDescendantBoxes, getDescendantViews } from '../../../../common/utils';
import { connect } from 'react-redux';
import './_carouselButtons.scss';
import TemplatesModal from "../templatesModal/TemplatesModal";
import _handlers from "../../../handlers/_handlers";

/**
 * Ediphy CarouselButtons Component
 * Buttons at the bottom of the carousel, that allow creating new views and removing existing ones
 */
class CarouselButtons extends Component {

    state = {
        showOverlay: false,
        showTemplates: false,
    };

    h = _handlers(this);

    /**
     * Get the parent of the currently selected navItem
     * @returns {*}
     */
    getParent = () => {
        const { indexSelected, navItemsById } = this.props;
        if (!indexSelected || indexSelected === -1) {
            return { id: 0 };
        }
        // If the selected navItem is not a section, it cannot have children -> we return its parent
        if (isSection(indexSelected)) {
            return navItemsById[indexSelected];
        }
        return navItemsById[navItemsById[indexSelected].parent] || navItemsById[0];
    };

    /**
     * Expand siblings of added navItem
     */
    expandSiblings = (parentId) => {
        const children = this.props.navItemsById[parentId].children;

        for (let child of children) {
            if (this.props.navItemsById[child].type !== 'section') {
                this.h.onNavItemExpanded(child, true);
            }
        }
    };

    /**
     * Calculate a new navItem's position on the index
     * @returns {*}
     */
    calculatePosition = () => {
        let parent = this.getParent();
        let ids = this.props.navItemsIds;
        // If we are at top level, the new navItem it's always going to be in last position
        if(parent.id === 0) {
            return ids.length;
        }

        // Starting after item's parent, if level is the same or lower -> we found the place we want
        for(let i = ids.indexOf(parent.id) + 1; i < ids.length; i++) {
            if(ids[i] && this.props.navItemsById[ids[i]].level <= parent.level) {
                return i;
            }
        }

        // If we arrive here it means we were adding a new child to the last navItem
        return ids.length;
    };

    /**
     * Checks if contained view leaves orphan marks
     * @param id Contained view id
     * @returns {*}
     */
    canDeleteContainedView = (id) => {
        if (id !== 0 && isContainedView(id)) {
            const thisPage = this.props.containedViewsById[id];
            const boxesById = this.props.boxesById;
            const parent = thisPage.parent;
            const boxDoesntExistAnyMore = parent && !boxesById[parent];
            const deletedMark = parent && boxesById[parent] && boxesById[parent].containedViewsById && boxesById[parent].containedViewsById.indexOf(id) === -1;
            return boxDoesntExistAnyMore || deletedMark;
        }
        return false;
    };

    /**
    * Render React Component
    * @returns {code}
    */
    render() {
        const { boxesById, indexSelected, navItemsById, carouselShow } = this.props;
        const buttons = [
            {
                tooltip: i18n.t('create new folder'),
                name: "newFolder",
                disabled: indexSelected === -1 || isContainedView(indexSelected) || navItemsById[indexSelected].level >= 10,
                onClick: this.addSection,
                icon: "create_new_folder",
            },
            {
                tooltip: i18n.t('create new document'),
                name: "newDocument",
                disabled: isContainedView(indexSelected),
                onClick: this.addPage,
                icon: "note_add",
            },
            {
                tooltip: i18n.t('create new slide'),
                name: "newSlide",
                disable: isContainedView(indexSelected),
                onClick: this.toggleTemplatesModal,
                icon: "slideshow",
            },
            {
                tooltip: i18n.t('DuplicateNavItem'),
                name: "duplicateNav",
                disabled: indexSelected === 0 || isContainedView(indexSelected) || isSection(indexSelected),
                onClick: () => this.h.onNavItemDuplicated(indexSelected),
                icon: "control_point_duplicate",
            },
            {
                tooltip: i18n.t('delete'),
                name: "delete",
                disabled: indexSelected === 0,
                onClick: () => this.setState({ showOverlay: true }),
                ref: button => {this.overlayTarget = button;},
                style: { float: 'right' },
                icon: "delete",

            },
        ];
        return (
            <div id="addbuttons" className="bottomGroup" style={{ display: carouselShow ? 'block' : 'none' }}>
                <div key="bottomLine" className="bottomLine" />
                {
                    buttons.map(button => {
                        return <OverlayTrigger key={button.name} placement="top" overlay={<Tooltip id="duplicateNavTooltip">{button.tooltip}</Tooltip>}>
                            <Button className="carouselButton"
                                name={button.name}
                                disabled={button.disabled}
                                onClick={button.onClick}
                                ref={button.ref}
                                style={button.style}>
                                <i className="material-icons">{button.icon}</i>
                            </Button>
                        </OverlayTrigger>;
                    })
                }
                <Overlay rootClose
                    key="confirm"
                    name="confirmationOverlay"
                    show={this.state.showOverlay}
                    placement='top'
                    target={() => ReactDOM.findDOMNode(this.overlayTarget)}
                    onHide={() => this.setState({ showOverlay: false })}>
                    <Popover id="popov" title={
                        isSection(indexSelected) ? i18n.t("delete_section") :
                            isContainedView(indexSelected) ? i18n.t('deleteContainedCanvas') :
                                i18n.t("delete_page")}>
                        <i style={{ color: 'yellow', fontSize: '13px', padding: '0 5px' }} className="material-icons">warning</i>
                        {isSection(indexSelected) ? i18n.t("messages.delete_section") :
                            (isContainedView(indexSelected) && !this.canDeleteContainedView(indexSelected)) ? i18n.t("messages.delete_busy_cv") : i18n.t("messages.delete_page")}
                        <br/>
                        <br/>
                        <Button className="popoverButton"
                            name="popoverCancelButton"
                            disabled={indexSelected === 0}
                            onClick={() => this.setState({ showOverlay: false })}
                            style={{ float: 'right' }} >
                            {i18n.t("Cancel")}
                        </Button>

                        <Button className="popoverButton"
                            name="popoverAcceptButton"
                            disabled={indexSelected === 0}
                            style={{ float: 'right' }}
                            onClick={this.deleteItem}>
                            {i18n.t("Accept")}
                        </Button>
                        <div style={{ clear: "both" }} />
                    </Popover>
                </Overlay>
                <TemplatesModal key="templatesModal"
                    show={this.state.showTemplates}
                    close={this.toggleTemplatesModal}
                    navItemsById={navItemsById}
                    boxesById={boxesById}
                    onNavItemAdded={(id, name, type, color, num, extra) => {
                        this.h.onNavItemAdded(id, name, this.getParent().id, type, this.calculatePosition(), color, num, extra);
                        this.expandSiblings(this.getParent().id);}}
                    onIndexSelected={this.h.onIndexSelected}
                    indexSelected={indexSelected}
                    onBoxAdded={this.h.onBoxAdded}
                    calculatePosition={this.calculatePosition}/>
            </div>
        );
    }
    /**
     * Shows/Hides the Import file modal
     */
    toggleTemplatesModal = () => {
        this.setState((prevState) => ({
            showTemplates: !prevState.showTemplates,
        }));
    };

    addPage = () => {
        let newId = ID_PREFIX_PAGE + Date.now();
        this.props.dispatch(addNavItem(
            newId,
            i18n.t("page"),
            this.getParent().id,
            PAGE_TYPES.DOCUMENT,
            this.calculatePosition(),
            "#ffffff",
            0,
            false,
            true,
            ID_PREFIX_SORTABLE_BOX + Date.now(),
        ));
        this.expandSiblings(this.getParent().id);
    };

    addSection = (e) => {
        let newId = ID_PREFIX_SECTION + Date.now();
        this.props.dispatch(addNavItem(newId,
            i18n.t("section"),
            this.getParent().id,
            PAGE_TYPES.SECTION,
            this.calculatePosition()
        ));
        this.expandSiblings(this.getParent().id);
        e.stopPropagation();
    };

    deleteItem = () => {
        const { boxesById, containedViewsById, indexSelected, navItemsById } = this.props;
        if(indexSelected !== 0) {
            if (isContainedView(indexSelected) /* && this.canDeleteContainedView(this.props.indexSelected)*/) {
                let boxesByIdRemoving = [];
                containedViewsById[indexSelected].boxesById.map(boxId => {
                    boxesByIdRemoving.push(boxId);
                    boxesByIdRemoving = boxesByIdRemoving.concat(getDescendantBoxes(boxesById[boxId], boxesById));
                });

                this.props.dispatch(deleteContainedView([indexSelected], boxesByIdRemoving, containedViewsById[cvId].parent));
            } else {
                let viewRemoving = [indexSelected].concat(getDescendantViews(navItemsById[indexSelected]));
                let boxesByIdRemoving = [];
                let containedRemoving = {};
                viewRemoving.map(id => {
                    navItemsById[id].boxesById.map(boxId => {
                        boxesByIdRemoving.push(boxId);
                        boxesByIdRemoving = boxesByIdRemoving.concat(getDescendantBoxes(boxesById[boxId], boxesById));
                    });
                });
                let marksRemoving = getDescendantLinkedBoxes(viewRemoving, navItemsById) || [];
                this.props.dispatch(deleteNavItem(
                    viewRemoving,
                    navItemsById[indexSelected].parent,
                    boxesByIdRemoving,
                    containedRemoving,
                    marksRemoving));
            }
        }
        this.props.dispatch(selectIndex(0));
        this.setState({ showOverlay: false });
    };
}
export default connect(mapStateToProps)(CarouselButtons);

function mapStateToProps(state) {
    const { boxesById, containedViewsById, indexSelected, navItemsById, navItemsIds } = state.undoGroup.present;
    const { carouselShow } = state.reactUI;
    return {
        boxesById,
        carouselShow,
        containedViewsById,
        indexSelected,
        navItemsById,
        navItemsIds,
    };
}

CarouselButtons.propTypes = {
    /**
     * Object containing all created boxesById (by id)
     */
    boxesById: PropTypes.object.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Redux actions dispatcher
     */
    dispatch: PropTypes.func,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Array containing all created views, each identified by its *id*
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Index displayed indicator
     */
    carouselShow: PropTypes.bool.isRequired,
};
