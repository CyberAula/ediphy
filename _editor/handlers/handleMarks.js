import {
    addRichMark,
    deleteRichMark,
    editRichMark,
    moveRichMark, selectBox,
    updateUI,
} from "../../common/actions";
import { isContainedView } from "../../common/utils";

export default (self) => ({
    addMarkShortcut: (mark) => {
        let state = JSON.parse(JSON.stringify(self.props.pluginToolbars[self.props.boxSelected].state));
        state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
        if(mark.connection.id) {
            state.__marks[mark.id].connection = mark.connection.id;
        }
        self.props.dispatch(addRichMark(self.props.boxSelected, mark, state));
    },

    deleteMarkCreator: () => self.props.dispatch(updateUI({ markCreatorVisible: false })),

    onMarkCreatorToggled: (id) => self.props.dispatch(updateUI({ markCreatorVisible: id })),

    onRichMarkAdded: (mark, view, viewToolbar) => self.props.dispatch(addRichMark(mark, view, viewToolbar)),

    onRichMarkMoved: (mark, value) => self.props.dispatch(moveRichMark(mark, value)),

    onRichMarkDeleted: (id) => {
        let cvid = self.props.marksById[id].connection;
        // This checks if the deleted mark leaves an orphan contained view, and displays a message asking if the user would like to delete it as well
        if (isContainedView(cvid)) {
            let selfcv = self.props.containedViewsById[cvid];
            if (Object.keys(selfcv.parent).length === 1) {
                self.props.dispatch(updateUI({ showCVAlert: true, markInfo: id }));
                return;
            }
        }
        self.props.dispatch(deleteRichMark(marks[id]));
    },

    onRichMarkEditPressed: (mark) => self.props.dispatch(updateUI({ currentRichMark: mark })),

    onRichMarkUpdated: (mark, view, viewToolbar) =>
    {
        self.props.dispatch(editRichMark(mark, view, viewToolbar));
    },

    onRichMarksModalToggled: (value, boxId = -1) => {
        const reactUI = self.props.reactUI;
        self.props.dispatch(updateUI({ richMarksVisible: !reactUI.richMarksVisible }));
        if(value) {
            self.props.dispatch(updateUI({ markCursorValue: value }));
        }
        if(reactUI.richMarksVisible) {
            self.props.dispatch(updateUI({
                currentRichMark: null,
                markCursorValue: null,
            }));
        }
        if(boxId !== -1) {
            self.props.dispatch(selectBox(boxId, self.props.boxesById?.[boxId] ?? self.props.boxes[boxId]));
        }
    },
});
