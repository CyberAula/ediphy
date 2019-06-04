import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carousel_buttons/CarouselButtons';
import CarouselHeader from '../carousel_header/CarouselHeader';
import CarouselList from '../carousel_list/CarouselList';
import FileTree from "../FileTree";

/**
 * Index wrapper container
 */
export default class EditorCarousel extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
    }

    /**
     * Renders React Component
     * @returns {code}
     */
    render() {
        return (
            <div id="colLeft" className="wrapperCarousel"
                style={{
                    maxWidth: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '212px') : '80px',
                    overflowX: this.props.carouselFull ? 'hidden' : '',
                }}>
                <CarouselHeader carouselFull={this.props.carouselFull}
                    carouselShow={this.props.carouselShow}
                    courseTitle={this.props.globalConfig.title}
                    onTitleChanged={this.props.onTitleChanged}
                    onToggleFull={this.props.onToggleFull}
                    onToggleWidth={this.props.onToggleWidth} />
                <FileTree
                    carouselShow={this.props.carouselShow}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    boxes={this.props.boxes}
                    navItemsIds={this.props.navItemsIds}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    indexSelected={this.props.indexSelected}
                    onBoxAdded={this.props.onBoxAdded}
                    onContainedViewDeleted={this.props.onContainedViewDeleted}
                    onContainedViewSelected={this.props.onContainedViewSelected}
                    onContainedViewNameChanged={this.props.onContainedViewNameChanged}
                    onNavItemNameChanged={this.props.onNavItemNameChanged}
                    onNavItemAdded={this.props.onNavItemAdded}
                    onNavItemSelected={this.props.onNavItemSelected}
                    onIndexSelected={this.props.onIndexSelected}
                    onNavItemExpanded={this.props.onNavItemExpanded}
                    onNavItemDeleted={this.props.onNavItemDeleted}
                    onNavItemReordered={this.props.onNavItemReordered}
                    viewToolbars={this.props.viewToolbars}
                />
                <CarouselButtons boxes={this.props.boxes}
                    carouselShow={this.props.carouselShow}
                    containedViews={this.props.containedViews}
                    indexSelected={this.props.indexSelected}
                    styleConfig={this.props.styleConfig}
                    navItems={this.props.navItems}
                    navItemsIds={this.props.navItemsIds}
                    onNavItemAdded={this.props.onNavItemAdded}
                    onNavItemReordered={this.props.onNavItemReordered}
                    onBoxAdded={this.props.onBoxAdded}
                    onNavItemExpanded={this.props.onNavItemExpanded}
                    onIndexSelected={this.props.onIndexSelected}
                    onContainedViewDeleted={this.props.onContainedViewDeleted}
                    onNavItemDuplicated={this.props.onNavItemDuplicated}
                    onNavItemDeleted={this.props.onNavItemDeleted} />
            </div>
        );
    }

}

EditorCarousel.propTypes = {
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     *  Removes a contained view
     */
    onContainedViewDeleted: PropTypes.func.isRequired,
    /**
     *  Callback for selecting contained view
     */
    onContainedViewSelected: PropTypes.func.isRequired,
    /**
     * Callback for renaming contained view
     */
    onContainedViewNameChanged: PropTypes.func.isRequired,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func.isRequired,
    /**
     * Function for adding a new view
     */
    onNavItemAdded: PropTypes.func.isRequired,
    /**
     * Selects view
     */
    onNavItemSelected: PropTypes.func.isRequired,
    /**
     * Selects a view/contained view in the index's context
     */
    onIndexSelected: PropTypes.func.isRequired,
    /**
     * Expands navItem (only for sections)
     */
    onNavItemExpanded: PropTypes.func.isRequired,
    /**
     * Removes a view
     */
    onNavItemDeleted: PropTypes.func.isRequired,
    /**
     * Callback for reordering navItems
     */
    onNavItemReordered: PropTypes.func.isRequired,
    /**
     * Modifies the course's title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Course title
     */
    title: PropTypes.string.isRequired,
    /**
     * Indicates whether the index has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     * Indicates whether the index takes the whole screen's width or not
     */
    carouselFull: PropTypes.bool,
    /**
     * Expands the index to make it take 100% of the width
     */
    onToggleFull: PropTypes.func.isRequired,
    /**
     * Modifies the index's width
     */
    onToggleWidth: PropTypes.func.isRequired,
    /**
     *  Object that cointains the course's global configuration, stored in the Redux state
     */
    globalConfig: PropTypes.object,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * Duplicate nav item
     */
    onNavItemDuplicated: PropTypes.func.isRequired,
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
};
