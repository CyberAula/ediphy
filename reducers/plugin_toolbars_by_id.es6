import {
    ADD_BOX, DELETE_BOX, DELETE_CONTAINED_VIEW,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER,
    TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_PLUGIN_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX,
} from '../common/actions';
import Utils, {
    changeProp, deleteProps,
} from '../common/utils';
import i18n from 'i18next';

function toolbarCreator(state, action) {
    let toolbar = {
        id: action.payload.ids.id,
        pluginName: action.payload.pluginName,
        state: action.payload.state || {},
        style: action.payload.style || {},
        showTextEditor: false,
    };

    return toolbar;
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, action.payload.ids.id, toolbarCreator(state, action));
    case DELETE_BOX:
        let children = action.payload.children ? action.payload.children : [];
        return deleteProps(state, children.concat(action.payload.id));
    case DELETE_CONTAINED_VIEW:
        let boxesCV = action.payload.boxes ? action.payload.boxes : [];
        let newToolbarCV = JSON.parse(JSON.stringify(state));
        let parents = action.payload.parent ? action.payload.parent : [];
        // Delete all related marks

        return deleteProps(newToolbarCV, boxesCV.concat(action.payload.ids[0]));
    case DELETE_NAV_ITEM:
        let boxes = action.payload.boxes ? action.payload.boxes : [];
        let newToolbar = { ...state };

        return deleteProps(newToolbar, boxes.concat(action.payload.ids));
    case DELETE_SORTABLE_CONTAINER:
        return deleteProps(state, action.payload.children);
    case RESIZE_BOX:
        newState = {
            ...state,
            [action.payload.id]: {
                height: action.payload.height,
                width: action.payload.width,
            },
        };
        return newState;
    case RESIZE_SORTABLE_CONTAINER:
        newState = {
            ...state,
            [action.payload.id]: {
                style: {
                    height: action.payload.height,
                },
            },
        };
        return newState;
    case TOGGLE_TEXT_EDITOR:
        newState = {
            ...state,
            [action.payload.id]: {
                showTextEditor: action.payload.value,
            },
        };
        return newState;
    case UPDATE_BOX:
        //   return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case UPDATE_PLUGIN_TOOLBAR:
        newState = {
            ...state,
            [action.payload.id]: {
                state: action.payload.state,
                style: action.payload.style,
            },
        };
        return newState;
    case VERTICALLY_ALIGN_BOX:
        newState = {
            ...state,
            [action.payload.id]: {
                style: {
                    verticalAlign: action.payload.value,
                },
            },
        };
        return newState;
    case IMPORT_STATE:
        return action.payload.present.pluginToolbarsById || state;
    case PASTE_BOX:
        return changeProp(state, action.payload.ids.id, action.payload.toolbar);
    default:
        return state;
    }
}
