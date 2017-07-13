import {ADD_BOX, ADD_CONTAINED_VIEW, ADD_RICH_MARK, DELETE_BOX,DELETE_CONTAINED_VIEW, CHANGE_CONTAINED_VIEW_NAME, TOGGLE_TITLE_MODE, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, IMPORT_STATE} from './../actions';
import {changeProp, deleteProps, isContainedView, findNavItemContainingBox} from './../utils';

function singleContainedViewReducer(state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
        case DELETE_BOX:
            return changeProp(state, "boxes", state.boxes.filter(id => action.payload.id !== id));
        case TOGGLE_TITLE_MODE:
            return changeProp(state, "header", action.payload.titles);
        case CHANGE_CONTAINED_VIEW_NAME:
            return changeProp(state, "name", action.payload.title);
        default:
            return state;
    }
}

export default function (state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            if (isContainedView(action.payload.ids.parent)) {
                return changeProp(
                    state,
                    action.payload.ids.parent,
                    singleContainedViewReducer(state[action.payload.ids.parent], action));
            }
            return state;
        case ADD_RICH_MARK:
            // If rich mark is connected to a new contained view, mark.connection will include this information;
            // otherwise, it's just the id/url and we're not interested
            if (action.payload.mark.connection.id) {
                return changeProp(state, action.payload.mark.connection.id, action.payload.mark.connection);
            }
            return state;
      /*  case DELETE_BOX:
            let stateWithViewsDeleted = deleteProps(state, action.payload.childrenViews);
            if (isContainedView(action.payload.parent)) {
                stateWithViewsDeleted = changeProp(
                    stateWithViewsDeleted,
                    action.payload.parent,
                    singleContainedViewReducer(stateWithViewsDeleted[action.payload.parent], action));
            }
            return stateWithViewsDeleted;*/
        case CHANGE_CONTAINED_VIEW_NAME:
            return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
        case DELETE_CONTAINED_VIEW:
            return deleteProps(state, action.payload.ids);
      /*  case DELETE_NAV_ITEM:
            return deleteProps(state, action.payload.containedViews);*/
        /*case DELETE_SORTABLE_CONTAINER:
            let item = findNavItemContainingBox(state,action.payload.parent);
            if(item) {
                if(item.extraFiles.length !== 0) {
                    return Object.assign({}, state,
                                    Object.assign({},
                                        {
                                            [findNavItemContainingBox(state, action.payload.parent).id]:
                                            Object.assign(
                                                {},
                                                findNavItemContainingBox(state, action.payload.parent),
                                                {extraFiles: {}
                                                }
                                            )
                                        }
                                    )
                        );
                }
            }
            return state;*/
            // return deleteProps(state, action.payload.childrenViews);
        case TOGGLE_TITLE_MODE:
            if (isContainedView(action.payload.id)) {
                return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
            }
            return state;
        case IMPORT_STATE:
            return action.payload.present.containedViewsById || state;
        default:
            return state;
    }
}