import {
    ADD_BOX, DELETE_BOX, DELETE_CONTAINED_VIEW,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER,
    TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_PLUGIN_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX, ADD_NAV_ITEM,
} from '../common/actions';
import Utils, {
    changeProps, deleteProps, isSortableBox,
} from '../common/utils';
import i18n from 'i18next';

function toolbarCreator(state, action) {
    let structure;
    let toolbar = {};
    if(isSortableBox(action.payload.ids.id)) {
        toolbar = {
            [action.payload.ids.id]: {
                id: action.payload.ids.id,
                pluginId: "sortable_container",
                state: {},
                structure: {},
                style: {},
            },
        };
    } else {
        let pluginId = action.payload.initialParams.name;
        if(action.payload.ids.container !== 0) {
            if(state[action.payload.container]) {
                let toolbar_container = {
                    id: action.payload.id.container,
                    pluginId: "sortableBox",
                    state: {},
                    structure: {},
                    style: {},
                };
                toolbar = { ...toolbar, toolbar_container };
            }
        }
        structure = {
            bheight: action.payload.initialParams.height || "auto",
            bwidth: action.payload.initialParams.width || "20%",
            // bwidthUnit: "%",
            // bHeightUnit: "px",
            rotation: action.payload.initialParams.rotation || 0,
            aspectRatio: true,
            position: action.payload.id ? "relative" : "absolute",
        };

        toolbar = {
            ...toolbar,
            [action.payload.ids.id]:
                {
                    id: action.payload.ids.id,
                    pluginId: pluginId,
                    state: action.payload.state || {},
                    structure: structure || {},
                    style: action.payload.style || {},
                    showTextEditor: false,
                },
        };
    }
    return toolbar;
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_BOX:
        return { ...state, ...toolbarCreator(state, action) };
    case ADD_NAV_ITEM:
        // return changeProp(state, action.payload.id, toolbarSortableContainer(state, action));
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
        console.log(action.payload);
        return {
            ...state,
            [action.payload.id]: { ...state[action.payload.id], structure: { ...state[action.payload.id].structure,
                height: action.payload.height,
                width: action.payload.width,
            },
            },
        };
    case RESIZE_SORTABLE_CONTAINER:
        return {
            ...state,
            [action.payload.id]: {
                style: {
                    height: action.payload.height,
                },
            },
        };
    case TOGGLE_TEXT_EDITOR:
        let idCaller = action.payload.id || action.payload.caller;
        return {
            ...state,
            [idCaller]: { ...state[idCaller], showTextEditor: action.payload.value },
        };
    case UPDATE_BOX:
        //   return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case UPDATE_PLUGIN_TOOLBAR:
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                [action.payload.tab]: {
                    ...state[action.payload.id][action.payload.tab],
                    [action.payload.name]: action.payload.value,
                },
            },
        };
    case VERTICALLY_ALIGN_BOX:
        return {
            ...state,
            [action.payload.id]: {
                style: {
                    verticalAlign: action.payload.value,
                },
            },
        };
    case IMPORT_STATE:
        return action.payload.present.pluginToolbarsById || state;
    case PASTE_BOX:
        return changeProps(state, [action.payload.ids.id, ...Object.keys(action.payload.children)], [action.payload.toolbar, ...Object.keys(action.payload.children).map(k=>{return action.payload.children[k].toolbar;})]);
    default:
        return state;
    }
}
