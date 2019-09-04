import {
    ADD_BOX,
    ADD_NAV_ITEM,
    ADD_RICH_MARK,
    CHANGE_COLS,
    CHANGE_ROWS,
    CHANGE_SORTABLE_PROPS, DELETE_BOX, DELETE_SORTABLE_CONTAINER, DROP_BOX,
    PASTE_BOX, REORDER_BOXES, RESIZE_SORTABLE_CONTAINER,
} from '../../common/actions';
import { changeProp, changeProps, deleteProp } from '../../common/utils';
import { sortableContainerCreator } from '../_helpers/sortableContainerCreator';
import singleSortableContainerReducer from './singleSortableContainerReducer';

export default function sortableContainersReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        let a = changeProp(
            state,
            action.payload.ids.container,
            state[action.payload.ids.container] ?
                singleSortableContainerReducer(state[action.payload.ids.container], action) :
                sortableContainerCreator(action.payload.ids.container, [action.payload.ids.id], "auto", action.payload.ids.parent)
        );
        return a;
    case CHANGE_COLS:
    case CHANGE_ROWS:
    case CHANGE_SORTABLE_PROPS:
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.id, singleSortableContainerReducer(state[action.payload.id], action));
    case DELETE_BOX:
    case REORDER_BOXES:
        return changeProp(state, action.payload.container, singleSortableContainerReducer(state[action.payload.container], action));
    case DROP_BOX:
        if (action.payload.parent === action.payload.oldParent) { // Sibling containers
            if (action.payload.oldContainer !== action.payload.container) { // But not the same one
                return changeProps(state,
                    [action.payload.oldContainer, action.payload.container],
                    [
                        singleSortableContainerReducer(state[action.payload.oldContainer], action),
                        singleSortableContainerReducer(state[action.payload.container], action),
                    ]);
            }
            return changeProp(state,
                action.payload.oldContainer, singleSortableContainerReducer(state[action.payload.oldContainer], action));

        // return state; // If we are moving to the same container we do nothing
        } else if (action.payload.currentBoxReducer === action.payload.oldParent) {
            return changeProp(state,
                action.payload.oldContainer,
                singleSortableContainerReducer(state[action.payload.oldContainer], action)
            );
        } else if (action.payload.currentBoxReducer === action.payload.parent) {
            return changeProp(state,
                action.payload.container,
                singleSortableContainerReducer(state[action.payload.container], action)
            );
        }
        return state;
    case DELETE_SORTABLE_CONTAINER:
        return deleteProp(state, action.payload.id);
    case ADD_NAV_ITEM:
    case ADD_RICH_MARK:
    default:
        return state;
    }
}
