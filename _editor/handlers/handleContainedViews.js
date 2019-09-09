import {
    deleteContainedView,
    selectContainedView, updateViewToolbar,
} from "../../common/actions";
import { getDescendantBoxes } from "../../common/utils";

export default function(self) {
    return {
        onContainedViewNameChanged: (id, titleStr) => self.props.dispatch(updateViewToolbar(id, titleStr)),

        onContainedViewSelected: (id) => self.props.dispatch(selectContainedView(id)),

        onContainedViewDeleted: (cvid) => {
            let boxesRemoving = [];
            self.props.containedViews[cvid].boxes.map(boxId => {
                boxesRemoving.push(boxId);
                boxesRemoving = boxesRemoving.concat(getDescendantBoxes(self.props.boxes[boxId], self.props.boxes));
            });
            self.props.dispatch(deleteContainedView([cvid], boxesRemoving, self.props.containedViews[cvid].parent));
        },
    };
}
