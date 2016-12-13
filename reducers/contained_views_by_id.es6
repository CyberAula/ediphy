import {ADD_BOX, ADD_RICH_MARK, DELETE_BOX, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, IMPORT_STATE} from './../actions';
import {changeProp, deleteProps, isContainedView} from './../utils';

function singleContainedViewReducer(state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
        case DELETE_BOX:
            return changeProp(state, "boxes", state.boxes.filter(id => action.payload.id !== id));
        default:
            return state;
    }
}

export default function (state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            if (isContainedView(action.payload.ids.container)) {
                return changeProp(
                    state,
                    action.payload.ids.container,
                    singleContainedViewReducer(state[action.payload.ids.container], action));
            }
            return state;
        case ADD_RICH_MARK:
            // If rich mark is connected to a new contained view, mark.connection will include this information;
            // otherwise, it's just the id/url and we're not interested
            if (action.payload.mark.connection.id) {
                return changeProp(state, action.payload.mark.connection.id, action.payload.mark.connection);
            }
            return state;
        case DELETE_BOX:
            let stateWithViewsDeleted = deleteProps(state, action.payload.childrenViews);
            if (isContainedView(action.payload.container)) {
                stateWithViewsDeleted = changeProp(
                    stateWithViewsDeleted,
                    action.payload.container,
                    singleContainedViewReducer(stateWithViewsDeleted[action.payload.container], action));
            }
            return stateWithViewsDeleted;
        case DELETE_NAV_ITEM:
            return deleteProps(state, action.payload.containedViews);
        case DELETE_SORTABLE_CONTAINER:
            return deleteProps(state, action.payload.childrenViews);
        case IMPORT_STATE:
            return action.payload.present.containedViewsById || state;
        default:
            return state;
    }
}