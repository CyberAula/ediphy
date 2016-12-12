import {combineReducers} from 'redux';
import undoable from 'redux-undo';
import Utils from './../utils';
import {ADD_BOX, SELECT_BOX, MOVE_BOX, DUPLICATE_BOX, RESIZE_BOX, UPDATE_BOX, DELETE_BOX, REORDER_SORTABLE_CONTAINER, DROP_BOX, INCREASE_LEVEL,
    ADD_RICH_MARK, EDIT_RICH_MARK, SELECT_CONTAINED_VIEW,
    RESIZE_SORTABLE_CONTAINER, DELETE_SORTABLE_CONTAINER, CHANGE_COLS, CHANGE_ROWS, CHANGE_SORTABLE_PROPS, REORDER_BOXES,
    ADD_NAV_ITEM, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, DELETE_NAV_ITEM, REORDER_NAV_ITEM, TOGGLE_NAV_ITEM, UPDATE_NAV_ITEM_EXTRA_FILES,
    CHANGE_NAV_ITEM_NAME, CHANGE_UNIT_NUMBER, VERTICALLY_ALIGN_BOX,
    TOGGLE_TEXT_EDITOR, TOGGLE_TITLE_MODE, CHANGE_TITLE,
    CHANGE_DISPLAY_MODE, SET_BUSY, UPDATE_TOOLBAR, COLLAPSE_TOOLBAR, IMPORT_STATE, FETCH_VISH_RESOURCES_SUCCESS
} from './../actions';
import {ID_PREFIX_SECTION, ID_PREFIX_PAGE, ID_PREFIX_BOX, ID_PREFIX_SORTABLE_BOX, ID_PREFIX_SORTABLE_CONTAINER} from './../constants';
import i18n from 'i18next';
import boxesById from './boxes_by_id';
import boxLevelSelected from './box_level_selected';
import boxSelected from './box_selected';
import containedViewsById from './contained_views_by_id';
import containedViewSelected from './contained_view_selected';
import navItemsById from './nav_items_by_id';
import navItemsIds from './nav_items_ids';
import navItemSelected from './nav_item_selected';
import toolbarsById from './toolbars_by_id';

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

const GlobalState = undoable(combineReducers({
    title: changeTitle,
    boxesById: boxesById, //{0: box0, 1: box1}
    boxSelected: boxSelected, //0
    boxLevelSelected: boxLevelSelected, //0
    navItemsIds: navItemsIds, //[0, 1]
    navItemSelected: navItemSelected, // 0
    navItemsById: navItemsById, // {0: navItem0, 1: navItem1}
    containedViewsById: containedViewsById, // {0: containedView0, 1: containedView1}
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

        if (action.type === ADD_BOX && action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
            return false;
        }

        return currentState !== previousState; // only add to history if state changed
    }
});

export default GlobalState;
