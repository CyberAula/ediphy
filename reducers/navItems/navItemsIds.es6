import {
    ADD_NAV_ITEM, REORDER_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE, ADD_NAV_ITEMS,
    DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../../common/actions';

export default function(state = [], action = {}) {
    switch (action.type) {
    case ADD_NAV_ITEM:
        let temp = state.slice();
        temp.splice(action.payload.position, 0, action.payload.id);
        return temp;
    case ADD_NAV_ITEMS:
        let tempMultiple = state.slice();
        action.payload.navs.map(nav=> tempMultiple.splice(nav.position, 0, nav.id));
        return tempMultiple;
    case DELETE_NAV_ITEM:
        return state.filter(id => action.payload.ids.indexOf(id) === -1);
    case REORDER_NAV_ITEM:
        return action.payload.idsInOrder;
    case IMPORT_STATE:
        return action.payload.present.navItemsIds || [];
    case IMPORT_EDI:
        return [...state, ...action.payload.state.navItemsIds];
    case DUPLICATE_NAV_ITEM:
        let dup = state.indexOf(action.payload.id);
        let temp2 = state.slice();
        temp2.splice(dup + 1, 0, action.payload.newId);
        return temp2;
    default:
        return state;
    }
}
