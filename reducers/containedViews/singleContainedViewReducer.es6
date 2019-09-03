import {
    ADD_BOX,
    ADD_RICH_MARK,
    CHANGE_BACKGROUND,
    CHANGE_BOX_LAYER,
    DELETE_BOX,
    DELETE_RICH_MARK, DROP_BOX, PASTE_BOX,
} from '../../common/actions';
import { changeProp } from '../../common/utils';

export function singleContainedViewReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
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
    case ADD_RICH_MARK:
        // only fired when new mark is connected to existing cv
        let oldParents = JSON.parse(JSON.stringify(state.parent));
        if (!oldParents || Object.keys(oldParents).indexOf(action.payload.parent) === -1) {
            oldParents[action.payload.parent] = [action.payload.mark.id];
        } else {
            oldParents[action.payload.parent].push(action.payload.mark.id);
        }
        return changeProp(state, "parent", oldParents);
    // return state;
    case CHANGE_BACKGROUND:
        return changeProp(state, "background", action.payload.background);
    case DELETE_RICH_MARK:
        if ((action.payload.mark.connectMode === "new" || action.payload.mark.connectMode === "existing")) {
            let newParent = { ...state.parent };
            if(newParent[action.payload.mark.id]) {
                delete newParent[action.payload.mark.id];
                return changeProp(state, "parent", newParent);
            }
        }
        return state;
    case DELETE_BOX:
        let modState = JSON.parse(JSON.stringify(state));
        delete modState.parent[action.payload.id];
        return changeProp(modState, "boxes", modState.boxes.filter(id => action.payload.id !== id));
    case DROP_BOX:
        if (state.id === action.payload.parent) {
            return changeProp(state, "boxes", [...state.boxes, action.payload.id]);
        } else if (state.id === action.payload.oldParent) {
            return changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        }
        return state;
    case PASTE_BOX:
        return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
    default:
        return state;
    }
}
