import {
    ADD_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW, DELETE_NAV_ITEM, DELETE_RICH_MARK, EDIT_RICH_MARK,
    PASTE_BOX,
} from '../common/actions';
import { changeProp, changeProps, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";

export default function(state = {}, action = {}) {
    let newState;
    switch(action.type) {
    case ADD_RICH_MARK:
        newState = changeProp(state, action.payload.id, { ...action.payload.mark });
        return newState;
    case DELETE_BOX:
        newState = { ...state };
        let marks = Object.keys(state).map((mark)=>{
            return action.payload.id === mark.parent;
        });
        marks.forEach((mark)=>{
            delete newState[mark];
        });
        return newState;
    case DELETE_CONTAINED_VIEW:
        newState = deleteProps(state, action.payload.id);
        return state;
    case DELETE_NAV_ITEM:
        return state;
    case DELETE_RICH_MARK:
        newState = deleteProps(state, action.payload.id);
        return state;
    case EDIT_RICH_MARK:
        newState = changeProp(state, action.payload.id, action.payload);
        return newState;
    case PASTE_BOX:
        // let newMarks = action.payload.

        // newState = changeProp(state, )
        return state;
    default:
        return state;
    }

}
