import { isContainedView, isSortableBox, isSortableContainer } from '../../common/utils';
import { sortableContainerCreator } from './sortableContainerCreator';
export function boxCreator(state, action) {
    let position;
    let level = 0;
    if (state[action.payload.ids.parent] && !isContainedView(action.payload.ids.container)) {
        level = state[action.payload.ids.parent].level + 1;
    }

    if (isSortableBox(action.payload.ids.id)) {
        position = { x: 0, y: 0, type: 'relative' };
        level = -1;
    } else {
        position = {
            x: 0,
            y: 0,
            type: 'absolute',
        };
    }
    if (isSortableContainer(action.payload.ids.container)) {
        position = {
            x: 0,
            y: 0,
            type: 'relative',
        };
    }
    let col = 0;
    let row = 0;
    if (action.payload.initialParams) {
        if (action.payload.initialParams.position) {
            position = action.payload.initialParams.position;
        }
        if (action.payload.initialParams.col) {
            col = action.payload.initialParams.col;
        }
        if (action.payload.initialParams.row) {
            row = action.payload.initialParams.row;
        }
        if (action.payload.initialParams.width) {
            // width = action.payload.initialParams.width;
        }
    }
    // sortableContainers for boxes inside this box (this is not EditorBoxSortable)
    let children = [];
    let sortableContainers = {};
    if (action.payload.state) {
        let pluginContainers = action.payload.state.__pluginContainerIds;
        if (pluginContainers) {
            for (let key in pluginContainers) {
                children.push(pluginContainers[key].id);
                sortableContainers[pluginContainers[key].id] = sortableContainerCreator(key, [], pluginContainers[key].height, action.payload.ids.id);
            }
        }
    }

    return {
        id: action.payload.ids.id,
        parent: action.payload.ids.parent,
        container: action.payload.ids.container,
        level: level,
        col: col,
        row: row,
        position: position,
        // width: width,
        // height: height,
        content: {}, // action.payload.content,
        draggable: action.payload.draggable,
        resizable: action.payload.resizable,
        showTextEditor: false,
        fragment: {},
        children: children,
        sortableContainers,
        containedViews: [],
    };
}
