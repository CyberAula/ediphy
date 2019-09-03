import { CHANGE_GLOBAL_CONFIG, IMPORT_STATE } from '../../common/actions';
import { changeProp } from '../../common/utils';
import { globalConfig } from "../serializer";
import { emptyState } from '../../core/store/state.empty';

export default function(state = { ...emptyState().undoGroup.present.globalConfig }, action = {}) {
    switch (action.type) {
    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value;
        }
        return changeProp(state, action.payload.prop, action.payload.value);
    case IMPORT_STATE:
        return globalConfig(action.payload.present.globalConfig) || state;
    default:
        return state;
    }
}
