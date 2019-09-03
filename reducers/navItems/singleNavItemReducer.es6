import {
    ADD_BOX,
    ADD_NAV_ITEM, ADD_RICH_MARK,
    CHANGE_BACKGROUND,
    CHANGE_BOX_LAYER, DELETE_BOX, DELETE_NAV_ITEM, DELETE_RICH_MARK, DROP_BOX, EDIT_RICH_MARK, EXPAND_NAV_ITEM,
    PASTE_BOX, REORDER_NAV_ITEM, TOGGLE_NAV_ITEM,
} from '../../common/actions';
import { changeProp, changeProps, deleteProp } from '../../common/utils';

export function singleNavItemReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let a = changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
        return a;
    case CHANGE_BOX_LAYER:
        let boxes = JSON.parse(JSON.stringify(action.payload.boxes_array));
        let x = boxes.indexOf(action.payload.id);
        if (action.payload.value === 'front') { boxes.push(boxes.splice(x, 1)[0]); }
        if (action.payload.value === 'back') { boxes.unshift(boxes.splice(x, 1)[0]);}
        if (action.payload.value === 'ahead' && x <= boxes.length - 1) {
            boxes.splice(x + 1, 0, boxes.splice(x, 1)[0]);
        }
        if (action.payload.value === 'behind' && x >= 0) {
            boxes.splice(x - 1, 0, boxes.splice(x, 1)[0]);
        }
        return changeProp(state, "boxes", boxes);
    case ADD_NAV_ITEM:
        let newChildren = JSON.parse(JSON.stringify(state.children));
        if (action.payload.id) {
            newChildren = [...newChildren, action.payload.id];
        } else if (action.payload.ids) {
            newChildren = newChildren.concat(action.payload.ids);
        }
        return changeProps(
            state,
            [
                "children",
                "isExpanded",
            ], [
                newChildren,
                true,
            ]
        );
    case CHANGE_BACKGROUND:
        return changeProp(state, "background", action.payload.background);
    case DELETE_BOX:
        let stateWithoutBox = changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        if(stateWithoutBox.extraFiles[action.payload.id]) {
            return changeProp(
                stateWithoutBox,
                "extraFiles",
                deleteProp(stateWithoutBox, action.payload.id)
            );
        }
        return stateWithoutBox;
    case EDIT_RICH_MARK:
        if((action.payload.mark.connectMode === "existing" || action.payload.mark.connectMode === "new") && state[action.payload.mark.connection]) {
            return {
                ...state,
                [state[action.payload.mark.connection]]: {
                    ...state[action.payload.mark.connection],
                    linkedBoxes: {
                        ...state[action.payload.mark.connection].linkedBoxes,
                        [action.payload.id]: action.payload.origin,
                    },
                },
            };
        }
        return state;
    case DELETE_RICH_MARK:
        if(action.payload.mark.connectMode === "existing" && state[action.payload.mark.connection]) {
            let lb = {
                ...state[action.payload.mark.connection].linkedBoxes,
            };
            delete lb[action.payload.mark.id];
            return changeProp(state, "linkedBoxes", lb);
        }
        return state;
    case EXPAND_NAV_ITEM:
        return changeProp(state, "isExpanded", action.payload.value);
    case DELETE_NAV_ITEM:
        return changeProp(state, "children", state.children.filter(id => id !== action.payload.ids[0]));
    case REORDER_NAV_ITEM:
        if (state.id === action.payload.id) {
        // Action was replaced, payload is different

            return changeProps(
                state,
                [
                    "parent",
                    "hidden",
                    "level",
                ], [
                    action.payload.newParent.id,
                    state.hidden, // action.payload.newParent.hidden,
                    action.payload.newParent.level + 1,
                ]
            );
        }
        // This order is important!!
        // If checked the other way round, when newParent and oldParent are equal, item moved will be deleted from children

        let uniq = (arr) => {
            let outArr = [];
            for (let elem of arr) {
                if (outArr.indexOf(elem) === -1) {
                    outArr.push(elem);
                }
            }
            return outArr;
        };
        if (state.id === action.payload.newParent) {
            let uniqueChildrenOrdered = uniq(action.payload.childrenInOrder);

            return changeProp(state, "children", uniqueChildrenOrdered);
        }
        if (state.id === action.payload.oldParent) {
            return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
        }

        return state;
    case TOGGLE_NAV_ITEM:
        return changeProp(state, "hidden", action.payload.value);
    case DROP_BOX:
        if (state.id === action.payload.parent) {
            return changeProp(state, "boxes", [...state.boxes, action.payload.id]);
        } else if (state.id === action.payload.oldParent) {
            return changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        }
        return state;
    case ADD_RICH_MARK:
        let oldParents = JSON.parse(JSON.stringify(state.linkedBoxes));
        if(Object.keys(oldParents).indexOf(action.payload.parent) === -1) {
            oldParents[action.payload.parent] = [action.payload.mark.id];
        } else {
            oldParents[action.payload.parent].push(action.payload.mark.id);
        }
        return changeProp(state, "linkedBoxes", oldParents);
    // return changeProp(state, "linkedBoxes", [...(state.linkedBoxes || []), action.payload.parent]);
    default:
        return state;
    }
}
