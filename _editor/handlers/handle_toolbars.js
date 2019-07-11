import { addBox, updateBox, updatePluginToolbar, updateUI, updateViewToolbar } from "../../common/actions";
import { parsePluginContainers, parsePluginContainersReact } from "../../common/plugins_inside_plugins";
import Ediphy from '../../core/editor/main';
import { isBox, isSortableBox } from "../../common/utils";
import { createBox } from "../../common/common_tools";

export default function(self) {
    return {
        onToolbarUpdated: (id, tab, accordion, name, value) => {
            if (isBox(id) || isSortableBox(id)) {
                let toolbar = self.props.pluginToolbars[id];
                let pluginAPI = Ediphy.Plugins.get(toolbar.pluginId);
                let config = pluginAPI.getConfig();
                let deletedBoxes = [];
                if (config.isComplex && accordion === 'state') {
                    let newPluginState = JSON.parse(JSON.stringify(toolbar.state));
                    newPluginState[name] = value;
                    let pluginContainerIds = {};// newPluginState.__pluginContainerIds;
                    let defaultBoxes = {};
                    if (config.flavor !== "react") {
                        let content = pluginAPI.getRenderTemplate(newPluginState);
                        parsePluginContainers(content, pluginContainerIds);
                    } else {
                        let content = pluginAPI.getRenderTemplate(newPluginState, { exercises: { correctAnswer: true } });
                        parsePluginContainersReact(content, pluginContainerIds, defaultBoxes);
                    }
                    if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length < Object.keys(pluginContainerIds).length)) {
                        for (let s in pluginContainerIds) {
                            if (!toolbar.state.__pluginContainerIds[s]) {
                                if (defaultBoxes[s]) {
                                    let page = self.props.containedViewSelected && self.props.containedViewSelected !== 0 ? self.props.containedViewSelected : self.props.navItemSelected;
                                    self.props.dispatch(updatePluginToolbar(id, tab, accordion,
                                        [name, "__pluginContainerIds"],
                                        [value, pluginContainerIds]));
                                    defaultBoxes[s].map((newBox, ind) => {
                                        createBox({
                                            parent: id,
                                            page,
                                            container: s,
                                            isDefaultPlugin: true,
                                            initialState: newBox.initialState,
                                            id: ID_PREFIX_BOX + Date.now() + '_' + ind,
                                            draggable: true,
                                            resizable: self.props.boxes[id].resizable,
                                        }, newBox.type, false,
                                        (...params)=>{self.props.dispatch(addBox(...params));},
                                        self.props.boxes);
                                    });

                                }
                            }
                        }
                        return;
                    } else if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length > Object.keys(pluginContainerIds).length)) {
                        for (let s in toolbar.state.__pluginContainerIds) {
                            if (!pluginContainerIds[s]) {
                                if (self.props.boxes[id].sortableContainers[s].children) {
                                    deletedBoxes = deletedBoxes.concat(self.props.boxes[id].sortableContainers[s].children);
                                }
                            }
                        }
                    }
                    self.props.dispatch(updatePluginToolbar(id, tab, accordion,
                        [name, "__pluginContainerIds"],
                        [value, pluginContainerIds], deletedBoxes));
                    return;
                }
                self.props.dispatch(updatePluginToolbar(id, tab, accordion, name, value, deletedBoxes));
            } else {
                self.props.dispatch(updateViewToolbar(id, tab, accordion, name, value));
            }
        },

        onPluginToolbarUpdated: (id, state) => self.props.dispatch(updateBox(id, "", self.props.pluginToolbars[self.props.reactUI.pluginConfigModal], state)),

        onViewToolbarUpdated: (id, toolbar) => self.props.dispatch(updateViewToolbar(id, toolbar)),
    };
}
