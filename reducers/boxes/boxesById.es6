import {
    changeProp, changeProps, deleteProps, isSortableBox, isContainedView, isSortableContainer,
    isBox,
} from '../../common/utils';
import {
    ADD_BOX, ADD_NAV_ITEM, ADD_RICH_MARK, EDIT_RICH_MARK, MOVE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_SORTABLE_CONTAINER,
    DROP_BOX,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    DELETE_NAV_ITEM, DELETE_CONTAINED_VIEW, IMPORT_STATE, PASTE_BOX, UPDATE_PLUGIN_TOOLBAR, TOGGLE_TEXT_EDITOR,
    RESIZE_BOX, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../../common/actions';
import { boxCreator } from '../_helpers/boxCreator';
import boxReducer from './boxReducer';

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
    case CHANGE_ROWS:
        newState = changeProp(state, action.payload.parent, boxReducer(state[action.payload.parent], action));
        action.payload.boxesAffected.forEach(id => {
            newState = changeProp(newState, id, boxReducer(newState[id], action));
        });
        return newState;
    case DELETE_BOX:
        let children = action.payload.children ? action.payload.children : [];
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
