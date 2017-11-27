import { ADD_BOX, ADD_CONTAINED_VIEW, ADD_RICH_MARK, DELETE_RICH_MARK, EDIT_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW, CHANGE_CONTAINED_VIEW_NAME, TOGGLE_TITLE_MODE, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, PASTE_BOX, IMPORT_STATE } from '../common/actions';
import { changeProp, deleteProps, isContainedView, findNavItemContainingBox, isView } from '../common/utils';

function singleContainedViewReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
    case ADD_RICH_MARK:
        // only fired when new mark is connected to existing cv
        let oldParents = Object.assign({}, state.parent);
        if (!oldParents || Object.keys(oldParents).indexOf(action.payload.parent) === -1) {
            oldParents[action.payload.parent] = [action.payload.mark.id];
        } else {
            oldParents[action.payload.parent].push(action.payload.mark.id);
        }
        return changeProp(state, "parent", oldParents);
        // return state;
    case DELETE_RICH_MARK:
        let previousParents = Object.assign({}, state.parent);
        let oldMarks = previousParents[action.payload.parent];
        let ind = oldMarks.indexOf(action.payload.id);
        if (ind > -1) {
            oldMarks.splice(ind, 1);
            if (oldMarks.length === 0) {
                delete previousParents[action.payload.parent];
            } else {
                previousParents[action.payload.parent] = oldMarks;
            }
        }
        return changeProp(state, "parent", previousParents);
    case DELETE_BOX:
        // TODO: Borrar parent boxes borradas
        let modState = Object.assign({}, state);
        delete modState.parent[action.payload.id];
        return changeProp(modState, "boxes", modState.boxes.filter(id => action.payload.id !== id));
    case TOGGLE_TITLE_MODE:
        return changeProp(state, "header", action.payload.titles);
    case CHANGE_CONTAINED_VIEW_NAME:
        return changeProp(state, "name", action.payload.title);
    case PASTE_BOX:
        return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
    default:
        return state;
    }
}

export default function(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        if (isContainedView(action.payload.ids.parent)) {
            return changeProp(
                state,
                action.payload.ids.parent,
                singleContainedViewReducer(state[action.payload.ids.parent], action));
        }
        return state;
    case EDIT_RICH_MARK:
        // This means we are only editing the position of the mark by dragging, so this reducer is not interested
        if(!action.payload.mark || !action.payload.newConnection) {
            return state;
        }
        let editState = Object.assign({}, state);
        // If the old connection is a contained view, we need to remove the mark from its parent list
        if (isContainedView(action.payload.oldConnection)) {
            if (editState[action.payload.oldConnection] && editState[action.payload.oldConnection].parent[action.payload.parent]) {
                let ind = editState[action.payload.oldConnection].parent[action.payload.parent].indexOf(action.payload.mark);
                if (ind > -1) {
                    editState[action.payload.oldConnection].parent[action.payload.parent].splice(ind, 1);
                    if (editState[action.payload.oldConnection].parent[action.payload.parent].length === 0) {
                        delete editState[action.payload.oldConnection].parent[action.payload.parent];
                    }
                }
            }
        }
        // If the new connection is a contained view, we need to include the mark from its parent list

        if (isContainedView(action.payload.newConnection)) {
            if (editState[action.payload.newConnection]) {
                if(Object.keys(editState[action.payload.newConnection].parent).indexOf(action.payload.parent) === -1) {
                    editState[action.payload.newConnection].parent[action.payload.parent] = [action.payload.mark.id || action.payload.mark];
                } else {
                    editState[action.payload.newConnection].parent[action.payload.parent].push(action.payload.mark.id || action.payload.mark);
                }
            } else if (action.payload.mark.connection.id) {
                editState = changeProp(editState, action.payload.mark.connection.id, action.payload.mark.connection);
            }
        }
        return editState;
    case DELETE_RICH_MARK:
        if(isContainedView(action.payload.cvid)) {
            return changeProp(state, action.payload.cvid, singleContainedViewReducer(state[action.payload.cvid], action));
        }
        return state;
    case ADD_RICH_MARK:
        // If rich mark is connected to a new contained view, mark.connection will include this information;
        // otherwise, it's just the id/url and we're not interested
        if (action.payload.mark.connectMode === 'existing' && isContainedView(action.payload.mark.connection)) {
            return changeProp(state, action.payload.mark.connection, singleContainedViewReducer(state[action.payload.mark.connection], action));
        }
        if (action.payload.mark.connection.id) {
            return changeProp(state, action.payload.mark.connection.id, action.payload.mark.connection);
        }
        return state;
    case DELETE_BOX:
        let modState = Object.assign({}, state);
        // Delete parent reference for contained views that linked to the deleted box
        for (let cv in action.payload.cvs) {
            delete modState[action.payload.cvs[cv]].parent[action.payload.id];
        }
        // If the deleted box's parent is a contained view, delete it from the boxes array
        if (isContainedView(action.payload.parent)) {
            modState = changeProp(
                modState,
                action.payload.parent,
                singleContainedViewReducer(modState[action.payload.parent], action));
        }
        return modState;
    case CHANGE_CONTAINED_VIEW_NAME:
        return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
    case DELETE_CONTAINED_VIEW:
        return deleteProps(state, action.payload.ids);
    case DELETE_NAV_ITEM:
        for (let cv in state) {
            for (let box in action.payload.boxes) {
                if (state[cv].parent[action.payload.boxes[box]]) {
                    delete state[cv].parent[action.payload.boxes[box]];
                }
            }
        }
        return state;
    case DELETE_SORTABLE_CONTAINER:
        /* let item = findNavItemContainingBox(state,action.payload.parent);
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
        }*/
        let nState = Object.assign({}, state);
        for (let cv in action.payload.cvs) {
            for (let b in action.payload.cvs[cv]) {
                delete nState[cv].parent[action.payload.cvs[cv][b]];
            }
        }
        return nState;
    // return deleteProps(state, action.payload.childrenViews);
    case TOGGLE_TITLE_MODE:
        if (isContainedView(action.payload.id)) {
            return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
        }
        return state;
    case PASTE_BOX:
        let newState = JSON.parse(JSON.stringify(state));
        if (isView(action.payload.ids.parent) && isContainedView(action.payload.ids.parent)) {
            newState = changeProp(newState, action.payload.ids.parent, singleContainedViewReducer(newState[action.payload.ids.parent], action));
        }
        if (action.payload.toolbar && action.payload.toolbar.state && action.payload.toolbar.state.__marks) {
            let marks = action.payload.toolbar.state.__marks;
            for (let mark in marks) {
                if (isContainedView(marks[mark].connection)) {
                    if (newState[marks[mark].connection]) {
                        if (!newState[marks[mark].connection].parent[action.payload.ids.id]) {
                            newState[marks[mark].connection].parent[action.payload.ids.id] = [];
                        }
                        newState[marks[mark].connection].parent[action.payload.ids.id].push(mark);

                    }
                }
            }
        }
        return newState;
    case IMPORT_STATE:
        return action.payload.present.containedViewsById || state;
    default:
        return state;
    }
}
