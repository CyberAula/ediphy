import { ADD_NAV_ITEM, REORDER_NAV_ITEM, DELETE_NAV_ITEM, IMPORT_STATE, ADD_NAV_ITEMS } from '../common/actions';

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
        return action.payload.present.navItemsIds || state;
    default:
        return state;
    }
}
