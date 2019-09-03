import { isSortableBox } from '../../common/utils';

export function toolbarCreator(state, action) {
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
