import { changeSortableProps, deleteSortableContainer, reorderSortableContainer,
    resizeSortableContainer } from "../../common/actions";
import { getDescendantBoxesFromContainer } from "../../common/utils";

export default function(self) {
    return {
        onSortableContainerResized: (id, parent, height) => self.props.dispatch(resizeSortableContainer(id, parent, height)),

        onSortableContainerReordered: (ids, parent) => self.props.dispatch(reorderSortableContainer(ids, parent)),

        onSortableContainerDeleted: (id, parent) => {
            let boxes = self.props.boxes;
            let containedViews = self.props.containedViews;
            let page = self.props.containedViewSelected && self.props.containedViewSelected !== 0 ? self.props.containedViewSelected : self.props.navItemSelected;
            let descBoxes = getDescendantBoxesFromContainer(boxes[parent], id, self.props.boxes, self.props.containedViews);
            let cvs = {};
            for (let b in descBoxes) {
                let box = boxes[descBoxes[b]];
                for (let cv in box.containedViews) {
                    if (!cvs[box.containedViews[cv]]) {
                        cvs[box.containedViews[cv]] = [box.id];
                    } else if (cvs[containedViews[cv]].indexOf(box.id) === -1) {
                        cvs[box.containedViews[cv]].push(box.id);
                    }
                }
            }
            self.props.dispatch(deleteSortableContainer(id, parent, descBoxes, cvs, page));
        },

        onSortablePropsChanged: (...params) => self.props.dispatch(changeSortableProps(...params)),
    };
}
