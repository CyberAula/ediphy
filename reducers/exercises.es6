import {
    ADD_NAV_ITEM, ADD_NAV_ITEMS, DELETE_NAV_ITEM, ADD_BOX, DELETE_BOX, PASTE_BOX, SET_CORRECT_ANSWER, IMPORT_STATE,
    DELETE_SORTABLE_CONTAINER, ADD_RICH_MARK, CONFIG_SCORE, EDIT_RICH_MARK,
} from '../common/actions';

import { isBox, existsAndIsViewOrContainedView, changeProp, changeProps, deleteProp, deleteProps, isContainedView } from '../common/utils';

function singleExerciseReducer(state = {}, action = {}) {
    switch (action.type) {
    case SET_CORRECT_ANSWER:
        let newScoreState = JSON.parse(JSON.stringify(state));
        if (newScoreState) {
            newScoreState.correctAnswer = action.payload.correctAnswer;
        }
        return newScoreState;
    case CONFIG_SCORE:
        return Object.assign({}, state, { [action.payload.button]: action.payload.value });
    default:
        return state;
    }
}

function exercisesReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let name = action.type === 'ADD_BOX' ? action.payload.initialParams.name : action.payload.toolbar.pluginId;
        let config = Ediphy.Plugins.get(name).getConfig();
        if (config && config.category === 'evaluation') {
            let defaultCorrectAnswer = (config.defaultCorrectAnswer === null || config.defaultCorrectAnswer === undefined) ? true : config.defaultCorrectAnswer;
            let defaultCurrentAnswer = (config.defaultCurrentAnswer === null || config.defaultCurrentAnswer === undefined) ? true : config.defaultCurrentAnswer;
            return changeProp(state, action.payload.ids.id, action.payload.score ? { ...action.payload.score, id: action.payload.ids.id } : {
                name,
                id: action.payload.ids.id,
                weight: 1,
                correctAnswer: defaultCorrectAnswer,
                currentAnswer: defaultCurrentAnswer,
                showFeedback: true,
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
    case ADD_RICH_MARK:
    case EDIT_RICH_MARK:
        return {
            id: action.type === ADD_RICH_MARK ? action.payload.mark.connection : action.payload.mark.mark.connection,
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

export default function(state = {}, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        if(action.payload.hasContent) {
            return changeProp(state, action.payload.id, singlePageReducer(state[action.payload.id], action));
        }
        return state;
    case ADD_NAV_ITEMS:
        let navIds = action.payload.navs.map(nav => { return nav.id; });
        let navs = action.payload.navs.map(nav => { return singlePageReducer(state, { type: ADD_NAV_ITEM, payload: nav }); });
        return changeProps(
            state,
            [...navIds],
            [...navs]
        );
    case ADD_RICH_MARK:
        if (isContainedView(action.payload.mark.connection) && !state[action.payload.mark.connection]) {
            return changeProp(state, action.payload.mark.connection, singlePageReducer(state[action.payload.mark.connection], action));
        }
        return state;
    case EDIT_RICH_MARK:
        if (isContainedView(action.payload.mark.mark.connection) && !state[action.payload.mark.mark.connection]) {
            return changeProp(state, action.payload.mark.mark.connection, singlePageReducer(state[action.payload.mark.markconnection], action));
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
        if (action.payload.page) {
            let page = action.payload.page.id ? action.payload.page.id : action.payload.page;
            return changeProp(state, page, singlePageReducer(state[page], action));
        }
        return state;
    case CONFIG_SCORE:
        return changeProp(state, action.payload.page, singlePageReducer(state[action.payload.page], action));
    case IMPORT_STATE:
        return action.payload.present.exercises || state;
    default:
        return state;
    }
}
