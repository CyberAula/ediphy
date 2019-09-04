import {
    ADD_NAV_ITEM, DELETE_CONTAINED_VIEW, SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE,
    INDEX_SELECT,
} from '../../common/actions';
import { isContainedView, isPage } from '../../common/utils';

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
    case INDEX_SELECT:
        if (isContainedView(action.payload.id)) {
            return action.payload.id;
        } else if (isPage(action.payload.id)) {
            return 0;
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.containedViewSelected || 0;
    default:
        return state;
    }
}
