import {
    ADD_BOX, INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE,
    PASTE_BOX, MOVE_BOX, DROP_BOX, DELETE_BOX, DUPLICATE_NAV_ITEM,
} from '../../common/actions';
import { isSortableBox, isBox } from '../../common/utils';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        if (action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
            return 0;
        }
        return isBox(action.payload.ids.parent) ? 1 : 0;
    case INCREASE_LEVEL:
        return state + 1;
    case MOVE_BOX:
        return isBox(action.payload.parent) ? 1 : 0;
    case SELECT_BOX:
        if (isSortableBox(action.payload.id)) {
            return -1;
        }
        return (action.payload.box && !isNaN(action.payload.box.level)) ? action.payload.box.level : 0/* Math.max(state, 0)*/;
    case DROP_BOX:
        return isBox(action.payload.parent) ? 1 : 0;
    case DUPLICATE_NAV_ITEM:
    case IMPORT_STATE:
    case DELETE_NAV_ITEM:
    case SELECT_NAV_ITEM:
    case PASTE_BOX:
    case DELETE_BOX:
        return 0;
    default:
        return state;
    }
}
