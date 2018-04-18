import Ediphy from './main';
import ReactDOM from 'react-dom';
import { isSortableContainer } from '../../common/utils';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import { UPDATE_BOX } from '../../common/actions';
import { getCKEDITORAdaptedContent } from '../../_editor/components/clipboard/clipboard.utils';
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
            if (temp.props.children instanceof Array) {
                for (let i = 0; i < temp.props.children.length; i++) {
                    assignPluginContainerIdsReact(temp.props.children[i]);
                }
            } else {
                assignPluginContainerIdsReact(temp.props.children);
            }
        }

        if (temp instanceof Array) {
            for (let i = 0; i < temp.length; i++) {
                assignPluginContainerIdsReact(temp[i]);
            }
        }
        if (temp.type && temp.type === PluginPlaceholder) {
            if (!state.__pluginContainerIds) {
                state.__pluginContainerIds = {};
            }
            let key = temp.props.pluginContainer;
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
        getInitialParams: function(initParams) {
            state = {};
            let config = this.getConfig();
            if (descendant.getInitialState) {
                state = descendant.getInitialState();
            }
            if (config.needsTextEdition) {
                if(initParams.text) {
                    state.__text = initParams.text;
                }

                if (!state.__text) {
                    state.__text = "<p>" + Ediphy.i18n.t("text_here") + "</p>";
                }
                state.__text = getCKEDITORAdaptedContent(state.__text);
                if (!descendant.getRenderTemplate) {
                    descendant.getRenderTemplate = function(stateObj, { exercises: { correctAnswer: [] } }) {
                        return stateObj.__text;
                    };
                }

            }
            if(initParams.url) {
                state.url = initParams.url;
            }

            /* if(initParams.text) {
              state.__text = initParams.text;
          }*/
            if (config.needsXMLEdition) {
                if (!state.__xml) {
                    state.__xml = null;
                    state.__size = null;
                }
            }
            /* if(isRich) {
              if(!state.__marks) {
                  state.__marks = {};
              }
          }*/
            if(config.category === 'evaluation') {
                if (!state.__score) {
                    state.__score = {
                        score: 1,
                        correctAnswer: config.defaultCorrectAnswer,
                        currentAnswer: config.defaultCurrentAnswer,

                    };
                }
            }

            let toolbar = this.getToolbar(state);
            let template = null;
            let params = { ...initParams };
            params.aspectRatio = !!config.aspectRatioButtonConfig;
            params.name = config.name;
            params.isDefaultPlugin = defaultFor(initParams.isDefaultPlugin, false);
            if (params && Object.keys(params) && Object.keys(params).length > 1) {
                let floatingBox = !isSortableContainer(params.container);
                if (config.initialWidth && !initParams.width) {
                    params.width = floatingBox && config.initialWidthSlide ? config.initialWidthSlide : config.initialWidth;
                }
                if (config.initialHeight && !initParams.height) {
                    params.height = floatingBox && config.initialHeightSlide ? config.initialHeightSlide : config.initialHeight;
                }
                //
                // if (needsConfigModal) {
                //     Do stuff
                // } else {

                if (config.flavor !== "react") {
                    template = descendant.getRenderTemplate(state, { exercises: { correctAnswer: [] } });
                    if(template !== null) { // TODO Revisar
                        template = html2json(template);
                        assignPluginContainerIds(template);
                    }
                } else{
                    template = descendant.getRenderTemplate(state, { exercises: { correctAnswer: [] } });
                    assignPluginContainerIdsReact(template);

                }

            // }
            }

            return {
                template,
                initialParams: params,
                config: this.getConfig(),
                toolbar,
                state,
            };

        },
        getConfig: function() {
            let name, displayName, category, callback, needsConfigModal, needsConfirmation, needsTextEdition, extraTextConfig, needsPointerEventsAllowed,
                needsXMLEdition, icon, iconFromUrl, aspectRatioButtonConfig, isComplex, isRich, marksType, flavor, allowFloatingBox, limitToOneInstance, initialWidth, initialHeight, initialWidthSlide, initialHeightSlide, defaultCorrectAnswer, defaultCurrentAnswer;
            if (descendant.getConfig) {
                let cfg = descendant.getConfig();
                name = cfg.name;
                displayName = cfg.displayName;
                category = cfg.category;
                icon = cfg.icon;
                iconFromUrl = cfg.iconFromUrl;
                isRich = cfg.isRich;
                isComplex = cfg.isComplex;
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
                defaultCorrectAnswer = cfg.defaultCorrectAnswer;
                defaultCurrentAnswer = cfg.defaultCurrentAnswer;
            }

            name = defaultFor(name, 'PluginName', "Plugin name not assigned");
            displayName = defaultFor(displayName, 'Plugin', "Plugin displayName not assigned");
            category = defaultFor(category, 'text', "Plugin category not assigned");
            icon = defaultFor(icon, 'fa-cogs', "Plugin icon not assigned");
            iconFromUrl = defaultFor(iconFromUrl, false);
            isRich = defaultFor(isRich, false);
            isComplex = defaultFor(isComplex, false);
            marksType = defaultFor(marksType, [{ name: 'value', key: 'value' }]);
            flavor = defaultFor(flavor, 'plain');
            allowFloatingBox = defaultFor(allowFloatingBox, true);
            needsConfigModal = defaultFor(needsConfigModal, false);
            needsConfirmation = defaultFor(needsConfirmation, false);
            needsTextEdition = defaultFor(needsTextEdition, false);
            needsXMLEdition = defaultFor(needsXMLEdition, false);
            needsPointerEventsAllowed = defaultFor(needsPointerEventsAllowed, false);
            limitToOneInstance = defaultFor(limitToOneInstance, false);
            initialWidth = defaultFor(initialWidth, '25%');
            initialWidthSlide = defaultFor(initialWidthSlide, initialWidth);
            initialHeight = defaultFor(initialHeight, 'auto');
            initialHeightSlide = defaultFor(initialHeightSlide, initialHeight);
            defaultCorrectAnswer = defaultFor(defaultCorrectAnswer, false);
            defaultCurrentAnswer = defaultFor(defaultCurrentAnswer, defaultCorrectAnswer);

            if (aspectRatioButtonConfig) {
                aspectRatioButtonConfig.name = Ediphy.i18n.t("Aspect_ratio");
                aspectRatioButtonConfig.location = defaultFor(aspectRatioButtonConfig.location, ["main", "z__extra"], "Aspect ratio button location not defined");
                if (!Array.isArray(aspectRatioButtonConfig.location) || aspectRatioButtonConfig.location.length < 2 || aspectRatioButtonConfig.location.length > 3) {
                    // eslint-disable-next-line no-console
                    console.error("Aspect ratio button location malformed");
                }
                aspectRatioButtonConfig.defaultValue = defaultFor(aspectRatioButtonConfig.defaultValue, "unchecked");
            }

            return {
                name, displayName, category, callback, needsConfigModal, needsConfirmation, needsTextEdition,
                extraTextConfig, needsXMLEdition, aspectRatioButtonConfig, allowFloatingBox, icon,
                iconFromUrl, isRich, isComplex, marksType, flavor, needsPointerEventsAllowed, limitToOneInstance,
                initialWidth, initialWidthSlide, initialHeightSlide, initialHeight, defaultCorrectAnswer, defaultCurrentAnswer,
            };
        },
        getRenderTemplate: function(render_state, props) {
            return descendant.getRenderTemplate(render_state, props);
        },
        getToolbar: function(toolbarState) {
            let toolbar;
            // eslint-disable-next-line no-var
            var buttonKey;
            if (descendant.getToolbar) {
                toolbar = descendant.getToolbar(toolbarState);
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
                        /* if (!button.callback && !button.autoManaged) {
                            button.callback = this.update.bind(this);
                        }*/
                    }
                    if (accordions[accordionKey].accordions || accordions[accordionKey].order) {
                        let accordions2 = defaultFor(accordions[accordionKey].accordions, {});
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
                                /* if (!button.callback && !button.autoManaged) {
                                    button.callback = this.update.bind(this);
                                }*/
                            }
                        }
                    }
                }
            }
            return toolbar;
        },
        getConfigTemplate: function(idBox, configState, update) {
            if (!descendant.getConfigTemplate) {
                if (this.getConfig().needsConfigModal) {
                    // eslint-disable-next-line no-console
                    console.error(this.getConfig().name + " has not defined getConfigTemplate method");
                    return null;
                }
                return null;
            }
            return descendant.getConfigTemplate(idBox, configState, update);

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
        getDefaultMarkValue: function() {
            if(descendant.getDefaultMarkValue) {
                return descendant.getDefaultMarkValue();
            }
            if (descendant.getConfig() && descendant.getConfig().marksType) {
                let markType = descendant.getConfig().marksType;
                if (markType && markType.length > 0 && markType[0] && markType[0].default) {
                    return markType[0].default;
                }
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

        afterRender: function(element, oldState) {
            state = oldState;
            if (descendant.afterRender) {
                descendant.afterRender(element, oldState);
            }
        },
        setState: function(key, value) {
            // chose if modify here or after
            state[key] = value;
        },
        /* getState: function() {
            return state;
        },*/
        registerExtraFunction: function() {
        },
    };

    return plugin;
}
