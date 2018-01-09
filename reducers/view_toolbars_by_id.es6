import {
    ADD_BOX, ADD_RICH_MARK, CHANGE_NAV_ITEM_NAME, DELETE_BOX, DELETE_RICH_MARK, DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    CHANGE_CONTAINED_VIEW_NAME,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX,
} from '../common/actions';
import i18n from 'i18next';
import { changeProp, changeProps, deleteProps, isDocument, isPage, isSection, isSlide } from "../common/utils";
import Utils from "../common/utils";

function toolbarSectionCreator(state, action, isContainedView = false) {
    let doc_type;
    let id = isContainedView ? action.payload.mark.connection.id : action.payload.id;
    let type = isContainedView ? action.payload.mark.connection.type : action.payload.type;
    if (isPage(id)) {
        doc_type = i18n.t('page');
    }
    if(isSlide(type)) {
        doc_type = i18n.t('slide');
    }

    if(isDocument(type)) {
        doc_type = i18n.t('document');
    }

    if(isSection(id)) {
        doc_type = i18n.t('section');
    }
    let pagetitle = i18n.t('Title') + doc_type;

    let toolbar = {
        tabs: ['main'],
        state: {
            header: doc_type,
            display_title: false,
            display_pagetitle: true,
            pagetitle_name: { value: pagetitle, display: true },
            display_pagesubtitle: { value: "", display: true },
            pagesubtitle_name: { value: "", display: true },
        },
    };

    return toolbar;
}

function toolbarReducer(state, action) {
    let newState;
    switch (action.type) {
    case CHANGE_NAV_ITEM_NAME:
        return state;
    case CHANGE_CONTAINED_VIEW_NAME:
        return state;
    case UPDATE_TOOLBAR:
        return newState;
    default:
        return state;
    }
}
/*
function toolbarReducer(state, action) {
    let newState;
    switch (action.type) {
    case CHANGE_NAV_ITEM_NAME:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.basic.buttons.navitem_name.value = action.payload.title;
        return newState;
    case CHANGE_CONTAINED_VIEW_NAME:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.basic.buttons.navitem_name.value = action.payload.title;
        return newState;
    case UPDATE_TOOLBAR:
        newState = Utils.deepClone(state);
        let pl = action.payload;

        if (pl.value.__name) {
            if (pl.accordions.length > 1) {
                newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]].buttons[pl.name] = pl.value;
            } else {
                newState.controls[pl.tab].accordions[pl.accordions[0]].buttons[pl.name] = pl.value;
            }
        } else if (pl.accordions.length > 1) {
            newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]]
                .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
        } else {
            newState.controls[pl.tab].accordions[pl.accordions[0]]
                .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
        }

        // Rebind callback functions because from not automanaged buttons
        for (let tabKey in newState.controls) {
            for (let accordionKey in newState.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                    button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.autoManaged) {
                        button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                    }
                }
                if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.autoManaged) {
                                button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                            }
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
*/
export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_NAV_ITEM:
        return changeProp(state, action.payload.id, toolbarSectionCreator(state, action));
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    // return state;
    case CHANGE_CONTAINED_VIEW_NAME:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case DELETE_CONTAINED_VIEW:
        let boxesCV = action.payload.boxes ? action.payload.boxes : [];
        let newToolbarCV = JSON.parse(JSON.stringify(state));
        let parents = action.payload.parent ? action.payload.parent : [];
        // Delete all related marks
        Object.keys(parents).forEach((el)=>{
            if (newToolbarCV[el] && newToolbarCV[el].state && newToolbarCV[el].state.__marks) {
                parents[el].forEach((mark)=>{
                    if (newToolbarCV[el].state.__marks[mark] && newToolbarCV[el].state.__marks[mark].connection === action.payload.ids[0]) {
                        delete newToolbarCV[el].state.__marks[mark];
                    }
                });
            }
        });
        return deleteProps(newToolbarCV, boxesCV.concat(action.payload.ids[0]));
    case DELETE_NAV_ITEM:
        let boxes = action.payload.boxes ? action.payload.boxes : [];
        let linkedBoxes = action.payload.linkedBoxes ? action.payload.linkedBoxes : {};
        let newToolbar = JSON.parse(JSON.stringify(state));
        Object.keys(linkedBoxes).forEach((el)=>{
            if (newToolbar[el] && newToolbar[el].state && newToolbar[el].state.__marks) {
                for (let markId in linkedBoxes[el]) {
                    let mark = linkedBoxes[el][markId];
                    action.payload.ids.forEach((id)=>{
                        if (newToolbar[el].state.__marks[mark] && newToolbar[el].state.__marks[mark].connection === id) {
                            delete newToolbar[el].state.__marks[mark];
                        }
                    });

                }
            }
        });
        return deleteProps(newToolbar, boxes.concat(action.payload.ids));
    case UPDATE_TOOLBAR:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case IMPORT_STATE:
        return action.payload.present.toolbarsById || state;
    default:
        return state;
    }
}
