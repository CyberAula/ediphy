import {
    ADD_BOX, ADD_RICH_MARK, DELETE_BOX, DELETE_CONTAINED_VIEW,
    DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER,
    TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_PLUGIN_TOOLBAR,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE, PASTE_BOX, ADD_NAV_ITEM, DUPLICATE_NAV_ITEM, IMPORT_EDI,
} from '../common/actions';
import Utils, {
    changeProps, deleteProps, isSortableBox, isPage,
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
        if(!action.payload.ids.container !== 0) {
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
        let initialWidth = 20;
        let widthUnit = "%";
        if (action.payload.initialParams.width) {
            let parsed = parseFloat(action.payload.initialParams.width);
            if (!isNaN(parsed)) {
                initialWidth = parsed;
                if (action.payload.initialParams.width.toString().indexOf("px") > -1) {
                    widthUnit = "px";
                }
            } else if (action.payload.initialParams.width === 'auto') {
                initialWidth = 'auto';
            }
        }

        let initialHeight = "auto";
        let heightUnit = action.payload.resizable ? "%" : "px";
        if (action.payload.initialParams.height && action.payload.initialParams.height !== 'auto') {
            let parsed = parseFloat(action.payload.initialParams.height);
            if (!isNaN(parsed)) {
                initialHeight = parsed;
                if (action.payload.initialParams.height.toString().indexOf("%") > -1) {
                    heightUnit = "%";
                }
            } else if (action.payload.initialParams.height === 'auto') {
                initialHeight = 'auto';
            }
        }

        structure = {
            height: initialHeight,
            width: initialWidth,
            widthUnit: widthUnit,
            heightUnit: heightUnit,
            rotation: action.payload.initialParams.rotation || 0,
            aspectRatio: (action.payload.initialParams.aspectRatio && action.payload.initialParams.aspectRatio.defaultValue !== undefined) ? action.payload.initialParams.aspectRatio.defaultValue : false,
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
        let a = { ...state, ...toolbarCreator(state, action) };
        return a;
    case ADD_NAV_ITEM:
        if(action.payload.type === "document") {
            return {
                ...state,
                [action.payload.sortable_id]: {
                    id: action.payload.sortable_id,
                    pluginId: "sortable_container",
                    showTextEditor: false,
                    state: {},
                    structure: {
                        aspectRatio: true,
                        height: "",
                        position: "absolute",
                        rotation: "",
                        width: "",
                    },
                    style: {
                        backgroundColor: "#ffffff",
                        boderWidth: 0,
                        borderColor: "#000000",
                        borderRadius: 0,
                        borderStyle: "solid",
                        opacity: 1,
                        padding: 0,
                    },
                },
            };
        }
        return state;
    case ADD_RICH_MARK:
        if(action.payload.mark.connectMode === "new" && action.payload.view.type === "document") {
            return {
                ...state,
                [action.payload.view.boxes[0]]: {
                    id: action.payload.view.boxes[0],
                    pluginId: "sortable_container",
                    showTextEditor: false,
                    state: {},
                    structure: {
                        aspectRatio: true,
                        height: "",
                        position: "absolute",
                        rotation: "",
                        width: "",
                    },
                    style: {
                        backgroundColor: "#ffffff",
                        boderWidth: 0,
                        borderColor: "#000000",
                        borderRadius: 0,
                        borderStyle: "solid",
                        opacity: 1,
                        padding: 0,
                    },
                },
            };
        }
        return state;
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
        return {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                structure: {
                    ...state[action.payload.id].structure,
                    ...action.payload.structure,
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
            [idCaller]: { ...state[idCaller],
                showTextEditor: action.payload.value },
        };
    case UPDATE_BOX:

        return {
            ...state,
            [action.payload.id]: { ...state[action.payload.id],
                state: action.payload.state } };
        //   return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case UPDATE_PLUGIN_TOOLBAR:
        let newValues = {};
        if (action.payload.name instanceof Array) {
            action.payload.name.map((name, ind) => { newValues[name] = action.payload.value[ind];});
        } else {
            newValues[action.payload.name] = action.payload.value;
        }
        let updatedState = {
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                [action.payload.accordion]: {
                    ...state[action.payload.id][action.payload.accordion],
                    ...newValues,
                },
            },
        };
        for (let b in action.payload.deletedBoxes) {
            delete updatedState[action.payload.deletedBoxes[b]];
        }
        return updatedState;
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
    case DUPLICATE_NAV_ITEM:
        let newToolbars = {};
        for (let t in action.payload.boxes) {
            let nt = action.payload.boxes[t];
            newToolbars[nt] = { ...state[t], id: nt };
        }
        return { ...state, ...newToolbars };
    case IMPORT_EDI:
        return { ...state, ...action.payload.state.pluginToolbarsById };
    default:
        return state;
    }
}
