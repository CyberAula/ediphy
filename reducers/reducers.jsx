import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import {
    ADD_BOX, SELECT_BOX, INCREASE_LEVEL, INDEX_SELECT, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, UPDATE_NAV_ITEM_EXTRA_FILES,
    TOGGLE_TEXT_EDITOR,
    DELETE_RICH_MARK, ADD_RICH_MARK, DELETE_CONTAINED_VIEW,
    TOGGLE_TITLE_MODE, CHANGE_DISPLAY_MODE, SET_BUSY, IMPORT_STATE, FETCH_VISH_RESOURCES_SUCCESS, UPDATE_BOX,
    UPLOAD_FILE, SELECT_CONTAINED_VIEW,
} from '../common/actions';
import { isSortableBox } from '../common/utils';
import boxesById from './boxes_by_id';
import boxLevelSelected from './box_level_selected';
import boxSelected from './box_selected';
import containedViewsById from './contained_views_by_id';
import containedViewSelected from './contained_view_selected';
import indexSelected from './index_selected';
import navItemsById from './nav_items_by_id';
import navItemsIds from './nav_items_ids';
import navItemSelected from './nav_item_selected';
import marksById from './marks_by_id';
import pluginToolbarsById from './plugin_toolbars_by_id';
import viewToolbarsById from './view_toolbars_by_id';
import globalConfig from './global_config';
import exercises from './exercises';
import lastActionDispatched from './lastActionDispatched';

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
        return /* action.payload.present.isBusy ||*/ state;
    default:
        return state;
    }
}

function filesUploaded(state = [], action = {}) {
    switch(action.type) {
    case UPLOAD_FILE:
        return state.concat(action.payload);
    case IMPORT_STATE:
        return action.payload.present.filesUploaded || state;
    default:
        return state;
    }
}
const GlobalState = undoable(combineReducers({
    lastActionDispatched: lastActionDispatched,
    globalConfig: globalConfig,
    filesUploaded: filesUploaded, // [img0, img1]
    boxesById: boxesById, // {0: box0, 1: box1}
    boxSelected: boxSelected, // 0
    boxLevelSelected: boxLevelSelected, // 0
    indexSelected: indexSelected,
    marksById: marksById, // {0: mark1, 1: mark2}
    navItemsIds: navItemsIds, // [0, 1]
    navItemSelected: navItemSelected, // 0
    navItemsById: navItemsById, // {0: navItem0, 1: navItem1}
    containedViewsById: containedViewsById, // {0: containedView0, 1: containedView1}
    containedViewSelected: containedViewSelected, // 0
    displayMode: changeDisplayMode, // "list",
    pluginToolbarsById: pluginToolbarsById, // {0: toolbar0, 1: toolbar1}
    viewToolbarsById: viewToolbarsById,
    exercises: exercises,
    isBusy: isBusy,
}), {
    filter: (action, currentState, previousState) => {
        switch (action.type) {
        case CHANGE_DISPLAY_MODE:
        case EXPAND_NAV_ITEM:
        case IMPORT_STATE:
        case INCREASE_LEVEL:
        case INDEX_SELECT:
        case SELECT_BOX:
        case SELECT_NAV_ITEM:
        case SELECT_CONTAINED_VIEW:
        case SET_BUSY:
        case TOGGLE_TEXT_EDITOR:
        case TOGGLE_TITLE_MODE:
        case UPDATE_NAV_ITEM_EXTRA_FILES:
        // case UPDATE_BOX:
        // case ADD_RICH_MARK:
            return false;
        }

        if(action.type === ADD_BOX) {
            if(action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
                return false;
            } else if (isSortableBox(action.payload.ids.id)) {
                return false;
            }
        }
        // TODO: Comprobar que esto funciona
        return currentState !== previousState;
    },
});

export default GlobalState;
