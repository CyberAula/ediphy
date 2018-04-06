
import {
    ADD_BOX, ADD_CONTAINED_VIEW, ADD_RICH_MARK, DELETE_RICH_MARK, EDIT_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW,
    CHANGE_CONTAINED_VIEW_NAME, TOGGLE_TITLE_MODE, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, PASTE_BOX, IMPORT_STATE,
    CHANGE_BOX_LAYER, CHANGE_BACKGROUND, DROP_BOX,
} from '../common/actions';

import { changeProp, deleteProps, isContainedView, findNavItemContainingBox } from '../common/utils';

function singleContainedViewReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
    case CHANGE_BOX_LAYER:
        let boxes = JSON.parse(JSON.stringify(action.payload.boxes_array));
        let x = boxes.indexOf(action.payload.id);
        if (action.payload.value === 'front') { boxes.push(boxes.splice(x, 1)[0]); }
        if (action.payload.value === 'back') { boxes.unshift(boxes.splice(x, 1)[0]);}
        if (action.payload.value === 'ahead' && x <= boxes.length - 1) {
            boxes.splice(x + 1, 0, boxes.splice(x, 1)[0]);
        }
        if (action.payload.value === 'behind' && x >= 0) {
            boxes.splice(x - 1, 0, boxes.splice(x, 1)[0]);
        }
        return changeProp(state, "boxes", boxes);
    case ADD_RICH_MARK:
        // only fired when new mark is connected to existing cv
        let oldParents = JSON.parse(JSON.stringify(state.parent));
        if (!oldParents || Object.keys(oldParents).indexOf(action.payload.parent) === -1) {
            oldParents[action.payload.parent] = [action.payload.mark.id];
        } else {
            oldParents[action.payload.parent].push(action.payload.mark.id);
        }
        return changeProp(state, "parent", oldParents);
        // return state;
    case CHANGE_BACKGROUND:
        return changeProp(state, "background", action.payload.background);
    case DELETE_RICH_MARK:
        if ((action.payload.mark.connectMode === "new" || action.payload.mark.connectMode === "existing") && state[action.payload.mark.connection]) {
            let newParent = { ...state[action.payload.mark.connection].parent };
            if(newParent[action.payload.mark.id]) {
                delete newParent[action.payload.mark.id];
                return changeProp(state, "parent", newParent);
            }
        }
        return state;
    case DELETE_BOX:
        let modState = JSON.parse(JSON.stringify(state));
        delete modState.parent[action.payload.id];
        return changeProp(modState, "boxes", modState.boxes.filter(id => action.payload.id !== id));
    case DROP_BOX:
        if (state.id === action.payload.parent) {
            return changeProp(state, "boxes", [...state.boxes, action.payload.id]);
        } else if (state.id === action.payload.oldParent) {
            return changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        }
        return state;
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
    case ADD_RICH_MARK:
        let view = action.payload.view;
        if (action.payload.mark.connectMode === "new") {
            return changeProp(state, action.payload.view.id, view);
        }
        if (action.payload.mark.connectMode === "existing") {
            return {
                ...state,
                [action.payload.mark.connection]: {
                    ...state[action.payload.mark.connection],
                    parent: {
                        ...state[action.payload.mark.connection].parent,
                        [action.payload.mark.id]: action.payload.mark.origin,
                    },
                },
            };
        }
        return state;
    case CHANGE_BOX_LAYER:
        if (action.payload.container === 0 && isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleContainedViewReducer(state[action.payload.parent], action));
        }
        return state;
    case CHANGE_BACKGROUND:
        if(isContainedView(action.payload.id)) {
            return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
        }
        return state;
    case EDIT_RICH_MARK:
        // This means we are only editing the position of the mark by dragging, so this reducer is not interested
        if(!action.payload.mark || !action.payload.newConnection) {
            return state;
        }
        let editState = JSON.parse(JSON.stringify(state));

        // If the old connection is a contained view, we need to remove the mark from its parent list
        if (isContainedView(action.payload.oldConnection)) {
            if (editState[action.payload.oldConnection] && editState[action.payload.oldConnection].parent[action.payload.parent]) {
                let ind = editState[action.payload.oldConnection].parent[action.payload.parent].indexOf(action.payload.mark.id || action.payload.mark);
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
    case DROP_BOX:
        if (isContainedView(action.payload.parent) && isContainedView(action.payload.oldParent)) {
            return changeProps(state, [action.payload.parent, action.payload.oldParent], [singleContainedViewReducer(state[action.payload.parent], action), singleContainedViewReducer(state[action.payload.oldParent], action)]);
        } else if (!isContainedView(action.payload.parent) && isContainedView(action.payload.oldParent)) {
            return changeProp(state, action.payload.oldParent, singleContainedViewReducer(state[action.payload.oldParent], action));
        } else if (isContainedView(action.payload.parent) && !isContainedView(action.payload.oldParent)) {
            return changeProp(state, action.payload.parent, singleContainedViewReducer(state[action.payload.parent], action));
        }
        return state;
    case ADD_RICH_MARK:
        // If rich mark is connected to a new contained view, mark.connection will include this information;
        // otherwise, it's just the id/url and we're not interested
        if (action.payload.mark.connectMode === 'existing' && isContainedView(action.payload.view.id)) {
            return changeProp(state, action.payload.view.id, singleContainedViewReducer(state[action.payload.view.id], action));
        }
        if (action.payload.mark.connection) {
            return changeProp(state, action.payload.mark.connection, action.payload.mark.connection);
        }
        return state;
    case DELETE_BOX:
        let modState = JSON.parse(JSON.stringify(state));
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
        let nState = JSON.parse(JSON.stringify(state));
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

        if (isContainedView(action.payload.ids.parent)) {
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
        if(action.payload.children) {
            let ids = Object.keys(action.payload.children);

            for (let id in ids) {
                let marks = action.payload.children[ids[id]].toolbar.state.__marks;
                for (let mark in marks) {
                    if (isContainedView(marks[mark].connection)) {
                        if (newState[marks[mark].connection]) {
                            if (!newState[marks[mark].connection].parent[ids[id]]) {
                                newState[marks[mark].connection].parent[ids[id]] = [];
                            }
                            newState[marks[mark].connection].parent[ids[id]].push(mark);

                        }
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
