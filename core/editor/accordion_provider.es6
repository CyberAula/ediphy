import i18n from "i18next";
import { isContainedView, isSlide, isSortableBox, isSortableContainer } from "../../common/utils";
import Select from "react-select";
import { ControlLabel, Popover, FormControl, OverlayTrigger, FormGroup, Panel, Radio, InputGroup } from "react-bootstrap";
import RadioButtonFormGroup from "../../_editor/components/toolbar/radio_button_form_group/RadioButtonFormGroup";
import { UPDATE_PLUGIN_TOOLBAR } from "../../common/actions";
import ToggleSwitch from "@trendmicro/react-toggle-switch/lib/index";
import React from "react";
import MarksList from "../../_editor/components/rich_plugins/marks_list/MarksList";
import ColorPicker from "../../_editor/components/common/color-picker/ColorPicker";
import ExternalProvider from "../../_editor/components/external_provider/external_provider/ExternalProvider";

export function toolbarFiller(toolbar, id, state, config, initialParams, container, marks = null, exercises = {}) {
    if (isSortableBox(id)) {
        toolbar.config.displayName = i18n.t('Container_');
    }
    if(!isSortableBox(id)) {
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
    console.log(controls);
    /* if (Object.keys(toolbar.state).length > 0) {
        Object.keys(toolbar.state).forEach((s)=>{
            // avoid container ids
            if(s.indexOf("__") === -1 && (!!controls.main.accordions.basic && !!controls.main.accordions.basic.buttons && !!controls.main.accordions.basic.buttons[s])) {
                controls.main.accordions.basic.buttons[s].value = toolbar.state[s];
            }
        });
    }*/

    if (Object.keys(toolbar.style).length > 0) {
        Object.keys(toolbar.style).forEach((s) => {
            controls.main.accordions.style.buttons[s].value = toolbar.style[s];
        });
    }
    if (Object.keys(toolbar.structure).length > 0) {
        Object.keys(toolbar.structure).forEach((s) => {
            if(s !== "width" && s !== "height" && s !== "heightUnit" && s !== "widthUnit" && s !== "aspectRatio") {
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

export function createScoreAccordions(controls, state, exercises) {
    if (!controls.main) {
        controls.main = {
            __name: "Main",
            accordions: {

            },
        };
    }
    if (!controls.main.accordions.score) {
        controls.main.accordions.__score = {
            key: '__score',
            __name: i18n.t("Toolbar de score"),
            icon: 'school',
            buttons: {},
        };
    }
    let buttons = Object.assign({}, controls.main.accordions.__score.buttons || {}, {
        weight: {
            __name: "wEIGHT",
            __defaultField: true,
            type: "number",
            value: 1,
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
        autoManaged: true,
    };
    if (arb.location.length === 2) {
        controls[arb.location[0]].accordions[arb.location[1]].buttons.aspectRatio = button;
    } else {
        controls[arb.location[0]].accordions[arb.location[1]].accordions[arb.location[2]].buttons.__aspectRatio = button;
    }
}

export function createControls(payload) {
    let controls = payload || {
        main: {
            __name: "Main",
            accordions: {},
        },
    };
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

    /* } else {
        let width = controls.main.accordions.__sortable.buttons.__width;
        displayValue = width.displayValue;
        value = width.value;
        units = width.units;
        type = width.type;
    }*/
    controls.main.accordions.structure.buttons.width = {
        __name: i18n.t('Width'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
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

    /* } else {
        let height = state.controls.main.accordions.__sortable.buttons.__height;
        type = height.type;
        displayValue = height.displayValue;
        value = height.value;
        units = height.units;
    }*/
    controls.main.accordions.structure.buttons.height = {
        __name: i18n.t('Height'),
        type: type,
        displayValue: displayValue,
        value: value,
        step: 5,
        units: units,
        auto: displayValue === "auto",
        autoManaged: true,
    };

    controls.main.accordions.structure.buttons.rotation = {
        __name: i18n.t('Rotate'),
        type: 'range',
        value: 0,
        min: 0,
        max: 360,
        autoManaged: false,
    };

    // This will be commented until it's working correctly
    if (!floatingBox) {
        /* controls.main.accordions.structure.buttons.position = {
            __name: i18n.t('Position'),
            type: 'radio',
            value: 'relative',
            options: ['absolute', 'relative'],
            autoManaged: true,
        };*/

    } else {
        // let hasPositionButton = action.payload.toolbar && action.payload.toolbar.main && action.payload.toolbar.main.accordions && action.payload.toolbar.main.accordions.__sortable && action.payload.toolbar.main.accordions.__sortable.buttons && action.payload.toolbar.main.accordions.__sortable.buttons.__position;
        let hasPositionButton = state.controls && state.controls.main && state.controls.main.accordions && state.controls.main.accordions.structure && state.controls.main.accordions.structure.buttons && state.controls.main.accordions.structure.buttons.__position;

        if (floatingBox && hasPositionButton) {
            controls.main.accordions.structure.buttons.position = {
                __name: i18n.t('Position'),
                type: 'radio',
                value: state.controls.main.accordions.structure.buttons.position.value,
                options: ['absolute', 'relative'],
                autoManaged: true,
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
export function renderAccordion(accordion, tabKey, accordionKeys, state, key, toolbar_props) {
    if (accordionKeys[0] === 'z__extra') {
        return null;
    }
    let props = {
        key: key,
        className: "panelPluginToolbar",
        collapsible: true,
        onEntered: (panel) => {
            panel.parentNode.classList.add("extendedPanel");
        },
        onExited: (panel) => {
            panel.parentNode.classList.remove("extendedPanel");
        },
        header: (
            <span key={'span' + key}>
                <i className="toolbarIcons material-icons">
                    {accordion.icon ? accordion.icon : <span className="toolbarIcons"/>}
                </i>{accordion.__name}
            </span>
        ),
    };
    let children = [];
    if (accordion.order) {
        for (let i = 0; i < accordion.order.length; i++) {
            if (accordion.accordions[accordion.order[i]]) {
                children.push(renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
            } else if (accordion.buttons[accordion.order[i]]) {
                children.push(renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i, toolbar_props));
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

                    {renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i, toolbar_props)}

                </div>
            );
        }

    }

    if (accordion.key === 'marks_list') {
        children.push(
            <MarksList key="marks_list"
                state={toolbar_props.marks}
                toolbars={state}
                onRichMarksModalToggled={toolbar_props.onRichMarksModalToggled}
                onRichMarkEditPressed={toolbar_props.onRichMarkEditPressed}
                onRichMarkDeleted={toolbar_props.onRichMarkDeleted}/>
        );
    }

    return React.createElement(Panel, props, children);
}

/**
     * Render toolbar button
     * @param accordion Name of the accordion
     * @param tabKey Unique key of the tab
     * @param accordionKeys Unique keys of the accordion
     * @param buttonKey Unique key of the button
     * @param state Toolbar state
     * @param key Current key
     * @returns {code} Button code
     */
export function renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key, toolbar_props) {
    let button = accordion.buttons[buttonKey];
    let children = null;

    let id = (toolbar_props.boxSelected !== -1) ?
        toolbar_props.boxSelected :
        (toolbar_props.containedViewSelected !== 0) ?
            toolbar_props.containedViewSelected :
            toolbar_props.navItemSelected;

    /* let currentElement = (accordionKeys[0] === "basic") ? "state" :
        accordionKeys[0];*/
    let currentElement = (["structure", "style", "z__extra", "__marks_list"].indexOf(accordionKeys[0]) === -1) ? "state" : accordionKeys[0];
    // get toolbar
    let toolbar_plugin_state;
    if(toolbar_props.boxSelected !== -1) {
        toolbar_plugin_state = toolbar_props.pluginToolbars[toolbar_props.boxSelected];
    }
    let props = {
        key: ('child_' + key),
        id: ('page' + '_' + buttonKey),
        type: button.type,
        value: button.value,
        checked: button.checked,
        label: button.__name,
        min: button.min,
        max: button.max,
        step: button.step,
        disabled: false,
        title: button.title ? button.title : '',
        className: button.class,
        style: { width: '100%' },
        onBlur: e => {
            let value = e.target.value;
            if (button.type === 'number' && value === "") {
                value = button.min ? button.min : 0;
            }

            if (!button.autoManaged && button.callback) {
                // button.callback(state, buttonKey, value, id, UPDATE_PLUGIN_TOOLBAR);
            }
        },
        onChange: e => {
            let value;
            if (typeof e.target !== 'undefined') {
                value = e.target.value;
            } else {
                value = e.value;
            }
            if (currentElement === 'structure' && (buttonKey === 'width' || buttonKey === 'height' || buttonKey === "aspectRatio")) {
                let type = e.target.type;
                if (!type && e.target.classList.contains('toggle-switch---toggle---mncCu')) {
                    type = 'checkbox';
                }
                switch (type) {
                case "checkbox":
                    if(buttonKey === "aspectRatio") {
                        toolbar_props.onBoxResized(id, { aspectRatio: !toolbar_plugin_state.structure.aspectRatio });
                    } else {
                        toolbar_props.onBoxResized(id, { [buttonKey]: toolbar_plugin_state.structure[buttonKey] === "auto" ? 100 : "auto" });
                    }
                    break;
                case "select-one":
                    toolbar_props.onBoxResized(id, { [buttonKey + "Unit"]: value });
                    break;

                default:
                    if (isNaN(parseInt(value, 10))) {
                        if (value === "") {
                            value = 0;
                        } else {
                            value = 100;
                        }
                    } else {
                        value = parseInt(value, 10);
                    }
                    let val;
                    if (button.units === "%") {
                        val = Math.min(Math.max(value, 0), 100);
                    } else if (button.units === "px") {
                        val = Math.max(value, 0);
                    }

                    let otherbutton = buttonKey === 'width' ? 'height' : 'width';
                    /* if (accordion.buttons.aspectRatio && accordion.buttons.aspectRatio.checked) {
                        val = val * value / value;
                        if (!otherButton.auto) {
                            otherButton.displayValue = otherButton.value;
                        }
                    }*/

                    // If next values are going to be over 100%, prevent action
                    if (toolbar_plugin_state.structure[buttonKey] !== "auto" && (toolbar_plugin_state.structure[buttonKey + "Unit"] === "%" && value > 100) || (toolbar_plugin_state.structure[otherbutton + "Unit"] === "%" && val > 100)) {
                        return;
                    }

                    if (buttonKey === "width") {
                        toolbar_props.onBoxResized(id, { width: value });
                    }

                    if (buttonKey === "height") {
                        toolbar_props.onBoxResized(id, { height: value });
                    }
                    return;

                    break;
                }

                return;
            }

            if (button.type === 'number') {
                // If there's any problem when parsing (NaN) -> take min value if defined; otherwise take 0
                if (!(value && value.length >= 1 && (value.charAt(value.length - 1) === '.' || value.charAt(value.length - 1) === ',' || value === 0))) {
                    value = parseFloat(value) || button.min || 0;
                    if (button.max && value > button.max) {
                        value = button.max;
                    }
                }

            }

            if (button.type === 'checkbox') {
                value = !button.checked;
            }
            if (button.type === 'radio') {
                value = button.options[value];
                if (buttonKey === '__position') {
                    toolbar_props.onToolbarUpdated(id, tabKey, currentElement, '__position', value);
                    let parentId = toolbar_props.box.parent;
                    let containerId = toolbar_props.box.container;
                    toolbar_props.onBoxMoved(id, 0, 0, value, parentId, containerId);
                    if (isSortableContainer(containerId)) {
                        let newHeight = parseFloat(document.getElementById(containerId).clientHeight, 10);
                        toolbar_props.onSortableContainerResized(containerId, parentId, newHeight);
                    }
                }
            }

            if (button.type === 'image_file') {
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
                            this.props.onToolbarUpdated(id, tabKey, currentElement, buttonKey, canvas.toDataURL("image/jpeg"));
                            if (!button.autoManaged) {
                                if (!button.callback) {
                                    this.handlecanvasToolbar(button.__name, data);
                                } else {
                                    button.callback(state, buttonKey, data, id, UPDATE_TOOLBAR);
                                }
                            }
                        };
                        img.src = data;
                    };
                    reader.readAsDataURL(file);
                    return;
                }
                return;

            }

            if (button.type === 'background_picker') {
                if(e.color) {
                    value = { background: e.color, attr: 'full' };
                    if (!value) {
                        return;
                    }
                }

                if(e.target && e.target.type === "radio") {
                    value = { background: button.value.background, attr: e.target.value };
                }

                if(e.target && e.target.type === "text") {
                    value = { background: e.target.value, attr: 'full' };
                }

                if(e.currentTarget && e.currentTarget.type === "button") {
                    value = { background: e.currentTarget.value, attr: 'full' };
                }
                if (e.target && e.target.files) {
                    if(e.target.files.length === 1) {
                        let file = e.target.files[0];
                        let reader = new FileReader();
                        reader.onload = () => {
                            let img = new Image();
                            let data = reader.result;
                            img.onload = () => {
                                let canvas = document.createElement('canvas');
                                let ctx = canvas.getContext('2d');
                                ctx.drawImage(img, 0, 0, 1200, 1200);
                                this.props.onToolbarUpdated(id, tabKey, currentElement, buttonKey, { background: data, attr: 'full' });
                                if (!button.autoManaged) {
                                    if (!button.callback) {
                                        this.handlecanvasToolbar(button.__name, { background: data, attr: 'full' });
                                    } else {
                                        button.callback(state, buttonKey, data, id, UPDATE_TOOLBAR);
                                    }
                                }
                            };
                            img.src = data;
                        };

                        reader.readAsDataURL(file);
                        return;
                    }
                    return;
                }

            }

            if (button.type === 'select' && button.multiple === true) {
                value = button.value;
                let ind = button.value.indexOf(e);
                value = e; // [...e.target.options].filter(o => o.selected).map(o => o.value);
            }

            if (button.type === 'colorOptions') {
                value = e.value;
            }
            if (button.type === 'color') {
                value = e.color;
                if (!value) {
                    return;
                }
            }

            // toolbar_props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

            if (toolbar_props.boxSelected === -1) {
                handlecanvasToolbar(button.__name, value, accordion, toolbar_props);
            } else {
                toolbar_props.onToolbarUpdated(id, tabKey, currentElement, buttonKey, value);
            }

        },

    };
    if (button.type === "color") {
        return React.createElement(
            FormGroup,
            { key: button.__name },
            [
                React.createElement(
                    ControlLabel,
                    { key: 'label_' + button.__name },
                    button.__name),
                /* React.createElement(
                      FormControl,
                        props,
                        null
                    ),*/
                React.createElement(
                    ColorPicker, { key: props.label, value: props.value, onChange: props.onChange },
                    []),
            ]);

    }
    if (button.options) {
        if (button.type === "colorOptions") {
            props.options = button.options;
            props.optionRenderer = this.renderOption;
            props.valueRenderer = this.renderValue;
            return React.createElement(
                FormGroup,
                { key: button.__name },
                [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        button.__name),
                    React.createElement(
                        Select,
                        props,
                        null),
                ]
            );
        }

        if (button.type === "select") {
            if (!button.multiple) {
                button.options.map((option, index) => {
                    if (!children) {
                        children = [];
                    }
                    children.push(React.createElement('option', { key: 'child_' + index, value: option }, option));
                });
                props.componentClass = 'select';
                return React.createElement(
                    FormGroup,
                    { key: button.__name },
                    [
                        React.createElement(
                            ControlLabel,
                            { key: 'label_' + button.__name },
                            button.__name),
                        React.createElement(
                            FormControl,
                            props,
                            children),
                    ]
                );
            }

            props.multiple = 'multiple';
            props.options = button.options;
            props.multi = true;
            props.simpleValue = true;
            props.placeholder = "No has elegido ninguna opción";
            return React.createElement(
                FormGroup,
                { key: button.__name },
                [
                    React.createElement(
                        ControlLabel,
                        { key: 'label_' + button.__name },
                        button.__name),
                    React.createElement(
                        Select,
                        props,
                        null),
                ]
            );
        }

        if (button.type === 'radio') {
            button.options.map((radio, index) => {
                if (!children) {
                    children = [];
                    children.push(React.createElement(ControlLabel, { key: 'child_' + index }, button.__name));
                }
                children.push(React.createElement(Radio, {
                    key: index,
                    name: button.__name,
                    value: index,
                    id: (button.__name + radio),
                    onChange: props.onChange,
                    checked: (button.value === button.options[index]),
                }, radio));
            });
            return React.createElement(FormGroup, props, children);
        }

        if (button.type === 'fancy_radio') {
            if (buttonKey === '__verticalAlign') {
                return React.createElement(RadioButtonFormGroup, {
                    key: button.__name,
                    title: button.__name,
                    options: button.options,
                    selected: button.value,
                    click: (option) => {
                        toolbar_props.onVerticallyAlignBox(toolbar_props.boxSelected, option);
                    },
                    tooltips: button.tooltips,
                    icons: button.icons,
                }, null);
            }
            return null;
        }
    }

    if (button.type === 'checkbox') {
        delete props.style.width;
        return React.createElement(
            FormGroup,
            { key: (button.__name) },
            [React.createElement(
                ToggleSwitch,
                props,
                button.__name),
            <label key={buttonKey + 'label'} style={{ display: 'inline-block' }}>{props.label}</label>]
        );
    }

    if (button.type === 'conditionalText') {
        props.style.marginTop = '5px';
        props.style.marginBottom = '15px';
        props.value = accordion.buttons[buttonKey].value;
        return React.createElement(
            FormGroup,
            {
                key: button.__name,
                style: { display: accordion.buttons[button.associatedKey].checked ? "block" : "none" },
            },
            [
                React.createElement(
                    "span",
                    { key: 'output_span' + button.__name, className: 'rangeOutput' },
                    button.type === "range" ? button.value : null),
                React.createElement(
                    FormControl,
                    props,
                    null),
            ]
        );
    }

    if (button.type === "image_file") {
        let isURI = (/data\:/).test(props.value);
        return React.createElement(
            FormGroup,
            { key: button.__name }, [
                React.createElement(
                    ControlLabel,
                    { key: 'label_' + button.__name, value: button.value },
                    button.__name),
                React.createElement('div', { key: 'container_' + button.__name, style: { display: 'block' } },
                    React.createElement(
                        FileInput, {
                            key: 'fileinput_' + props.label,
                            value: props.value,
                            onChange: props.onChange,
                            style: { width: '100%' },
                        },
                        React.createElement('div', {
                            style: { backgroundImage: isURI ? 'url(' + props.value + ')' : 'none' },
                            key: "inside_" + props.label,
                            className: 'fileDrag_toolbar',
                        }, isURI ? null : [
                            React.createElement('span', { key: props.label + "1" }, i18n.t('FileInput.Drag')),
                            React.createElement('span', { key: props.label + "2", className: "fileUploaded" }, [
                                React.createElement('i', {
                                    key: 'icon_' + button.__name,
                                    className: 'material-icons',
                                }, 'insert_drive_file'),
                            ]),
                        ])
                    )
                ),
            ]);
    }

    if (button.type === "background_picker") {
        let isURI = (/data\:/).test(props.value.background);
        let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(props.value.background);
        let default_background = "rgb(255,255,255)";
        let isSli = isSlide(this.props.navItems[this.props.navItemSelected].type);

        return React.createElement(
            FormGroup,
            { key: button.__name },
            [
                React.createElement(
                    ControlLabel,
                    { key: 'label1_' + button.__name },
                    i18n.t('background.background_color')),
                React.createElement(
                    ColorPicker, { key: "cpicker_" + props.label, value: isColor ? props.value.background : default_background, onChange: props.onChange },
                    []),
                isSli && React.createElement(
                    ControlLabel,
                    { key: 'label2_' + button.__name, value: button.value.background },
                    i18n.t('background.background_image')),
                isSli && React.createElement('div',
                    { key: 'container_' + button.__name, style: { display: 'block' } },
                    [React.createElement(
                        FileInput, {
                            key: 'fileinput_' + props.label,
                            value: props.value.background,
                            onChange: props.onChange,
                            style: { width: '100%' },
                        },
                        React.createElement('div', {
                            style: { backgroundImage: isURI ? 'url(' + props.value.background + ')' : 'none' },
                            key: "inside_" + props.label,
                            className: 'fileDrag_toolbar',
                        }, isURI ? null : [
                            React.createElement('span', { key: props.label + "1" }, i18n.t('FileInput.Drag')),
                            React.createElement('span', { key: props.label + "2", className: "fileUploaded" }, [
                                React.createElement('i', {
                                    key: 'icon_' + button.__name,
                                    className: 'material-icons',
                                }, 'insert_drive_file'),
                            ]),
                        ])
                    ),
                    React.createElement(
                        FormGroup,
                        { key: button.__name },
                        [
                            React.createElement(
                                ControlLabel,
                                { key: 'labelurlinput_' + button.__name },
                                i18n.t('background.background_input_url')),
                            React.createElement(FormControl,
                                {
                                    key: 'urlinput_' + props.label,
                                    value: isURI || isColor ? '' : props.value.background,
                                    onChange: props.onChange,
                                }, null),
                        ]),
                    (!isColor) && React.createElement(Radio, { key: 'full_', name: 'image_display', checked: props.value.attr === 'full', onChange: props.onChange, value: 'full' }, 'full'),
                    (!isColor) && React.createElement(Radio, { key: 'repeat', name: 'image_display', checked: props.value.attr === 'repeat', onChange: props.onChange, value: 'repeat' }, 'repeat'),
                    (!isColor) && React.createElement(Radio, { key: 'centered', name: 'image_display', checked: props.value.attr === 'centered', onChange: props.onChange, value: 'centered' }, 'centered'),
                    ]
                ),
                React.createElement(
                    ControlLabel,
                    { key: 'label_' + button.__name },
                    i18n.t('background.reset_background')),
                React.createElement(
                    Button, {
                        value: default_background,
                        key: 'button_' + button.__name,
                        onClick: props.onChange,
                        className: "toolbarButton",
                    },
                    React.createElement("div", { key: props.label }, "Reset"),
                ),
            ]);
    }

    if (button.type === "external_provider") {
        return React.createElement(ExternalProvider, {
            key: button.__name,
            formControlProps: props,
            isBusy: toolbar_props.isBusy,
            fetchResults: toolbar_props.fetchResults,
            onFetchVishResources: toolbar_props.onFetchVishResources,
            onUploadVishResource: toolbar_props.onUploadVishResource,
            onChange: props.onChange,
            accept: button.accept,
        }, null);
    }

    // If it's none of previous types (number, text, color, range, ...)
    if (accordionKeys[0] === 'structure' && (buttonKey === 'width' || buttonKey === 'height')) {
        let advancedPanel = (
            <FormGroup>
                <ToggleSwitch label={i18n.t("Auto")}
                    checked={toolbar_plugin_state.structure[buttonKey] === "auto"}
                    onChange={props.onChange}/>
                {i18n.t("Auto")} <br/>
                {/* Disable px size in slides*/}
                {isSlide(toolbar_props.navItems[toolbar_props.navItemSelected].type) ?
                    (<span/>) :
                    (<div><br/>
                        <ControlLabel>{i18n.t("Units")}</ControlLabel>
                        <FormControl componentClass='select'
                            value={toolbar_plugin_state.structure[buttonKey + "Unit"]}
                            onChange={props.onChange}>
                            <option value="px">{i18n.t("Pixels")}</option>
                            <option value="%">{i18n.t("Percentage")}</option>
                        </FormControl></div>)}
            </FormGroup>
        );

        let auto = toolbar_plugin_state.structure[buttonKey] === "auto";
        props.value = auto ? 'auto' : toolbar_plugin_state.structure[buttonKey];
        props.type = auto ? 'text' : 'number';
        props.disabled = auto;
        return (
            <FormGroup key={button.__name}>
                <ControlLabel key={"label_" + button.__name}>
                    {button.__name + (!auto ? " (" + toolbar_plugin_state.structure[buttonKey + "Unit"] + ")" : "")}
                </ControlLabel>
                <InputGroup>
                    <FormControl {...props} />
                    <OverlayTrigger trigger="click"
                        placement="bottom"
                        rootClose
                        overlay={
                            <Popover id="advancedpanel"
                                className="advancedPopover"
                                title={i18n.t('Advanced')}>
                                {advancedPanel}
                            </Popover>
                        }>
                        <InputGroup.Addon className="gc_addon">
                            <i className="material-icons gridconficons">settings</i>
                        </InputGroup.Addon>
                    </OverlayTrigger>
                </InputGroup>
            </FormGroup>
        );
    }
    if (button.type === 'range') {
        props.className = "rangeInput";
        return React.createElement(
            FormGroup,
            { key: button.__name },
            [
                React.createElement(
                    ControlLabel,
                    { key: 'label_' + button.__name },
                    button.__name),
                React.createElement(
                    "span",
                    { key: 'output_span' + button.__name, className: 'rangeOutput' },
                    button.type === "range" ? button.value : null),
                React.createElement(
                    FormControl,
                    props,
                    null),
            ]
        );
    }
    return React.createElement(
        FormGroup,
        { key: button.__name },
        [
            React.createElement(
                ControlLabel,
                { key: 'label_' + button.__name },
                button.__name),
            React.createElement(
                FormControl,
                props,
                null),
        ]
    );
}

/**
     * Renders options or multiple select inputs
     * @param option Option object wihth its label
     * @returns {code}
     */
export function renderOption(option) {
    return (
        <span>{option.label}<i style={{ color: option.color, float: 'right' }} className="fa fa-stop"/></span>
    );
}

/**
     * Rende option value
     * @param option Option object wihth its label
     * @returns {code}
     */
export function renderValue(option) {
    return (
        <span>{option.label}</span>
    );
}

/**
 * Header configuration
 * @param name type of title
 * @param value value of the field
 */
export function handlecanvasToolbar(name, value, accordions, toolbar_props) {
    let navitem = toolbar_props.navItems[toolbar_props.navItemSelected];
    let toolbar = accordions;
    switch (name) {
    // change page/slide title
    case i18n.t('background.background'):
        let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(value.background);
        if(isColor) {
            toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, value.background);
        } else {
            toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, value);
        }
        break;
    case "custom_title":
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentTitleContent: value,
        });
        break;
    // change page/slide title
    case "custom_subtitle":
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentSubtitleContent: value,
        });
        break;
    // change page/slide title
    case "custom_pagenum":
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            numPageContent: value,
        });
        break;
    // preview / export document
    case i18n.t('display_page'):
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected);
        break;
    // change document(navitem) name
    case i18n.t('NavItem_name'):
        if (isContainedView(toolbar_props.navItemSelected)) {
            toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, { viewName: value });
        } else {
            toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, { viewName: value });
        }
        break;
        // display - course title
    case i18n.t('course_title'):
        let courseTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            courseTitle: courseTitle,
        });
        break; // display - page title
    case i18n.t('Title') + i18n.t('document'):
        let docTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentTitle: docTitle,
        });
        break;
    // display - page title
    case i18n.t('Title') + i18n.t('page'):
        let pageTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentTitle: pageTitle,
        });
        break;
    // display - slide title
    case i18n.t('Title') + i18n.t('slide'):
        let slideTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentTitle: slideTitle,
        });
        break;
    case i18n.t('Title') + i18n.t('section'):
        let sectionTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentTitle: sectionTitle,
        });
        break;
    // display - subtitle
    case i18n.t('subtitle'):
        let subTitle = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            documentSubTitle: subTitle,
        });
        break;
    // display - breadcrumb
    case i18n.t('Breadcrumb'):
        let breadcrumb = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            breadcrumb: breadcrumb,
        });
        break;
    // display - pagenumber
    case i18n.t('pagenumber'):
        let pagenumber = value ? 'reduced' : 'hidden';
        toolbar_props.updateViewToolbar(toolbar_props.navItemSelected, {
            numPage: pagenumber,
        });
        break;
    default:
        break;
    }

}

