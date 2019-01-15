import {
    ADD_BOX, ADD_NAV_ITEM, DELETE_BOX, DELETE_SORTABLE_CONTAINER, DELETE_NAV_ITEM, SELECT_BOX,
    DELETE_CONTAINED_VIEW,
    SELECT_CONTAINED_VIEW, SELECT_NAV_ITEM, IMPORT_STATE, PASTE_BOX, INDEX_SELECT, DUPLICATE_NAV_ITEM,
} from '../common/actions';
import { ID_PREFIX_BOX } from '../common/constants';
import { isBox, isSortableBox, isContainedView, isPage } from '../common/utils';

export default function(state = -1, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        // When we create a new document, new EditorBoxSortable is created aswell; we don't want it to be selected
        if (isSortableBox(action.payload.ids.id)) {
            if (isContainedView(action.payload.ids.parent)) {
                return state;
            }
            return -1;
        }
        // When we create a new box with default plugins, we don't want them to be selected
        if (action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
            let a = state;
            return a;
        }
        // Just normal situation
        return action.payload.ids.id;

    case ADD_NAV_ITEM:
        return -1;
    case DELETE_BOX:
        // If box is in contained view, it has a box as a parent -> we need to check this and select none
        if (isContainedView(action.payload.container)) {
            return -1;
        }
        // When we delete a box inside another one, we want its parent to be selected
        if (isBox(action.payload.parent)) {
            return action.payload.parent;
        }
        return -1;
    case DELETE_SORTABLE_CONTAINER:
        return -1;
    case DELETE_NAV_ITEM:
        return -1;
    case DELETE_CONTAINED_VIEW:
        return -1;
    case SELECT_BOX:
        return action.payload.id;
    case SELECT_CONTAINED_VIEW:
        return -1;
    case INDEX_SELECT:
        if (isContainedView(action.payload.id) || isPage(action.payload.id)) {
            return -1;
        }
    case SELECT_NAV_ITEM:
        return -1;
    case IMPORT_STATE:
        return -1;
    case PASTE_BOX:
        return action.payload.ids.id;
    case DUPLICATE_NAV_ITEM:
        return -1;
    default:
        return state;
    }
}
