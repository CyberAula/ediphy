import { combineReducers } from 'redux';
import undoable from 'redux-undo';
import {
    ADD_BOX, SELECT_BOX, INCREASE_LEVEL, INDEX_SELECT, SELECT_NAV_ITEM, EXPAND_NAV_ITEM,
    TOGGLE_TEXT_EDITOR,
    SET_BUSY, IMPORT_STATE,
    UPLOAD_FILE, SELECT_CONTAINED_VIEW, DELETE_FILE, UPDATE_UI,
} from '../common/actions';
import { isSortableBox } from '../common/utils';

import boxesById from './boxes/boxesById';
import boxLevelSelected from './boxes/boxLevelSelected';
import boxSelected from './boxes/boxSelected';
import containedViewsById from './containedViews/containedViewsById';
import containedViewSelected from './containedViews/containedViewSelected';
import displayMode from './general/displayMode';
import everPublished from './general/everPublished';
import exercises from './exercises/exercises';
import filesUploaded from './general/filesUploaded';
import globalConfig from './general/globalConfig';
import indexSelected from './navItems/indexSelected';
import isBusy from './general/isBusy';
import lastActionDispatched from './general/lastActionDispatched';
import marksById from './general/marksById';
import navItemsById from './navItems/navItemsById';
import navItemsIds from './navItems/navItemsIds';
import navItemSelected from './navItems/navItemSelected';
import pluginToolbarsById from './toolbars/pluginToolbarsById';
import reactUI from './reactUI';
import status from './general/status';
import styleConfig from './styleConfig';
import version from './general/version';
import viewToolbarsById from './toolbars/viewToolbarsById';

const GlobalState = combineReducers({
    filesUploaded, // We are not allowed to undo file uploads/removals because the files remain in the server
    status,
    everPublished,
    reactUI,
    undoGroup: undoable(combineReducers({
        version,
        lastActionDispatched,
        globalConfig,
        styleConfig,
        boxesById, // {0: box0, 1: box1}
        boxSelected, // 0
        boxLevelSelected, // 0
        indexSelected,
        marksById, // {0: mark1, 1: mark2}
        navItemsIds, // [0, 1]
        navItemSelected, // 0
        navItemsById, // {0: navItem0, 1: navItem1}
        containedViewsById, // {0: containedView0, 1: containedView1}
        containedViewSelected, // 0
        displayMode, // "list",
        pluginToolbarsById, // {0: toolbar0, 1: toolbar1}
        viewToolbarsById,
        exercises,
        isBusy,
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
            case UPDATE_UI:
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
