import {ADD_BOX, ADD_RICH_MARK, COLLAPSE_TOOLBAR, DELETE_BOX, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE} from './../actions';
import Utils, {changeProp, deleteProps, isSortableBox, isPage, isSection, isView} from './../utils';
import {ID_PREFIX_SORTABLE_CONTAINER} from './../constants';
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
        controls: action.payload.toolbar || {},
        config: action.payload.config || {},
        state: action.payload.state,
        showTextEditor: false,
        isCollapsed: false
    };
    if (isSortableBox(action.payload.ids.id)) {
        if (toolbar.config) {
            toolbar.config.name = i18n.t('Container_');
        }
    }
    // If contained in sortableContainer
    if (action.payload.ids.container.length && action.payload.ids.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
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

export default function (state = {}, action = {}) {
    var newState;
    switch (action.type) {
        case ADD_BOX:
            let toolbar = toolbarCreator(state, action);

            newState = Object.assign({}, state);
            newState[action.payload.ids.id] = toolbar;
            if (!isView(action.payload.ids.parent)) {
                let parentControls = state[action.payload.ids.parent].controls;
                if (Object.keys(parentControls).length === 0) {
                    parentControls.main = {
                        __name: "Main",
                        accordions: {}
                    };
                }
                newState[action.payload.ids.parent].controls = parentControls;
            }

            return newState;
        case DELETE_BOX:
            let newObject = Utils.deepClone(state);
            delete newObject[action.payload.id];

            if (action.payload.children) {
                action.payload.children.forEach(id => {
                    delete newObject[id];
                });
            }

            return newObject;
        case DELETE_SORTABLE_CONTAINER:
            newState = Utils.deepClone(state);
            if (action.payload.children) {
                action.payload.children.forEach(id => {
                    delete newState[id];
                });
            }

            return newState;
        case DUPLICATE_BOX:
            newState = Object.assign({}, state);
            let replaced = Object.assign({}, state);
            let newIds = action.payload.newIds;
            //let count = 0;
            Object.keys(newIds).map((box)=> {
                replaced = Object.assign({}, Object.replaceAll(replaced, box, newIds[box]));
            });
            replaced = Object.assign({}, Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId));
            let defState = Object.assign({}, newState, replaced);
            return defState;
        case UPDATE_TOOLBAR:
            newState = Object.assign({}, state);
            let pl = action.payload;
            if (pl.accordions.length > 1) {
                newState[pl.id].controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]].buttons[pl.name].value = pl.value;
            } else {
                newState[pl.id].controls[pl.tab].accordions[pl.accordions[0]].buttons[pl.name].value = pl.value;
            }
            return newState;
        case COLLAPSE_TOOLBAR:
            return Object.assign({}, state, {
                [action.payload.id]: Object.assign({}, state[action.payload.id], {isCollapsed: !(state[action.payload.id].isCollapsed)})
            });
        case VERTICALLY_ALIGN_BOX:
            newState = Utils.deepClone(state);
            newState[action.payload.id].controls.main.accordions.__sortable.buttons.__verticalAlign.value = action.payload.verticalAlign;
            return newState;
        case RESIZE_BOX:
            newState = Object.assign({}, state);
            let height = action.payload.height;
            //let width = action.payload.width;
            let heightAuto = height === 'auto';

            if (newState[action.payload.id] && newState[action.payload.id].controls) {
                if (newState[action.payload.id].controls.main && newState[action.payload.id].controls.main.accordions) {
                    if (newState[action.payload.id].controls.main.accordions.__sortable) {
                        let buttons = newState[action.payload.id].controls.main.accordions.__sortable.buttons;
                        if (buttons.__heightAuto) {
                            newState[action.payload.id].controls.main.accordions.__sortable.buttons.__heightAuto.checked = heightAuto;
                            newState[action.payload.id].controls.main.accordions.__sortable.buttons.__heightAuto.value = heightAuto ? 'checked' : 'unchecked';
                        }
                        if (buttons.height && buttons.width) {
                            newState[action.payload.id].controls.main.accordions.__sortable.buttons.height.value = height;
                            newState[action.payload.id].controls.main.accordions.__sortable.buttons.width.value = height;
                        }
                    }
                }
            }

            return newState;
        case ADD_RICH_MARK:
            return Object.assign({}, state, {
                [action.payload.parent]: Object.assign({}, state[action.payload.parent], {
                    state: action.payload.state
                })
            });
        case EDIT_RICH_MARK:
            return Object.assign({}, state, {
                [action.payload.parent]: Object.assign({}, state[action.payload.parent], {
                    state: action.payload.state
                })
            });
        case UPDATE_BOX:
            let controls = action.payload.toolbar;

            try {
                createSortableButtons(
                    controls,
                    state[action.payload.id].controls.main.accordions.__sortable.buttons.width.value,
                    state[action.payload.id].controls.main.accordions.__sortable.buttons.height.value
                );
                createAliasButton(
                    controls,
                    state[action.payload.id].controls.main.accordions.__extra.buttons.alias.value
                );
            } catch (e) {
            }

            if (state[action.payload.id].config && state[action.payload.id].config.isRich) {
                createRichAccordions(controls);
            }

            return Object.assign({}, state, {
                [action.payload.id]: Object.assign({}, state[action.payload.id], {
                    state: action.payload.state,
                    controls: controls
                })
            });
        case TOGGLE_TEXT_EDITOR:
            return Object.assign({}, state, {
                [action.payload.caller]: Object.assign({}, state[action.payload.caller], {showTextEditor: action.payload.value})
            });
        case IMPORT_STATE:
            return action.payload.present.toolbarsById || state;
        case DELETE_NAV_ITEM:
            newState = Object.assign({}, state);
            action.payload.boxes.map(box => {
                delete newState[box];
            });
            return newState;
        case RESIZE_SORTABLE_CONTAINER:
            newState = Object.assign({}, state);
            if (newState[action.payload.parent].state) {
                let sortableContainers = newState[action.payload.parent].state.__pluginContainerIds;
                for (let key in sortableContainers) {
                    if (sortableContainers[key].id === action.payload.id) {
                        sortableContainers[key].height = action.payload.height;
                        break;
                    }
                }
            }
            return newState;
        default:
            return state;
    }
}