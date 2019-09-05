
import {
    ADD_BOX, ADD_RICH_MARK, DELETE_RICH_MARK, EDIT_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, PASTE_BOX, IMPORT_STATE,
    CHANGE_BOX_LAYER, CHANGE_BACKGROUND, DROP_BOX, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../../common/actions';

import { changeProp, deleteProps, isContainedView } from '../../common/utils';
import { singleContainedViewReducer } from './singleContainedViewReducer';

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
            return changeProp(state, view.id, view);
        }
        if (action.payload.mark.connectMode === "existing") {
            if(isContainedView(action.payload.mark.connection)) {
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
        }
        return state;
    case CHANGE_BOX_LAYER:
        if (action.payload.container === 0 && isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleContainedViewReducer(state[action.payload.parent], action));
        }
        return state;
    case CHANGE_BACKGROUND:
        if (isContainedView(action.payload.id)) {
            return changeProp(state, action.payload.id, singleContainedViewReducer(state[action.payload.id], action));
        }
        return state;
    case EDIT_RICH_MARK:
        let oldCv = "";
        let newParents = {};
        newState = { ...state };
        Object.keys(newState).forEach(cv=>{
            if(Object.keys(newState[cv].parent).includes(action.payload.mark.id)) {
                oldCv = newState[cv].id;
            }
        });
        if(oldCv !== "") {
            newParents = newState[oldCv].parent;
            delete newParents[action.payload.mark.id];
            newState = {
                ...newState,
                [oldCv]: {
                    ...newState[oldCv],
                    parent: newParents,
                },
            };
        }

        // This means we are only editing the position of the mark by dragging, so this reducer is not interested
        if (action.payload.mark.connectMode === "new") {
            return {
                ...newState,
                [action.payload.view.id]: action.payload.view,
            };
        } else if (action.payload.mark.connectMode === "existing") {
            if (isContainedView(action.payload.mark.connection)) {
                return {
                    ...newState,
                    [action.payload.mark.connection]: {
                        ...newState[action.payload.mark.connection],
                        parent: {
                            ...newState[action.payload.mark.connection].parent,
                            [action.payload.mark.id]: action.payload.mark.origin,
                        },
                    },
                };
            }
            return newState;

        }
        return state;
    case DELETE_RICH_MARK:
        if(isContainedView(action.payload.mark.connection)) {
            return changeProp(state, action.payload.mark.connection, singleContainedViewReducer(state[action.payload.mark.connection], action));
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
    case DELETE_BOX:
        let modState = JSON.parse(JSON.stringify(state));
        // Delete parent reference for contained views that linked to the deleted box
        for (let cv in action.payload.cvs) {
            if(modState[action.payload.cvs[cv]]) {
                let inverted_parents = Object.keys(modState[action.payload.cvs[cv]].parent).map(mark=>{
                    if (modState[action.payload.cvs[cv]].parent[mark] === action.payload.id) {
                        return mark;
                    }
                    if (action.payload.children.indexOf(modState[action.payload.cvs[cv]].parent[mark]) > -1) {
                        return mark;
                    }
                    return null;
                }).filter(ele=> ele !== null);
                inverted_parents.forEach(e=>{
                    delete modState[action.payload.cvs[cv]].parent[e];
                });
            }
        }
        // If the deleted box's parent is a contained view, delete it from the boxes array
        if (isContainedView(action.payload.parent)) {
            modState = changeProp(
                modState,
                action.payload.parent,
                singleContainedViewReducer(modState[action.payload.parent], action));
        }
        return modState;
    case DELETE_CONTAINED_VIEW:
        return deleteProps(state, action.payload.ids);
    case DELETE_NAV_ITEM:
        let navState = JSON.parse(JSON.stringify(state));
        for (let cv in navState) {
            /* for (let box in action.payload.boxes) {
                console.log(parents,)
                let parents = Object.keys(state[cv].parent).reduce((obj, key) => (obj[state[cv].parent[key]] = key, obj), {});
                if (parents[action.payload.boxes[box]]) {
                    delete state[cv].parent[parents[action.payload.boxes[box]]];
                }
            } */
            if (navState[cv].parent) {
                for (let mark in navState[cv].parent) {
                    let box = navState[cv].parent[mark];
                    if (action.payload.boxes.indexOf(box) !== -1) {
                        delete navState[cv].parent[mark];
                    }
                }
            }
        }
        return navState;
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
    case PASTE_BOX:
        let newState = JSON.parse(JSON.stringify(state));

        if (isContainedView(action.payload.ids.parent)) {
            newState = changeProp(newState, action.payload.ids.parent, singleContainedViewReducer(newState[action.payload.ids.parent], action));
        }
        if (action.payload.marks) {
            let marks = action.payload.marks;
            for (let mark in marks) {
                if (isContainedView(marks[mark].connection)) {
                    newState[marks[mark].connection].parent[mark] = marks[mark].origin;
                }
            }
        }
        return newState;
    case IMPORT_STATE:
        return action.payload.present.containedViewsById || state;
    case DUPLICATE_NAV_ITEM:
        let modifiedMarks = {};
        let modifiedCvs = {};
        for (let b in action.payload.linkedCvs) {
            for (let cv_i in action.payload.linkedCvs[b]) {
                let cv = action.payload.linkedCvs[b][cv_i];
                let cvObj = state[cv];
                if(state[cv]) {
                    for (let mb in cvObj.parent) {
                        if (cvObj.parent[mb] === b) {
                            modifiedMarks[cv] = { ...modifiedMarks[cv], [mb + action.payload.suffix]: action.payload.boxes[b] };
                        }
                    }
                    modifiedCvs[cv] = { ...state[cv], parent: { ...state[cv].parent, ... modifiedMarks[cv] } };
                }
            }
        }
        return { ...state, ...modifiedCvs };
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.containedViewsById };
    default:
        return state;
    }
}
