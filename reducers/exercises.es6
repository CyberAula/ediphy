import {
    ADD_NAV_ITEM, DELETE_NAV_ITEM, ADD_BOX, DELETE_BOX, PASTE_BOX, SET_CORRECT_ANSWER, IMPORT_STATE,
    DELETE_SORTABLE_CONTAINER,
} from '../common/actions';

import { isBox, existsAndIsViewOrContainedView, changeProp } from '../common/utils';

function singleExerciseReducer(state = {}, action = {}) {
    switch (action.type) {
    case SET_CORRECT_ANSWER:
        let newScoreState = JSON.parse(JSON.stringify(state));
        if (newScoreState) {
            newScoreState.correctAnswer = action.payload.correctAnswer;
        }
        return newScoreState;
    }
}

function exercisesReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let name = action.payload.config.name;
        let config = Ediphy.Plugins.get(name).getConfig();
        if (config && config.category == 'evaluation') {
            let defaultCorrectAnswer = config.defaultCorrectAnswer || true;
            return changeProp(state, action.payload.ids.id, { id: action.payload.ids.id, weight: 1, correctAnswer: defaultCorrectAnswer });
        }
        return state;
    case SET_CORRECT_ANSWER:
        return changeProp(state, action.payload.id, singleExerciseReducer(state[action.payload.id], action));
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
            weight: 10,
            exercises: {},
        };
    case ADD_BOX:
    case PASTE_BOX:
    case SET_CORRECT_ANSWER:
        return changeProp(state, "exercises", exercisesReducer(state.exercises, action));
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
    case SET_CORRECT_ANSWER:
        return changeProp(state, action.payload.page, singlePageReducer(state[action.payload.page], action));
    case DELETE_NAV_ITEM: // TODO
        return state;
    case DELETE_BOX:// TODO
        return state;
    case DELETE_SORTABLE_CONTAINER:// TODO
        return state;
    case IMPORT_STATE:
        return action.payload.present.exercises || state;
    default:
        return state;
    }
}
