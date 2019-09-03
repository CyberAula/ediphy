import {
    ADD_NAV_ITEM, DELETE_NAV_ITEM, INDEX_SELECT, SELECT_NAV_ITEM, IMPORT_STATE,
    DUPLICATE_NAV_ITEM,
} from '../../common/actions';

export default function(state = 0, action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        return action.payload.id;
    case DELETE_NAV_ITEM:
        return 0;
    case SELECT_NAV_ITEM:
        return state;
    case INDEX_SELECT:
        return action.payload.id;
    case IMPORT_STATE:
        return 0;
    case DUPLICATE_NAV_ITEM:
        return action.payload.newId;
    default:
        return state;
    }
}
