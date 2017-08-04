import { ADD_BOX, ADD_RICH_MARK, CHANGE_NAV_ITEM_NAME, DELETE_BOX, DELETE_RICH_MARK, DELETE_CONTAINED_VIEW, ADD_NAV_ITEM, DELETE_NAV_ITEM, DELETE_SORTABLE_CONTAINER, DUPLICATE_BOX,
    EDIT_RICH_MARK, RESIZE_BOX, RESIZE_SORTABLE_CONTAINER, TOGGLE_TEXT_EDITOR, UPDATE_BOX, UPDATE_TOOLBAR, CHANGE_CONTAINED_VIEW_NAME,
    VERTICALLY_ALIGN_BOX, IMPORT_STATE } from './../actions';
import Utils, { changeProp, changeProps, deleteProps, isSortableBox, isSortableContainer, isPage, isSlide, isDocument, nextToolbarAvailName } from './../utils';
import i18n from 'i18next';

function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        checked: arb.defaultValue,
        autoManaged: true,
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.__aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

function createRichAccordions(controls) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __marks_list: {
                    key: 'marks_list',
                    __name: i18n.t("marks.marks_list"),
                    icon: 'room',
                    buttons: {},
                }, /* ,
                __content_list: {
                    key: 'content_list',
                    __name: 'Content List',
                    icon: 'border_all',
                    buttons: {}
                }*/
            },
        };
    }
    if (!controls.main.accordions.__marks_list) {
        controls.main.accordions.__marks_list = {
            key: 'marks_list',
            __name: i18n.t("marks.marks_list"),
            icon: 'room',
            buttons: {},
        };
    }
    /* if (!controls.main.accordions.__content_list) {
        controls.main.accordions.__content_list = {
            key: 'content_list',
            __name: 'Content List',
            icon: 'border_all',
            buttons: {}
        };
    }*/
}

function createAliasButton(controls, state) {
    if (!controls.main) {
        controls.main = {
            __name: "Alias",
            icon: 'rate_review',
            accordions: {
                z__extra: {
                    __name: "Alias",
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.z__extra) {
        controls.main.accordions.z__extra = {
            __name: "Alias",
            icon: 'rate_review',
            buttons: {},
        };
    }
    if (!controls.main.accordions.z__extra.buttons.alias) {
        if(state === null) {
            controls.main.accordions.z__extra.buttons.alias = {
                __name: 'Alias',
                type: 'text',
                value: "",
                autoManaged: true,
                isAttribute: true,
            };
        }else{
            controls.main.accordions.z__extra.buttons.alias = Object.assign({}, state.controls.main.accordions.z__extra.buttons.alias);
        }
    }
}

function createSizeButtons(controls, state, action, floatingBox) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __sortable: {
                    key: 'structure',
                    __name: i18n.t('Structure'),
                    icon: 'border_all',
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.__sortable) {
        controls.main.accordions.__sortable = {
            key: 'structure',
            __name: i18n.t('Structure'),
            icon: 'border_all',
            buttons: {},
        };
    }
    let displayValue;
    let value;
    let units;
    let type;

    // It means we are creating a new one, initial params can come
    if (state === null) {
        if (floatingBox) {
            displayValue = 25;
            value = 25;
            units = "%";
        } else {
            displayValue = 25;
            value = 25;
            units = "%";
        }
        type = "number";

        if (isSortableContainer(action.payload.ids.container) &&
            isSortableBox(action.payload.ids.parent) && !action.payload.config.needsTextEdition) {

            displayValue = 25;
            value = 25;
            units = '%';
        }

        let initialWidth = action.payload.initialParams.width;
        if (initialWidth) {
            if (initialWidth === "auto") {
                displayValue = "auto";
                units = "%";
                type = "text";
            } else {
                displayValue = parseInt(initialWidth, 10);
                value = parseInt(initialWidth, 10);
                if (initialWidth.indexOf("px") !== -1) {
                    units = "px";
                } else {
                    units = "%";
                }
            }
        }

    } else {
        let width = state.controls.main.accordions.__sortable.buttons.__width;
        displayValue = width.displayValue;
        value = width.value;
        units = width.units;
        type = width.type;
    }
    controls.main.accordions.__sortable.buttons.__width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
    };
    if (state === null) {
        let initialHeight = action.payload.initialParams.height;
        if (initialHeight) {
            if (initialHeight === "auto") {
                displayValue = "auto";
                units = "%";
                type = "text";
            } else {
                displayValue = parseInt(initialHeight, 10);
                value = parseInt(initialHeight, 10);
                if (initialHeight.indexOf("px") !== -1) {
                    units = "px";
                } else {
                    units = "%";
                }
            }
        } else {
            value = "20";
            displayValue = "auto";
            units = "%";
            type = "text";
        }

    } else {
        let height = state.controls.main.accordions.__sortable.buttons.__height;
        type = height.type;
        displayValue = height.displayValue;
        value = height.value;
        units = height.units;
        /* controls.main.accordions.__sortable.buttons.__height = {
         __name: i18n.t('Height'),
         type: height.type,
         displayValue: height.displayValue,
         value: height.value,
         step: 5,
         units: height.units,
         auto: height.displayValue === "auto",
         autoManaged: true
         };*/
    }
    controls.main.accordions.__sortable.buttons.__height = {
        __name: i18n.t('Height'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
    };

    if (state === null) {
        controls.main.accordions.__sortable.buttons.__rotate = {
            __name: i18n.t('Rotate'),
            type: 'range',
            value: 0,
            min: 0,
            max: 360,
            autoManaged: false,
        };

    } else {
        // let hasPositionButton = action.payload.toolbar && action.payload.toolbar.main && action.payload.toolbar.main.accordions && action.payload.toolbar.main.accordions.__sortable && action.payload.toolbar.main.accordions.__sortable.buttons && action.payload.toolbar.main.accordions.__sortable.buttons.__position;
        let hasButton = state.controls && state.controls.main && state.controls.main.accordions && state.controls.main.accordions.__sortable && state.controls.main.accordions.__sortable.buttons && state.controls.main.accordions.__sortable.buttons.__rotate;

        if (hasButton) {
            controls.main.accordions.__sortable.buttons.__rotate = {
                __name: i18n.t('Rotate'),
                type: 'range',
                value: state.controls.main.accordions.__sortable.buttons.__rotate.value,
                min: 0,
                max: 360,
                autoManaged: true,
            };
        }

    }

    // This will be commented until it's working correctly
    if (state === null) {
        if (!floatingBox) {
            controls.main.accordions.__sortable.buttons.__position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: 'relative',
                options: ['absolute', 'relative'],
                autoManaged: true,
            };
        }

    } else {
        // let hasPositionButton = action.payload.toolbar && action.payload.toolbar.main && action.payload.toolbar.main.accordions && action.payload.toolbar.main.accordions.__sortable && action.payload.toolbar.main.accordions.__sortable.buttons && action.payload.toolbar.main.accordions.__sortable.buttons.__position;
        let hasPositionButton = state.controls && state.controls.main && state.controls.main.accordions && state.controls.main.accordions.__sortable && state.controls.main.accordions.__sortable.buttons && state.controls.main.accordions.__sortable.buttons.__position;

        if (!floatingBox && hasPositionButton) {
            controls.main.accordions.__sortable.buttons.__position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: state.controls.main.accordions.__sortable.buttons.__position.value,
                options: ['absolute', 'relative'],
                autoManaged: true,
            };
        }

    }

    /*
       controls.main.accordions.__sortable.buttons.__verticalAlign = {
       __name: i18n.t('Vertical_align'),
       type: 'fancy_radio',
       value: 'middle',
       options: ['top', 'middle', 'bottom'],
       tooltips: [i18n.t('messages.align_top'), i18n.t('messages.align_middle'), i18n.t('messages.align_bottom')],
       icons: ['vertical_align_top', 'vertical_align_center', 'vertical_align_bottom'],
       autoManaged: true
       };
       */

}

function toolbarCreator(state, action) {
    let toolbar = {
        id: action.payload.ids.id,
        controls: action.payload.toolbar || {
            main: {
                __name: "Main",
                accordions: {},
            },
        },
        config: action.payload.config || {},
        state: action.payload.state || {},
        showTextEditor: false,
    };
    if (isSortableBox(action.payload.ids.id)) {
        toolbar.config.displayName = i18n.t('Container_');
    }
    if(!isSortableBox(action.payload.ids.id)) {
        createSizeButtons(toolbar.controls, null, action, !isSortableContainer(action.payload.ids.container));
        createAliasButton(toolbar.controls, null);
    }
    if (toolbar.config && toolbar.config.aspectRatioButtonConfig) {
        createAspectRatioButton(toolbar.controls, toolbar.config);
    }
    if (toolbar.config && toolbar.config.isRich) {
        createRichAccordions(toolbar.controls);
    }

    return toolbar;
}

function toolbarSectionCreator(state, action, isContainedView = false) {
    let doc_type;
    let id = isContainedView ? action.payload.mark.connection.id : action.payload.id;
    let type = isContainedView ? action.payload.mark.connection.type : action.payload.type;
    if (isPage(id)) {
        doc_type = i18n.t('page');
    }
    if(isSlide(type)) {
        doc_type = i18n.t('slide');
    }

    if(isDocument(type)) {
        doc_type = i18n.t('document');
    }
    let pagetitle = i18n.t('Title') + doc_type;
    let toolbar = {
        id: id,
        controls: action.payload.toolbar || {
            main: {
                __name: "Main",
                accordions: { // define accordions for section
                    basic: {
                        __name: "Generales",
                        icon: 'settings',
                        buttons: {
                            page_display: {
                                __name: i18n.t('display_page'),
                                type: 'checkbox',
                                checked: true,
                                autoManaged: false,
                            }, // Por qué hay dos títulos y por qué están en secciones distintas?
                            navitem_name: {
                                __name: i18n.t('NavItem_name'),
                                type: 'text',
                                value: isContainedView ? nextToolbarAvailName(i18n.t('contained_view'), state) : doc_type,
                                autoManaged: false,
                            },
                        },
                    },
                    header: {
                        __name: i18n.t('Header'),
                        icon: 'format_color_text',
                        buttons: {
                            display_title: {
                                __name: i18n.t('course_title'),
                                type: 'checkbox',
                                checked: false,
                                autoManaged: false,
                            },
                            display_pagetitle: {
                                __name: pagetitle,
                                type: 'checkbox',
                                checked: true,
                                autoManaged: false,
                            },
                            pagetitle_name: {
                                __name: "custom_title",
                                type: 'conditionalText',
                                associatedKey: 'display_pagetitle',
                                value: "",
                                autoManaged: false,
                                display: true,
                            },
                            display_pagesubtitle: {
                                __name: i18n.t('subtitle'),
                                type: 'checkbox',
                                checked: false,
                                autoManaged: false,
                            },
                            pagesubtitle_name: {
                                __name: "custom_subtitle",
                                type: 'conditionalText',
                                associatedKey: 'display_pagesubtitle',
                                value: "",
                                autoManaged: false,
                                display: true,
                            },

                        },

                    },
                },
            },
        },
        config: action.payload.config || {},
        state: action.payload.state || {},

    };

    if (!isContainedView && toolbar.controls && toolbar.controls.main && toolbar.controls.main.header && toolbar.controls.main.header.buttons) {
        toolbar.controls.main.header.buttons.display_breadcrumb = {
            __name: i18n.t('Breadcrumb'),
            type: 'checkbox',
            checked: true,
            autoManaged: false,
        };
        toolbar.controls.main.header.buttons.display_pagenumber = {
            __name: i18n.t('pagenumber'),
            type: 'checkbox',
            checked: false,
            autoManaged: false,
        };
        toolbar.controls.main.header.buttons.pagenumber_name = {
            __name: "custom_pagenum",
            type: 'conditionalText',
            associatedKey: 'display_pagenumber',
            value: "",
            autoManaged: false,
            display: true,
        };
    }
    toolbar.config.displayName = isContainedView ? doc_type + ': ' + i18n.t("contained_view") : doc_type;

    createAliasButton(toolbar.controls, null);

    return toolbar;
}

function toolbarReducer(state, action) {
    let newState;
    switch (action.type) {
    case ADD_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case CHANGE_NAV_ITEM_NAME:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.basic.buttons.navitem_name.value = action.payload.title;
        return newState;
    case CHANGE_CONTAINED_VIEW_NAME:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.basic.buttons.navitem_name.value = action.payload.title;
        return newState;
    case EDIT_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case RESIZE_BOX:
        newState = Utils.deepClone(state);
        if (newState.controls.main.accordions.__sortable) {
            let buttons = newState.controls.main.accordions.__sortable.buttons;
            if (buttons.__height && buttons.__width) {
                if (action.payload.heightButton) {
                    newState.controls.main.accordions.__sortable.buttons.__height = action.payload.heightButton;
                }
                if (action.payload.widthButton) {
                    newState.controls.main.accordions.__sortable.buttons.__width = action.payload.widthButton;
                }
            }
        }

        // Rebind callback functions because from not automanaged buttons
        for (let tabKey in newState.controls) {
            for (let accordionKey in newState.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                    button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.autoManaged) {
                        button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                    }
                }
                if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.autoManaged) {
                                button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                            }
                        }
                    }
                }
            }
        }

        return newState;
    case RESIZE_SORTABLE_CONTAINER:
        newState = Utils.deepClone(state);
        let sortableContainers = newState.state.__pluginContainerIds;
        for (let key in sortableContainers) {
            if (sortableContainers[key].id === action.payload.id) {
                sortableContainers[key].height = action.payload.height;
                break;
            }
        }

        // Rebind callback functions because from not automanaged buttons
        for (let tabKey in newState.controls) {
            for (let accordionKey in newState.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                    button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.autoManaged) {
                        button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                    }
                }
                if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.autoManaged) {
                                button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                            }
                        }
                    }
                }
            }
        }

        return newState;

    case TOGGLE_TEXT_EDITOR:
        return changeProp(state, "showTextEditor", action.payload.value);
    case UPDATE_BOX:
        /* let controls = action.payload.toolbar;
            if (!isSortableBox(action.payload.id)) {
                createSizeButtons(controls, state, action);
                createAliasButton(controls, state);
            }

            if (state.config && state.config.isRich) {
                createRichAccordions(controls);
            }
            if (state.config && state.config.aspectRatioButtonConfig) {
                createAspectRatioButton(controls, state.config);
            }*/
        return changeProps(
            state,
            [
                "state",
            ], [
                action.payload.state,
            ]
        );
    case UPDATE_TOOLBAR:
        newState = Utils.deepClone(state);
        let pl = action.payload;

        if (pl.value.__name) {
            if (pl.accordions.length > 1) {
                newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]].buttons[pl.name] = pl.value;
            } else {
                newState.controls[pl.tab].accordions[pl.accordions[0]].buttons[pl.name] = pl.value;
            }
        } else if (pl.accordions.length > 1) {
            newState.controls[pl.tab].accordions[pl.accordions[0]].accordions[pl.accordions[1]]
                .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
        } else {
            newState.controls[pl.tab].accordions[pl.accordions[0]]
                .buttons[pl.name][typeof pl.value === "boolean" ? "checked" : "value"] = pl.value;
        }

        // Rebind callback functions because from not automanaged buttons
        for (let tabKey in newState.controls) {
            for (let accordionKey in newState.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                    button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.autoManaged) {
                        button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                    }
                }
                if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.autoManaged) {
                                button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                            }
                        }
                    }
                }
            }
        }

        return newState;
    case DELETE_RICH_MARK:
        return changeProp(state, "state", action.payload.state);
    case VERTICALLY_ALIGN_BOX:
        newState = Utils.deepClone(state);
        newState.controls.main.accordions.__sortable.buttons.__verticalAlign.value = action.payload.verticalAlign;

        // Rebind callback functions because from not automanaged buttons
        for (let tabKey in newState.controls) {
            for (let accordionKey in newState.controls[tabKey].accordions) {
                let button;
                for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].buttons) {
                    button = newState.controls[tabKey].accordions[accordionKey].buttons[buttonKey];
                    if (!button.autoManaged) {
                        button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                    }
                }
                if (newState.controls[tabKey].accordions[accordionKey].accordions) {
                    for (let accordionKey2 in newState.controls[tabKey].accordions[accordionKey].accordions) {
                        for (let buttonKey in newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons) {
                            button = newState.controls[tabKey].accordions[accordionKey].accordions[accordionKey2].buttons[buttonKey];
                            if (!button.autoManaged) {
                                button.callback = state.controls[tabKey].accordions[accordionKey].buttons[buttonKey].callback;
                            }
                        }
                    }
                }
            }
        }

        return newState;
    default:
        return state;
    }
}

export default function(state = {}, action = {}) {
    let newState;
    switch (action.type) {
    case ADD_BOX:
        return changeProp(state, action.payload.ids.id, toolbarCreator(state, action));
    case ADD_NAV_ITEM:
        return changeProp(state, action.payload.id, toolbarSectionCreator(state, action));
    case ADD_RICH_MARK:
        newState = state;
        if(action.payload.mark.connectMode === "new") {
            let modState = changeProp(state, action.payload.mark.connection.id || action.payload.mark.connection, toolbarSectionCreator(state, action, true));
            newState = changeProp(modState, action.payload.parent, toolbarReducer(modState[action.payload.parent], action));
        }
        return newState;
    case CHANGE_NAV_ITEM_NAME:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
        // return state;
    case CHANGE_CONTAINED_VIEW_NAME:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case DELETE_BOX:
        let children = action.payload.children ? action.payload.children : [];
        return deleteProps(state, children.concat(action.payload.id));
    case DELETE_CONTAINED_VIEW:
        let boxesCV = action.payload.boxes ? action.payload.boxes : [];
        let newToolbarCV = Object.assign({}, state);
        let parents = action.payload.parent ? action.payload.parent : [];
        // Delete all related marks
        parents.forEach((el)=>{
            if (newToolbarCV[el] && newToolbarCV[el].state && newToolbarCV[el].state.__marks) {
                for (let mark in newToolbarCV[el].state.__marks) {
                    if (newToolbarCV[el].state.__marks[mark].connection === action.payload.ids[0]) {
                        delete newToolbarCV[el].state.__marks[mark];
                    }
                }
            }
        });
        return deleteProps(newToolbarCV, boxesCV.concat(action.payload.ids[0]));
    case DELETE_NAV_ITEM:
        let boxes = action.payload.boxes ? action.payload.boxes : [];
        let linkedBoxes = action.payload.linkedBoxes ? action.payload.linkedBoxes : [];
        let newToolbar = Object.assign({}, state);
        linkedBoxes.forEach((el)=>{s;
            if (newToolbar[el] && newToolbar[el].state && newToolbar[el].state.__marks) {
                for (let mark in newToolbar[el].state.__marks) {
                    action.payload.ids.forEach((id)=>{
                        if (newToolbar[el].state.__marks[mark] && newToolbar[el].state.__marks[mark].connection === id) {
                            delete newToolbar[el].state.__marks[mark];
                        }
                    });

                }
            }
        });
        return deleteProps(newToolbar, boxes.concat(action.payload.ids));
    case DELETE_SORTABLE_CONTAINER:
        return deleteProps(state, action.payload.children);
    case DUPLICATE_BOX:
        newState = Object.assign({}, state);
        let replaced = Object.assign({}, state);
        let newIds = action.payload.newIds;
        // let count = 0;
        Object.keys(newIds).map((box)=> {
            replaced = Object.assign({}, Object.replaceAll(replaced, box, newIds[box]));
        });
        replaced = Object.assign({}, Object.replaceAll(replaced, action.payload.id.substr(3), action.payload.newId));
        return Object.assign({}, newState, replaced);
    case EDIT_RICH_MARK:
        return state;
        // return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
    case DELETE_RICH_MARK:
        // if (state[action.payload.parent] && state[action.payload.parent].state.__marks && state[action.payload.parent].state.__marks[action.payload.id]) {
        // return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
        // }
        return state;
    case RESIZE_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case RESIZE_SORTABLE_CONTAINER:
        return changeProp(state, action.payload.parent, toolbarReducer(state[action.payload.parent], action));
    case TOGGLE_TEXT_EDITOR:
        return changeProp(state, action.payload.caller, toolbarReducer(state[action.payload.caller], action));
    case UPDATE_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case UPDATE_TOOLBAR:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case VERTICALLY_ALIGN_BOX:
        return changeProp(state, action.payload.id, toolbarReducer(state[action.payload.id], action));
    case IMPORT_STATE:
        return action.payload.present.toolbarsById || state;
    default:
        return state;
    }
}
