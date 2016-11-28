import {ADD_BOX, ADD_NAV_ITEM, DELETE_BOX, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX, REMOVE_NAV_ITEM, SELECT_BOX,
    SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE} from './../actions';
import {ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_BOX} from './../constants';
import {isBox, isSortableBox} from './../utils';

export default function (state = -1, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            // When we create a new document, new DaliBoxSortable is created aswell; we don't want it to be selected
            if (isSortableBox(action.payload.ids.id)) {
                return -1;
            }
            // When we create a new box with default plugins, we don't want them to be selected
            if (action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
                return state;
            }
            // Just normal situation
            return action.payload.ids.id;
        case ADD_NAV_ITEM:
            return -1;
        case DELETE_BOX:
            // If box is in contained view, it has a box as a parent -> we need to check this and select none
            if (action.payload.container.length && action.payload.container.indexOf(ID_PREFIX_CONTAINED_VIEW) !== -1) {
                return -1;
            }
            // When we delete a box inside another one, we want it's parent to be selected
            if (isBox(action.payload.parent)) {
                return action.payload.parent;
            }
            return -1;
        case DELETE_SORTABLE_CONTAINER:
            return -1;
        case DUPLICATE_BOX:
            return ID_PREFIX_BOX + action.payload.newId;
        case REMOVE_NAV_ITEM:
            return -1;
        case SELECT_BOX:
            return action.payload.id;
        case SELECT_CONTAINED_VIEW:
            return -1;
        case SELECT_NAV_ITEM:
            return -1;
        case IMPORT_STATE:
            return action.payload.present.boxSelected || state;
        default:
            return state;
    }
}