import {
    ADD_BOX, ADD_RICH_MARK, CHANGE_NAV_ITEM_NAME, DELETE_BOX, DELETE_RICH_MARK, DELETE_CONTAINED_VIEW, ADD_NAV_ITEM,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    CHANGE_CONTAINED_VIEW_NAME,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX,
} from '../common/actions';
import Utils, {
    changeProp, changeProps, deleteProps, isSortableBox, isSortableContainer, isPage, isSlide, isDocument,
    nextToolbarAvailName, isSection,
} from '../common/utils';
import i18n from 'i18next';

function toolbarCreator(state, action) {
    let toolbar = {
        id: action.payload.ids.id,
        config: action.payload.config || {},
        state: action.payload.state || {},
        showTextEditor: false,
    };
    if (isSortableBox(action.payload.ids.id)) {
        toolbar.config.displayName = i18n.t('Container_');
    }
    if(!isSortableBox(action.payload.ids.id)) {
        createSizeButtons(toolbar.controls, null, action, !isSortableContainer(action.payload.ids.container));
        createAliasButton(toolbar.controls, null);
    }
    if (toolbar.config && toolbar.config.aspectRatioButtonConfig) {
        createAspectRatioButton(toolbar.controls, toolbar.config);
    }
    if (toolbar.config && toolbar.config.isRich) {
        createRichAccordions(toolbar.controls);
    }

    return toolbar;
}

function toolbarReducer(state, action) {
    let newState;
    switch (action.type) {
    case ADD_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case EDIT_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case RESIZE_BOX:
        newState = Utils.deepClone(state);
        if (newState.controls.main.accordions.__sortable) {
            let buttons = newState.controls.main.accordions.__sortable.buttons;
            if (buttons.__height && buttons.__width) {
                if (action.payload.heightButton) {
                    newState.controls.main.accordions.__sortable.buttons.__height = action.payload.heightButton;
                }
                if (action.payload.widthButton) {
                    newState.controls.main.accordions.__sortable.buttons.__width = action.payload.widthButton;
                }
            }
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
    case RESIZE_SORTABLE_CONTAINER:
        newState = Utils.deepClone(state);
        let sortableContainers = newState.state.__pluginContainerIds;
        for (let key in sortableContainers) {
            if (sortableContainers[key].id === action.payload.id) {
                sortableContainers[key].height = action.payload.height;
                break;
            }
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

    case TOGGLE_TEXT_EDITOR:
        return changeProp(state, "showTextEditor", action.payload.value);
    case UPDATE_BOX:
        /* let controls = action.payload.toolbar;
            if (!isSortableBox(action.payload.id)) {
                createSizeButtons(controls, state, action);
                createAliasButton(controls, state);
            }

            if (state.config && state.config.isRich) {
                createRichAccordions(controls);
            }
            if (state.config && state.config.aspectRatioButtonConfig) {
                createAspectRatioButton(controls, state.config);
            }*/
        return changeProps(
            state,
            [
                "state",
            ], [
                action.payload.state,
            ]
        );
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
    case DELETE_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case VERTICALLY_ALIGN_BOX:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.__sortable.buttons.__verticalAlign.value = action.payload.verticalAlign;

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

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, action.payload.ids.id, toolbarCreator(state, action));
    case ADD_NAV_ITEM:
        return changeProp(state, action.payload.id, toolbarSectionCreator(state, action));
    case ADD_RICH_MARK:
        newState = JSON.parse(JSON.stringify(state));
        if(action.payload.mark.connectMode === "new") {
            let modState = changeProp(newState, action.payload.mark.connection.id || action.payload.mark.connection, toolbarSectionCreator(newState, action, true));
            newState = changeProp(modState, action.payload.parent, toolbarReducer(modState[action.payload.parent], action));
        } else {
            newState = changeProp(newState, action.payload.parent, toolbarReducer(newState[action.payload.parent], action));
        }
        return newState;
    case DELETE_BOX:
        let children = action.payload.children ? action.payload.children : [];
        return deleteProps(state, children.concat(action.payload.id));
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
    case DELETE_SORTABLE_CONTAINER:
        return deleteProps(state, action.payload.children);
    case DUPLICATE_BOX:
        let replaced = JSON.parse(JSON.stringify(state));
        let newIds = action.payload.newIds;
        // let count = 0;
        Object.keys(newIds).map((box)=> {
            replaced = Object.assign({}, Object.replaceAll(replaced, box, newIds[box]));
        });
        replaced = Object.assign({}, Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId));
        return replaced;
    case EDIT_RICH_MARK:
        if(action.payload.mark.connectMode === "new" && action.payload.oldConnection !== action.payload.newConnection) {
            let modState = changeProp(state, action.payload.mark.connection.id || action.payload.mark.connection, toolbarSectionCreator(state, action, true));
            return changeProp(modState, action.payload.parent, toolbarReducer(modState[action.payload.parent], action));
        }
        return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));

    case DELETE_RICH_MARK:
        if (state[action.payload.parent] && state[action.payload.parent].state.__marks && state[action.payload.parent].state.__marks[action.payload.id]) {
            return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
        }
        return state;
    case RESIZE_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
    case TOGGLE_TEXT_EDITOR:
        return changeProp(state, action.payload.caller, toolbarReducer(state[action.payload.caller], action));
    case UPDATE_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case UPDATE_TOOLBAR:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case VERTICALLY_ALIGN_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case IMPORT_STATE:
        return action.payload.present.toolbarsById || state;
    case PASTE_BOX:
        return changeProp(state, action.payload.ids.id, action.payload.toolbar);
    default:
        return state;
    }
}
