import i18n from "i18next";
import { isSlide, isSortableBox, isSortableContainer } from "../../common/utils";
import { Panel } from "react-bootstrap";
import React from "react";

import MarksList from "../../_editor/components/rich_plugins/marks_list/MarksList";
import { getThemeColors, getThemes } from "../../common/themes/theme_loader";
import { loadBackground, getBackground } from "../../common/themes/background_loader";
import { getCurrentColor, getThemeFont } from "../../common/themes/theme_loader";
import { sanitizeThemeToolbar } from "../../common/themes/theme_loader";
import {
    BackgroundPicker, ConditionalText, DefaultComponent, FancyRadio, Font, MyRadio, MySelect, Size,
    Theme, Range, External, PluginColor, Color, Text, Checkbox,
} from "../../_editor/components/toolbar/toolbarComponents/toolbarComponents";

/* eslint-disable react/prop-types */
export function toolbarFiller(toolbar, id, state, config, initialParams, container, marks = null, exercises = {}) {

    if (isSortableBox(id)) {
        toolbar.config.displayName = i18n.t('Container_');
    }
    if (!isSortableBox(id)) {
        createSizeButtons(toolbar, state, config, !isSortableBox(container), container);
        createAliasButton(toolbar, null);
    }
    if (config && config.aspectRatioButtonConfig) {
        createAspectRatioButton(toolbar, config);
    }
    if (config && config.isRich) {
        createRichAccordions(toolbar);
    }

    if (config && config.category === 'evaluation') {
        createScoreAccordions(toolbar, state, exercises);
    }
    return toolbar;
}

export function toolbarMapper(controls, toolbar) {
    if (Object.keys(toolbar.style).length > 0) {
        Object.keys(toolbar.style).forEach((s) => {
            if (controls.main.accordions.style.buttons[s]) {
                controls.main.accordions.style.buttons[s].value = toolbar.style[s];
            }
        });
    }
    if (Object.keys(toolbar.structure).length > 0) {
        Object.keys(toolbar.structure).forEach((s) => {
            if (s !== "width" && s !== "height" && s !== "heightUnit" && s !== "widthUnit" && s !== "aspectRatio") {
                if (controls.main.accordions.structure.buttons[s]) {
                    controls.main.accordions.structure.buttons[s].value = toolbar.structure[s];
                }
            }
            if (s === "aspectRatio") {
                if (controls.main.accordions.structure.buttons[s]) {
                    controls.main.accordions.structure.buttons[s].checked = toolbar.structure[s];
                }
            }
        });
    }
    return controls;
}

export function createRichAccordions(controls) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                __marks_list: {
                    key: 'marks_list',
                    __name: i18n.t("marks.marks_list"),
                    icon: 'room',
                    buttons: {},
                },
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
}

export function createScoreAccordions(controls = {}, state, exercises) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {},
        };
    }
    if (!controls.main.accordions.__score) {
        controls.main.accordions.__score = {
            key: '__score',
            __name: i18n.t("configuration"),
            icon: 'build',
            buttons: {},
        };
    }
    let buttons = Object.assign({}, controls.main.accordions.__score.buttons || {}, {
        weight: {
            __name: i18n.t("Score"), // Valoración máxima (puntos)
            __defaultField: true,
            type: "number",
            value: exercises.weight,
            min: 0,
        },

    });
    controls.main.accordions.__score.buttons = buttons;
}

export function createAspectRatioButton(controls, config) {
    let arb = config.aspectRatioButtonConfig;
    let button = {
        __name: arb.name,
        type: "checkbox",
        checked: arb.defaultValue,
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

export function createAliasButton(controls, state) {
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
        if (state === null) {
            controls.main.accordions.z__extra.buttons.alias = {
                __name: 'Alias',
                type: 'text',
                value: "",
                isAttribute: true,
            };
        } else {
            controls.main.accordions.z__extra.buttons.alias = Object.assign({}, state.controls.main.accordions.z__extra.buttons.alias);
        }
    }
}

export function createSizeButtons(controls, state, initialParams, floatingBox, container) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {
                structure: {
                    key: 'structure',
                    __name: i18n.t('Structure'),
                    icon: 'border_all',
                    buttons: {},
                },
            },
        };
    } else if (!controls.main.accordions.structure) {
        controls.main.accordions.structure = {
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
    // if (state === null) {
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

    if (isSortableContainer(container) &&
        isSortableBox(parent) && config.needsTextEdition) {

        displayValue = 25;
        value = 25;
        units = '%';
    }

    let initialWidth = initialParams.initialWidth;
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

    controls.main.accordions.structure.buttons.width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        min: 0,
        max: units === '%' ? 100 : 100000,
        auto: displayValue === "auto",
    };
    // if (state === null) {
    let initialHeight = initialParams.initialHeight;
    if (initialHeight) {
        if (initialHeight === "auto") {
            displayValue = "auto";
            units = "%";
            type = "text";
        } else {
            displayValue = parseInt(initialHeight, 10);
            value = parseInt(initialHeight, 10);
            type = "text";
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

    controls.main.accordions.structure.buttons.height = {
        __name: i18n.t('Height'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        min: 0,
        max: units === '%' ? 100 : 100000,
        auto: displayValue === "auto",
    };

    controls.main.accordions.structure.buttons.rotation = {
        __name: i18n.t('Rotate'),
        type: 'range',
        value: 0,
        min: 0,
        max: 360,
    };

    // This will be commented until it's working correctly
    if (!floatingBox) {
        /* controls.main.accordions.structure.buttons.position = {
            __name: i18n.t('Position'),
            type: 'radio',
            value: 'relative',
            options: ['absolute', 'relative'],

        };*/

    } else {
        let hasPositionButton = state.controls?.main?.accordions?.structure?.buttons?.__position;
        // state.controls
        // && state.controls.main
        // && state.controls.main.accordions
        // && state.controls.main.accordions.structure
        // && state.controls.main.accordions.structure.buttons
        // && state.controls.main.accordions.structure.buttons.__position;

        if (floatingBox && hasPositionButton) {
            controls.main.accordions.structure.buttons.position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: state.controls.main.accordions.structure.buttons.position.value,
                options: ['absolute', 'relative'],
            };
        }
    }
}

/**
 * Render toolbar accordion
 * @param accordion Name of the accordion
 * @param tabKey Unique key of the tab
 * @param accordionKeys Unique keys of the accordion
 * @param state Toolbar state
 * @param key Current key
 */
export function renderAccordion(accordion, tabKey, accordionKeys, state, key, toolbarProps) {
    if (accordionKeys[0] === 'z__extra') {
        return null;
    }

    let props = {
        key: key,
        className: "panelPluginToolbar",
        header: (
            <Panel.Heading key={'span' + key} className={"panel-heading"}>
                <Panel.Title toggle>
                    <p className={"titleA"} style={{
                        color: 'white',
                        paddingTop: '0',
                        paddingBottom: '0',
                        paddingLeft: '0',
                        fontSize: '14.4px',
                    }}>
                        <i className="toolbarIcons material-icons">
                            {accordion.icon ? accordion.icon : <span className="toolbarIcons"/>}
                        </i>{accordion.__name}
                    </p>
                </Panel.Title>
            </Panel.Heading>
        ),
    };
    let children = [];
    if (accordion.order) {
        for (let i = 0; i < accordion.order.length; i++) {
            if (accordion.accordions[accordion.order[i]]) {
                children.push(renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
            } else if (accordion.buttons[accordion.order[i]]) {
                children.push(renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i, toolbarProps));
            } else {
                // eslint-disable-next-line no-console
                console.error("Element %s not defined", accordion.order[i]);
            }
        }
    } else {
        let buttonKeys = Object.keys(accordion.buttons);
        for (let i = 0; i < buttonKeys.length; i++) {
            let buttonWidth = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '60%' : '100%';
            let buttonMargin = (buttonKeys[i] === '__width' || buttonKeys[i] === '__height') ? '5%' : '0px';
            children.push(
                <div key={'div_' + i}
                    style={{
                        width: buttonWidth,
                        marginRight: buttonMargin,
                    }}>
                    {renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i, toolbarProps)}
                </div>,
            );
        }
    }

    if (accordion.key === 'marks_list') {
        children.push(
            <MarksList key="marks_list"
                state={toolbarProps.marks}
                viewToolbars={toolbarProps.viewToolbars}
                box_id={toolbarProps.box.id}
                onRichMarksModalToggled={toolbarProps.handleMarks.onRichMarksModalToggled}
                onRichMarkEditPressed={toolbarProps.handleMarks.onRichMarkEditPressed}
                onRichMarkDeleted={toolbarProps.handleMarks.onRichMarkDeleted}
            />,
        );
    }
    return <Panel className={"panelPluginToolbar"}{...props}>{props.header}<Panel.Body
        collapsible>{children}</Panel.Body></Panel>;
    // React.createElement(Panel, props, children);
}

/**
 * Render toolbar button
 * @param accordion Name of the accordion
 * @param tabKey Unique key of the tab
 * @param accordionKeys Unique keys of the accordion
 * @param buttonKey Unique key of the button
 * @param state Toolbar state
 * @param key Current key
 * @param toolbarProps
 * @returns {code} Button code
 */
export function renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key, toolbarProps) {
    let button = accordion.buttons[buttonKey];
    let id = (toolbarProps.boxSelected !== -1) ? toolbarProps.boxSelected : (toolbarProps.containedViewSelected || toolbarProps.navItemSelected);
    let currentElement = (["structure", "style", "z__extra", "__marks_list", "__score"].indexOf(accordionKeys[0]) === -1) ? "state" : accordionKeys[0];
    let toolbar_plugin_state = toolbarProps.boxSelected !== -1 ? toolbarProps.pluginToolbars[toolbarProps.boxSelected] : undefined;

    let commitChanges = (val) => {
        if (toolbarProps.boxSelected === -1) {
            handleCanvasToolbar(buttonKey, val, accordion, toolbarProps, buttonKey);
        } else if (currentElement === '__score') {
            toolbarProps.onScoreConfig(id, buttonKey, val);
            if (!button.__defaultField) {
                toolbarProps.handleToolbars.onToolbarUpdated(id, tabKey, 'state', buttonKey, val);
            }
        } else {
            toolbarProps.handleToolbars.onToolbarUpdated(id, tabKey, currentElement, buttonKey, val);
        }
    };

    let props = {
        key: ('child_' + key),
        id: ('page' + '_' + buttonKey),
        type: button.type,
        value: button.value,
        checked: button.checked,
        componentClass: 'input',
        label: button.__name,
        min: button.min,
        max: button.max,
        step: button.step,
        disabled: false,
        placeholder: button.placeholder,
        title: button.title ?? '',
        className: button.class,
        style: { width: '100%' },
        onBlur: e => {
            let value = e.target.value;
            if (button.type === 'number' && value === "") {
                value = button.min ?? 0;
            }
            handleCanvasToolbar(buttonKey, value, accordion, toolbarProps, buttonKey);
        },
        onChange: e => {
            let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            // TODO What is __position button???
            commitChanges(value);
            console.err('handler has not been implemented yet for ' + buttonKey);
        },
    };

    let newValue;
    let navItemSelected = toolbarProps.navItemSelected;
    let theme = toolbarProps.viewToolbars[navItemSelected]?.theme ?? 'default';

    // Generic handlers
    let handler;
    let autoSizeHandler = () => toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: toolbar_plugin_state.structure[buttonKey] === "auto" ? 100 : "auto" });
    let unitsHandler = e => {
        let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
        toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey + "Unit"]: value });
    };
    let defaultHandler = (e) => {
        let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
        commitChanges(value);
    };

    if (buttonKey === 'width' || buttonKey === 'height' || buttonKey === 'aspectRatio') {
        let auto = toolbar_plugin_state.structure[buttonKey] === "auto";
        switch (button.type) {
        case 'checkbox':
            handler = () => {
                if (buttonKey === "aspectRatio") {
                    toolbarProps.handleBoxes.onBoxResized(id, { aspectRatio: !toolbar_plugin_state.structure.aspectRatio });
                } else {
                    toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: toolbar_plugin_state.structure[buttonKey] === "auto" ? 100 : "auto" });
                }
            };
            props = {
                key: props.key,
                id: props.id,
                type: props.type,
                value: props.value,
                checked: props.checked,
                label: props.label,
                disabled: props.disabled,
                title: props.title,
            };
            return Checkbox(button, handler, props);
        case 'number':
        case 'text':
            handler = e => {
                newValue = (typeof e.target !== 'undefined') ? e.target.value : e.value;
                toolbarProps.handleBoxes.onBoxResized(id, { [buttonKey]: newValue });
            };
            props.value = auto ? 'auto' : toolbar_plugin_state.structure[buttonKey];
            props.type = auto ? 'text' : 'number';
            props.max = toolbar_plugin_state.structure[buttonKey + "Unit"] === '%' ? 100 : 100000;
            props.disabled = auto;
            return Size(button, handler, props, accordionKeys, buttonKey, toolbar_plugin_state, toolbarProps, auto, autoSizeHandler, unitsHandler);
        }

    }

    switch (button.type) {
    case 'checkbox':
        handler = () => commitChanges(!button.checked);
        props = {
            key: props.key,
            id: props.id,
            type: props.type,
            value: props.value,
            checked: props.checked,
            label: props.label,
            disabled: props.disabled,
            title: props.title,
        };
        return Checkbox(button, handler, props);
    case 'color':
        handler = e => commitChanges(e.color);
        return Color(button, handler, props);
    case 'custom_color_plugin':
        handler = e => {
            theme = toolbarProps.viewToolbars[toolbarProps.navItemSelected].theme ?? 'default';
            const restore = e.currentTarget?.type === 'button';
            newValue = restore ? { color: getCurrentColor(theme), custom: false } :
                e.color ? { color: e.color, custom: true } : newValue;
            commitChanges(newValue);
        };
        return PluginColor(button, handler, props, toolbarProps, id);
    case 'theme_select':
        handler = e => commitChanges(getThemes()[e || 0]);
        return Theme(button, handler, {
            ...props,
            currentTheme: props.value,
            currentItem: toolbarProps.navItemSelected,
        });
    case 'font_picker':
        handler = e => {
            if (e.family) {
                newValue = button?.kind === 'theme_font' ? e.family : {
                    font: e.family,
                    custom: !e.themeDefaultFont,
                };
            }
            commitChanges(newValue);
        };
        return Font(button, handler, { ...props, theme });
    case 'text':
        return Text(button, defaultHandler, props);
    case 'external_provider':
        return External(button, props, toolbarProps, defaultHandler);
    case 'range':
        return Range(button, props, defaultHandler);
    case 'conditionalText':
        props.style.marginTop = '5px';
        props.style.marginBottom = '15px';
        props.value = accordion.buttons[buttonKey].value;
        props.accordionChecked = accordion.buttons[button.associatedKey].checked;

        return ConditionalText(button, props, defaultHandler);
        // As in Box style -> Border Style
    case 'select':
        return MySelect(button, props, defaultHandler);
    case 'radio':
        handler = e => {
            let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            commitChanges(button.options[value]);
        };
        return MyRadio(button, props, handler);
    case 'fancy_radio':
        return FancyRadio(button, buttonKey, toolbarProps);
    case 'background_picker':
        let isURI = (/data\:/).test(props.value.background);
        let isColor = (/(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/ig).test(props.value.background) || (/#/).test(props.value.background) || !(/url/).test(props.value.background);
        let default_background = loadBackground(theme, 0);

        let isSli = isSlide(toolbarProps.navItems[id].type);
        let background_attr = toolbarProps.viewToolbars[id].backgroundAttr;
        let background_attr_zoom = toolbarProps.viewToolbars[id].backgroundZoom === undefined ? 100 : toolbarProps.viewToolbars[id].backgroundZoom;

        handler = e => {
            let value;
            if (e.color) {
                value = { background: e.color, backgroundAttr: 'full', backgroundZoom: 100, customBackground: true };
            }
            if (e.target?.type === "radio") {
                value = { background: button.value.background, backgroundAttr: e.target.value, backgroundZoom: 100 };
            }
            if (e.target?.type === "text") {
                value = { background: e.target.value, backgroundAttr: 'full' };
            }
            if (e.value) {
                value = {
                    background: 'url(' + e.value + ')',
                    backgroundAttr: button.value?.backgroundAttr ? button.value.backgroundAttr : 'full',
                    backgroundZoom: 100,
                    customBackground: true,
                };
            }
            // Restore background button
            if (e.currentTarget && e.currentTarget.type === "button") {
                value = {
                    background: e.currentTarget.value,
                    backgroundAttr: 'full',
                    backgroundZoom: 100,
                    customBackground: false,
                    themeBackground: 0,
                };
            }
            if (e.target?.name === "image_display_zoom") {
                value = {
                    background: button.value.background,
                    backgroundAttr: (toolbarProps.viewToolbars[id].backgroundAttr) ? toolbarProps.viewToolbars[id].backgroundAttr : 'repeat',
                    backgroundZoom: e.target.value,
                };
            }
            if (e.target?.files) {
                if (e.target.files.length === 1) {
                    let file = e.target.files[0];
                    let reader = new FileReader();
                    reader.onload = () => {
                        let img = new Image();
                        let data = reader.result;
                        img.onload = () => {
                            let canvas = document.createElement('canvas');
                            let ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, 1200, 1200);
                            handleCanvasToolbar(buttonKey, {
                                background: 'url(' + data + ')',
                                backgroundAttr: 'full',
                                backgroundZoom: 100,
                                customBackground: true,
                            }, accordion, toolbarProps);
                        };
                        img.src = data;
                    };
                    reader.readAsDataURL(file);
                    return;
                }
                return;
            }
            commitChanges(value);
        };
        return BackgroundPicker(button, props, toolbarProps, isURI, isColor, default_background, isSli, background_attr, background_attr_zoom, handler);
    case 'number':
        handler = e => {
            let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            // If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
            if (!(value && value.length >= 1 && (value.charAt(value.length - 1) === '.' || value.charAt(value.length - 1) === ',' || value === 0))) {
                value = parseFloat(value) || button.min || 0;
                if (button.max && value > button.max) {
                    value = button.max;
                }
            }
            commitChanges(value);
        };
        return DefaultComponent(button, props, handler);

    default:
        return DefaultComponent(button, props, defaultHandler);
    }
}

/**
 * Header configuration. Does NOT apply to plugins' toolbar.
 * @param name type of title
 * @param value value of the field
 * @param accordions
 * @param toolbarProps
 */
export function handleCanvasToolbar(name, value, accordions, toolbarProps) {
    let themeToolbar = sanitizeThemeToolbar(toolbarProps.viewToolbars[toolbarProps.navItemSelected]);
    switch (name) {
    // change page/slide title
    case "background":
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, value);
        break;
    case 'documentSubtitleContent':
    case 'documentTitleContent':
    case 'numPageContent':
    case 'viewName':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            [name]: value,
        });
        break;
        // preview / export document
    case 'page_display':
        toolbarProps.handleNavItems.onNavItemToggled(toolbarProps.navItemSelected);
        break;
    // Do or do not display the following
    case 'breadcrumb':
    case 'courseTitle':
    case 'documentSubtitle':
    case 'documentTitle':
    case 'numPage':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            [name]: value ? 'reduced' : 'hidden',
        });
        break;
    case 'theme':
        let currentView = toolbarProps.viewToolbars[toolbarProps.navItemSelected];
        let wasCustomFont = currentView.hasOwnProperty('theme') && currentView.hasOwnProperty('font') && (currentView.font !== getThemeFont(currentView.theme));
        let wasCustomColor = currentView.hasOwnProperty('theme') && currentView.hasOwnProperty('colors') && currentView.colors.themeColor1 !== getThemeColors(currentView.theme).themeColor1;
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            theme: value,
            themeBackground: 0,
            background: getBackground(value, 0),
            font: wasCustomFont ? currentView.font : getThemeFont(value),
            colors: wasCustomColor ? currentView.colors : getThemeColors(value),
        });
        break;
    case 'theme_background':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            themeBackground: value,
            background: value,
        });
        break;
    case 'theme_font':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, { font: value });
        break;
    case 'theme_primary_color':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            colors: { ...themeToolbar.colors, themeColor1: value },
        });
        break;
    case 'theme_secondary_color':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            colors: { ...themeToolbar.colors, themeColor2: value },
        });
        break;
    case 'weight':
        toolbarProps.onScoreConfig(toolbarProps.navItemSelected, 'weight', value);
        break;
    default:
        break;
    }
}

/* eslint-enable react/prop-types */
