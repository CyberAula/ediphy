import {
    ADD_RICH_MARK, DELETE_BOX, MOVE_RICH_MARK, DELETE_CONTAINED_VIEW, DELETE_NAV_ITEM, DELETE_RICH_MARK, EDIT_RICH_MARK,
    PASTE_BOX, IMPORT_STATE,
} from '../common/actions';
import { deleteProp, changeProp, changeProps, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";

export default function(state = {}, action = {}) {
    let newState;
    let marks_to_be_deleted;
    switch(action.type) {
    case ADD_RICH_MARK:
        newState = {
            ...state,
            [action.payload.mark.id]: action.payload.mark,
        };
        return newState;
    case DELETE_BOX:
        newState = { ...state };
        let marks = Object.keys(newState).map((mark)=>{
            if(action.payload.id === newState[mark].origin) {
                return mark;
            }
            if (action.payload.children.indexOf(newState[mark].origin) > -1) {
                return mark;
            }
            return undefined;
        }).filter(r=> r !== undefined);
        marks.forEach((mark)=>{
            delete newState[mark];
        });
        return newState;
    case DELETE_CONTAINED_VIEW:
        marks_to_be_deleted = [];

        marks_to_be_deleted = marks_to_be_deleted.concat(Object.keys(action.payload.parent));
        if(marks_to_be_deleted.length > 0) {
            newState = { ...state };
            for(let d in marks_to_be_deleted) {
                delete newState[marks_to_be_deleted[d]];
            }
            return newState;
        }
        return state;
    case DELETE_NAV_ITEM:
        marks_to_be_deleted = [];

        Object.keys(state).map(mark=>{
            if(action.payload.boxes.includes(state[mark].origin)) {
                marks_to_be_deleted.push(mark);
            }
            if(Object.keys(action.payload.linkedBoxes).includes(mark)) {
                marks_to_be_deleted.push(mark);
            }
        });
        if(marks_to_be_deleted.length > 0) {
            newState = { ...state };
            for(let d in marks_to_be_deleted) {
                delete newState[marks_to_be_deleted[d]];
            }
            return newState;
        }
        return state;
    case DELETE_RICH_MARK:
        newState = deleteProp(state, action.payload.mark.id);
        return newState;
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
        return { ...state, ...action.payload.marks };
    case IMPORT_STATE:
        return action.payload.present.marksById || state;
    default:
        return state;
    }

}
