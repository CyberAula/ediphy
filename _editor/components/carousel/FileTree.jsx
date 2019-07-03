import React, { Component } from 'react';
import Sortly, { findDescendants, convert } from 'react-sortly';
import update from 'immutability-helper';

import ItemRenderer from './ItemRenderer';
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import i18n from "i18next";
import { isSlide } from "../../../common/utils";
import EditorIndexTitle from "./editor_index_title/EditorIndexTitle";
import ContainedViewsList from "./ContainedViewsList";
import PropTypes from "prop-types";

class FileTree extends Component {

    state = {
        showSortableItems: true,
        showContainedViews: true,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps.navItems !== this.props.navItems
            || nextProps.navItemsIds !== this.props.navItemsIds
            || nextProps.viewToolbars !== this.props.viewToolbars
            || nextProps.carouselShow !== this.props.carouselShow
            || nextProps.indexSelected !== this.props.indexSelected
            || nextProps.containedViews !== this.props.containedViews
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
        let edItems = edNavItemsId.map((item, i) => {
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

        let oldParentId = this.props.navItems[movedItem.id].parent;
        let newParentId = movedItem.path[movedItem.path.length - 1] || 0;
        let idsInOrder = items.map(item => item.id);
        let childrenInOrder = this.getImmediateDescendants(items, newParentId);

        if (newParentId !== 0) {
            let shouldChildExpand = movedItem.type === 'file' && this.props.navItems[newParentId].isExpanded;
            this.props.onNavItemExpanded(movedItem.id, shouldChildExpand);
        }
        this.props.onNavItemReordered(movedItem.id, newParentId, oldParentId, idsInOrder, childrenInOrder);
    };

    getImmediateDescendants = (items, parentId) => {
        return parentId === 0 ?
            items.filter(i => i.path.length === 0).map(i => i.id) :
            findDescendants(items, items.findIndex(i => i.id === parentId)).filter(i => i.path.slice(-1)[0] === parentId).map(i => i.id);
    };

    handleToggleCollapse = (index) => {
        let items = this.ediphyNavItemsToSortlyItems(this.props.navItems, this.props.navItemsIds, this.props.viewToolbars);
        const descendants = findDescendants(items, index);
        const parentId = items[index].id;
        const expandedItemId = items[index].id;
        const expands = items[index].collapsed;

        this.props.onNavItemExpanded(expandedItemId, expands);

        if (!expands) {
            descendants.forEach(item => this.props.onNavItemExpanded(item.id, expands));
        } else {
            descendants.forEach(item => {
                const immediateChild = item.path.slice(-1)[0] === parentId;
                if (immediateChild && item.type !== "folder") { this.props.onNavItemExpanded(item.id, expands); }
            });
        }
    };

    renderItem = (props) => { return <ItemRenderer {...props}
        onToggleCollapse={this.handleToggleCollapse}
        onIndexSelected = {this.props.onIndexSelected}
        onNavItemSelected={this.props.onNavItemSelected}
        onNavItemNameChanged={this.props.onNavItemNameChanged}
        navItems={this.props.navItems}
        viewToolbars={this.props.viewToolbars}
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
                                    items={this.ediphyNavItemsToSortlyItems(this.props.navItems, this.props.navItemsIds, this.props.viewToolbars)}
                                    itemRenderer={this.renderItem}
                                    onMove={this.handleMove}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <div id="scontainedViewsCollapse" style={{ height: "20px", backgroundColor: "black", marginBottom: "2px", paddingLeft: "10px", cursor: 'pointer' }} onClick={()=> {
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
            </div>
        );
    }
}

const overrideDropCaptureHandler = (manager) => {
    const backend = HTML5Backend(manager);
    const orgTopDropCapture = backend.handleTopDropCapture;

    backend.handleTopDropCapture = (e) => {
        let classes = e.target.className.split(' ');
        if (e.target.tagName === 'INPUT' && e.target.type === 'file') {
            e.stopPropagation();
        } else if (classes.includes('file') || classes.includes('folder')) {
            orgTopDropCapture.call(backend, e);
        }
    };

    return backend;
};

FileTree.propTypes = {
    /**
     * Global parent of navItems (0)
     */
    id: PropTypes.number,
    /**
     * Indicates whether the carousel has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     *  View/Contained view selected at the index
     */
    navItemsIds: PropTypes.array,
    /**
     * Callback for adding a new box
     */
    onBoxAdded: PropTypes.func,
    /**
     * Callback for selecting contained view
     */
    onContainedViewNameChanged: PropTypes.func,
    /**
     * Callback for renaming contained view
     */
    onContainedViewSelected: PropTypes.func,
    /**
     * Callback for deleting contained view
     */
    onContainedViewDeleted: PropTypes.func,
    /**
     * Callback for renaming view
     */
    onIndexSelected: PropTypes.func,
    /**
     * Adds a new view
     */
    onNavItemAdded: PropTypes.func,
    /**
     * Expands navItem (only for sections)
     */
    onNavItemExpanded: PropTypes.func,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Callback for reordering navItems
     */
    onNavItemReordered: PropTypes.func,
    /**
     * Deletes a view
     */
    onNavItemDeleted: PropTypes.func,
    /**
     * Selects a view
     */
    onNavItemSelected: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
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
     *  Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
};

export default DragDropContext(overrideDropCaptureHandler)(FileTree);
