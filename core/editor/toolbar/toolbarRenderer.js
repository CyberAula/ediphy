import React from "react";
import { Panel } from "react-bootstrap";

import MarksList from "../../../_editor/components/richPlugins/marksList/MarksList";
import { SizeButton } from "../../../_editor/components/toolbar/toolbarComponents/sizeButton";
import { Checkbox, Color, ConditionalText, DefaultComponent, External, FancyRadio, Font, MyRadio, MySelect, PluginColor, Range, Text, Theme } from "../../../_editor/components/toolbar/toolbarComponents/toolbarComponents";
import { BackgroundPicker, handleBackground } from "../../../_editor/components/toolbar/toolbarComponents/backgroundPicker";

import { handleCanvasToolbar } from "./handleCanvasToolbar";
import { getCurrentColor, getThemes } from "../../../common/themes/themeLoader";
import { loadBackground } from "../../../common/themes/backgroundLoader";

/**
 * Render toolbar accordion
 * @param accordion Name of the accordion
 * @param tabKey Unique key of the tab
 * @param accordionKeys Unique keys of the accordion
 * @param state Toolbar state
 * @param key Current key
 * @param toolbarProps
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
    return (
        <Panel className={"panelPluginToolbar"}{...props}>{props.header}
            <Panel.Body collapsible>{children}</Panel.Body>
        </Panel>);
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
    let toolbarPluginState = toolbarProps.boxSelected !== -1 ? toolbarProps.pluginToolbars[toolbarProps.boxSelected] : undefined;

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

    let newValue, handler;
    let navItemSelected = toolbarProps.navItemSelected;
    let theme = toolbarProps.viewToolbars[navItemSelected]?.theme ?? 'default';

    let defaultHandler = (e) => {
        let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
        commitChanges(value);
    };

    if (buttonKey === 'width' || buttonKey === 'height' || buttonKey === 'aspectRatio') {
        return SizeButton(toolbarPluginState, buttonKey, toolbarProps, id, props, button, accordionKeys);
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
        return Theme(button, handler, { ...props, currentTheme: props.value, currentItem: toolbarProps.navItemSelected });
    case 'font_picker':
        handler = e => {
            newValue = e.family && button?.kind === 'theme_font' ? e.family : { font: e.family, custom: !e.themeDefaultFont };
            commitChanges(newValue);
        };
        return Font(button, handler, { ...props, theme });
    case 'text':
        return Text(button, defaultHandler, props);
    case 'externalProvider':
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
            newValue = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            commitChanges(button.options[newValue]);
        };
        return MyRadio(button, props, handler);
    case 'fancy_radio':
        return FancyRadio(button, buttonKey, toolbarProps);
    case 'background_picker':
        let default_background = loadBackground(theme, 0);
        handler = e => handleBackground(e, toolbarProps, accordion, buttonKey, commitChanges, button, id);
        return BackgroundPicker(button, props, toolbarProps, id, default_background, handler);
    case 'number':
        handler = e => {
            newValue = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            // If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
            if (!(newValue && newValue.length >= 1 && (newValue.charAt(newValue.length - 1) === '.' || newValue.charAt(newValue.length - 1) === ',' || newValue === 0))) {
                newValue = parseFloat(newValue) || button.min || 0;
                if (button.max && value > button.max) {
                    newValue = button.max;
                }
            }
            commitChanges(value);
        };
        return DefaultComponent(button, props, handler);

    default:
        return DefaultComponent(button, props, defaultHandler);
    }
}
