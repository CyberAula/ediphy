import {
    addNavItem,
    addNavItems, deleteNavItem,
    duplicateNavItem, expandNavItem, reorderNavItem,
    selectNavItem, toggleNavItem,
    updateUI,
    updateViewToolbar,
} from "../../common/actions";
import Ediphy from "../../core/editor/main";
import { getDescendantBoxes, getDescendantLinkedBoxes } from "../../common/utils";

export default function(self) {
    return {
        onNavItemNameChanged: (id, titleStr) => self.props.dispatch(updateViewToolbar(id, titleStr)),

        onNavItemAdded: (id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => {
            self.props.dispatch(addNavItem(
                id,
                name,
                parent,
                type,
                position,
                background,
                customSize,
                hideTitles,
                (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)),
                sortable_id));
        },

        onNavItemsAdded: (navs, parent) => self.props.dispatch(addNavItems(navs, parent)),

        onNavItemDuplicated: (id) => {
            if (id && self.props.navItems[id]) {
                let newBoxes = [];
                let navItem = self.props.navItems[id];
                let linkedCVs = {};
                if (navItem.boxes) {
                    newBoxes = newBoxes.concat(navItem.boxes);
                    navItem.boxes.forEach(b => {
                        let box = self.props.boxes[b];
                        if (box.sortableContainers) {
                            for (let sc in box.sortableContainers) {
                                if (box.sortableContainers[sc].children) {
                                    newBoxes = newBoxes.concat(box.sortableContainers[sc].children);
                                    box.sortableContainers[sc].children.forEach(bo => {
                                        let bx = self.props.boxes[bo];
                                        if (bx.sortableContainers) {
                                            for (let scc in bx.sortableContainers) {
                                                if (bx.sortableContainers[scc].children) {
                                                    newBoxes = newBoxes.concat(bx.sortableContainers[scc].children);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                let newBoxesMap = {};
                newBoxes.map(box => {
                    linkedCVs[box] = [...self.props.boxes[box].containedViews];
                    newBoxesMap[box] = box + Date.now(); });
                self.props.dispatch(duplicateNavItem(id, id + Date.now(), newBoxesMap, Date.now(), linkedCVs));
            }
        },

        onNavItemSelected: (id) => self.props.dispatch(selectNavItem(id)),

        onNavItemExpanded: (id, value) => self.props.dispatch(expandNavItem(id, value)),

        onNavItemDeleted: (navsel) => {
            let viewRemoving = [navsel].concat(self.getDescendantViews(self.props.navItems[navsel]));
            let boxesRemoving = [];
            let containedRemoving = {};
            viewRemoving.map(id => {
                self.props.navItems[id].boxes.map(boxId => {
                    boxesRemoving.push(boxId);
                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(self.props.boxes[boxId], self.props.boxes));
                });
            });
            let marksRemoving = getDescendantLinkedBoxes(viewRemoving, self.props.navItems) || [];
            dispatch(deleteNavItem(
                viewRemoving,
                self.props.navItems[navsel].parent,
                boxesRemoving,
                containedRemoving,
                marksRemoving));
        },

        onNavItemReordered: (...params) => self.props.dispatch(reorderNavItem(...params)),

        onNavItemToggled: () => self.props.dispatch(toggleNavItem(self.props.navItemSelected)),
    };
}
