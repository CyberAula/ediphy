import {ADD_BOX, ADD_RICH_MARK, DELETE_BOX, ADD_NAV_ITEM, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE} from './../actions';
import Utils, {changeProp, changeProps, deleteProps, isSortableBox, isSortableContainer} from './../utils';
import i18n from 'i18next';

function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        checked: arb.defaultValue,
        autoManaged: true
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.__aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

function createRichAccordions(controls) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __marks_list: {
                    key: 'marks_list',
                    __name: 'Marks List',
                    icon: 'border_all',
                    buttons: {}
                },
                __content_list: {
                    key: 'content_list',
                    __name: 'Content List',
                    icon: 'border_all',
                    buttons: {}
                }
            }
        };
    }
    if (!controls.main.accordions.__marks_list) {
        controls.main.accordions.__marks_list = {
            key: 'marks_list',
            __name: 'Marks List',
            icon: 'border_all',
            buttons: {}
        };
    }
    if (!controls.main.accordions.__content_list) {
        controls.main.accordions.__content_list = {
            key: 'content_list',
            __name: 'Content List',
            icon: 'border_all',
            buttons: {}
        };
    }
}

function createAliasButton(controls, state) {
    if (!controls.main) {
        controls.main = {
            __name: "Alias",
            icon: 'rate_review',
            accordions: {
                __extra: {
                    __name: "Alias",
                    buttons: {}
                }
            }
        };
    } else if (!controls.main.accordions.__extra) {
        controls.main.accordions.__extra = {
            __name: "Alias",
            icon: 'rate_review',
            buttons: {}
        };
    }
    if (!controls.main.accordions.__extra.buttons.alias) {
        if(state === null){
            controls.main.accordions.__extra.buttons.alias = {
                __name: 'Alias',
                type: 'text',
                value: "",
                autoManaged: true,
                isAttribute: true
            };
        }else{
            controls.main.accordions.__extra.buttons.alias = Object.assign({}, state.controls.main.accordions.__extra.buttons.alias);
        }
    }
}

function createSizeButtons(controls, state, action, floatingBox) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __sortable: {
                    key: 'structure',
                    __name: i18n.t('Structure'),
                    icon: 'border_all',
                    buttons: {}
                }
            }
        };
    } else if (!controls.main.accordions.__sortable) {
        controls.main.accordions.__sortable = {
            key: 'structure',
            __name: i18n.t('Structure'),
            icon: 'border_all',
            buttons: {}
        };
    }
    let displayValue;
    let value;
    let units;
    let type;

    // It means we are creating a new one, initial params can come
    if (state === null) {
        if(floatingBox) {
            displayValue = 25;
            value = 25;
            units = "%";
        }else{
            displayValue = 100;
            value = 100;
            units = "%";
        }
        type = "number";

        if (isSortableContainer(action.payload.ids.container) &&
            isSortableBox(action.payload.ids.parent) && !action.payload.config.needsTextEdition) {

            displayValue = 25;
            value = 25;
        }

        let initialWidth = action.payload.initialParams.width;
        if (initialWidth) {
            if (initialWidth === "auto") {
                displayValue = "auto";
                units = "%";
                type = "text";
            } else {
                displayValue = parseInt(initialWidth, 10);
                value = parseInt(initialWidth, 10);
                if (initialWidth.indexOf("px") !== -1) {
                    units = "px";
                }else{
                    units = "%";
                }
            }
        }
    } else {
        let width = state.controls.main.accordions.__sortable.buttons.__width;
        displayValue = width.displayValue;
        value = width.value;
        units = width.units;
        type = width.type;
    }
    controls.main.accordions.__sortable.buttons.__width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true
    };
    if(state === null){
        controls.main.accordions.__sortable.buttons.__height = {
            __name: i18n.t('Height'),
            type: 'text',
            displayValue: 'auto',
            value: 100,
            step: 5,
            units: floatingBox ? "px" : "%",
            auto: true,
            autoManaged: true
        };
    }else {
        let height = state.controls.main.accordions.__sortable.buttons.__height;
        controls.main.accordions.__sortable.buttons.__height = {
            __name: i18n.t('Height'),
            type: height.type,
            displayValue: height.displayValue,
            value: height.value,
            step: 5,
            units: height.units,
            auto: height.displayValue === "auto",
            autoManaged: true
        };
    }

    //This will be commented until it's working correctly
    /*
     controls.main.accordions.__sortable.buttons.__position = {
     __name: i18n.t('Position'),
     type: 'radio',
     value: 'relative',
     options: ['absolute', 'relative'],
     autoManaged: true
     };

     controls.main.accordions.__sortable.buttons.__verticalAlign = {
     __name: i18n.t('Vertical_align'),
     type: 'fancy_radio',
     value: 'middle',
     options: ['top', 'middle', 'bottom'],
     tooltips: [i18n.t('messages.align_top'), i18n.t('messages.align_middle'), i18n.t('messages.align_bottom')],
     icons: ['vertical_align_top', 'vertical_align_center', 'vertical_align_bottom'],
     autoManaged: true
     };
     */
}

function toolbarCreator(state, action) {
    let toolbar = {
        id: action.payload.ids.id,
        controls: action.payload.toolbar || {
            main: {
                __name: "Main",
                accordions: {}
            }
        },
        config: action.payload.config || {},
        state: action.payload.state || {},
        showTextEditor: false
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

function toolbarSectionCreator(state, action) {
    let toolbar = {
        id: action.payload.id,
        controls: action.payload.toolbar || {
            main: {
                __name: "Main",
                accordions: { //define accordions for section
                  basic: {
                    __name: "Página",
                    icon: 'settings',
                    buttons: {
                        visibility: {
                            __name: i18n.t('display_page'),
                            type: 'checkbox',
                            //checked: base.getState().controls,
                            checked: true,
                            autoManaged: false
                        }
                    }
                  },
                  style: {
                      __name: i18n.t('Header'),
                      icon: 'format_color_text',
                      buttons: {
                          controls: {
                              __name: "Título visible",
                              type: 'checkbox',
                              //checked: base.getState().controls,
                              checked: true,
                              autoManaged: false
                          },
                          url: {
                              __name: "Título",
                              type: 'text',
                              value: "Título curso",
                              autoManaged: false
                          }
                      }

                  }
                }
            }
        },
        config: action.payload.config || {},
        state: action.payload.state || {}
    };

    toolbar.config.displayName = "Documento_prueba";

    createAliasButton(toolbar.controls, null);

    return toolbar;
}

function toolbarReducer(state, action) {
    var newState;
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
                        if (!button.autoManaged){
                            button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                        }
                    }
                    if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                            for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                                button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                                if (!button.autoManaged){
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
                        if (!button.autoManaged){
                            button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                        }
                    }
                    if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                            for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                                button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                                if (!button.autoManaged){
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
            let controls = action.payload.toolbar;
            if (!isSortableBox(action.payload.id)) {
                createSizeButtons(controls, state, action);
                createAliasButton(controls, state);
            }

            if (state.config && state.config.isRich) {
                createRichAccordions(controls);
            }

            return changeProps(
                state,
                [
                    "state",
                    "controls"
                ], [
                    action.payload.state,
                    state.controls
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
            } else {
                if (pl.accordions.length > 1) {
                    newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]]
                        .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
                } else {
                    newState.controls[pl.tab].accordions[pl.accordions[0]]
                        .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
                }
            }

            // Rebind callback functions because from not automanaged buttons
             for (let tabKey in newState.controls) {
                for (let accordionKey in newState.controls[tabKey].accordions) {
                    let button;
                    for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                        button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                        if (!button.autoManaged){
                            button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                        }
                    }
                    if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                            for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                                button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                                if (!button.autoManaged){
                                    button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                                }
                            }
                        }
                    }
                }
             }

            return newState;
        case VERTICALLY_ALIGN_BOX:
            newState = Utils.deepClone(state);
            newState.controls.main.accordions.__sortable.buttons.__verticalAlign.value = action.payload.verticalAlign;

            // Rebind callback functions because from not automanaged buttons
             for (let tabKey in newState.controls) {
                for (let accordionKey in newState.controls[tabKey].accordions) {
                    let button;
                    for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                        button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                        if (!button.autoManaged){
                            button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                        }
                    }
                    if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                            for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                                button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                                if (!button.autoManaged){
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

export default function (state = {}, action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return changeProp(state, action.payload.ids.id, toolbarCreator(state, action));
        case ADD_RICH_MARK:
            return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
        case DELETE_BOX:
            let children = action.payload.children ? action.payload.children : [];
            return deleteProps(state, children.concat(action.payload.id));
        case ADD_NAV_ITEM:
            return changeProp(state, action.payload.id, toolbarSectionCreator(state, action));
        case DELETE_NAV_ITEM:
            let boxes = action.payload.boxes ? action.payload.boxes : [];
            return deleteProps(state, boxes.concat(action.payload.id));
        case DELETE_SORTABLE_CONTAINER:
            return deleteProps(state, action.payload.children);
        case DUPLICATE_BOX:
            let newState = Object.assign({}, state);
            let replaced = Object.assign({}, state);
            let newIds = action.payload.newIds;
            //let count = 0;
            Object.keys(newIds).map((box)=> {
                replaced = Object.assign({}, Object.replaceAll(replaced, box, newIds[box]));
            });
            replaced = Object.assign({}, Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId));
            return Object.assign({}, newState, replaced);
        case EDIT_RICH_MARK:
            return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
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
        default:
            return state;
    }
}
