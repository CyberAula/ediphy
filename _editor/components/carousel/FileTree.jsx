import React, { Component } from 'react';
import Sortly, { findDescendants, convert } from 'react-sortly';
import update from 'immutability-helper';

import ItemRenderer from './ItemRenderer';
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

class FileTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSortableItems: true,
            showContainedViews: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleToggleCollapse = this.handleToggleCollapse.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.ediphyNavItemsToSortlyItems = this.ediphyNavItemsToSortlyItems.bind(this);
        this.getImmediateDescendants = this.getImmediateDescendants.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        console.log(this.props);
        console.log(nextProps);
        if(nextProps.navItems !== this.props.navItems || nextProps.navItemsIds !== this.props.navItemsIds || nextProps.viewToolbars !== this.props.viewToolbars) {
            return true;
        }
        return false;
    }

    handleMove(items, index, newIndex) {
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
    }

    ediphyNavItemsToSortlyItems(edNavItems, edNavItemsId, edViewToolbars) {
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
        console.log(this.props.navItems);
        console.log(edItems);
        return convert(edItems);
    }

    handleChange(items) {
        console.log('handle change');
        let movedItem = items.find(i => i.id === this.props.indexSelected);

        let oldParentId = this.props.navItems[movedItem.id].parent;
        let newParentId = movedItem.path[movedItem.path.length - 1] || 0;
        let idsInOrder = items.map(item => item.id);
        let childrenInOrder = this.getImmediateDescendants(items, newParentId);

        const shouldChildExpand = this.props.navItems[newParentId].isExpanded;
        this.props.onNavItemExpanded(movedItem.id, shouldChildExpand);
        this.props.onNavItemReordered(movedItem.id, newParentId, oldParentId, idsInOrder, childrenInOrder);

    }

    getImmediateDescendants(items, parentId) {
        return parentId === 0 ?
            items.filter(i => i.path.length === 0).map(i => i.id) :
            findDescendants(items, items.findIndex(i => i.id === parentId)).filter(i => i.path.slice(-1)[0] === parentId).map(i => i.id);
    }

    handleToggleCollapse(index) {
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
    }

    renderItem(props) { return <ItemRenderer {...props}
        onToggleCollapse={this.handleToggleCollapse}
        onIndexSelected = {this.props.onIndexSelected}
        onNavItemNameChanged={this.props.onNavItemNameChanged}
        navItems={this.props.navItems}
        viewToolbars={this.props.viewToolbars}
    />; }

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
        let items = this.ediphyNavItemsToSortlyItems(this.props.navItems, this.props.navItemsIds, this.props.viewToolbars);

        if (!this.props.carouselShow) { return (<div style={{ height: "100%" }}><br /></div>); }

        return (
            <div className={"DnD-Window"}
                style={{ height: (this.state.showSortableItems) ? this.getContentHeight() : '0px', display: 'inherit' }}>
                <section style={{ width: '100%' }}>
                    <div className="row" style={{ width: '100%' }}>
                        <div className="col-12 col-lg-8 col-xl-6" style={{ width: '100%' }}>
                            <Sortly
                                items={items}
                                itemRenderer={this.renderItem}
                                onMove={this.handleMove}
                                onChange={this.handleChange}
                                onDrop={this.onDrop}
                            />
                        </div>
                    </div>
                </section>
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

export default DragDropContext(overrideDropCaptureHandler)(FileTree);
