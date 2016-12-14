import {ADD_NAV_ITEM, REORDER_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE} from './../actions';

export default function (state = [], action = {}) {
    switch (action.type) {
        case ADD_NAV_ITEM:
            let temp = state.slice();
            temp.splice(action.payload.position, 0, action.payload.id);
            return temp;
        case DELETE_NAV_ITEM:
            return state.filter(id => action.payload.ids.indexOf(id) === -1);
        case REORDER_NAV_ITEM:
            return action.payload.idsInOrder;
        case IMPORT_STATE:
            return action.payload.present.navItemsIds || state;
        default:
            return state;
    }
}