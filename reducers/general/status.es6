import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../../common/actions';

export default function status(state = "draft", action = {}) {
    switch (action.type) {

    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value.status;
        } else if (action.payload.prop === 'status') {
            return action.payload.value;
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.status || state;
    default:
        return state;
    }}
