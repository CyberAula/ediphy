import React from "react";
import { Panel } from "react-bootstrap";

import MarksList from "../../../_editor/components/richPlugins/marksList/MarksList";
import { SizeButton } from "../../../_editor/components/toolbar/toolbarComponents/sizeButton";
import { Checkbox, Color, ConditionalText, DefaultComponent, External, FancyRadio, Font, MyRadio, MySelect, PluginColor, Range, Text, Theme } from "../../../_editor/components/toolbar/toolbarComponents/toolbarComponents";
import { BackgroundPicker, handleBackground } from "../../../_editor/components/toolbar/toolbarComponents/backgroundPicker";

import { handleCanvasToolbar } from "./handleCanvasToolbar";
import { getCurrentColor, getThemes } from "../../../common/themes/themeLoader";
import { loadBackground } from "../../../common/themes/backgroundLoader";
import _handlers from "../../../_editor/handlers/_handlers";
import { Accordion, ToolbarIcon } from "../../../_editor/components/toolbar/Styles";

/**
 * Render toolbar accordion
 * @param accordion Name of the accordion
 * @param tabKey Unique key of the tab
 * @param accordionKeys Unique keys of the accordion
 * @param state Toolbar state
 * @param key Current key
 * @param toolbar
 */
export function renderAccordion(accordion, tabKey, accordionKeys, state, key, toolbar) {
    let h = _handlers(toolbar);

    if (accordionKeys[0] === 'z__extra') {
        return null;
    }

    let props = { key: key };
    let toolbarProps = toolbar.props;
    let children = [];
    if (accordion.order) {
        for (let i = 0; i < accordion.order.length; i++) {
            if (accordion.accordions[accordion.order[i]]) {
                children.push(renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
            } else if (accordion.buttons[accordion.order[i]]) {
                children.push(renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i, toolbar));
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
                    {renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i, toolbar)}
                </div>,
            );
        }
    }

    if (accordion.key === 'marks_list') {
        children.push(
            <MarksList key="marks_list"
                state={toolbarProps.marks}
                viewToolbarsById={toolbarProps.viewToolbarsById}
                boxId={toolbarProps.box.id}
                onRichMarksModalToggled={h.onRichMarksModalToggled}
                onRichMarkEditPressed={h.onRichMarkEditPressed}
                onRichMarkDeleted={h.onRichMarkDeleted}
            />,
        );
    }
    return (
        // eslint-disable-next-line react/prop-types
        <Accordion className={"panelPluginToolbar"}{...props}>
            <Panel.Heading key={'span' + key} className={"panel-heading"}>
                <Panel.Title toggle>
                    <p className={"titleA"} style={{
                        color: 'white',
                        paddingTop: '0',
                        paddingBottom: '0',
                        paddingLeft: '0',
                        fontSize: '14.4px',
                    }}>
                        <ToolbarIcon>
                            {accordion.icon ? accordion.icon : null}
                        </ToolbarIcon>{accordion.__name}
                    </p>
                </Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>{children}</Panel.Body>
        </Accordion>
    );
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
 * @param toolbar
 * @returns {code} Button code
 */
export function renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key, toolbar) {
    let button = accordion.buttons[buttonKey];
    let toolbarProps = toolbar.props;
    let h = _handlers(toolbar);
    let id = (toolbarProps.boxSelected !== -1) ? toolbarProps.boxSelected : (toolbarProps.containedViewSelected || toolbarProps.navItemSelected);
    let currentElement = (["structure", "style", "z__extra", "__marks_list", "__score"].indexOf(accordionKeys[0]) === -1) ? "state" : accordionKeys[0];
    let toolbarPluginState = toolbarProps.boxSelected !== -1 ? toolbarProps.pluginToolbarsById[toolbarProps.boxSelected] : undefined;

    let commitChanges = (val) => {
        if (toolbarProps.boxSelected === -1) {
            handleCanvasToolbar(buttonKey, val, accordion, toolbar, buttonKey);
        } else if (currentElement === '__score') {
            h.onScoreConfig(id, buttonKey, val, toolbarProps.navItemSelected);
            if (!button.__defaultField) {
                h.onToolbarUpdated(id, tabKey, 'state', buttonKey, val);
            }
        } else {
            h.onToolbarUpdated(id, tabKey, currentElement, buttonKey, val);
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
            handleCanvasToolbar(buttonKey, value, accordion, toolbar, buttonKey);
        },
        onChange: e => {
            let value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            // TODO What is __position button???
            commitChanges(value);
            // eslint-disable-next-line no-console
            console.err('handler has not been implemented yet for ' + buttonKey);
        },
    };

    let newValue, handler;
    let navItemSelected = toolbarProps.navItemSelected;
    let theme = toolbarProps.viewToolbarsById[navItemSelected]?.theme ?? 'default';

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
            theme = toolbarProps.viewToolbarsById[toolbarProps.navItemSelected].theme ?? 'default';
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
        return External(button, props, toolbar, defaultHandler);
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
        handler = e => handleBackground(e, toolbar, accordion, buttonKey, commitChanges, button, id);
        return BackgroundPicker(button, props, toolbar, id, default_background, handler);
    case 'number':
        handler = e => {
            newValue = (typeof e.target !== 'undefined') ? e.target.value : e.value;
            // If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
            if (!(newValue && newValue.length >= 1 && (newValue.charAt(newValue.length - 1) === '.' || newValue.charAt(newValue.length - 1) === ',' || newValue === 0))) {
                newValue = parseFloat(newValue) || button.min || 0;
                if (button.max && newValue > button.max) {
                    newValue = button.max;
                }
            }
            commitChanges(newValue);
        };
        return DefaultComponent(button, props, handler);

    default:
        return DefaultComponent(button, props, defaultHandler);
    }
}
