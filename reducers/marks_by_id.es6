import { ADD_RICH_MARK, DELETE_CONTAINED_VIEW, DELETE_RICH_MARK, PASTE_BOX } from '../common/actions';

export default function(state = {}, action = {}) {
    let newState;
    switch(action.type) {
    case ADD_RICH_MARK:
        return state;
    case DELETE_CONTAINED_VIEW:
        return state;
    case DELETE_RICH_MARK:
        return state;
    case PASTE_BOX:
        return state;
    default:
        return state;
    }

}
