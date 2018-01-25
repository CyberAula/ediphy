import Ediphy from './main';
import ReactDOM from 'react-dom';
import { isSortableContainer } from '../../common/utils';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
let html2json = require('html2json').html2json;

export default function() {
    let descendant, state, id, initialParams = {};

    let defaultFor = function(arg, value, warn) {
        if (typeof arg !== 'undefined') {
            return arg;
        }

        if (warn) {
            // eslint-disable-next-line no-console
            console.warn(warn);
        }
        return value;
    };

    let assignPluginContainerIds = function(json) {
        if (json.child) {
            for (let i = 0; i < json.child.length; i++) {
                assignPluginContainerIds(json.child[i]);
            }
        }
        if (json.tag && json.tag === "plugin") {
            if (!state.__pluginContainerIds) {
                state.__pluginContainerIds = {};
            }
            let key = json.attr['plugin-data-key'];
            if (!key) {
                // eslint-disable-next-line no-console
                console.error(json.tag + " has not defined plugin-data-key");
            } else if (state.__pluginContainerIds[key]) {
                json.attr['plugin-data-id'] = state.__pluginContainerIds[key].id;
                json.attr['plugin-data-display-name'] = state.__pluginContainerIds[key].name;
                json.attr['plugin-data-height'] = state.__pluginContainerIds[key].height;
            }
        }
    };

    let assignPluginContainerIdsReact = function(temp) {
        if (temp.props && temp.props.children) {
            if(temp.props.children instanceof Array) {
                for (let i = 0; i < temp.props.children.length; i++) {
                    assignPluginContainerIdsReact(temp.props.children[i]);
                }
            } else {
                assignPluginContainerIdsReact(temp.props.children);
            }

        }
        if (temp.type && temp.type === PluginPlaceholder) {
            if (!state.__pluginContainerIds) {
                state.__pluginContainerIds = {};
            }
            let key = temp.props['plugin-data-key'];
            if (!key) {
            } else if (state.__pluginContainerIds[key]) {
                temp.props.pluginContainer = state.__pluginContainerIds[key].id;
                temp.props['plugin-data-display-name'] = state.__pluginContainerIds[key].name;
                temp.props['plugin-data-height'] = state.__pluginContainerIds[key].height;
            }
        }
    };

    let plugin = {
        create: function(obj) {
            descendant = obj;

            Object.keys(descendant).map(function(idKey) {
                if (idKey !== 'init' &&
                    idKey !== 'getConfig' &&
                    idKey !== 'getToolbar' &&
                    idKey !== 'getSections' &&
                    idKey !== 'getInitialState' &&
                    idKey !== 'handleToolbar' &&
                    idKey !== 'afterRender' &&
                    idKey !== 'getConfigTemplate' &&
                    idKey !== 'getRenderTemplate' &&
                    idKey !== 'editRichMark' &&
                    idKey !== 'getLocales') {
                    plugin[idKey] = descendant[idKey];
                }
            });
        },
        init: function() {
            if (descendant.init) {
                descendant.init();
            }
        },
        getLocales: function() {
            try {
                let currentLanguage = Ediphy.i18n.language;
                let texts = require('./../../plugins/' + this.getConfig().name + "/locales/" + currentLanguage);
                Ediphy.i18n.addResourceBundle(currentLanguage, 'translation', texts, true, false);
            } catch (e) {
            }
        },
        getConfig: function() {
            let name, displayName, category, callback, needsConfigModal, needsConfirmation, needsTextEdition, extraTextConfig, needsPointerEventsAllowed,
                needsXMLEdition, icon, iconFromUrl, aspectRatioButtonConfig, isRich, marksType, flavor, allowFloatingBox, limitToOneInstance, initialWidth, initialHeight, initialWidthSlide, initialHeightSlide;
            if (descendant.getConfig) {
                let cfg = descendant.getConfig();
                name = cfg.name;
                displayName = cfg.displayName;
                category = cfg.category;
                icon = cfg.icon;
                iconFromUrl = cfg.iconFromUrl;
                isRich = cfg.isRich;
                flavor = cfg.flavor;
                marksType = cfg.marksType;
                needsConfigModal = cfg.needsConfigModal;
                needsConfirmation = cfg.needsConfirmation;
                needsTextEdition = cfg.needsTextEdition;
                extraTextConfig = cfg.extraTextConfig;
                needsXMLEdition = cfg.needsXMLEdition;
                allowFloatingBox = cfg.allowFloatingBox;
                aspectRatioButtonConfig = cfg.aspectRatioButtonConfig;
                needsPointerEventsAllowed = cfg.needsPointerEventsAllowed;
                limitToOneInstance = cfg.limitToOneInstance;
                initialWidth = cfg.initialWidth;
                initialWidthSlide = cfg.initialWidthSlide;
                initialHeightSlide = cfg.initialHeightSlide;
                initialHeight = cfg.initialHeight;
            }

            name = defaultFor(name, 'PluginName', "Plugin name not assigned");
            displayName = defaultFor(displayName, 'Plugin', "Plugin displayName not assigned");
            category = defaultFor(category, 'text', "Plugin category not assigned");
            icon = defaultFor(icon, 'fa-cogs', "Plugin icon not assigned");
            iconFromUrl = defaultFor(iconFromUrl, false);
            isRich = defaultFor(isRich, false);
            marksType = defaultFor(marksType, [{ name: 'value', key: 'value' }]);
            flavor = defaultFor(flavor, 'plain');
            allowFloatingBox = defaultFor(allowFloatingBox, true);
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsConfirmation = defaultFor(needsConfirmation, false);
            needsTextEdition = defaultFor(needsTextEdition, false);
            needsXMLEdition = defaultFor(needsXMLEdition, false);
            needsPointerEventsAllowed = defaultFor(needsPointerEventsAllowed, false);
            limitToOneInstance = defaultFor(limitToOneInstance, false);
            initialWidth = defaultFor(initialWidth, '25');
            initialWidthSlide = defaultFor(initialWidthSlide, initialWidth);
            initialHeight = defaultFor(initialHeight, '25');
            initialHeightSlide = defaultFor(initialHeightSlide, initialHeight);

            if (aspectRatioButtonConfig) {
                aspectRatioButtonConfig.name = Ediphy.i18n.t("Aspect_ratio");
                aspectRatioButtonConfig.location = defaultFor(aspectRatioButtonConfig.location, ["main", "z__extra"], "Aspect ratio button location not defined");
                if (!Array.isArray(aspectRatioButtonConfig.location) || aspectRatioButtonConfig.location.length < 2 || aspectRatioButtonConfig.location.length > 3) {
                    // eslint-disable-next-line no-console
                    console.error("Aspect ratio button location malformed");
                }
                aspectRatioButtonConfig.defaultValue = defaultFor(aspectRatioButtonConfig.defaultValue, "unchecked");
            }

            callback = function(initParams, reason) {
                state = {};
                if (descendant.getInitialState) {
                    state = descendant.getInitialState();
                }
                if (needsTextEdition) {
                    if(initParams.text) {
                        state.__text = initParams.text;
                    }

                    if (!state.__text) {
                        state.__text = "<p>" + Ediphy.i18n.t("text_here") + "</p>";
                    }
                    if (!descendant.getRenderTemplate) {
                        descendant.getRenderTemplate = function(stateObj, props) {
                            return stateObj.__text;
                        };
                    }
                }

                if(initParams.url) {
                    state.url = initParams.url;
                }

                if (needsXMLEdition) {
                    if (!state.__xml) {
                        state.__xml = null;
                        state.__size = null;
                    }
                }
                if(isRich) {
                    if(!state.__marks) {
                        state.__marks = {};
                    }
                }
                initialParams = initParams;
                if (initialParams && Object.keys(initialParams).length !== 0) {
                    let floatingBox = !isSortableContainer(initialParams.container);
                    if (descendant.getConfig().initialWidth) {
                        initialParams.width = floatingBox && descendant.getConfig().initialWidthSlide ? descendant.getConfig().initialWidthSlide : descendant.getConfig().initialWidth;
                    }
                    if (descendant.getConfig().initialHeight) {
                        initialParams.height = floatingBox && descendant.getConfig().initialHeightSlide ? descendant.getConfig().initialHeightSlide : descendant.getConfig().initialHeight;
                    }

                    if (needsConfigModal) {
                        this.openConfigModal(reason, state);
                    } else {
                        this.render(reason);
                    }
                }
            }.bind(this);

            return {
                name: name,
                displayName: displayName,
                category: category,
                callback: callback,
                needsConfigModal: needsConfigModal,
                needsConfirmation: needsConfirmation,
                needsTextEdition: needsTextEdition,
                extraTextConfig: extraTextConfig,
                needsXMLEdition: needsXMLEdition,
                aspectRatioButtonConfig: aspectRatioButtonConfig,
                allowFloatingBox: allowFloatingBox,
                icon: icon,
                iconFromUrl: iconFromUrl,
                isRich: isRich,
                marksType: marksType,
                flavor: flavor,
                needsPointerEventsAllowed: needsPointerEventsAllowed,
                limitToOneInstance: limitToOneInstance,
                initialWidth: initialWidth,
                initialWidthSlide: initialWidthSlide,
                initialHeightSlide: initialHeightSlide,
                initialHeight: initialHeight,
            };
        },
        getRenderTemplate: function(render_state, props) {
            return descendant.getRenderTemplate(render_state, props);
        },
        getToolbar: function() {
            let toolbar;
            // eslint-disable-next-line no-var
            var buttonKey;
            if (descendant.getToolbar) {
                toolbar = descendant.getToolbar();
            }
            toolbar = defaultFor(toolbar, {});

            for (let tabKey in toolbar) {
                toolbar[tabKey].__name = defaultFor(toolbar[tabKey].__name, tabKey);
                let accordions = defaultFor(toolbar[tabKey].accordions, {}, "Property accordions in tab '" + tabKey + "' not found");
                toolbar[tabKey].accordions = accordions;
                for (let accordionKey in accordions) {
                    let button;
                    accordions[accordionKey].__name = defaultFor(accordions[accordionKey].__name, accordionKey, "Property __name in accordion '" + accordionKey + "' not found");
                    let buttons = defaultFor(accordions[accordionKey].buttons, {}, "Property buttons in accordion '" + accordionKey + "' not found");
                    accordions[accordionKey].buttons = buttons;
                    for (buttonKey in buttons) {
                        button = buttons[buttonKey];
                        button.__name = defaultFor(button.__name, buttonKey, "Property __name in button '" + buttonKey + "' not found");
                        button.autoManaged = defaultFor(button.autoManaged, true);
                        if(button.type === "radio" || button.type === "select") {
                            button.options = defaultFor(button.options, []);
                        }
                        if (!button.callback && !button.autoManaged) {
                            button.callback = this.update.bind(this);
                        }
                    }
                    if (accordions[accordionKey].accordions || accordions[accordionKey].order) {
                        let accordions2 = defaultFor(accordions[accordionKey].accordions, {}, "Property accordions in accordion '" + accordionKey + "' not found");
                        accordions[accordionKey].accordions = accordions2;
                        accordions[accordionKey].order = defaultFor(accordions[accordionKey].order, [], "Property order in accordion '" + accordionKey + "' not found");
                        if (accordions[accordionKey].order.length !== (Object.keys(buttons).length + Object.keys(accordions2).length)) {
                            // eslint-disable-next-line no-console
                            console.warn("Accordion '%s' in tab '%s' malformed. Order property length differs from expected", accordionKey, tabKey);
                        }
                        for (let accordionKey2 in accordions2) {
                            accordions2[accordionKey2].__name = defaultFor(accordions2[accordionKey2].__name, accordionKey2, "Property __name in accordion '" + accordionKey2 + "' not found");
                            buttons = defaultFor(accordions2[accordionKey2].buttons, {}, "Property buttons in accordion '" + accordionKey2 + "' not found");
                            accordions2[accordionKey2].buttons = buttons;
                            for (buttonKey in buttons) {
                                button = buttons[buttonKey];
                                button.__name = defaultFor(button.__name, buttonKey, "Property __name in button '" + buttonKey + "' not found");
                                button.autoManaged = defaultFor(button.autoManaged, true);
                                if(button.type === "radio" || button.type === "select") {
                                    button.options = defaultFor(button.options, []);
                                }
                                if (!button.callback && !button.autoManaged) {
                                    button.callback = this.update.bind(this);
                                }
                            }
                        }
                    }
                }
            }
            return toolbar;
        },
        openConfigModal: function(reason, oldState, sender) {
            state = oldState;
            id = sender;

            if (!descendant.getConfigTemplate) {
                if (this.getConfig().needsConfigModal) {
                    // eslint-disable-next-line no-console
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
                }
            } else {
                Ediphy.API.openConfig(this.getConfig().name, reason).then(function(div) {
                    if(this.getConfig().flavor !== 'react') {
                        let template = descendant.getConfigTemplate(oldState, div);
                        if(template) {
                            div.innerHTML = descendant.getConfigTemplate(oldState).replace(/[$]ediphy[$]/g, "Ediphy.Plugins.get('" + this.getConfig().name + "')");
                        }
                    } else {
                        ReactDOM.render(descendant.getConfigTemplate(oldState), div);
                    }
                }.bind(this));
            }
        },
        configModalNeedsUpdate: function() {
            Ediphy.API.configModalNeedsUpdate();
        },
        getRichMarkInput: function(setMark) {
            if(descendant.getRichMarkInput) {
                descendant.getRichMarkInput(state, setMark);
            }
            return undefined;
        },
        parseRichMarkInput: function(...values) {
            if(descendant.parseRichMarkInput) {
                return descendant.parseRichMarkInput(...values);
            }
            return undefined;
        },
        pointerEventsCallback: function(bool, toolbarState) {
            if(descendant.pointerEventsCallback) {
                return descendant.pointerEventsCallback(bool, toolbarState);
            }
            return undefined;
        },
        /* Esta función es para poder comprobar si los valores introducidos por el usuario al crear marcas son correctos*/
        validateValueInput: function(value) {
            if(descendant.validateValueInput) {
                return descendant.validateValueInput(value);
            }
            return undefined;
        },
        postParseRichMarkInput(mark_id, value) {
            Ediphy.API.editRichMark(mark_id, value);
        },
        forceUpdate: function(oldState, sender, reason) {
            state = oldState;
            id = sender ? sender : id;
            this.render(reason);
        },
        render: function(reason) {
            // Posible reasons:
            // ADD_BOX,
            // ADD_RICH_MARK,
            // EDIT_RICH_MARK,
            // DELETE_RICH_MARK,
            // UPDATE_TOOLBAR,
            // UPDATE_BOX,
            // RESIZE_SORTABLE_CONTAINER,
            // EDIT_PLUGIN_TEXT,
            // UPDATE_NAV_ITEM_EXTRA_FILES

            if (!descendant.getRenderTemplate) {
                // eslint-disable-next-line no-console
                console.error(this.getConfig().name + " has not defined getRenderTemplate method");
            } else {

                let template = null;
                if (this.getConfig().flavor !== "react") {
                    template = descendant.getRenderTemplate(state, {});
                    if(template !== null) {
                        template = html2json(template);
                        assignPluginContainerIds(template);
                    }
                } else{
                    template = descendant.getRenderTemplate(state, {});
                    assignPluginContainerIdsReact(template);

                }

                if (template !== null) {
                    Ediphy.API.renderPlugin(
                        template,
                        this.getToolbar(),
                        this.getConfig(),
                        state,
                        {
                            id: id,
                            parent: initialParams.parent,
                            container: initialParams.container,
                        },
                        {
                            position: initialParams.position,
                            row: initialParams.row,
                            col: initialParams.col,
                            width: initialParams.width,
                            height: initialParams.height,
                            isDefaultPlugin: defaultFor(initialParams.isDefaultPlugin, false),
                        },
                        reason
                    );
                }
            }
        },
        editRichMark: function(boxId, mark, value) {
            Ediphy.API.editRichMark(boxId, mark, value);
        },
        afterRender: function(element, oldState) {
            state = oldState;
            if (descendant.afterRender) {
                descendant.afterRender(element, oldState);
            }
        },
        update: function(oldState, name, value, sender, reason) {
            state = oldState;
            id = sender || id;
            if (descendant.handleToolbar) {
                descendant.handleToolbar(name, value);
            }
            this.render(reason);
        },
        setState: function(key, value) {
            state[key] = value;
        },
        getState: function() {
            return state;
        },
        registerExtraFunction: function() {
        },
    };

    return plugin;
}
