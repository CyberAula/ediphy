import { ADD_NAV_ITEM, DELETE_NAV_ITEM, DELETE_CONTAINED_VIEW, SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE } from '../common/actions';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        return 0;
        // case DELETE_NAV_ITEM:
        //     return 0;
    case SELECT_CONTAINED_VIEW:
        return action.payload.id;
    case DELETE_CONTAINED_VIEW:
        return 0;
    case SELECT_NAV_ITEM:
        return 0;
    case IMPORT_STATE:
        return action.payload.present.containedViewSelected || state;
    default:
        return state;
    }
}
