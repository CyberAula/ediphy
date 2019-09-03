import { CONFIG_SCORE, SET_CORRECT_ANSWER } from '../../common/actions';

export function singleExerciseReducer(state = {}, action = {}) {
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
