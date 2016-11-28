import {ADD_BOX, INCREASE_LEVEL, SELECT_BOX, SELECT_NAV_ITEM, REMOVE_NAV_ITEM} from './../actions';
import {ID_PREFIX_SORTABLE_BOX} from './../constants';

export default function (state = 0, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return 0;
        case INCREASE_LEVEL:
            return state + 1;
        case REMOVE_NAV_ITEM:
            return 0;
        case SELECT_BOX:
            if (action.payload.id === -1) {
                return 0;
            }
            if (action.payload.id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1) {
                return -1;
            }
            return state;
        case SELECT_NAV_ITEM:
            return 0;
        default:
            return state;
    }
}