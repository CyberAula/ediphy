import {
    ADD_NAV_ITEM, ADD_NAV_ITEMS, DELETE_NAV_ITEM, ADD_BOX, DELETE_BOX, PASTE_BOX, SET_CORRECT_ANSWER, IMPORT_STATE,
    DELETE_SORTABLE_CONTAINER, ADD_RICH_MARK, CONFIG_SCORE, EDIT_RICH_MARK, DELETE_CONTAINED_VIEW, DUPLICATE_NAV_ITEM,
    IMPORT_EDI,
} from '../../common/actions';

import { isBox, existsAndIsViewOrContainedView, changeProp, changeProps, deleteProps, isContainedView } from '../../common/utils';
import { singleExercisePageReducer } from './singleExercisePageReducer';

export default function(state = {}, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        if(action.payload.hasContent) {
            return changeProp(state, action.payload.id, singleExercisePageReducer(state[action.payload.id], action));
        }
        return state;
    case ADD_NAV_ITEMS:
        let navIds = action.payload.navs.map(nav => { return nav.id; });
        let navs = action.payload.navs.map(nav => { return singleExercisePageReducer(state, { type: ADD_NAV_ITEM, payload: nav }); });
        return changeProps(
            state,
            [...navIds],
            [...navs]
        );
    case ADD_RICH_MARK:
        if (isContainedView(action.payload.mark.connection) && !state[action.payload.mark.connection]) {
            return changeProp(state, action.payload.mark.connection, singleExercisePageReducer(state[action.payload.mark.connection], action));
        }
        return state;
    case EDIT_RICH_MARK:
        if (isContainedView(action.payload.mark.connection) && !state[action.payload.mark.connection]) {
            return changeProp(state, action.payload.mark.connection, singleExercisePageReducer(state[action.payload.mark.connection], action));
        }
        return state;
    case ADD_BOX:
    case PASTE_BOX:
        if (action.payload.ids && isBox(action.payload.ids.id || "") && existsAndIsViewOrContainedView(action.payload.ids.page)) {
            let a = changeProp(state, action.payload.ids.page, singleExercisePageReducer(state[action.payload.ids.page], action));
            return a;
        }
        return state;
    case DELETE_NAV_ITEM:
    case DELETE_CONTAINED_VIEW:
        return deleteProps(state, action.payload.ids);

    case DELETE_BOX:
    case SET_CORRECT_ANSWER:
    case DELETE_SORTABLE_CONTAINER:
        if (action.payload.page) {
            let page = action.payload.page.id ? action.payload.page.id : action.payload.page;
            return changeProp(state, page, singleExercisePageReducer(state[page], action));
        }
        return state;
    case CONFIG_SCORE:
        return changeProp(state, action.payload.page, singleExercisePageReducer(state[action.payload.page], action));
    case IMPORT_STATE:
        return action.payload.present.exercises || state;
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.exercises };
    case DUPLICATE_NAV_ITEM:
        let newExercise = JSON.parse(JSON.stringify(state[action.payload.id]));
        newExercise.id = action.payload.newId;
        let newExercises = {};
        for (let ex in newExercise.exercises) {
            let newId = action.payload.boxes[ex];
            newExercises[newId] = { ...newExercise.exercises[ex], id: newId };
        }
        newExercise.exercises = newExercises;
        return { ...state, [action.payload.newId]: newExercise };
    default:
        return state;
    }
}
