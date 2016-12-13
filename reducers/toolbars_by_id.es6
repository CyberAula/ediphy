import {ADD_BOX, ADD_RICH_MARK, DELETE_BOX, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE} from './../actions';
import Utils, {changeProp, changeProps, deleteProps, isSortableBox, isSortableContainer} from './../utils';
import i18n from 'i18next';

function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        value: arb.defaultValue,
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
function createSortableButtons(controls) {
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
    controls.main.accordions.__sortable.buttons.width = {
        __name: i18n.t('Width_percentage'),
        type: 'number',
        value: 100,
        min: 0,
        max: 100,
        step: 5,
        units: '%',
        autoManaged: true
    };
    controls.main.accordions.__sortable.buttons.height = {
        __name: i18n.t('Height_percentage'),
        type: 'number',
        value: 'auto',
        min: 0,
        max: 100,
        step: 5,
        units: '%',
        autoManaged: true
    };
    controls.main.accordions.__sortable.buttons.__heightAuto = {
        __name: i18n.t('Height_auto'),
        type: 'checkbox',
        value: 'checked',
        checked: 'true',
        autoManaged: true
    };
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
}
function createFloatingBoxButtons(controls) {
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

    controls.main.accordions.__sortable.buttons.width = {
        __name: i18n.t('Width_pixels'),
        type: 'number',
        value: 100,
        min: 0,
        max: 100,
        step: 5,
        units: 'px',
        autoManaged: true
    };
    controls.main.accordions.__sortable.buttons.height = {
        __name: i18n.t('Height_pixels'),
        type: 'number',
        value: 'auto',
        min: 0,
        max: 100,
        step: 5,
        units: 'px',
        autoManaged: true
    };
    controls.main.accordions.__sortable.buttons.__heightAuto = {
        __name: i18n.t('Height_auto'),
        type: 'checkbox',
        value: 'checked',
        checked: 'true',
        autoManaged: true
    };
}
function createAliasButton(controls) {
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
    controls.main.accordions.__extra.buttons.alias = {
        __name: 'Alias',
        type: 'text',
        value: "",
        autoManaged: true,
        isAttribute: true
    };
}

function toolbarCreator(state, action){
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
    // If contained in sortableContainer
    if (isSortableContainer(action.payload.ids.container)) {
        createSortableButtons(toolbar.controls);
    // If not contained (AKA floating box)
    } else if (!isSortableBox(action.payload.ids.id)) {
        createFloatingBoxButtons(toolbar.controls);
    }

    // If not a DaliBoxSortable
    if (!isSortableBox(action.payload.ids.id)) {
        createAliasButton(toolbar.controls);
    }
    if (toolbar.config && toolbar.config.aspectRatioButtonConfig) {
        createAspectRatioButton(toolbar.controls, toolbar.config);
    }

    if (toolbar.config && toolbar.config.isRich) {
        createRichAccordions(toolbar.controls);
    }

    return toolbar;
}

function toolbarReducer(state, action){
    var newState;
    switch (action.type){
        case ADD_RICH_MARK:
            return changeProp(state, "state", action.payload.state);
        case EDIT_RICH_MARK:
            return changeProp(state, "state", action.payload.state);
        case RESIZE_BOX:
            newState = Utils.deepClone(state);
            let height = action.payload.height;
            let heightAuto = height === 'auto';

            if (newState.controls.main.accordions.__sortable) {
                let buttons = newState.controls.main.accordions.__sortable.buttons;
                if (buttons.__heightAuto) {
                    newState.controls.main.accordions.__sortable.buttons.__heightAuto.checked = heightAuto;
                    newState.controls.main.accordions.__sortable.buttons.__heightAuto.value = heightAuto ? 'checked' : 'unchecked';
                }
                if (buttons.height && buttons.width) {
                    newState.controls.main.accordions.__sortable.buttons.height.value = height;
                    newState.controls.main.accordions.__sortable.buttons.width.value = height;
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
            return newState;
        case TOGGLE_TEXT_EDITOR:
            return changeProp(state, "showTextEditor", action.payload.value);
        case UPDATE_BOX:
            let controls = action.payload.toolbar;

            try {
                createSortableButtons(
                    controls,
                    state.controls.main.accordions.__sortable.buttons.width.value,
                    state.controls.main.accordions.__sortable.buttons.height.value
                );
                createAliasButton(
                    controls,
                    state.controls.main.accordions.__extra.buttons.alias.value
                );
            } catch (e) {
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
                    controls
                ]
            );
        case UPDATE_TOOLBAR:
            newState = Utils.deepClone(state);
            let pl = action.payload;
            if (pl.accordions.length > 1) {
                newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]].buttons[pl.name].value = pl.value;
            } else {
                newState.controls[pl.tab].accordions[pl.accordions[0]].buttons[pl.name].value = pl.value;
            }
            return newState;
        case VERTICALLY_ALIGN_BOX:
            newState = Utils.deepClone(state);
            newState.controls.main.accordions.__sortable.buttons.__verticalAlign.value = action.payload.verticalAlign;
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
        case DELETE_NAV_ITEM:
            return deleteProps(state, action.payload.boxes);
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