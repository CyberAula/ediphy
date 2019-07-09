import Utils, {
    changeProp, changeProps, deleteProp, deleteProps, isSortableBox, isContainedView, isSortableContainer,
    isBox,
} from '../common/utils';
import {
    ADD_BOX, ADD_NAV_ITEM, ADD_RICH_MARK, EDIT_RICH_MARK, MOVE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_SORTABLE_CONTAINER,
    DROP_BOX,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    DELETE_NAV_ITEM, DELETE_CONTAINED_VIEW, IMPORT_STATE, PASTE_BOX, UPDATE_PLUGIN_TOOLBAR, TOGGLE_TEXT_EDITOR,
    RESIZE_BOX, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../common/actions';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX } from '../common/constants';

function boxCreator(state, action) {
    let position;
    let level = 0;
    if (state[action.payload.ids.parent] && !isContainedView(action.payload.ids.container)) {
        level = state[action.payload.ids.parent].level + 1;
    }

    if (isSortableBox(action.payload.ids.id)) {
        position = { x: 0, y: 0, type: 'relative' };
        level = -1;
    } else {
        position = {
            x: 0,
            y: 0,
            type: 'absolute',
        };
    }
    if (isSortableContainer(action.payload.ids.container)) {
        position = {
            x: 0,
            y: 0,
            type: 'relative',
        };
    }
    let col = 0;
    let row = 0;
    if (action.payload.initialParams) {
        if (action.payload.initialParams.position) {
            position = action.payload.initialParams.position;
        }
        if (action.payload.initialParams.col) {
            col = action.payload.initialParams.col;
        }
        if (action.payload.initialParams.row) {
            row = action.payload.initialParams.row;
        }
        if (action.payload.initialParams.width) {
            // width = action.payload.initialParams.width;
        }
    }
    // sortableContainers for boxes inside this box (this is not EditorBoxSortable)
    let children = [];
    let sortableContainers = {};
    if (action.payload.state) {
        let pluginContainers = action.payload.state.__pluginContainerIds;
        if (pluginContainers) {
            for (let key in pluginContainers) {
                children.push(pluginContainers[key].id);
                sortableContainers[pluginContainers[key].id] = sortableContainerCreator(key, [], pluginContainers[key].height, action.payload.ids.id);
            }
        }
    }

    return {
        id: action.payload.ids.id,
        parent: action.payload.ids.parent,
        container: action.payload.ids.container,
        level: level,
        col: col,
        row: row,
        position: position,
        // width: width,
        // height: height,
        content: {}, // action.payload.content,
        draggable: action.payload.draggable,
        resizable: action.payload.resizable,
        showTextEditor: false,
        fragment: {},
        children: children,
        sortableContainers,
        containedViews: [],
    };
}

function sortableContainerCreator(key = "", children = [], height = "auto", parent) {
    return {
        children: children,
        style: {
            padding: '0px',
            borderColor: '#ffffff',
            borderWidth: '0px',
            borderStyle: 'solid',
            opacity: '1',
            textAlign: isBox(parent) ? 'left' : 'center',
            className: '',
        },
        height: height,
        key: key,
        colDistribution: [100],
        cols: [
            [100],
        ],
    };
}

function boxReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let a = changeProps(
            state,
            [
                "children",
                "sortableContainers",
            ], [
                (state.children.indexOf(action.payload.ids.container) !== -1) ? // if parent box contains container indicated
                    state.children : // nothing changes
                    [...state.children, action.payload.ids.container], // adds container to children
                sortableContainersReducer(state.sortableContainers, action),
            ]
        );
        return a;
    case ADD_RICH_MARK:
        return changeProp(state, "containedViews", [...state.containedViews, action.payload.mark.connection]);
    case CHANGE_COLS:
        if (action.payload.parent === state.id) {
            return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
        }
        return changeProps(
            state,
            [
                "col",
                "row",
            ], [
                state.col >= action.payload.distribution.length ? action.payload.distribution.length - 1 : state.col,
                state.col >= action.payload.distribution.length ? 0 : state.row,
            ]
        );
    case CHANGE_SORTABLE_PROPS:
        return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
    case CHANGE_ROWS:
        if (action.payload.parent === state.id) {
            return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
        }
        return changeProp(
            state,
            "row",
            state.row >= action.payload.distribution.length ?
                action.payload.distribution.length - 1 :
                state.row
        );
    case DELETE_BOX:
        return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
    case DELETE_SORTABLE_CONTAINER:
        return changeProps(
            state,
            [
                "children",
                "sortableContainers",
            ], [
                state.children.filter(id => id !== action.payload.id),
                sortableContainersReducer(state.sortableContainers, action),
            ]
        );
    case DROP_BOX:
        if (state.id === action.payload.parent || state.id === action.payload.oldParent) { // If we are dealing with the new or the previous parents, we need to modify the sortable containers of each one of them to add/delete the dropped box to/from its children
            // Two boxes can have containers with the same name (like plugins inside plugins) so we need to let them know in which box we are. That's why we create a new value in the action.payload
            return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, Object.assign({}, action, { payload: Object.assign({}, action.payload, { currentBoxReducer: state.id }) })));
        } else if (state.id === action.payload.id) { // If we are dealing with the dropped box, we need to modify some of its properties

            let newLevel = isBox(action.payload.parent) ? 1 : 0;
            let isResizable = !(isBox(action.payload.parent) || isSortableBox(action.payload.parent)); // Change from slide to sortable or viceversa
            return changeProps(
                state,
                [
                    "parent",
                    "container",
                    "row",
                    "col",
                    "position",
                    "level",
                    "resizable",
                ], [
                    action.payload.parent,
                    action.payload.container,
                    action.payload.row,
                    action.payload.col,
                    action.payload.position || state.position,
                    newLevel,
                    isResizable,
                ]);
        }
        return state;
    case RESIZE_BOX:
        return changeProp(state, "position",
            {
                x: action.payload.structure.x || state.position.x,
                y: action.payload.structure.y || state.position.y,
                type: state.position.type,
            }
        );

    case MOVE_BOX:
        return changeProp(state, "position",
            {
                x: action.payload.x,
                y: action.payload.y,
                type: action.payload.position,
            }
        );

    case REORDER_SORTABLE_CONTAINER:
        return changeProp(state, "children", action.payload.ids);
    case REORDER_BOXES:
        return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
    case UPDATE_PLUGIN_TOOLBAR:
        let newSortableContainers = {};
        let newChildren = [];
        if (action.payload.name instanceof Array && action.payload.name.indexOf("__pluginContainerIds") > -1) {
            for (let containerKey in action.payload.value[1]) {
                let container = action.payload.value[1][containerKey];
                // if not found -> create new one; otherwise copy existing
                if (!state.sortableContainers[container.id] && action.payload.value[1][containerKey]) {
                    newSortableContainers[container.id] = sortableContainerCreator(containerKey, [], container.height, action.payload.id);
                } else {
                    newSortableContainers[container.id] = Utils.deepClone(state.sortableContainers[container.id]);
                }
                newChildren.push(containerKey);
            }

            // return state;
            return changeProps(
                state,
                [
                    /* "content",*/
                    "children",
                    "sortableContainers",
                ], [
                    /* action.payload.content,*/
                    newChildren,
                    newSortableContainers,
                ]
            );
        }
        return state;

    case UPDATE_BOX:
        // sortableContainers for boxes inside this box (this is not EditorBoxSortable) (***** only working with PLUGIN inside PLUGIN)
        let sortableContainers = {};
        let children = [];
        if (action.payload.state.__pluginContainerIds) {
            for (let containerKey in action.payload.state.__pluginContainerIds) {
                let container = action.payload.state.__pluginContainerIds[containerKey];
                // if not found -> create new one; otherwise copy existing
                if (!state.sortableContainers[container.id]) {
                    sortableContainers[container.id] = sortableContainerCreator(containerKey, [], container.height, action.payload.id);
                } else {
                    sortableContainers[container.id] = Utils.deepClone(state.sortableContainers[container.id]);
                }
                children.push(container.id);
            }
        }

        return changeProps(
            state,
            [
                "children",
                "sortableContainers",
            ], [
                children,
                sortableContainers,
            ]
        );
    case DUPLICATE_NAV_ITEM:
        let id = action.payload.boxes[state.id];
        let parent = action.payload.boxes[state.parent] ? action.payload.boxes[state.parent] : state.parent;
        if (parent === action.payload.id) {
            parent = action.payload.newId;
        }
        let sortableContainersObj = {};
        if (state.sortableContainers) {
            sortableContainersObj = JSON.parse(JSON.stringify(state.sortableContainers));
            for (let sc in sortableContainersObj) {
                let children_boxes = sortableContainersObj[sc].children.map(child=>{
                    return action.payload.boxes[child];
                });
                sortableContainersObj[sc].children = children_boxes;
            }
        }
        return { ...state, id, parent, sortableContainers: sortableContainersObj };
    default:
        return state;
    }
}

function singleSortableContainerReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        if (action.payload.index || (action.payload.initialParams && action.payload.initialParams.index)) {
            let newOrder = [...state.children];
            newOrder.splice(action.payload.index || action.payload.initialParams.index, 0, action.payload.ids.id);
            return changeProp(state, "children", newOrder);
        }
        return changeProp(state, "children", [...state.children, action.payload.ids.id]);
    case CHANGE_COLS:
        let cols = state.cols;
        let distributionLength = action.payload.distribution.length;
        if (distributionLength < cols.length) {
            cols = cols.slice(0, distributionLength);
        }
        let reduced = action.payload.distribution.reduce(function(prev, curr) {
            return prev + curr;
        });
        if (reduced > 99 || reduced <= 101) {
            if (distributionLength > cols.length) {
                let difference = distributionLength - cols.length;
                for (let i = 0; i < difference; i++) {
                    cols.push([100]);
                }
            }
        }

        return changeProps(
            state,
            [
                "colDistribution",
                "cols",
            ], [
                action.payload.distribution,
                cols,
            ]
        );
    case CHANGE_ROWS:
        let newCols = state.cols.slice();
        newCols[action.payload.column] = action.payload.distribution;
        return changeProp(state, "cols", newCols);
    case CHANGE_SORTABLE_PROPS:
        return changeProp(state, "style", changeProp(state.style, action.payload.prop, action.payload.value));
    case DELETE_BOX:
        return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
    case DROP_BOX:
        if (action.payload.oldContainer === action.payload.container && action.payload.oldParent === action.payload.parent && (action.payload.index || action.payload.index === 0)) {
            let newCh = state.children.filter(id => id !== action.payload.id);
            newCh.splice(action.payload.index, 0, action.payload.id);
            return changeProp(state, "children", newCh);
        }
        if (state.key === action.payload.oldContainer && action.payload.currentBoxReducer === action.payload.oldParent) {
            return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
        } else if (state.key === action.payload.container && action.payload.currentBoxReducer === action.payload.parent) {
            if (action.payload.index || action.payload.index === 0) {
                let newOrder = [...state.children];
                newOrder.splice(action.payload.index, 0, action.payload.id);
                return changeProp(state, "children", newOrder);
            }
            return changeProp(state, "children", [...state.children, action.payload.id]);
        }
        return state;
    case REORDER_BOXES:
        return changeProp(state, "children", action.payload.order);
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, "height", action.payload.height);
    default:
        return state;
    }
}

function sortableContainersReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let a = changeProp(
            state,
            action.payload.ids.container,
            state[action.payload.ids.container] ?
                singleSortableContainerReducer(state[action.payload.ids.container], action) :
                sortableContainerCreator(action.payload.ids.container, [action.payload.ids.id], "auto", action.payload.ids.parent)
        );
        return a;
    case ADD_NAV_ITEM:
    case ADD_RICH_MARK:
        return state;
    case CHANGE_COLS:
        return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
    case CHANGE_ROWS:
        return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
    case CHANGE_SORTABLE_PROPS:
        return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
    case DELETE_BOX:
        return changeProp(state, action.payload.container, singleSortableContainerReducer(state[action.payload.container], action));
    case DROP_BOX:
        if (action.payload.parent === action.payload.oldParent) { // Sibling containers
            if (action.payload.oldContainer !== action.payload.container) { // But not the same one
                return changeProps(state,
                    [action.payload.oldContainer, action.payload.container],
                    [
                        singleSortableContainerReducer(state[action.payload.oldContainer], action),
                        singleSortableContainerReducer(state[action.payload.container], action),
                    ]);
            }
            return changeProp(state,
                action.payload.oldContainer, singleSortableContainerReducer(state[action.payload.oldContainer], action));

            // return state; // If we are moving to the same container we do nothing
        } else if (action.payload.currentBoxReducer === action.payload.oldParent) {
            return changeProp(state,
                action.payload.oldContainer,
                singleSortableContainerReducer(state[action.payload.oldContainer], action)
            );
        } else if (action.payload.currentBoxReducer === action.payload.parent) {
            return changeProp(state,
                action.payload.container,
                singleSortableContainerReducer(state[action.payload.container], action)
            );
        }
        return state;
    case DELETE_SORTABLE_CONTAINER:
        return deleteProp(state, action.payload.id);
    case REORDER_BOXES:
        return changeProp(state, action.payload.container, singleSortableContainerReducer(state[action.payload.container], action));
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
    default:
        return state;
    }
}

export default function(state = {}, action = {}) {
    let newState;
    let temp;
    switch (action.type) {
    case ADD_BOX:
        // if box is contained in sortableContainer, add it as well to its children
        if (isSortableContainer(action.payload.ids.container)) {
            let r = changeProps(
                state,
                [
                    action.payload.ids.id,
                    action.payload.ids.parent,
                ], [
                    boxCreator(state, action),
                    boxReducer(state[action.payload.ids.parent], action),
                ]
            );
            return r;
        }

        let a = changeProp(state, action.payload.ids.id, boxCreator(state, action));

        return a;
    case REORDER_SORTABLE_CONTAINER:
        return {
            ...state,
            [action.payload.parent]: {
                ...state[action.payload.parent],
                children: [].concat(action.payload.ids),
            },
        };
    case ADD_NAV_ITEM:
        if(action.payload.type === "document") {
            return {
                ...state,
                [action.payload.sortable_id]: {
                    parent: action.payload.id,
                    id: action.payload.sortable_id,
                    container: 0,
                    level: -1,
                    col: 0,
                    row: 0,
                    position: { type: "relative", x: 0, y: 0 },
                    draggable: false,
                    resizable: false,
                    showTextEditor: false,
                    fragment: {},
                    children: [],
                    sortableContainers: {},
                    containedViews: [],
                },
            };
        }
        return state;
    case PASTE_BOX:
        let ids = Object.keys(action.payload.children);
        let bx = ids.map(k => {return action.payload.children[k].box;});
        if (isSortableContainer(action.payload.ids.container)) {

            return changeProps(
                state,
                [
                    action.payload.ids.id,
                    action.payload.ids.parent,
                    ...ids,
                ], [
                    action.payload.box,
                    boxReducer(state[action.payload.ids.parent], action),
                    ...bx,
                ]
            );
        }
        return changeProps(
            state,
            [action.payload.ids.id, ...ids],
            [action.payload.box, ...bx]
        );
    case MOVE_BOX:
        return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
    case RESIZE_BOX:
        return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
    case UPDATE_BOX:
    case TOGGLE_TEXT_EDITOR:
    case UPDATE_PLUGIN_TOOLBAR:
        let updatedState = JSON.parse(JSON.stringify(state));
        for (let b in action.payload.deletedBoxes) {
            delete updatedState[action.payload.deletedBoxes[b]];
        }
        return changeProp(updatedState, action.payload.id, boxReducer(updatedState[action.payload.id], action));
    case ADD_RICH_MARK:
    case EDIT_RICH_MARK:
        // If rich mark is connected to a contained view (new or existing), mark.connection will include this information;
        // otherwise, it's just the id/url and we're not interested
        if ((action.payload.mark.id && action.payload.view && isContainedView(action.payload.view.id)) && (action.payload.mark.connectMode === "new" || action.payload.mark.connectMode === "existing")) {
            let newBoxState = {
                ...state,
                [action.payload.mark.origin]: {
                    ...state[action.payload.mark.origin],
                    containedViews: state[action.payload.mark.origin].containedViews.concat([action.payload.view.id]),
                },
            };
            if(action.payload.mark.connectMode === "new" && action.payload.view.type === "document") {
                newBoxState = {
                    ...newBoxState,
                    [action.payload.view.boxes[0]]: {
                        parent: action.payload.view.id,
                        id: action.payload.view.boxes[0],
                        container: 0,
                        level: -1,
                        col: 0,
                        row: 0,
                        position: { type: "relative", x: 0, y: 0 },
                        draggable: false,
                        resizable: false,
                        showTextEditor: false,
                        fragment: {},
                        children: [],
                        sortableContainers: {},
                        containedViews: [],
                    },

                };
            }
            return newBoxState;
        }
        return state;
    case REORDER_BOXES:
        return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
    case CHANGE_SORTABLE_PROPS:
        return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
    case DROP_BOX:
        if (isSortableBox(action.payload.parent) || isBox(action.payload.parent)) { // New parent is box
            if (action.payload.oldParent === action.payload.parent) { // Same parent as before but container or row changes
                // We need to change the box's container and tell the parent
                return changeProps(state, [action.payload.id, action.payload.parent], [boxReducer(state[action.payload.id], action), boxReducer(state[action.payload.parent], action)]);
            } // Different parent
            if (isBox(action.payload.oldParent) || isSortableBox(action.payload.oldParent)) { // Old parent was a box
                // We need to change the new and old parent
                return changeProps(state, [action.payload.id, action.payload.parent, action.payload.oldParent], [boxReducer(state[action.payload.id], action), boxReducer(state[action.payload.parent], action), boxReducer(state[action.payload.oldParent], action)]);
            } // Old parent was a page or something else
            // We just need to change the new parent
            return changeProps(state, [action.payload.id, action.payload.parent], [boxReducer(state[action.payload.id], action), boxReducer(state[action.payload.parent], action)]);

        } // New parent is something other than a box
        if (!isBox(action.payload.parent) && !isSortableBox(action.payload.parent)) { // Old parent was a box
            // We need to change the box's parent and container and remove the child from the old parent.
            return changeProps(state, [action.payload.id, action.payload.oldParent], [boxReducer(state[action.payload.id], action), boxReducer(state[action.payload.oldParent], action)]);
        } // Old parent was a page or something else
        // We do nothing because boxes cannot change their parents to another page.
        return state;
        // return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
    case CHANGE_COLS:
        newState = changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        action.payload.boxesAffected.forEach(id => {
            newState = changeProp(newState, id, boxReducer(newState[id], action));
        });
        return newState;
    case CHANGE_ROWS:
        newState = changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        action.payload.boxesAffected.forEach(id => {
            newState = changeProp(newState, id, boxReducer(newState[id], action));
        });
        return newState;
    case DELETE_BOX:
        let children = action.payload.children ? action.payload.children : [];
        let which_children = children.concat(action.payload.id);
        temp = deleteProps(state, children.concat(action.payload.id));

        // If box is in sortableContainer, delete from its children aswell
        if (isSortableContainer(action.payload.container)) {
            return changeProp(temp, action.payload.parent, boxReducer(state[action.payload.parent], action));
        }
        return temp;
    case DELETE_CONTAINED_VIEW:
        let newBoxes = JSON.parse(JSON.stringify(state));
        Object.keys(action.payload.parent).forEach((el)=>{
            if(newBoxes[el] && newBoxes[el].containedViews) {
                let index = newBoxes[el].containedViews.indexOf(action.payload.ids[0]);
                if(index > -1) {
                    newBoxes[el].containedViews.splice(index, 1);
                }
            }
        });
        return deleteProps(newBoxes, action.payload.boxes);
    case DELETE_SORTABLE_CONTAINER:
        let tempState = deleteProps(state, action.payload.children);
        return changeProp(tempState, action.payload.parent, boxReducer(state[action.payload.parent], action));
    case DELETE_NAV_ITEM:
        // TODO: Delete linked marks
        return deleteProps(state, action.payload.boxes);
    case IMPORT_STATE:
        return action.payload.present.boxesById || state;
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.boxesById };
    case DUPLICATE_NAV_ITEM:
        let newBoxesArr = {};
        for (let box in action.payload.boxes) {
            let newId = action.payload.boxes[box];
            newBoxesArr[newId] = boxReducer(state[box], action);
        }
        return { ...state, ...newBoxesArr };
    default:
        return state;
    }
}
