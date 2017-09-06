import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../common/actions';
import { changeProp } from '../common/utils';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        return changeProp(state, action.payload.prop, action.payload.value);
    case IMPORT_STATE:
        return action.payload.present.globalConfig || state;
    default:
        return state;
    }
}
