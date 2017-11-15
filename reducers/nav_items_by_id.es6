import { ADD_BOX, MOVE_BOX, ADD_NAV_ITEM, CHANGE_NAV_ITEM_NAME, CHANGE_UNIT_NUMBER, DELETE_BOX, DUPLICATE_BOX, EXPAND_NAV_ITEM,
    REORDER_NAV_ITEM, DELETE_NAV_ITEM, TOGGLE_NAV_ITEM, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES, DELETE_SORTABLE_CONTAINER,
    ADD_RICH_MARK, EDIT_RICH_MARK, DELETE_RICH_MARK,
    IMPORT_STATE } from '../common/actions';
import { ID_PREFIX_BOX } from '../common/constants';
import { changeProp, changeProps, deleteProp, deleteProps, isView, isSlide, isDocument, findNavItemContainingBox, findDescendantNavItems, isContainedView } from '../common/utils';

function navItemCreator(state = {}, action = {}) {
    return {
        id: action.payload.id,
        name: action.payload.name,
        isExpanded: true,
        parent: action.payload.parent,
        children: [],
        boxes: [],
        linkedBoxes: {},
        level: state[action.payload.parent].level + 1,
        type: action.payload.type,
        unitNumber: (action.payload.parent === 0 ?
            state[action.payload.parent].children.length + 1 :
            state[action.payload.parent].unitNumber),
        hidden: state[action.payload.parent].hidden,
        extraFiles: {},
        header: {
            elementContent: { documentTitle: '', documentSubTitle: '', numPage: '' },
            display: { courseTitle: 'hidden', documentTitle: 'expanded', documentSubTitle: 'hidden', breadcrumb: "reduced", pageNumber: "hidden" },
        },
        // titleMode: isSlide(action.payload.type) ? 'hidden' : 'expanded'
    };
}

function singleNavItemReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
    case MOVE_BOX:
        let children = Object.assign([], state.boxes);
        for(let x in children) {
            if (children[x] === action.payload.id) {
                children.push(children.splice(x, 1)[0]);
            }
        }
        return changeProp(state, "boxes", children);
    case ADD_NAV_ITEM:
        return changeProps(
            state,
            [
                "children",
                "isExpanded",
            ], [
                [...state.children, action.payload.id],
                true,
            ]
        );
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, "name", action.payload.title);
    case CHANGE_UNIT_NUMBER:
        let finalValue;
        if(isNaN(parseInt(action.payload.value, 10))) {
            finalValue = "";
        } else {
            finalValue = action.payload.value;
        }
        return changeProp(state, "unitNumber", finalValue);
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
    case DELETE_RICH_MARK:
        let previousParents = Object.assign({}, state.linkedBoxes);
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
        return changeProp(state, "linkedBoxes", previousParents);
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
                    "unitNumber",
                ], [
                    action.payload.newParent.id,
                    state.hidden, // action.payload.newParent.hidden,
                    action.payload.newParent.level + 1,
                    // If navItem is going to be level 1, unitNumber should not change
                    action.payload.newParent.level === 0 ?
                        state.unitNumber :
                        action.payload.newParent.unitNumber,
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
    case ADD_RICH_MARK:
        let oldParents = Object.assign({}, state.linkedBoxes);
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

export default function(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
        if (isView(action.payload.ids.parent)) {
            return changeProp(state, action.payload.ids.parent, singleNavItemReducer(state[action.payload.ids.parent], action));
        }
        return state;
    case MOVE_BOX:
        if (action.payload.container === 0 && action.payload.position === 'absolute') {
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
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case CHANGE_UNIT_NUMBER:
        let itemsToChange = findDescendantNavItems(state, action.payload.id);
        let newValues = [];
        itemsToChange.forEach(item => {
            newValues.push(singleNavItemReducer(state[item], action));
        });
        return changeProps(state, itemsToChange, newValues);
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
        let nState = Object.assign({}, state);
        /* for (let cv in action.payload.cvs) {
        for (let b in action.payload.cvs[cv]) {
          delete nState[cv].parent[action.payload.cvs[cv][b]];
        }
      }*/
        return nState;
    case DUPLICATE_BOX:
        if (isView(action.payload.parent)) {
            let newBoxes = state[action.payload.parent].boxes;
            newBoxes.push(ID_PREFIX_BOX + action.payload.newId);

            if (action.payload.parent !== 0) {
                return Object.assign({}, state, {
                    [action.payload.parent]: Object.assign({}, state[action.payload.parent], {
                        boxes: newBoxes,
                    }),
                });
            }
        }
        return state;
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
        for (let cv in state) {
            for (let box in action.payload.boxes) {
                if (state[cv].linkedBoxes && state[cv].linkedBoxes[action.payload.boxes[box]]) {
                    delete state[cv].linkedBoxes[action.payload.boxes[box]];
                }
            }
        }
        let stateWithNavItemsDeleted = deleteProps(state, action.payload.ids);
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
        if (action.payload && action.payload.mark && action.payload.mark.connectMode === 'existing' && action.payload.mark.connection) {
            if (!isContainedView(action.payload.mark.connection)) {
                return changeProp(state, action.payload.mark.connection, singleNavItemReducer(state[action.payload.mark.connection], action));

            }
        }
        return state;
    case EDIT_RICH_MARK:
        if(!action.payload.mark || !action.payload.newConnection) {
            return state;
        }
        let editState = Object.assign({}, state);
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
        if(!isContainedView(action.payload.cvid) && isView(action.payload.cvid)) {
            return changeProp(state, action.payload.cvid, singleNavItemReducer(state[action.payload.cvid], action));
        }
        return state;
    case UPDATE_NAV_ITEM_EXTRA_FILES:
        return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
    case IMPORT_STATE:
        return action.payload.present.navItemsById || state;
    default:
        return state;
    }
}
