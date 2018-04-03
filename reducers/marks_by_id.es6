import {
    ADD_RICH_MARK, DELETE_BOX, MOVE_RICH_MARK, DELETE_CONTAINED_VIEW, DELETE_NAV_ITEM, DELETE_RICH_MARK, EDIT_RICH_MARK,
    PASTE_BOX,
} from '../common/actions';
import { changeProp, changeProps, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";

export default function(state = {}, action = {}) {
    let newState;
    switch(action.type) {
    case ADD_RICH_MARK:
        newState = {
            ...state,
            [action.payload.mark.id]: action.payload.mark,
        };
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
    case MOVE_RICH_MARK:
        return {
            ...state,
            [action.payload.mark]: {
                ...state[action.payload.mark],
                value: action.payload.value,
            },
        };
    case EDIT_RICH_MARK:
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                ...action.payload.mark.mark,
            },
        };
    case PASTE_BOX:

        // let newMarks = action.payload.

        // newState = changeProp(state, )
        // return state;
        console.log(action.payload);
        return { ...state, ...action.payload.marks };
    default:
        return state;
    }

}
