import i18n from "i18next";
import { isSlide, isSortableBox, isSortableContainer } from "../../common/utils";
import Select from "react-select";
import { ControlLabel, FormControl, FormGroup, Panel, Radio } from "react-bootstrap";
import RadioButtonFormGroup from "../../_editor/components/toolbar/radio_button_form_group/RadioButtonFormGroup";
import { UPDATE_TOOLBAR } from "../../common/actions";
import ToggleSwitch from "@trendmicro/react-toggle-switch/lib/index";
import React from "react";
import ColorPicker from "../../_editor/components/common/color-picker/ColorPicker";
import ExternalProvider from "../../_editor/components/external_provider/external_provider/ExternalProvider";

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

export function createAspectRatioButton(controls, config) {
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

export function createSizeButtons(controls, state, action, floatingBox) {
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
}

/**
     * Render toolbar accordion
     * @param accordion Name of the accordion
     * @param tabKey Unique key of the tab
     * @param accordionKeys Unique keys of the accordion
     * @param state Toolbar state
     * @param key Current key
     */
export function renderAccordion(accordion, tabKey, accordionKeys, state, key) {
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
                children.push(this.renderAccordion(accordion.accordions[accordion.order[i]], tabKey, [accordionKeys[0], accordion.order[i]], state, i));
            } else if (accordion.buttons[accordion.order[i]]) {
                children.push(this.renderButton(accordion, tabKey, accordionKeys, accordion.order[i], state, i));
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
                    {this.renderButton(accordion, tabKey, accordionKeys, buttonKeys[i], state, i)}

                </div>
            );
        }

    }

    if (accordion.key === 'marks_list') {
        children.push(
            <MarksList key="marks_list"
                state={state.__marks}
                toolbars={this.props.toolbars}
                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                onRichMarkEditPressed={this.props.onRichMarkEditPressed}
                onRichMarkDeleted={this.props.onRichMarkDeleted}/>
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
export function renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
    let button = accordion.buttons[buttonKey];
    let children = null;
    let id;
    if (this.props.boxSelected === -1) {
        id = this.props.navItemSelected;
    } else {
        id = this.props.box.id;
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
                button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
            }
        },
        onChange: e => {
            let value;
            if (typeof e.target !== 'undefined') {
                value = e.target.value;
            } else {
                value = e.value;
            }
            if (buttonKey === '__width' || buttonKey === '__height') {
                let newButton = Object.assign({}, (buttonKey === '__width' ? accordion.buttons.__width : accordion.buttons.__height));
                let otherButton = Object.assign({}, (buttonKey === '__height' ? accordion.buttons.__width : accordion.buttons.__height));
                let type = e.target.type;
                if (!type && e.target.classList.contains('toggle-switch---toggle---mncCu')) {
                    type = 'checkbox';
                }
                switch (type) {
                case "checkbox":
                    newButton.auto = !newButton.auto;
                    newButton.displayValue = newButton.auto ? 'auto' : button.value;
                    newButton.type = newButton.auto ? 'text' : 'number';
                    newButton.disabled = newButton.auto;
                    break;
                case "select-one":
                    newButton.units = value;
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
                    if (newButton.units === "%") {
                        val = Math.min(Math.max(value, 0), 100);
                        newButton.displayValue = val;
                        newButton.value = val;
                    } else if (newButton.units === "px") {
                        val = Math.max(value, 0);
                        newButton.displayValue = val;
                        newButton.value = val;
                    }
                    break;
                }
                if (accordion.buttons.__aspectRatio && accordion.buttons.__aspectRatio.checked) {
                    otherButton.value = otherButton.value * newButton.value / button.value;
                    if (!otherButton.auto) {
                        otherButton.displayValue = otherButton.value;
                    }
                }

                // If next values are going to be over 100%, prevent action
                if ((newButton.units === "%" && newButton.value > 100) || (otherButton.units === "%" && otherButton.value > 100)) {
                    return;
                }

                if (buttonKey === "__width") {
                    this.props.onBoxResized(id, newButton, otherButton);
                } else {
                    this.props.onBoxResized(id, otherButton, newButton);
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
                    this.props.onToolbarUpdated(id, tabKey, accordionKeys, '__position', value);
                    let parentId = this.props.box.parent;
                    let containerId = this.props.box.container;
                    this.props.onBoxMoved(id, 0, 0, value, parentId, containerId);
                    if (isSortableContainer(containerId)) {
                        let newHeight = parseFloat(document.getElementById(containerId).clientHeight, 10);
                        this.props.onSortableContainerResized(containerId, parentId, newHeight);
                    }
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

            this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

            if (!button.autoManaged) {
                if (!button.callback) {
                    this.handlecanvasToolbar(button.__name, value);
                } else {
                    button.callback(state, buttonKey, value, id, UPDATE_TOOLBAR);
                }

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
                        this.props.onVerticallyAlignBox(this.props.boxSelected, option);
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

    if (button.type === "external_provider") {
        return React.createElement(ExternalProvider, {
            key: button.__name,
            formControlProps: props,
            isBusy: this.props.isBusy,
            fetchResults: this.props.fetchResults,
            onFetchVishResources: this.props.onFetchVishResources,
            onUploadVishResource: this.props.onUploadVishResource,
            onChange: props.onChange,
            accept: button.accept,
        }, null);
    }

    // If it's none of previous types (number, text, color, range, ...)
    if (buttonKey === '__width' || buttonKey === '__height') {
        let advancedPanel = (
            <FormGroup>
                <ToggleSwitch label={i18n.t("Auto")}
                    checked={button.auto}
                    onChange={props.onChange}/>
                {i18n.t("Auto")} <br/>
                {/* Disable px size in slides*/}
                {isSlide(this.props.navItems[this.props.navItemSelected].type) ?
                    (<span/>) :
                    (<div><br/>
                        <ControlLabel>{i18n.t("Units")}</ControlLabel>
                        <FormControl componentClass='select'
                            value={button.units}
                            onChange={props.onChange}>
                            <option value="px">{i18n.t("Pixels")}</option>
                            <option value="%">{i18n.t("Percentage")}</option>
                        </FormControl></div>)}
            </FormGroup>
        );

        props.value = button.auto ? 'auto' : button.value;
        props.type = button.auto ? 'text' : 'number';
        props.disabled = button.auto;
        return (
            <FormGroup key={button.__name}>
                <ControlLabel key={"label_" + button.__name}>
                    {button.__name + (!button.auto ? " (" + button.units + ")" : "")}
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

