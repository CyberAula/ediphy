import {
    ADD_BOX, MOVE_BOX, ADD_NAV_ITEM, CHANGE_NAV_ITEM_NAME, CHANGE_BACKGROUND, DELETE_BOX, EXPAND_NAV_ITEM,
    REORDER_NAV_ITEM, DELETE_NAV_ITEM, TOGGLE_NAV_ITEM, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES,
    DELETE_SORTABLE_CONTAINER, DROP_BOX,
    ADD_RICH_MARK, EDIT_RICH_MARK, DELETE_RICH_MARK,
    IMPORT_STATE, PASTE_BOX, CHANGE_BOX_LAYER, ADD_NAV_ITEMS,
} from '../common/actions';
import { ID_PREFIX_BOX } from '../common/constants';
import { changeProp, changeProps, deleteProp, deleteProps, isView, isSlide, isDocument, findNavItemContainingBox, findDescendantNavItems, isContainedView } from '../common/utils';

function navItemCreator(state = {}, action = {}) {
    return {
        id: action.payload.id,
        isExpanded: true,
        parent: action.payload.parent,
        children: [],
        boxes: action.payload.type === "document" ? [action.payload.sortable_id] : [],
        linkedBoxes: {},
        level: state[action.payload.parent].level + 1,
        type: action.payload.type,
        hidden: state[action.payload.parent].hidden,
        extraFiles: {},
        customSize: action.payload.customSize,
    };
}

function singleNavItemReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
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
    case ADD_NAV_ITEM:
        let newChildren = JSON.parse(JSON.stringify(state.children));
        if (action.payload.id) {
            newChildren = [...newChildren, action.payload.id];
        } else if (action.payload.ids) {
            newChildren = newChildren.concat(action.payload.ids);
        }
        return changeProps(
            state,
            [
                "children",
                "isExpanded",
            ], [
                newChildren,
                true,
            ]
        );
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, "name", action.payload.title);

    case CHANGE_BACKGROUND:
        return changeProp(state, "background", action.payload.background);
    case DELETE_BOX:
        let stateWithoutBox = changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        if(stateWithoutBox.extraFiles[action.payload.id]) {
            return changeProp(
                stateWithoutBox,
                "extraFiles",
                deleteProp(stateWithoutBox, action.payload.id)
            );
        }
        return stateWithoutBox;
    case ADD_RICH_MARK:
    case EDIT_RICH_MARK:
        if((action.payload.mark.connectMode === "existing" || action.payload.mark.connectMode === "new") && state[action.payload.mark.connection]) {
            return {
                ...state,
                [state[action.payload.mark.connection]]: {
                    ...state[action.payload.mark.connection],
                    linkedBoxes: {
                        ...state[action.payload.mark.connection].linkedBoxes,
                        [action.payload.id]: action.payload.origin,
                    },
                },
            };
        }
        return state;
    case DELETE_RICH_MARK:
        if(action.payload.mark.connectMode === "existing" && state[action.payload.mark.connection]) {
            let lb = {
                ...state[action.payload.mark.connection].linkedBoxes,
            };
            delete lb[action.payload.mark.id];
            return changeProp(state, "linkedBoxes", lb);
        }
        return state;
    case EXPAND_NAV_ITEM:
        return changeProp(state, "isExpanded", action.payload.value);
    case DELETE_NAV_ITEM:
        return changeProp(state, "children", state.children.filter(id => id !== action.payload.ids[0]));
    case REORDER_NAV_ITEM:
        if (state.id === action.payload.id) {
            // Action was replaced, payload is different
            return changeProps(
                state,
                [
                    "parent",
                    "hidden",
                    "level",
                ], [
                    action.payload.newParent.id,
                    state.hidden, // action.payload.newParent.hidden,
                    action.payload.newParent.level + 1,
                ]
            );
        }
        // This order is important!!
        // If checked the other way round, when newParent and oldParent are equal, item moved will be deleted from children
        if (state.id === action.payload.newParent) {
            return changeProp(state, "children", action.payload.childrenInOrder);
        }
        if (state.id === action.payload.oldParent) {
            return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
        }

        return state;
    case TOGGLE_NAV_ITEM:
        return changeProp(state, "hidden", action.payload.value);
    case TOGGLE_TITLE_MODE:
        return changeProp(state, "header", action.payload.titles);
    case DROP_BOX:
        if (state.id === action.payload.parent) {
            return changeProp(state, "boxes", [...state.boxes, action.payload.id]);
        } else if (state.id === action.payload.oldParent) {
            return changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        }
        return state;
    case ADD_RICH_MARK:
        let oldParents = JSON.parse(JSON.stringify(state.linkedBoxes));
        if(Object.keys(oldParents).indexOf(action.payload.parent) === -1) {
            oldParents[action.payload.parent] = [action.payload.mark.id];
        } else {
            oldParents[action.payload.parent].push(action.payload.mark.id);
        }
        return changeProp(state, "linkedBoxes", oldParents);
        // return changeProp(state, "linkedBoxes", [...(state.linkedBoxes || []), action.payload.parent]);
    case UPDATE_NAV_ITEM_EXTRA_FILES:
        return changeProp(
            state,
            "extraFiles",
            changeProp(state.extraFiles, action.payload.box, action.payload.xml_path)
        );
    default:
        return state;
    }
}

export default function(state = { 0: { id: 0, children: [], boxes: [], level: 0, type: '', hidden: false } }, action = {}) {

    switch (action.type) {
    case ADD_BOX:
        if (isView(action.payload.ids.parent)) {
            return changeProp(state, action.payload.ids.parent, singleNavItemReducer(state[action.payload.ids.parent], action));
        }
        return state;
    case MOVE_BOX:
        if (action.payload.container === 0 && action.payload.position === 'absolute' && !isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;
    case CHANGE_BOX_LAYER:
        if (action.payload.container === 0 && !isContainedView(action.payload.parent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;
    case ADD_NAV_ITEM:
        return changeProps(
            state,
            [
                action.payload.id,
                action.payload.parent,
            ], [
                navItemCreator(state, action),
                singleNavItemReducer(state[action.payload.parent], action),
            ]
        );
    case ADD_NAV_ITEMS:
        let navIds = action.payload.navs.map(nav => { return nav.id; });
        let navs = action.payload.navs.map(nav => { return navItemCreator(state, { type: ADD_NAV_ITEM, payload: nav }); });
        return changeProps(
            state,
            [...navIds, action.payload.parent],
            [...navs,
                singleNavItemReducer(state[action.payload.parent], { type: ADD_NAV_ITEM, payload: { parent: action.payload.parent, ids: navIds } }),
            ]
        );
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case CHANGE_BACKGROUND:
        if(isView(action.payload.id)) {
            return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
        }
        return state;
    case DELETE_BOX:
        if (isView(action.payload.parent) && action.payload.parent !== 0) {
            /* if(findNavItemContainingBox(state,action.payload.parent).extraFiles.length !== 0){
                            return changeProp(Object.assign({}, state,
                                            Object.assign(
                                                {},
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
                                ),
                            action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
                        }*/
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }

        if(typeof findNavItemContainingBox(state, action.payload.parent) !== 'undefined' && findNavItemContainingBox(state, action.payload.parent).extraFiles.length !== 0) {
            return Object.assign({}, state,
                Object.assign({},
                    {
                        [findNavItemContainingBox(state, action.payload.parent).id]:
                                Object.assign(
                                    {},
                                    findNavItemContainingBox(state, action.payload.parent),
                                    { extraFiles: {},
                                    }
                                ),
                    }
                )
            );
        }

        return state;
    case DELETE_SORTABLE_CONTAINER:
        /* let item = findNavItemContainingBox(state, action.payload.parent);
                if(item) {
                    if(item.extraFiles.length !== 0) {
                        return Object.assign({}, state,
                            Object.assign({},
                                {
                                    [findNavItemContainingBox(state, action.payload.parent).id]:
                                    Object.assign(
                                        {},
                                        findNavItemContainingBox(state, action.payload.parent),
                                        { extraFiles: {},
                                        }
                                    ),
                                }
                            )
                        );
                    }
                }*/
        let nState = JSON.parse(JSON.stringify(state));
        /* for (let cv in action.payload.cvs) {
                for (let b in action.payload.cvs[cv]) {
                  delete nState[cv].parent[action.payload.cvs[cv][b]];
                }
              }*/
        return nState;
    case EXPAND_NAV_ITEM:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case REORDER_NAV_ITEM:
        let itemsReordered = changeProps(
            state,
            [
                action.payload.id,
                action.payload.oldParent,
                action.payload.newParent,

            ], [
                // Cheaty sneaky, action is replaced
                singleNavItemReducer(state[action.payload.id], {
                    type: REORDER_NAV_ITEM,
                    payload: {
                        id: action.payload.id,
                        oldParent: action.payload.oldParent,
                        newParent: state[action.payload.newParent],
                    },
                }),
                singleNavItemReducer(state[action.payload.oldParent], action),
                singleNavItemReducer(state[action.payload.newParent], action),
            ]
        );

            // Some properties are inherited from parent (level, hidden, unitNumber, etc.)
            // We should update item's children with new inherited value
        let descendantsToUpdate = findDescendantNavItems(itemsReordered, action.payload.id);
        // We remove the first element (the item we moved)
        descendantsToUpdate.shift();
        let newDescendants = [];
        descendantsToUpdate.forEach(it => {
            // Cheaty sneaky, action is replaced here aswell
            newDescendants.push(singleNavItemReducer(state[it], {
                type: REORDER_NAV_ITEM,
                payload: {
                    id: it,
                    newParent: itemsReordered[itemsReordered[it].parent],
                },
            }));
        });
        return changeProps(itemsReordered, descendantsToUpdate, newDescendants);
    case DELETE_NAV_ITEM:
        let navState = JSON.parse(JSON.stringify(state));
        for (let cv in navState) {
            for (let box in action.payload.boxes) {
                if (navState[cv].linkedBoxes && navState[cv].linkedBoxes[action.payload.boxes[box]]) {
                    delete navState[cv].linkedBoxes[action.payload.boxes[box]];
                }
            }
        }
        let stateWithNavItemsDeleted = deleteProps(navState, action.payload.ids);
        return changeProp(stateWithNavItemsDeleted, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
    case TOGGLE_NAV_ITEM:
        // If parent is already hidden, do nothing
        if (state[state[action.payload.id].parent].hidden) {
            return state;
        }
        let itemsToToggle = findDescendantNavItems(state, action.payload.id);
        let itemsToggled = [];
        itemsToToggle.forEach(it => {
            // This is "cheaty"; we're replacing the original action
            itemsToggled.push(singleNavItemReducer(state[it], {
                type: TOGGLE_NAV_ITEM,
                payload: { value: (!state[action.payload.id].hidden) },
            }));
        });
        return changeProps(state, itemsToToggle, itemsToggled);
    case TOGGLE_TITLE_MODE:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case ADD_RICH_MARK:
        if (action.payload && action.payload.mark && (action.payload.mark.connectMode === 'existing' || action.payload.mark.connectMode === 'new') && action.payload.mark.connection) {
            if (!isContainedView(action.payload.mark.connection)) {
                return changeProp(state, action.payload.mark.connection, singleNavItemReducer(state[action.payload.mark.connection], action));

            }
        }
        return state;
    case EDIT_RICH_MARK:
        if(!action.payload.mark || !action.payload.newConnection) {
            return state;
        }
        let editState = JSON.parse(JSON.stringify(state));
        if (!isContainedView(action.payload.oldConnection) && action.payload.oldConnection !== 0) {
            if (editState[action.payload.oldConnection] && editState[action.payload.oldConnection].linkedBoxes[action.payload.parent]) {
                let ind = editState[action.payload.oldConnection].linkedBoxes[action.payload.parent].indexOf(action.payload.mark);
                if (ind > -1) {
                    editState[action.payload.oldConnection].linkedBoxes[action.payload.parent].splice(ind, 1);
                    if (editState[action.payload.oldConnection].linkedBoxes[action.payload.parent].length === 0) {
                        delete editState[action.payload.oldConnection].linkedBoxes[action.payload.parent];
                    }

                }
            }
        }
        if (!isContainedView(action.payload.newConnection) && action.payload.oldConnection !== 0) {
            if (editState[action.payload.newConnection]) {
                if(Object.keys(editState[action.payload.newConnection].linkedBoxes).indexOf(action.payload.parent) === -1) {
                    editState[action.payload.newConnection].linkedBoxes[action.payload.parent] = [action.payload.mark.id || action.payload.mark];
                } else {
                    editState[action.payload.newConnection].linkedBoxes[action.payload.parent].push(action.payload.mark.id || action.payload.mark);
                }
            }
        }
        return editState;
    case DELETE_RICH_MARK:
        if(!isContainedView(action.payload.mark.connection) && isView(action.payload.mark.connection)) {
            return changeProp(state, action.payload.mark.connection, singleNavItemReducer(state[action.payload.mark.connection], action));
        }
        return state;
    case UPDATE_NAV_ITEM_EXTRA_FILES:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case IMPORT_STATE:
        return action.payload.present.navItemsById || state;
    case DROP_BOX:
        if (isView(action.payload.parent) && isView(action.payload.oldParent)) {
            return changeProps(state, [action.payload.parent, action.payload.oldParent], [singleNavItemReducer(state[action.payload.parent], action), singleNavItemReducer(state[action.payload.oldParent], action)]);
        } else if (!isView(action.payload.parent) && isView(action.payload.oldParent)) {
            return changeProp(state, action.payload.oldParent, singleNavItemReducer(state[action.payload.oldParent], action));
        } else if (isView(action.payload.parent) && !isView(action.payload.oldParent)) {
            return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        }
        return state;

    case PASTE_BOX:

        let newState = JSON.parse(JSON.stringify(state));
        if (isView(action.payload.ids.parent) && !isContainedView(action.payload.ids.parent)) {
            newState = changeProp(newState, action.payload.ids.parent, singleNavItemReducer(newState[action.payload.ids.parent], action));
        }

        if (action.payload.toolbar && action.payload.toolbar.state && action.payload.toolbar.state.__marks) {
            let marks = action.payload.toolbar.state.__marks;
            for (let mark in marks) {
                if (isView(marks[mark].connection)) {
                    if (newState[marks[mark].connection]) {
                        if (!newState[marks[mark].connection].linkedBoxes[action.payload.ids.id]) {
                            newState[marks[mark].connection].linkedBoxes[action.payload.ids.id] = [];
                        }
                        newState[marks[mark].connection].linkedBoxes[action.payload.ids.id].push(mark);

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
                            if (!newState[marks[mark].connection].linkedBoxes[ids[id]]) {
                                newState[marks[mark].connection].linkedBoxes[ids[id]] = [];
                            }
                            newState[marks[mark].connection].linkedBoxes[ids[id]].push(mark);

                        }
                    }
                }
            }
        }
        return newState;
    default:
        return state;
    }
}
