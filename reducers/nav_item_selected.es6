import { ADD_NAV_ITEM, DELETE_NAV_ITEM, SELECT_NAV_ITEM, IMPORT_STATE } from '../common/actions';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        if(action.payload.hasContent) {
            return action.payload.id;
        }
        return state;
    case DELETE_NAV_ITEM:
        if (action.payload.ids && action.payload.ids.length > 0 && action.payload.ids.includes(state)) {
            return 0;
        }
        return state;
    case SELECT_NAV_ITEM:
        return action.payload.id;
    case IMPORT_STATE:
        return 0;
    default:
        return state;
    }
}
