import {ADD_NAV_ITEM, DELETE_NAV_ITEM, SELECT_NAV_ITEM, IMPORT_STATE} from './../actions';

export default function (state = 0, action = {}) {
    switch (action.type) {
        case ADD_NAV_ITEM:
            if(action.payload.hasContent){
                return action.payload.id;
            }
            return state;
        case DELETE_NAV_ITEM:
            if (action.payload.ids && action.payload.ids.length > 0 && state === action.payload.ids[0]) {
                return 0;
            } 
            return state;
        case SELECT_NAV_ITEM:
            return action.payload.id;
        case IMPORT_STATE:
            return action.payload.present.navItemSelected || state;
        default:
            return state;
    }
}