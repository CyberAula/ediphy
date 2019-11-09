import React, { Component } from 'react';
import Sortly, { findDescendants, convert } from 'react-sortly';
import update from 'immutability-helper';

import CarouselItemRenderer from './CarouselItemRenderer';
import i18n from "i18next";
import ContainedViewsList from "./ContainedViewsList";
import PropTypes from "prop-types";
import handleNavItems from "../../handlers/handleNavItems";
import handleContainedViews from "../../handlers/handleContainedViews";
import handleCanvas from "../../handlers/handleCanvas";
import { connect } from "react-redux";

class FileTree extends Component {

    state = {
        showSortableItems: true,
        showContainedViews: true,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.navItemsById !== this.props.navItemsById
            || nextProps.navItemsIds !== this.props.navItemsIds
            || nextProps.viewToolbarsById !== this.props.viewToolbarsById
            || nextProps.carouselShow !== this.props.carouselShow
            || nextProps.indexSelected !== this.props.indexSelected
            || nextProps.containedViewsById !== this.props.containedViewsById
            || nextProps.containedViewSelected !== this.props.containedViewSelected
            || nextState.showSortableItems !== this.state.showSortableItems
            || nextState.showContainedViews !== this.state.showContainedViews);
    }

    handleMove = (items, index, newIndex) => {
        const { path } = items[newIndex];
        const parent = items.find(item => item.id === path[path.length - 1]);

        // parent should not be file
        if (parent && parent.type === 'file') {
            return false;
        }

        // if parent is collapsed, should expand the parent
        if (parent && parent.collapsed) {
            const updateFn = {
                [items.indexOf(parent)]: { collapsed: { $set: false } },
            };
            const descendants = findDescendants(items, items.indexOf(parent));
            descendants.forEach((item) => {
                updateFn[items.indexOf(item)] = { collapsed: { $set: false } };
            });

            return update(items, updateFn);
        }
        return true;
    };

    ediphyNavItemsToSortlyItems = (edNavItems, edNavItemsId, edViewToolbars) => {
        let edItems = edNavItemsId.map((item) => {
            return {
                id: edNavItems[item].id,
                name: edViewToolbars[item].viewName,
                type: edNavItems[item].type === 'section' ? 'folder' : 'file',
                edType: edNavItems[item].type,
                index: edNavItems[edNavItems[item].parent].children.indexOf(item),
                parentId: edNavItems[item].parent,
                collapsed: !edNavItems[item].isExpanded,
            };

        });
        return convert(edItems);
    };

    handleChange = (items) => {
        let movedItem = items.find(i => i.id === this.props.indexSelected);

        let oldParentId = this.props.navItemsById[movedItem.id].parent;
        let newParentId = movedItem.path[movedItem.path.length - 1] || 0;
        let idsInOrder = items.map(item => item.id);
        let childrenInOrder = this.getImmediateDescendants(items, newParentId);

        if (newParentId !== 0) {
            let shouldChildExpand = movedItem.type === 'file' && this.props.navItemsById[newParentId].isExpanded;
            handleNavItems(this).onNavItemExpanded(movedItem.id, shouldChildExpand);
        }
        handleNavItems(this).onNavItemReordered(movedItem.id, newParentId, oldParentId, idsInOrder, childrenInOrder);
    };

    getImmediateDescendants = (items, parentId) => {
        return parentId === 0 ?
            items.filter(i => i.path.length === 0).map(i => i.id) :
            findDescendants(items, items.findIndex(i => i.id === parentId)).filter(i => i.path.slice(-1)[0] === parentId).map(i => i.id);
    };

    handleToggleCollapse = (index) => {
        let items = this.ediphyNavItemsToSortlyItems(this.props.navItemsById, this.props.navItemsIds, this.props.viewToolbarsById);
        const descendants = findDescendants(items, index);
        const parentId = items[index].id;
        const expandedItemId = items[index].id;
        const expands = items[index].collapsed;

        handleNavItems(this).onNavItemExpanded(expandedItemId, expands);

        if (!expands) {
            descendants.forEach(item => handleNavItems(this).onNavItemExpanded(item.id, expands));
        } else {
            descendants.forEach(item => {
                const immediateChild = item.path.slice(-1)[0] === parentId;
                if (immediateChild && item.type !== "folder") { handleNavItems(this).onNavItemExpanded(item.id, expands); }
            });
        }
    };

    renderItem = (props) => { return <CarouselItemRenderer {...props}
        onToggleCollapse={this.handleToggleCollapse}
        onIndexSelected = {handleCanvas(this).onIndexSelected}
        onNavItemSelected={handleNavItems(this).onNavItemSelected}
        onNavItemNameChanged={handleNavItems(this).onNavItemNameChanged}
        navItemsById={this.props.navItemsById}
        viewToolbarsById={this.props.viewToolbarsById}
        containedViewSelected={this.props.containedViewSelected}
        navItemSelected={this.props.navItemSelected}
        indexSelected={this.props.indexSelected}
    />; };

    getContentHeight() {
        if(!this.state.showSortableItems && !this.state.showContainedViews) {
            return("50px");
        } else if(this.state.showSortableItems && !this.state.showContainedViews) {
            return "calc(100% - 124px)";
        } else if(this.state.showSortableItems && this.state.showContainedViews) {
            return "calc(50%)";
        }
        return "calc(100% - 124px)";
    }

    render() {
        if (!this.props.carouselShow) { return (<div style={{ height: "100%" }}><br /></div>); }
        return (
            <div className={"carousselListContainer"} style={{ height: '100%' }}>
                <div id="sortablesCollapse" style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showSortableItems: !this.state.showSortableItems });
                }}>
                    {(this.state.showSortableItems) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "11px" }}>{i18n.t("INDEX")}</span>
                </div>
                <div className={"DnD-Window carList"}
                    style={{ height: (this.state.showSortableItems) ? this.getContentHeight() : '0px', display: 'inherit ' }}>
                    <section style={{ display: 'flex', flex: 1, overflowX: 'hidden' }}>
                        <div className="row" style={{ display: 'flex', flex: 1 }}>
                            <div className="col-12 col-lg-8 col-xl-6" style={{ width: '100%' }}>
                                <Sortly
                                    items={this.ediphyNavItemsToSortlyItems(this.props.navItemsById, this.props.navItemsIds, this.props.viewToolbarsById)}
                                    itemRenderer={this.renderItem}
                                    onMove={this.handleMove}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <div id="scontainedViewsByIdCollapse" style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
                    this.setState({ showContainedViews: !this.state.showContainedViews });
                }}>
                    {(this.state.showContainedViews) ?
                        <i className="material-icons" style={{ color: "gray", fontSize: "22px" }}>{"arrow_drop_down" }</i> :
                        <i className="material-icons" style={{ color: "gray", fontSize: "15px", marginLeft: "2px", marginRight: "2px" }}>{"play_arrow" }</i>
                    }
                    <span style={{ color: "white", fontSize: "11px" }}>{i18n.t("CONTAINED_VIEWS")}</span>
                </div>
                <ContainedViewsList
                    showContainedViews = {this.state.showContainedViews}
                    showSortableItems = {this.state.showSortableItems}
                    containedViewsById={this.props.containedViewsById}
                    containedViewSelected={this.props.containedViewSelected}
                    indexSelected={this.props.indexSelected}
                    handleContainedViews={handleContainedViews(this)}
                    onIndexSelected={handleCanvas(this).onIndexSelected}
                    viewToolbarsById={this.props.viewToolbarsById}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { boxesById, containedViewsById, containedViewSelected, indexSelected,
        navItemsIds, navItemsById, navItemSelected, viewToolbarsById } = state.undoGroup.present;
    const { carouselShow } = state.reactUI;
    return {
        boxesById,
        carouselShow,
        containedViewsById,
        containedViewSelected,
        indexSelected,
        navItemsIds,
        navItemsById,
        navItemSelected,
        viewToolbarsById,
    };
}

export default connect(mapStateToProps)(FileTree);

FileTree.propTypes = {
    /**
     * Global parent of navItemsById (0)
     */
    id: PropTypes.number,
    /**
     * Indicates whether the carousel has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
    /**
     * Redux action dispatcher
     */
    dispatch: PropTypes.func,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItemsById: PropTypes.object,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     *  View/Contained view selected at the index
     */
    navItemsIds: PropTypes.array,
    /**
     * Callback for selecting contained view
     */
    onContainedViewNameChanged: PropTypes.func,
    /**
     * Callback for renaming contained view
     */
    onContainedViewSelected: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbarsById: PropTypes.object,
    /**
     * Object containing all the pages' toolbars
     */
    name: PropTypes.string,
    /**
     * Object containing all the pages' toolbars
     */
    type: PropTypes.oneOf(['folder', 'file']),
    /**
     * Indicates if objects is collapsed (not expanded)
     */
    collapsed: PropTypes.bool,
    /**
     * Function to connect Drag source
     */
    connectDragSource: PropTypes.func,
    /**
     * Manages preview when dragging
     */
    connectDragPreview: PropTypes.func,
    /**
     * Function to connect Drop target
     */
    connectDropTarget: PropTypes.func,
    /**
     * Boolean that indicates if object is dragging
     */
    isDragging: PropTypes.bool,
    /**
     *  Object containing all created boxesById (by id)
     */
    boxesById: PropTypes.object,

};

