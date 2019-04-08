import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import {
    ADD_BOX, SELECT_BOX, INCREASE_LEVEL, INDEX_SELECT, SELECT_NAV_ITEM, EXPAND_NAV_ITEM,
    TOGGLE_TEXT_EDITOR,
    DELETE_RICH_MARK, ADD_RICH_MARK, DELETE_CONTAINED_VIEW,
    SET_BUSY, IMPORT_STATE, FETCH_VISH_RESOURCES_SUCCESS, UPDATE_BOX,
    UPLOAD_FILE, SELECT_CONTAINED_VIEW, DELETE_FILE, CHANGE_GLOBAL_CONFIG, IMPORT_EDI,
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
import styleConfig from './style_config';
import exercises from './exercises';
import lastActionDispatched from './lastActionDispatched';
const version = "3";

function changeDisplayMode(state = "", action = {}) {
    switch (action.type) {
    // case CHANGE_DISPLAY_MODE:
    //     return action.payload.mode;
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

function filesUploaded(state = {}, action = {}) {
    switch(action.type) {
    case UPLOAD_FILE:
        return { ...state, [action.payload.id]: { ...action.payload } };
    case DELETE_FILE:
        return Object.keys(state)
            .filter(key => key !== action.payload.id)
            .reduce((result, current) => {
                result[current] = state[current];
                return result;
            }, {});
    case IMPORT_STATE:
        return action.payload.present.filesUploaded || state;
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.filesUploaded };
    default:
        return state;
    }
}

function versionReducer(state = {}, action = {}) {
    return version;
}

function status(state = "draft", action = {}) {
    switch (action.type) {

    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE') {
            return action.payload.value.status;
        } else if (action.payload.prop === 'status') {
            return action.payload.value;
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.status || state;
    default:
        return state;
    }}
function everPublished(state = false, action = {}) {
    switch (action.type) {
    case CHANGE_GLOBAL_CONFIG:
        if(action.payload.prop === 'STATE' && action.payload.value.status === 'final' && state === false) {
            return true;
        } else if (action.payload.prop === 'status' && action.payload.value === 'final' && state === false) {
            return true;
        }
        return state;
    case IMPORT_STATE:
        return action.payload.present.everPublished === undefined ? state : action.payload.present.everPublished;
    default:
        return state;
    }}
const GlobalState = combineReducers({
    filesUploaded, // We are not allowed to undo file uploads/removals because the files remain in the server
    status,
    everPublished,
    undoGroup: undoable(combineReducers({
        version: versionReducer,
        lastActionDispatched: lastActionDispatched,
        globalConfig: globalConfig,
        styleConfig: styleConfig,
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
            /* flag for */
            if (action.payload && action.payload.reason && action.payload.reason === "saving_state") {
                window.exitFlag = true;
            } else {
                window.exitFlag = null;
            }

            switch (action.type) {
            // case CHANGE_DISPLAY_MODE:
            case EXPAND_NAV_ITEM:
            case IMPORT_STATE:
            case INCREASE_LEVEL:
            case INDEX_SELECT:
            case SELECT_BOX:
            case SELECT_NAV_ITEM:
            case SELECT_CONTAINED_VIEW:
            case SET_BUSY:
            case TOGGLE_TEXT_EDITOR:
            case UPLOAD_FILE:
            case DELETE_FILE:
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
    }) });

export default GlobalState;
