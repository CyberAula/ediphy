import React, { Component } from 'react';
import Sortly, { findDescendants } from 'react-sortly';
import update from 'immutability-helper';

import ItemRenderer from './ItemRenderer';
import { DragDropContext, DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { getFilesFromDragEvent } from "html-dir-content";

const ITEMS = [
    { id: 1, name: 'Section 1', type: 'folder', path: [] },
    { id: 2, name: 'Slide 1', type: 'file', path: [1] },
    { id: 3, name: 'Slide 2', type: 'file', path: [1] },
    { id: 4, name: 'Slide 3', type: 'file', path: [1] },
    { id: 5, name: 'Section 2', type: 'folder', path: [] },
    { id: 6, name: 'Slide 4', type: 'file', path: [5] },
    { id: 7, name: 'Slide 5', type: 'file', path: [5] },
    { id: 8, name: 'Slide 6', type: 'file', path: [5] },
    { id: 9, name: 'Section 3', type: 'folder', collapsed: true, path: [] },
    { id: 10, name: 'Slide 7', type: 'file', collapsed: true, path: [9] },
    { id: 11, name: 'Slide 8', type: 'file', collapsed: true, path: [9] },
    { id: 12, name: 'Slide 9', type: 'file', collapsed: true, path: [9] },
    { id: 13, name: 'Section 4', type: 'folder', path: [] },
    { id: 14, name: 'Slide 10', type: 'file', path: [13] },
    { id: 15, name: 'Slide 11', type: 'file', path: [13] },
    { id: 16, name: 'Slide 12', type: 'file', path: [13] },
];

class FileTree extends Component {
    constructor(props) {
        super(props);
        this.state = { items: ITEMS };

        this.handleChange = this.handleChange.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleToggleCollapse = this.handleToggleCollapse.bind(this);
        this.renderItem = this.renderItem.bind(this);
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

    handleChange(items) {
        this.setState({ items });
    }

    handleToggleCollapse(index) {
        const { items } = this.state;
        const descendants = findDescendants(items, index);

        const updateFn = {
            [index]: { $toggle: ['collapsed'] },
        };
        descendants.forEach((item) => {
            updateFn[items.indexOf(item)] = { $toggle: ['collapsed'] };
        });

        this.setState(update(this.state, {
            items: updateFn,
        }));
    }

    renderItem(props) { return <ItemRenderer {...props} onToggleCollapse={this.handleToggleCollapse} />; }

    componentWillUpdate() {
        let colLeft = document.getElementById('colLeft');

        this.DnDScope = colLeft;

        this.DnDScope = {
            body: colLeft,
        };
    }

    render() {
        const { items } = this.state;
        return (
            <div className={"DnD-Window"}>
                <section style={{ width: '100%' }}>
                    <div className="row" style={{ width: '100%' }}>
                        <div className="col-12 col-lg-8 col-xl-6" style={{ width: '100%' }}>
                            <Sortly
                                items={items}
                                itemRenderer={this.renderItem}
                                onMove={this.handleMove}
                                onChange={this.handleChange}
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
