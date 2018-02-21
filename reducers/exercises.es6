import {
    ADD_NAV_ITEM, DELETE_NAV_ITEM, ADD_BOX, DELETE_BOX, PASTE_BOX, SET_CORRECT_ANSWER, IMPORT_STATE,
    DELETE_SORTABLE_CONTAINER,
} from '../common/actions';

import { isBox, existsAndIsViewOrContainedView, changeProp, deleteProp, deleteProps } from '../common/utils';

function singleExerciseReducer(state = {}, action = {}) {
    switch (action.type) {
    case SET_CORRECT_ANSWER:
        let newScoreState = JSON.parse(JSON.stringify(state));
        if (newScoreState) {
            newScoreState.correctAnswer = action.payload.correctAnswer;
        }
        return newScoreState;
    default:
        return state;
    }
}

function exercisesReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let name = action.type === 'ADD_BOX' ? action.payload.config.name : action.payload.toolbar.config.name;
        let config = Ediphy.Plugins.get(name).getConfig();
        if (config && config.category === 'evaluation') {
            let defaultCorrectAnswer = (config.defaultCorrectAnswer === null || config.defaultCorrectAnswer === undefined) ? true : config.defaultCorrectAnswer;
            return changeProp(state, action.payload.ids.id, {
                id: action.payload.ids.id,
                weight: 1,
                correctAnswer: defaultCorrectAnswer,
                currentAnswer: defaultCorrectAnswer,
                showFeedback: true,
            });
        }
        return state;
    case SET_CORRECT_ANSWER:
        return changeProp(state, action.payload.id, singleExerciseReducer(state[action.payload.id], action));
    case DELETE_BOX:
        return deleteProp(state, action.payload.id);
    case DELETE_SORTABLE_CONTAINER:
        return deleteProps(state, action.payload.children);
    default:
        return state;
    }
}

function singlePageReducer(state = {}, action = {}) {
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
    case ADD_BOX:
    case PASTE_BOX:
    case SET_CORRECT_ANSWER:
    case DELETE_BOX:
    case DELETE_SORTABLE_CONTAINER:
        return changeProp(state, "exercises", exercisesReducer(state.exercises, action));
    default:
        return state;
    }
}

export default function(state = {}, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        if(action.payload.hasContent) {
            return changeProp(state, action.payload.id, singlePageReducer(state[action.payload.id], action));
        }
        return state;
    case ADD_BOX:
    case PASTE_BOX:
        if (action.payload.ids && isBox(action.payload.ids.id || "") && existsAndIsViewOrContainedView(action.payload.ids.page)) {
            return changeProp(state, action.payload.ids.page, singlePageReducer(state[action.payload.ids.page], action));
        }
        return state;
    case DELETE_NAV_ITEM:
        return deleteProps(state, action.payload.ids);
    case DELETE_BOX:
    case SET_CORRECT_ANSWER:
    case DELETE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.page, singlePageReducer(state[action.payload.page], action));
    case IMPORT_STATE:
        return action.payload.present.exercises || state;
    default:
        return state;
    }
}
