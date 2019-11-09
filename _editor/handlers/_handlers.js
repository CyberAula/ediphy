import handleBoxes from "./handleBoxes";
import handleContainedViews from "./handleContainedViews";
import handleSortableContainers from "./handleSortableContainers";
import handleModals from "./handleModals";
import handleMarks from "./handleMarks";
import handleNavItems from "./handleNavItems";
import handleToolbars from "./handleToolbars";
import handleExercises from "./handleExercises";
import handleCanvas from "./handleCanvas";
import handleExportImport from "./handleExportImport";

export default (self) => ({
    ...handleBoxes(self),
    ...handleContainedViews(self),
    ...handleSortableContainers(self),
    ...handleModals(self),
    ...handleMarks(self),
    ...handleNavItems(self),
    ...handleToolbars(self),
    ...handleExercises(self),
    ...handleCanvas(self),
    ...handleExportImport(self),
});
