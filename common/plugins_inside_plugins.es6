import PluginPlaceholder from '../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import { isSortableContainer } from './utils';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from './constants';
import { ADD_BOX } from './actions';
/**
 *
 * @param obj
 * @param state
 * @params defaultBoxes
 */
export function parsePluginContainersReact(obj, state, defaultBoxes = {}) {
    if (obj && obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            parsePluginContainersReact(obj[i], state, defaultBoxes);
        }
    }
    if (obj && obj.props && obj.props.children) {
        if (obj.props.children && obj.props.children instanceof Array) {
            for (let i = 0; i < obj.props.children.length; i++) {
                if (obj.props.children.length > 1) {
                    parsePluginContainersReact(obj.props.children[i], state, defaultBoxes);
                }
            }
        } else if (obj.props.children) {
            parsePluginContainersReact(obj.props.children, state, defaultBoxes);
        }
    }

    if (obj && obj.type && obj.type === PluginPlaceholder) {
        let newProps = {};
        if (obj.props) {
            let height = "auto";
            if (obj.props) {
                if (obj.props.pluginDataHeight) {
                    height = obj.props.pluginDataHeight;
                } else if (obj.props.pluginDataInitialHeight) {
                    height = obj.props.pluginDataInitialHeight;
                } else {
                    height = obj.props.hasOwnProperty('pluginDataResizable') ? "auto" : "auto";
                }
            }
            newProps = JSON.parse(JSON.stringify(obj.props));
            if (!newProps) {
                newProps = {
                    style: { height: height },
                };
            }
            if (!newProps.style) {
                newProps.style = { height: height };
            } else {
                newProps.style.height = height;
            }
            if (newProps.style.minHeight) {
                delete newProps.style.minHeight;
            }
            if (!newProps.pluginContainer) {
                // eslint-disable-next-line no-console
                console.error("It is mandatory to specify the prop \"pluginContainer\" in PluginPlaceholder Component");
                newProps.pluginContainer = ID_PREFIX_SORTABLE_CONTAINER + Date.now() + parseInt(Math.random() * 10000, 10) + new Date().getUTCMilliseconds();
            } else {
                newProps.pluginContainer = isSortableContainer(newProps.pluginContainer) ? newProps.pluginContainer : ID_PREFIX_SORTABLE_CONTAINER + newProps.pluginContainer;
            }
            if (!newProps.pluginDataHeight) {
                newProps.pluginDataHeight = newProps.pluginDataInitialHeight || (newProps.hasOwnProperty('pluginDataResizable') ? "auto" : "auto");
            }

            if (obj.props.pluginContainer && !state[obj.props.pluginContainer]) {
                state[newProps.pluginContainer] = {
                    id: newProps.pluginContainer,
                    name: newProps.pluginContainerName || newProps.pluginContainer,
                    height: newProps.pluginDataHeight,
                };

                if (newProps.pluginDefaultContent) {
                    if (!defaultBoxes[newProps.pluginContainer] || !(defaultBoxes[newProps.pluginContainer] instanceof Array)) {
                        defaultBoxes[newProps.pluginContainer] = [];
                    }
                    newProps.pluginDefaultContent.map(newPlugin => {
                        defaultBoxes[newProps.pluginContainer].push({ type: newPlugin.plugin, initialState: newPlugin.initialState });
                    });

                }
            }
        }
    }

}

/**
 * @deprecated
 * @param obj
 * @param state
 */
export function parsePluginContainers(obj, state) {
    if (obj && obj.child) {
        for (let i = 0; i < obj.child.length; i++) {
            if (obj.child[i].tag && obj.child[i].tag === "plugin") {
                if (obj.child.length > 1) {
                    // eslint-disable-next-line no-console
                    console.error("A plugin tag must not have siblings. Please check renderTemplate method");
                }
                let height = "auto";
                let child = obj.child[i];
                if (child.attr) {
                    if (child.attr['plugin-data-height']) {
                        height = child.attr['plugin-data-height'];
                    } else if (child.attr['plugin-data-initial-height']) {
                        height = child.attr['plugin-data-initial-height'];
                    } else {
                        height = child.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto";
                    }
                }
                if (!obj.attr) {
                    obj.attr = {
                        style: { height: height },
                    };
                } else if (!obj.attr.style) {
                    obj.attr.style = { height: height };
                } else {
                    obj.attr.style.height = height;
                }

                if (obj.attr.style.minHeight) {
                    delete obj.attr.style.minHeight;
                }
            }
            parsePluginContainers(obj.child[i], state);
        }
    }
    if (obj && obj.tag && obj.tag === "plugin") {
        if (obj.attr) {
            if (!obj.attr['plugin-container']) {
                obj.attr['plugin-container'] = ID_PREFIX_SORTABLE_CONTAINER + Date.now() + parseInt(Math.random() * 10000, 10) + new Date().getUTCMilliseconds();
            }
            if (!obj.attr['plugin-data-height']) {
                obj.attr['plugin-data-height'] = obj.attr['plugin-data-initial-height'] || (obj.attr.hasOwnProperty('plugin-data-resizable') ? "auto" : "auto");
            }
            if (obj.attr['plugin-data-key'] && !state[obj.attr['plugin-data-key']]) {
                state[obj.attr['plugin-data-key']] = {
                    id: obj.attr['plugin-container'],
                    name: obj.attr['plugin-data-display-name'] || obj.attr['plugin-data-key'],
                    height: obj.attr['plugin-data-height'],
                };
            }
        }
    }
    if (obj && obj.attr && obj.attr.class) {
        if(!Array.isArray(obj.attr.class) && typeof obj.attr.class === "string") {
            obj.attr.class = [obj.attr.class];
        }
        obj.attr.className = obj.attr.class.join(' ');
        delete obj.attr.class;
    }
}

export function hasExerciseBox() {
    return false;
}

/**
 * @deprecated
 * @param ids
 * @param obj
 * @param boxes
 */
export function addDefaultContainerPlugins(ids, obj, boxes) {

    if (obj && obj.child) {
        for (let i = 0; i < obj.child.length; i++) {
            addDefaultContainerPlugins(ids, obj.child[i], boxes);
        }
    }
    if (obj && obj.tag && obj.tag === "plugin" && obj.attr['plugin-data-default']) {
        let idContainer = isSortableContainer(obj.attr['plugin-container']) ? obj.attr['plugin-container'] : ID_PREFIX_SORTABLE_CONTAINER + obj.props.pluginContainer;

        let plug_children = boxes[ids.id].sortableContainers[idContainer];
        if (plug_children && plug_children.children && plug_children.children.length === 0) {
            obj.attr['plugin-data-default'].split(",").map(name => {
                if (!Ediphy.Plugins.get(name)) {
                    // eslint-disable-next-line no-console
                    console.error("Plugin " + name + " does not exist");
                    return;
                }

                let initParams = {
                    parent: ids.id,
                    container: idContainer,
                    isDefaultPlugin: true,
                    id: ID_PREFIX_BOX + Date.now(),
                };

                let config = Ediphy.Plugins.get(name).getConfig();
                if (obj.attr['plugin-data-text'] && config.needsTextEdition) {
                    initParams.text = obj.attr['plugin-data-text'];
                }

                config.callback(initParams, ADD_BOX);
            });
        }
    }
}
/**
 *
 * @param params
 * @param obj
 * @param boxes
 * @param newBoxes
 */
export function addDefaultContainerPluginsReact(params, obj, boxes, newBoxes) {
    if (obj && obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            addDefaultContainerPluginsReact(params, obj[i], boxes, newBoxes);
        }
    }
    if (obj && obj.props && obj.props.children) {
        if (obj.props.children && obj.props.children instanceof Array) {
            for (let i = 0; i < obj.props.children.length; i++) {
                addDefaultContainerPluginsReact(params, obj.props.children[i], boxes, newBoxes);
            }
        } else if (obj.props.children) {
            addDefaultContainerPluginsReact(params, obj.props.children, boxes, newBoxes);
        }
    }

    if (obj && obj.type && obj.type === PluginPlaceholder && obj.props.pluginDefaultContent) {
        let idContainer = isSortableContainer(obj.props.pluginContainer) ? obj.props.pluginContainer : ID_PREFIX_SORTABLE_CONTAINER + obj.props.pluginContainer;
        obj.props.pluginDefaultContent.map((name) => {
            if (!Ediphy.Plugins.get(name.plugin)) {
                // eslint-disable-next-line no-console
                console.error("Plugin " + name.plugin + " does not exist");
                return;
            }
            let ids = {
                parent: params.id,
                page: params.page,
                container: idContainer,
                isDefaultPlugin: true,
            };

            if (name.initialState) {
                ids.initialState = name.initialState;
            }
            newBoxes.push({ name: name.plugin, ids });

        });
    }
}
