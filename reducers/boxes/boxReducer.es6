import {
    ADD_BOX,
    ADD_RICH_MARK,
    CHANGE_COLS,
    CHANGE_ROWS,
    CHANGE_SORTABLE_PROPS,
    DELETE_BOX,
    DELETE_SORTABLE_CONTAINER,
    DROP_BOX, DUPLICATE_NAV_ITEM,
    MOVE_BOX,
    PASTE_BOX,
    REORDER_BOXES,
    REORDER_SORTABLE_CONTAINER,
    RESIZE_BOX,
    RESIZE_SORTABLE_CONTAINER,
    UPDATE_BOX,
    UPDATE_PLUGIN_TOOLBAR,
} from '../../common/actions';
import Utils, { changeProp, changeProps, isBox, isSortableBox } from '../../common/utils';
import sortableContainersReducer from './sortableContainersReducer';
import { sortableContainerCreator } from "../_helpers/sortableContainerCreator";

export default function boxReducer(state = {}, action = {}) {
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
