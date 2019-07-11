import handle_boxes from "./handle_boxes";
import handle_contained_views from "./handle_contained_views";
import handle_sortable_containers from "./handle_sortable_containers";
import handle_modals from "./handle_modals";
import handle_marks from "./handle_marks";
import handle_nav_items from "./handle_nav_items";
import handle_toolbars from "./handle_toolbars";
import handle_exercises from "./handle_exercises";
import handle_canvas from "./handle_canvas";
import handle_export_import from "./handle_export_import";

export default function(self) {
    return {
        handle_boxes: handle_boxes(self),
        handle_contained_views: handle_contained_views(self),
        handle_sortable_containers: handle_sortable_containers(self),
        handle_modals: handle_modals(self),
        handle_marks: handle_marks(self),
        handle_nav_items: handle_nav_items(self),
        handle_toolbars: handle_toolbars(self),
        handle_exercises: handle_exercises(self),
        handle_canvas: handle_canvas(self),
        handle_export_import: handle_export_import(self),
    };
}
