import {
    ADD_BOX,
    CONFIG_SCORE,
    DELETE_BOX,
    DELETE_SORTABLE_CONTAINER,
    PASTE_BOX,
    SET_CORRECT_ANSWER,
} from '../../common/actions';
import { changeProp, deleteProp, deleteProps } from '../../common/utils';
import { singleExerciseReducer } from './singleExerciseReducer';

export function exercisesReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let name = action.type === 'ADD_BOX' ? action.payload.initialParams.name : action.payload.toolbar.pluginId;
        let config = action.payload.ids.config; // Ediphy.Plugins.get(name).getConfig();
        if (config && config.category === 'evaluation') {
            let defaultCorrectAnswer = (config.defaultCorrectAnswer === null || config.defaultCorrectAnswer === undefined) ? true : config.defaultCorrectAnswer;
            let defaultCurrentAnswer = (config.defaultCurrentAnswer === null || config.defaultCurrentAnswer === undefined) ? true : config.defaultCurrentAnswer;
            return changeProp(state, action.payload.ids.id, action.payload.score ? { ...action.payload.score, id: action.payload.ids.id } : {
                name,
                id: action.payload.ids.id,
                weight: 1,
                correctAnswer: (action.payload.ids.exercises && action.payload.ids.exercises.correctAnswer !== undefined) ? action.payload.ids.exercises.correctAnswer : defaultCorrectAnswer,
                currentAnswer: (action.payload.ids.exercises && action.payload.ids.exercises.currentAnswer !== undefined) ? action.payload.ids.exercises.currentAnswer : defaultCurrentAnswer,
                showFeedback: (action.payload.ids.exercises && action.payload.ids.showFeedback),
                attempted: false,
                score: 0,
            });
        }
        return state;
    case SET_CORRECT_ANSWER:
    case CONFIG_SCORE:
        return changeProp(state, action.payload.id, singleExerciseReducer(state[action.payload.id], action));
    case DELETE_BOX:
        if (action.payload.id in state) {
            return deleteProp(state, action.payload.id);
        }
        return state;

    case DELETE_SORTABLE_CONTAINER:
        return deleteProps(state, action.payload.children);
    default:
        return state;
    }
}
