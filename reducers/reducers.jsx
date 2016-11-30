import {combineReducers} from 'redux';
import undoable from 'redux-undo';
import Utils from './../utils';
import {ADD_BOX, SELECT_BOX, MOVE_BOX, DUPLICATE_BOX, RESIZE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_BOX, DROP_BOX, INCREASE_LEVEL,
    ADD_RICH_MARK, EDIT_RICH_MARK, SELECT_CONTAINED_VIEW,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    ADD_NAV_ITEM, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, REMOVE_NAV_ITEM, REORDER_NAV_ITEM, TOGGLE_NAV_ITEM, UPDATE_NAV_ITEM_EXTRA_FILES,
    CHANGE_SECTION_TITLE, CHANGE_UNIT_NUMBER, VERTICALLY_ALIGN_BOX,
    TOGGLE_TEXT_EDITOR, TOGGLE_TITLE_MODE, CHANGE_TITLE,
    CHANGE_DISPLAY_MODE, SET_BUSY, UPDATE_TOOLBAR, COLLAPSE_TOOLBAR, IMPORT_STATE, FETCH_VISH_RESOURCES_SUCCESS, UPLOAD_IMAGE
} from './../actions';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_CONTAINED_VIEW, ID_PREFIX_SORTABLE_CONTAINER} from './../constants';
import i18n from 'i18next';
import boxesById from './boxes_by_id';
import boxLevelSelected from './box_level_selected';
import boxSelected from './box_selected';
import navItemsById from './nav_items_by_id';

function boxesIds(state = [], action = {}) {
    switch (action.type) {
        case ADD_BOX:
            return [...state, action.payload.ids.id];
        case DUPLICATE_BOX:
            let firstJoin = state;
            firstJoin.push(ID_PREFIX_BOX + action.payload.newId);
            let newIds = action.payload.newIds;
            Object.keys(newIds).map((box)=> {
                firstJoin.push(ID_PREFIX_BOX + newIds[box]);
            });
            return firstJoin;
        case DELETE_BOX:
            return state.filter(id => {
                return id !== action.payload.id && (action.payload.children ? action.payload.children.indexOf(id) === -1 : true);
            });
        case DELETE_SORTABLE_CONTAINER:
            return state.filter(id => action.payload.children.indexOf(id) === -1);
        case REMOVE_NAV_ITEM:
            return state.filter(id => {
                return action.payload.boxes.indexOf(id) === -1;
            });
        case IMPORT_STATE:
            return action.payload.present.boxes || state;
        default:
            return state;
    }
}

function navItemsIds(state = [], action = {}) {
    switch (action.type) {
        case ADD_NAV_ITEM:
            let nState = state.slice();
            nState.splice(action.payload.position - 1, 0, action.payload.id);
            return nState;
        case REMOVE_NAV_ITEM:
            let newState = state.slice();
            action.payload.ids.forEach(id => {
                newState.splice(newState.indexOf(id), 1);
            });
            return newState;
        case REORDER_NAV_ITEM:
            return action.payload.idsInOrder;
        case IMPORT_STATE:
            return action.payload.present.navItemsIds || state;
        default:
            return state;
    }
}

function navItemSelected(state = 0, action = {}) {
    switch (action.type) {
        case SELECT_NAV_ITEM:
            return action.payload.id;
        case ADD_NAV_ITEM:
            return action.payload.id;
        case REMOVE_NAV_ITEM:
            return 0;
        case IMPORT_STATE:
            return action.payload.present.navItemSelected || state;
        default:
            return state;
    }
}

function containedViewSelected(state = 0, action = {}) {
    switch (action.type) {
        case SELECT_NAV_ITEM:
            return 0;
        case SELECT_CONTAINED_VIEW:
            return action.payload.id;
        case ADD_NAV_ITEM:
            return 0;
        case REMOVE_NAV_ITEM:
            return 0;
        case IMPORT_STATE:
            return action.payload.present.containedViewSelected || state;
        default:
            return state;
    }
}

function containedViews(state = {}, action = {}) {
    switch (action.type) {
        case ADD_RICH_MARK:
            if (action.payload.mark.connection.id) {
                return Object.assign({}, state, {
                    [action.payload.mark.connection.id]: action.payload.mark.connection
                });
            }
            return state;
        case ADD_BOX:
            if (action.payload.ids.container.length && action.payload.ids.container.indexOf(ID_PREFIX_CONTAINED_VIEW) !== -1) {
                return Object.assign({}, state, {
                    [action.payload.ids.container]: Object.assign({}, state[action.payload.ids.container], {
                        boxes: [...state[action.payload.ids.container].boxes, action.payload.ids.id]
                    })
                });
            }
            return state;
        case DELETE_BOX:
            let newState = Utils.deepClone(state);

            if (action.payload.childrenViews) {
                action.payload.childrenViews.map(view => {
                    delete newState[view];
                });
            }

            if (action.payload.container.length && action.payload.container.indexOf(ID_PREFIX_CONTAINED_VIEW) !== -1) {
                newState[action.payload.container].boxes = newState[action.payload.container].boxes.filter(id => action.payload.id !== id);
            }

            return newState;
        case DELETE_SORTABLE_CONTAINER:
            newState = Utils.deepClone(state);

            if (action.payload.childrenViews) {
                action.payload.childrenViews.map(view => {
                    delete newState[view];
                });
            }
            return newState;
        case REMOVE_NAV_ITEM:
            if (action.payload.containedViews) {
                let newState = Utils.deepClone(state);
                action.payload.containedViews.map(view => {
                    delete newState[view];
                });
                return newState;
            }
            return state;
        case IMPORT_STATE:
            return action.payload.present.containedViewsById || state;
        default:
            return state;
    }
}

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
        title: i18n.t('Height_auto_message'),
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

function toolbarsById(state = {}, action = {}) {
    var newState;
    switch (action.type) {
        case ADD_BOX:
            let toolbar = {
                id: action.payload.ids.id,
                controls: action.payload.toolbar || {},
                config: action.payload.config || {},
                state: action.payload.state,
                showTextEditor: false,
                isCollapsed: false
            };
            if (action.payload.ids.id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1) {
                if (toolbar.config) {
                    toolbar.config.name = i18n.t('Container_');
                }
            }
            // If contained in sortableContainer
            if (action.payload.ids.container.length && action.payload.ids.container.indexOf(ID_PREFIX_SORTABLE_CONTAINER) !== -1) {
                createSortableButtons(toolbar.controls);
            // If not contained (AKA floating box)
            } else if (action.payload.ids.id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                createFloatingBoxButtons(toolbar.controls);
            }

            // If not a DaliBoxSortable
            if (action.payload.ids.id.indexOf(ID_PREFIX_SORTABLE_BOX) === -1) {
                createAliasButton(toolbar.controls);
            }
            if (toolbar.config && toolbar.config.aspectRatioButtonConfig) {
                createAspectRatioButton(toolbar.controls, toolbar.config);
            }

            if (toolbar.config && toolbar.config.isRich) {
                createRichAccordions(toolbar.controls);
            }

            newState = Object.assign({}, state);
            newState[action.payload.ids.id] = toolbar;
            if (action.payload.ids.parent.indexOf(ID_PREFIX_PAGE) === -1 && action.payload.ids.parent.indexOf(ID_PREFIX_SECTION) === -1) {
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
            //let newId = ID_PREFIX_BOX + action.payload.newId;
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
            let width = action.payload.width;
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
                            newState[action.payload.id].controls.main.accordions.__sortable.buttons.width.value = width;
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
        case REMOVE_NAV_ITEM:
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

function changeTitle(state = "", action = {}) {
    switch (action.type) {
        case CHANGE_TITLE:
            return action.payload;
        case IMPORT_STATE:
            return action.payload.present.title || state;
        default:
            return state;
    }
}

function changeDisplayMode(state = "", action = {}) {
    switch (action.type) {
        case CHANGE_DISPLAY_MODE:
            return action.payload.mode;
        case IMPORT_STATE:
            return action.payload.present.displayMode || state;
        default:
            return state;
    }
}

function isBusy(state = "", action = {}) {
    switch (action.type) {
        case SET_BUSY:
            return action.payload;
        case IMPORT_STATE:
            return action.payload.present.isBusy || state;
        default:
            return state;
    }
}

function fetchVishResults(state = {results: []}, action = {}) {
    switch (action.type) {
        case FETCH_VISH_RESOURCES_SUCCESS:
            return action.payload.result;
        default:
            return state;
    }
}

function imagesUploaded(state = [], action = {}){
    switch(action.type){
        case UPLOAD_IMAGE:
            return state.concat(action.payload.url);
        default:
            return state;
    }
}

const GlobalState = undoable(combineReducers({
    title: changeTitle,
    imagesUploaded: imagesUploaded, // [img0, img1]
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxLevelSelected: boxLevelSelected, //0
    boxesIds: boxesIds, //[0, 1]
    navItemsIds: navItemsIds, //[0, 1]
    navItemSelected: navItemSelected, // 0
    navItemsById: navItemsById, // {0: navItem0, 1: navItem1}
    containedViewsById: containedViews, // {0: containedView0, 1: containedView1}
    containedViewSelected: containedViewSelected, //0
    displayMode: changeDisplayMode, //"list",
    toolbarsById: toolbarsById, // {0: toolbar0, 1: toolbar1}
    isBusy: isBusy,
    fetchVishResults: fetchVishResults
}), {
    filter: (action, currentState, previousState) => {

        switch (action.type) {
            case CHANGE_DISPLAY_MODE:
            case EXPAND_NAV_ITEM:
            case IMPORT_STATE:
            case INCREASE_LEVEL:
            case SELECT_BOX:
            case SELECT_NAV_ITEM:
            case SET_BUSY:
            case TOGGLE_TEXT_EDITOR:
            case TOGGLE_TITLE_MODE:
            case REORDER_BOXES:
            case UPDATE_NAV_ITEM_EXTRA_FILES:
                return false;
        }

        if(action.type === ADD_BOX){
            if(action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
                return false;
            }else if (action.payload.ids.id.indexOf(ID_PREFIX_SORTABLE_BOX) !== -1){
                return false;
            }
        }

        return currentState !== previousState; // only add to history if state changed
    }
});

export default GlobalState;
