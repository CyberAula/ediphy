import {
    deleteContainedView,
    selectContainedView, updateViewToolbar,
} from "../../common/actions";
import { getDescendantBoxes } from "../../common/utils";

export default (self) => ({
    onContainedViewNameChanged: (id, titleStr) => self.props.dispatch(updateViewToolbar(id, titleStr)),

    onContainedViewSelected: (id) => self.props.dispatch(selectContainedView(id)),

    onContainedViewDeleted: (cvid) => {
        let boxesRemoving = [];
        self.props.containedViewsById[cvid].boxes.map(boxId => {
            boxesRemoving.push(boxId);
            boxesRemoving = boxesRemoving.concat(getDescendantBoxes(self.props.boxesById[boxId], self.props.boxesById));
        });
        self.props.dispatch(deleteContainedView([cvid], boxesRemoving, self.props.containedViewsById[cvid].parent));
    },
});
