import {
    addBox, changeCols, changeRows,
    deleteBox,
    dropBox,
    increaseBoxLevel,
    moveBox,
    reorderBoxes,
    resizeBox,
    selectBox, verticallyAlignBox,
} from "../../common/actions";
import { getDescendantBoxes } from "../../common/utils";

export default (self) => ({
    onBoxAdded: (...params) => self.props.dispatch(addBox(...params)),

    onBoxDeleted: (id, parent, container, page) => {
        let bx = getDescendantBoxes(self.props.boxesById[id], self.props.boxesById);
        let cvs = [...self.props.boxesById[id].containedViews];
        bx.map(box=>{
            cvs = [...cvs, ...self.props.boxesById[box].containedViews];
        });
        self.props.dispatch(deleteBox(id,
            parent,
            container,
            bx,
            cvs,
            page));
    },

    onBoxSelected: (id) => {
        self.props.dispatch(selectBox(id, self.props.boxesById[id]));
    },

    onBoxLevelIncreased: () => self.props.dispatch(increaseBoxLevel()),

    onBoxMoved: (...params) => self.props.dispatch(moveBox(...params)),

    onBoxResized: (id, structure) => self.props.dispatch(resizeBox(id, structure)),

    onBoxDropped: (...params) => self.props.dispatch(dropBox(...params)),

    onBoxesInsideSortableReorder: (parent, container, order) => self.props.dispatch(reorderBoxes(parent, container, order)),

    onColsChanged: (...params) => self.props.dispatch(changeCols(...params)),

    onRowsChanged: (...params) => self.props.dispatch(changeRows(...params)),

    onVerticallyAlignBox: (id, verticalAlign) => self.props.dispatch(verticallyAlignBox(id, verticalAlign)),
});
