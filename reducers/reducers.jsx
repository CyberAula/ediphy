import {combineReducers} from 'redux';
import undoable from 'redux-undo';
import {ADD_BOX, SELECT_BOX, INCREASE_LEVEL, SELECT_NAV_ITEM, EXPAND_NAV_ITEM, UPDATE_NAV_ITEM_EXTRA_FILES, TOGGLE_TEXT_EDITOR,
    TOGGLE_TITLE_MODE, CHANGE_TITLE, CHANGE_DISPLAY_MODE, SET_BUSY, IMPORT_STATE, FETCH_VISH_RESOURCES_SUCCESS, UPLOAD_IMAGE} from './../actions';
import {isSortableBox} from './../utils';
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
            case UPDATE_NAV_ITEM_EXTRA_FILES:
                return false;
        }

        if(action.type === ADD_BOX){
            if(action.payload.initialParams && action.payload.initialParams.isDefaultPlugin) {
                return false;
            }else if (isSortableBox(action.payload.ids.id)){
                return false;
            }
        }

        return currentState !== previousState; // only add to history if state changed
    }
});

export default GlobalState;
