import {ADD_BOX, ADD_NAV_ITEM, CHANGE_SECTION_TITLE, CHANGE_UNIT_NUMBER, DELETE_BOX, DUPLICATE_BOX, EXPAND_NAV_ITEM,
    REORDER_NAV_ITEM, REMOVE_NAV_ITEM, TOGGLE_NAV_ITEM, TOGGLE_TITLE_MODE, UPDATE_NAV_ITEM_EXTRA_FILES,
    IMPORT_STATE} from './../actions';
import {ID_PREFIX_BOX} from './../constants';
import Utils, {changeProp, changeProps, deleteProp, deleteProps, isView, isSlide, isDocument, findDescendantNavItems} from './../utils';

function navItemCreator(state = {}, action = {}) {
    return {
        id: action.payload.id,
        name: action.payload.name,
        isExpanded: true,
        parent: action.payload.parent,
        children: [],
        boxes: [],
        level: state[action.payload.parent].level + 1,
        type: action.payload.type,
        unitNumber: (action.payload.parent === 0 ?
        state[action.payload.parent].children.length + 1 :
            state[action.payload.parent].unitNumber),
        hidden: state[action.payload.parent].hidden,
        extraFiles: {},
        titlesReduced: isSlide(action.payload.type) ? 'hidden' : 'expanded'
    };
}

function singleNavItemReducer(state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProp(state, "boxes", [...state.boxes, action.payload.ids.id]);
        case ADD_NAV_ITEM:
            return changeProp(state, "children", [...state.children, action.payload.id]);
        case CHANGE_SECTION_TITLE:
            return changeProp(state, "name", action.payload.title);
        case CHANGE_UNIT_NUMBER:
            return changeProp(state, "unitNumber", action.payload.value);
        case DELETE_BOX:
            return changeProp(state, "boxes", state.boxes.filter(id => id !== action.payload.id));
        case EXPAND_NAV_ITEM:
            return changeProp(state, "isExpanded", action.payload.value);
        case REMOVE_NAV_ITEM:
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
                        "unitNumber"
                    ], [
                        action.payload.newParent.id,
                        action.payload.newParent.hidden,
                        action.payload.newParent.level + 1,
                        // If navItem is going to be level 1, unitNumber should not change
                        action.payload.newParent.level === 0 ?
                            state.unitNumber :
                            action.payload.newParent.unitNumber
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
            return changeProp(state, "titlesReduced", action.payload.value);
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

export default function (state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            if (isView(action.payload.ids.parent)) {
                return changeProp(state, action.payload.ids.parent, singleNavItemReducer(state[action.payload.ids.parent], action));
            }
            return state;
        case ADD_NAV_ITEM:
            return changeProps(
                state,
                [
                    action.payload.id,
                    action.payload.parent
                ], [
                    navItemCreator(state, action),
                    singleNavItemReducer(state[action.payload.parent], action)
                ]
            );
        case CHANGE_SECTION_TITLE:
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
                return changeProp(state, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
            }
            return state;
        case DUPLICATE_BOX:
            if (isView(action.payload.parent)) {
                let newBoxes = state[action.payload.parent].boxes;
                newBoxes.push(ID_PREFIX_BOX + action.payload.newId);

                if (action.payload.parent !== 0) {
                    return Object.assign({}, state, {
                        [action.payload.parent]: Object.assign({}, state[action.payload.parent], {
                            boxes: newBoxes
                        })
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
                    action.payload.newParent

                ], [
                    // Cheaty sneaky, action is replaced
                    singleNavItemReducer(state[action.payload.id], {
                        type: REORDER_NAV_ITEM,
                        payload: {
                            id: action.payload.id,
                            oldParent: action.payload.oldParent,
                            newParent: state[action.payload.newParent]
                        }
                    }),
                    singleNavItemReducer(state[action.payload.oldParent], action),
                    singleNavItemReducer(state[action.payload.newParent], action)
                ]
            );

            // Some properties are inherited from parent (level, hidden, unitNumber, etc.)
            // We should update item's children with new inherited value
            let descendantsToUpdate = findDescendantNavItems(itemsReordered, action.payload.id);
            // We remove the first element (the item we moved)
            descendantsToUpdate.shift();
            let newDescendants = [];
            descendantsToUpdate.forEach(item => {
                // Cheaty sneaky, action is replaced here aswell
                newDescendants.push(singleNavItemReducer(state[item], {
                    type: REORDER_NAV_ITEM,
                    payload: {
                        id: item,
                        newParent: itemsReordered[itemsReordered[item].parent]
                    }
                }));
            });
            return changeProps(itemsReordered, descendantsToUpdate, newDescendants);
        case REMOVE_NAV_ITEM:
            let stateWithNavItemsDeleted = deleteProps(state, action.payload.ids);
            return changeProp(stateWithNavItemsDeleted, action.payload.parent, singleNavItemReducer(state[action.payload.parent], action));
        case TOGGLE_NAV_ITEM:
            // If parent is already hidden, do nothing
            if (state[state[action.payload.id].parent].hidden) {
                return state;
            }
            let itemsToToggle = findDescendantNavItems(state, action.payload.id);
            let itemsToggled = [];
            itemsToToggle.forEach(item => {
                //This is "cheaty"; we're replacing the original action
                itemsToggled.push(singleNavItemReducer(state[item], {
                    type: TOGGLE_NAV_ITEM,
                    payload: {value: (state[action.payload.id].hidden ? false : true)}
                }));
            });
            return changeProps(state, itemsToToggle, itemsToggled);
        case TOGGLE_TITLE_MODE:
            return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
        case UPDATE_NAV_ITEM_EXTRA_FILES:
            return changeProp(state, action.payload.id, singleNavItemReducer(state[action.payload.id], action));
        case IMPORT_STATE:
            return action.payload.present.navItemsById || state;
        default:
            return state;
    }
}