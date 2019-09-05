import {
    ADD_RICH_MARK, DELETE_BOX, MOVE_RICH_MARK, DELETE_CONTAINED_VIEW, DELETE_NAV_ITEM, DELETE_RICH_MARK, EDIT_RICH_MARK,
    PASTE_BOX, IMPORT_STATE, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../../common/actions';
import { deleteProp } from "../../common/utils";
import { marksSerializer } from "../serializer";

export default function(state = {}, action = {}) {
    let newState;
    let marks_to_be_deleted;
    let newMark;
    switch(action.type) {
    case ADD_RICH_MARK:
        newMark = { ...action.payload.mark };
        if (newMark.connectMode === "new") {
            newMark.connectMode = "existing";
        }
        return {
            ...state,
            [action.payload.mark.id]: newMark,
        };
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
        newMark = { ...action.payload.mark };
        if (newMark.connectMode === "new") {
            newMark.connectMode = "existing";
        }
        return {
            ...state,
            [action.payload.mark.id]: {
                ...state[action.payload.mark.id],
                ...newMark,
            },
        };
    case PASTE_BOX:
        // let newMarks = action.payload.
        // newState = changeProp(state, )
        // return state;
        return { ...state, ...action.payload.marks };
    case IMPORT_STATE:
        return marksSerializer(action.payload.present.marksById, action.payload.present.version) || state;
    case IMPORT_EDI:
        return { ...state, ...marksSerializer(action.payload.state.marksById, action.payload.state.version) };
    case DUPLICATE_NAV_ITEM:
        let candidates = {};
        let suffix = action.payload.suffix;
        for (let mark_id in state) {
            let mark = state[mark_id];
            let isCandidate = Object.keys(action.payload.boxes).indexOf(mark.origin);
            if (isCandidate > -1) {
                candidates[mark_id + suffix] = { ...mark, id: mark_id + suffix, origin: action.payload.boxes[mark.origin] };
            }
        }
        return { ...state, ...candidates };
    default:
        return state;
    }

}
