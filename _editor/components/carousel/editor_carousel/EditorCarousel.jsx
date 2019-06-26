import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carousel_buttons/CarouselButtons';
import CarouselHeader from '../carousel_header/CarouselHeader';
import CarouselList from '../carousel_list/CarouselList';
import FileTree from "../FileTree";

import { connect } from "react-redux";
import { updateUI } from "../../../../common/actions";
import { UI } from "../../../../common/UI.es6";

/**
 * Index wrapper container
 */
class EditorCarousel extends Component

{
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

        this.onToggleWidth = this.onToggleWidth.bind(this);
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
                <CarouselHeader
                    carouselFull={this.props.carouselFull}
                    carouselShow={this.props.carouselShow}
                    courseTitle={this.props.title}
                    onTitleChanged={this.props.onTitleChanged}
                    onToggleWidth={this.onToggleWidth} />
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
                <CarouselButtons
                    carouselShow={this.props.carouselShow}
                    onNavItemAdded={this.props.onNavItemAdded}
                    onBoxAdded={this.props.onBoxAdded}
                    onNavItemExpanded={this.props.onNavItemExpanded}
                    onIndexSelected={this.props.onIndexSelected}
                    onNavItemDuplicated={this.props.onNavItemDuplicated}
                    onNavItemDeleted={this.props.onNavItemDeleted} />
            </div>
        );
    }

    onToggleWidth() {
        if(this.props.carouselShow) {
            this.props.dispatch(updateUI({
                carouselShow: false,
                carouselFull: false,
            }));
        } else {
            this.props.dispatch(updateUI(UI.carouselShow, true));
        }
    }

}

function mapStateToProps(state) {
    return {
        carouselShow: state.reactUI.carouselShow,
        carouselFull: state.reactUI.carouselFull,
        boxes: state.undoGroup.present.boxes,
        title: state.undoGroup.present.globalConfig.title || '---',
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        indexSelected: state.undoGroup.present.indexSelected,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemSelected,
        displayMode: state.undoGroup.present.displayMode,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorCarousel);

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
    title: PropTypes.string,
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
};
