import {
    ADD_BOX, INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE,
    PASTE_BOX, MOVE_BOX, DROP_BOX,
} from '../common/actions';
import { isSortableBox, isBox } from '../common/utils';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        return isBox(action.payload.ids.parent) ? 1 : 0;
    case INCREASE_LEVEL:
        return state + 1;
    case DELETE_NAV_ITEM:
        return 0;
    case SELECT_BOX:
        if (isSortableBox(action.payload.id)) {
            return -1;
        }
        return action.payload.box && action.payload.box.level ? action.payload.box.level : Math.max(state, 0);
    case IMPORT_STATE:
        return 0;
    case SELECT_NAV_ITEM:
        return 0;
    case PASTE_BOX:
        return 0;
    case DROP_BOX:
        return isBox(action.payload.parent) ? 1 : 0;
    default:
        return state;
    }
}
