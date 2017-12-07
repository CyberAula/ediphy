import {
    ADD_BOX, INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE,
    PASTE_BOX, MOVE_BOX,
} from '../common/actions';
import { isSortableBox } from '../common/utils';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        return 0;
    case INCREASE_LEVEL:
        return state + 1;
    case DELETE_NAV_ITEM:
        return 0;
    case SELECT_BOX:
        if (action.payload.id === -1) {
            return 0;
        }
        if (isSortableBox(action.payload.id)) {
            return -1;
        }
        // If level is -1 because a EditorBoxSortable was selected previously, we want to return 0, otherwise, return current
        return Math.max(state, 0);
    case IMPORT_STATE:
        return 0;
    case SELECT_NAV_ITEM:
        return 0;
    case PASTE_BOX:
        return 0;

    default:
        return state;
    }
}
