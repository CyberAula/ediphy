import {
    ADD_BOX,
    CHANGE_COLS,
    CHANGE_ROWS,
    CHANGE_SORTABLE_PROPS,
    DELETE_BOX,
    DROP_BOX,
    PASTE_BOX, REORDER_BOXES, RESIZE_SORTABLE_CONTAINER,
} from '../../common/actions';
import { changeProp, changeProps } from '../../common/utils';

export default function singleSortableContainerReducer(state = {}, action = {}) {
    switch (action.type) {
    case ADD_BOX:
    case PASTE_BOX:
        if (action.payload.index || (action.payload.initialParams && action.payload.initialParams.index)) {
            let newOrder = [...state.children];
            newOrder.splice(action.payload.index || action.payload.initialParams.index, 0, action.payload.ids.id);
            return changeProp(state, "children", newOrder);
        }
        return changeProp(state, "children", [...state.children, action.payload.ids.id]);
    case CHANGE_COLS:
        let cols = state.cols;
        let distributionLength = action.payload.distribution.length;
        if (distributionLength < cols.length) {
            cols = cols.slice(0, distributionLength);
        }
        let reduced = action.payload.distribution.reduce(function(prev, curr) {
            return prev + curr;
        });
        if (reduced > 99 || reduced <= 101) {
            if (distributionLength > cols.length) {
                let difference = distributionLength - cols.length;
                for (let i = 0; i < difference; i++) {
                    cols.push([100]);
                }
            }
        }

        return changeProps(
            state,
            [
                "colDistribution",
                "cols",
            ], [
                action.payload.distribution,
                cols,
            ]
        );
    case CHANGE_ROWS:
        let newCols = state.cols.slice();
        newCols[action.payload.column] = action.payload.distribution;
        return changeProp(state, "cols", newCols);
    case CHANGE_SORTABLE_PROPS:
        return changeProp(state, "style", changeProp(state.style, action.payload.prop, action.payload.value));
    case DELETE_BOX:
        return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
    case DROP_BOX:
        if (action.payload.oldContainer === action.payload.container && action.payload.oldParent === action.payload.parent && (action.payload.index || action.payload.index === 0)) {
            let newCh = state.children.filter(id => id !== action.payload.id);
            newCh.splice(action.payload.index, 0, action.payload.id);
            return changeProp(state, "children", newCh);
        }
        if (state.key === action.payload.oldContainer && action.payload.currentBoxReducer === action.payload.oldParent) {
            return changeProp(state, "children", state.children.filter(id => id !== action.payload.id));
        } else if (state.key === action.payload.container && action.payload.currentBoxReducer === action.payload.parent) {
            if (action.payload.index || action.payload.index === 0) {
                let newOrder = [...state.children];
                newOrder.splice(action.payload.index, 0, action.payload.id);
                return changeProp(state, "children", newOrder);
            }
            return changeProp(state, "children", [...state.children, action.payload.id]);
        }
        return state;
    case REORDER_BOXES:
        return changeProp(state, "children", action.payload.order);
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, "height", action.payload.height);
    default:
        return state;
    }
}
