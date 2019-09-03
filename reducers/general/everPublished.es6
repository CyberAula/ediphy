import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../../common/actions';

export default function everPublished(state = false, action = {}) {
    switch (action.type) {
    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE' && action.payload.value.status === 'final' && state === false) {
            return true;
        } else if (action.payload.prop === 'status' && action.payload.value === 'final' && state === false) {
            return true;
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.everPublished === undefined ? state : action.payload.present.everPublished;
    default:
        return state;
    }}
