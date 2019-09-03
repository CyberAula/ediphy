import {
    ADD_BOX,
    ADD_NAV_ITEM,
    ADD_RICH_MARK, CONFIG_SCORE,
    DELETE_BOX, DELETE_SORTABLE_CONTAINER,
    EDIT_RICH_MARK,
    PASTE_BOX,
    SET_CORRECT_ANSWER,
} from '../../common/actions';
import { changeProp, isBox } from '../../common/utils';
import { exercisesReducer } from './exercisesReducer';

export function singleExercisePageReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        return {
            id: action.payload.id,
            submitButton: true,
            trackProgress: false,
            attempted: false,
            minForPass: 50,
            score: 0,
            weight: 10,
            exercises: {},
        };
    case ADD_RICH_MARK:
    case EDIT_RICH_MARK:
        return {
            id: action.type === ADD_RICH_MARK ? action.payload.mark.connection : action.payload.mark.connection,
            submitButton: true,
            trackProgress: false,
            attempted: false,
            minForPass: 50,
            score: 0,
            weight: 10,
            exercises: {},
        };
    case ADD_BOX:
    case PASTE_BOX:
    case SET_CORRECT_ANSWER:
    case DELETE_BOX:
    case DELETE_SORTABLE_CONTAINER:
        return changeProp(state, "exercises", exercisesReducer(state.exercises, action));
    case CONFIG_SCORE:
        if (isBox(action.payload.id)) {
            return changeProp(state, "exercises", exercisesReducer(state.exercises, action));
        }
        return Object.assign({}, state, { [action.payload.button]: action.payload.value });
    default:
        return state;
    }
}
