import Utils, {changeProp, changeProps, deleteProp, deleteProps, isSortableBox, isContainedView, isSortableContainer} from './../utils';
import {ADD_BOX, MOVE_BOX, DUPLICATE_BOX, RESIZE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_SORTABLE_CONTAINER, DROP_BOX, ADD_RICH_MARK,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    DELETE_NAV_ITEM, IMPORT_STATE} from './../actions';
import {ID_PREFIX_BOX} from './../constants';

function boxCreator(state, action) {
    let position, width, height;
    let level = 0;
    if (state[action.payload.ids.parent] && !isContainedView(action.payload.ids.container)) {
        level = state[action.payload.ids.parent].level + 1;
    }

    if (isSortableBox(action.payload.ids.id)) {
        position = {x: 0, y: 0, type: 'relative'};
        width = '100%';
        level = -1;
    } else {
        position = {
            x: 0,
            y: 0,
            type: 'absolute'
        };
        if (action.payload.config.category !== "text") {
            width = 200;
        }
        height = 'auto';
    }
    if (isSortableContainer(action.payload.ids.container)) {
        position.x = 0;
        position.y = 0;
        position.type = 'relative';
        if (isSortableBox(action.payload.ids.parent)) {
            if (action.payload.config.category !== "text") {
                width = "25%";
            }
        }
        height = 'auto';
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
            width = action.payload.initialParams.width;
        }
    }

    // sortableContainers for boxes inside this box (this is not DaliBoxSortable)
    let children = [];
    let sortableContainers = {};
    if (action.payload.state) {
        let pluginContainers = action.payload.state.__pluginContainerIds;
        if (pluginContainers) {
            for (let key in pluginContainers) {
                children.push(pluginContainers[key].id);
                sortableContainers[pluginContainers[key].id] = sortableContainerCreator(key, [], pluginContainers[key].height);
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
        width: width,
        height: height,
        content: action.payload.content,
        draggable: action.payload.draggable,
        resizable: action.payload.resizable,
        showTextEditor: false,
        fragment: {},
        children: children,
        sortableContainers: sortableContainers,
        containedViews: []
    };
}

function sortableContainerCreator(key = "", children = [], height = "auto") {
    return {
        children: children,
        style: {
            padding: '0px',
            borderColor: '#ffffff',
            borderWidth: '0px',
            borderStyle: 'solid',
            opacity: '1',
            textAlign: 'center',
            className: ''
        },
        height: height,
        key: key,
        colDistribution: [100],
        cols: [
            [100]
        ]
    };
}

function boxReducer(state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProps(
                state,
                [
                    "children",
                    "sortableContainers"
                ], [
                    (state.children.indexOf(action.payload.ids.container) !== -1) ? // if parent box contains container indicated
                        state.children : // nothing changes
                        [...state.children, action.payload.ids.container], // adds container to children
                    sortableContainersReducer(state.sortableContainers, action)
                ]
            );
        case ADD_RICH_MARK:
            return changeProp(state, "containedViews", [...state.containedViews, action.payload.mark.connection.id]);
        case CHANGE_COLS:
            if (action.payload.parent === state.id) {
                return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
            }
            return changeProps(
                state,
                [
                    "col",
                    "row"
                ], [
                    state.col >= action.payload.distribution.length ? action.payload.distribution.length - 1 : state.col,
                    state.col >= action.payload.distribution.length ? 0 : state.row
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
                    "sortableContainers"
                ], [
                    state.children.filter(id => id !== action.payload.id),
                    sortableContainersReducer(state.sortableContainers, action)
                ]
            );
        case DROP_BOX:
            return changeProps(
                state,
                [
                    "row",
                    "col"
                ], [
                    action.payload.row,
                    action.payload.col
                ]
            );
        case MOVE_BOX:
            return changeProp(state, "position",
                {
                    x: action.payload.x,
                    y: action.payload.y,
                    type: action.payload.position
                }
            );
        case REORDER_SORTABLE_CONTAINER:
            return changeProp(state, "children", action.payload.ids);
        case REORDER_BOXES:
            return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
        case RESIZE_BOX:
            return changeProps(
                state,
                [
                    "width",
                    "height"
                ], [
                    action.payload.width,
                    action.payload.height
                ]
            );
        case RESIZE_SORTABLE_CONTAINER:
            return changeProp(state, "sortableContainers", sortableContainersReducer(state.sortableContainers, action));
        case UPDATE_BOX:
            // sortableContainers for boxes inside this box (this is not DaliBoxSortable)
            let sortableContainers = {};
            let children = [];
            if (action.payload.state.__pluginContainerIds) {
                for (let containerKey in action.payload.state.__pluginContainerIds) {
                    let container = action.payload.state.__pluginContainerIds[containerKey];
                    // if not found -> create new one; otherwise copy existing
                    if (!state.sortableContainers[container.id]) {
                        sortableContainers[container.id] = sortableContainerCreator(containerKey, [], container.height);
                    } else {
                        sortableContainers[container.id] = Utils.deepClone(state.sortableContainers[container.id]);
                    }
                    children.push(container.id);
                }
            }

            return changeProps(
                state,
                [
                    "content",
                    "children",
                    "sortableContainers"
                ], [
                    action.payload.content,
                    children,
                    sortableContainers
                ]
            );
        default:
            return state;
    }
}

function singleSortableContainerReducer(state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProp(state, "children", [...state.children, action.payload.ids.id]);
        case CHANGE_COLS:
            let cols = state.cols;
            let distributionLength = action.payload.distribution.length;
            if (distributionLength < cols.length) {
                cols = cols.slice(0, distributionLength);
            }
            let reduced = action.payload.distribution.reduce(function (prev, curr) {
                return prev + curr;
            });
            if (reduced > 99 || reduced <= 101) {
                if (distributionLength > cols.length) {
                    let difference = distributionLength - cols.length;
                    for (var i = 0; i < difference; i++) {
                        cols.push([100]);
                    }
                }
            }

            return changeProps(
                state,
                [
                    "colDistribution",
                    "cols"
                ], [
                    action.payload.distribution,
                    cols
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
            return changeProp(
                state,
                action.payload.ids.container,
                state[action.payload.ids.container] ?
                    singleSortableContainerReducer(state[action.payload.ids.container], action) :
                    sortableContainerCreator("", [action.payload.ids.id])
            );
        case CHANGE_COLS:
            return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
        case CHANGE_ROWS:
            return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
        case CHANGE_SORTABLE_PROPS:
            return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
        case DELETE_BOX:
            return changeProp(state, action.payload.container, singleSortableContainerReducer(state[action.payload.container], action));
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


export default function (state = {}, action = {}) {
    var newState;
    let temp;
    console.log(action);
    switch (action.type) {
        case ADD_BOX:
            // if box is contained in sortableContainer, add it aswell to its children
            if (isSortableContainer(action.payload.ids.container)) {
                return changeProps(
                    state,
                    [
                        action.payload.ids.id,
                        action.payload.ids.parent
                    ], [
                        boxCreator(state, action),
                        boxReducer(state[action.payload.ids.parent], action)
                    ]
                );
            }
            return changeProp(state, action.payload.ids.id, boxCreator(state, action));
        case MOVE_BOX:
            return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
        case DUPLICATE_BOX:
            //TODO
            newState = Object.assign({}, state);
            let replaced = Object.assign({}, state);
            let newIds = action.payload.newIds;
            let newId = ID_PREFIX_BOX + action.payload.newId;
            //let count = 0;
            Object.keys(newIds).map(box => {
                replaced = Object.replaceAll(replaced, box, newIds[box]);
            });
            replaced = Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId);//split -
            let defState = Object.assign({}, newState, replaced);
            if (action.payload.container !== 0) {
                replaced[action.payload.parent].sortableContainers[action.payload.container].children.push(action.payload.id);
            }

            return Object.assign({}, defState, {
                [newId]: Object.assign({}, defState[newId], {position: {x: 0, y: 0, position: 'absolute'}})
            });

        case RESIZE_BOX:
            return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
        case RESIZE_SORTABLE_CONTAINER:
            return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        case UPDATE_BOX:
            return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
        case ADD_RICH_MARK:
            // If rich mark is connected to a new contained view, mark.connection will include this information;
            // otherwise, it's just the id/url and we're not interested
            if (action.payload.mark.connection.id) {
                return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
            }
            return state;
        case REORDER_BOXES:
            return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        case CHANGE_SORTABLE_PROPS:
            return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        case DROP_BOX:
            return changeProp(state, action.payload.id, boxReducer(state[action.payload.id], action));
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
            temp = deleteProps(state, children.concat(action.payload.id));

            //If box is in sortableContainer, delete from its children aswell
            if (isSortableContainer(action.payload.container)) {
                return changeProp(temp, action.payload.parent, boxReducer(state[action.payload.parent], action));
            }
            return temp;
        case DELETE_SORTABLE_CONTAINER:
            temp = deleteProps(state, action.payload.children);
            return changeProp(temp, action.payload.parent, boxReducer(state[action.payload.parent], action));
        case DELETE_NAV_ITEM:
            return deleteProps(state, action.payload.boxes);
        case REORDER_SORTABLE_CONTAINER:
            return changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        case IMPORT_STATE:
            return action.payload.present.boxesById || state;
        default:
            return state;
    }
}