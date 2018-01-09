import React, { Component } from 'react';
import { Tooltip, FormControl, OverlayTrigger, Popover, InputGroup, FormGroup, Radio, ControlLabel, Checkbox, Button, PanelGroup, Panel } from 'react-bootstrap';
import GridConfigurator from '../grid_configurator/GridConfigurator.jsx';
import RadioButtonFormGroup from '../radio_button_form_group/RadioButtonFormGroup.jsx';
import Select from 'react-select';
import ExternalProvider from '../../external_provider/external_provider/ExternalProvider';
import MarksList from './../../rich_plugins/marks_list/MarksList.jsx';
import Ediphy from '../../../../core/editor/main';
import ColorPicker from './../../common/color-picker/ColorPicker';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import { UPDATE_TOOLBAR, UPDATE_BOX } from '../../../../common/actions';
import { isSortableContainer, isCanvasElement, isContainedView, isSlide } from '../../../../common/utils';
import i18n from 'i18next';
import './_pluginToolbar.scss';

/**
 * Toolbar component for configuring boxes or pages
 */
export default class PluginToolbar extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        /**
         * Component's initial state
         * @type {{open: boolean}}
         */
        this.state = {
            open: false,
        };
    }

    /**
     * Render React component
     * @returns {code}
     */
    render() {
        let toolbar = this.props.toolbars[this.props.box.id];
        // We define the extra buttons we need depending on plugin's configuration
        let textButton;
        if (toolbar.config.needsTextEdition) {
            textButton = (
                <div className="panel-body">
                    <Button key={'text'}
                        className={toolbar.showTextEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                        onClick={() => {
                            this.props.onTextEditorToggled(toolbar.id, !toolbar.showTextEditor);

                        }}>
                        <i className="toolbarIcons material-icons">mode_edit</i>
                        {i18n.t("edit_text")}
                    </Button>
                </div>
            );
        }
        let xmlButton;
        if (toolbar.config.needsXMLEdition) {
            xmlButton = (
                <Button key={'xml'}
                    className={toolbar.showXMLEditor ? 'toolbarButton textediting' : 'toolbarButton'}
                    onClick={() => {
                        this.props.onXMLEditorToggled();
                    }}>
                    Edit XML
                </Button>
            );
        }
        let configButton;
        if (toolbar.config && toolbar.config.needsConfigModal) {
            configButton = (
                <div className="panel-body">
                    <Button key={'config'}
                        className='toolbarButton'
                        onClick={() => {
                            Ediphy.Plugins.get(toolbar.config.name).openConfigModal(UPDATE_BOX, toolbar.state, toolbar.id);
                        }}>
                        <i className="toolbarIcons material-icons">build</i>
                        {i18n.t('open_conf')}
                    </Button>
                </div>
            );
        }
        let duplicateButton;
        if (this.props.box.id[1] !== 's') {
            duplicateButton = (
                <Button key={'duplicate'}
                    className="pluginToolbarMainButton"
                    onClick={e => {
                        this.props.onBoxDuplicated(this.props.box.id, this.props.box.parent, this.props.box.container);
                        e.stopPropagation();
                    }}>
                    <i className="material-icons">content_copy</i>
                </Button>
            );
        }

        return (
            <div id="wrap"
                className="wrapper"
                style={{
                    right: '0px',
                    top: this.props.top,
                }}>
                <div className="pestana"
                    onClick={() => {
                        this.setState({ open: !this.state.open });
                    }} />
                <div id="tools"
                    style={{
                        width: this.state.open ? '250px' : '40px',
                    }}
                    className="toolbox">
                    <OverlayTrigger placement="left"
                        overlay={
                            <Tooltip className={this.state.open ? 'hidden' : ''}
                                id="tooltip_props">
                                {i18n.t('Properties')}
                            </Tooltip>
                        }>
                        <div onClick={() => {
                            this.setState({ open: !this.state.open });
                        }}
                        style={{ display: 'block' }}
                        className={this.state.open ? 'carouselListTitle toolbarSpread' : 'carouselListTitle toolbarHide'}>
                            <div className="toolbarTitle">
                                <i className="material-icons">settings</i>
                                <span className="toolbarTitletxt">
                                    {i18n.t('Properties')}
                                </span>
                            </div>
                            <div className="pluginTitleInToolbar">
                                {toolbar.config.displayName || ""}
                            </div>
                        </div>
                    </OverlayTrigger>
                    <div id="insidetools" style={{ display: this.state.open ? 'block' : 'none' }}>
                        <div className="toolbarTabs">
                            {Object.keys(toolbar.controls).map((tabKey, index) => {
                                let tab = toolbar.controls[tabKey];
                                return (
                                    <div key={'key_' + index} className="toolbarTab">
                                        <PanelGroup>
                                            {Object.keys(tab.accordions).sort().map((accordionKey, ind) => {
                                                return this.renderAccordion(
                                                    tab.accordions[accordionKey],
                                                    tabKey,
                                                    [accordionKey],
                                                    toolbar.state,
                                                    ind
                                                );
                                            })}
                                            {this.props.box.children.map((id, ind) => {
                                                let container = this.props.box.sortableContainers[id];
                                                if (tabKey === "main") {
                                                    return (
                                                        <Panel key={'panel_' + id}
                                                            className="panelPluginToolbar"
                                                            collapsible
                                                            onEnter={(panel) => {
                                                                panel.parentNode.classList.add("extendedPanel");
                                                            }}
                                                            onExited={(panel) => {
                                                                panel.parentNode.classList.remove("extendedPanel");
                                                            }}
                                                            header={
                                                                <span>
                                                                    <i className="toolbarIcons material-icons">web_asset</i>
                                                                    {(toolbar.state.__pluginContainerIds && toolbar.state.__pluginContainerIds[container.key].name) ?
                                                                        toolbar.state.__pluginContainerIds[container.key].name :
                                                                        (i18n.t('Block') + ' ' + (ind + 1))
                                                                    }
                                                                </span>
                                                            }>
                                                            <GridConfigurator id={id}
                                                                parentId={this.props.box.id}
                                                                container={container}
                                                                onColsChanged={this.props.onColsChanged}
                                                                onRowsChanged={this.props.onRowsChanged}
                                                                sortableProps={this.props.box.sortableContainers[id]}
                                                                onSortablePropsChanged={this.props.onSortablePropsChanged}
                                                                onSortableContainerResized={this.props.onSortableContainerResized}/>
                                                        </Panel>);
                                                }
                                                return null;
                                            })}
                                        </PanelGroup>
                                        {textButton}
                                        {xmlButton}
                                        {configButton}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Render toolbar accordion
     * @param accordion Name of the accordion
     * @param tabKey Unique key of the tab
     * @param accordionKeys Unique keys of the accordion
     * @param state Toolbar state
     * @param key Current key
     */
    renderAccordion(accordion, tabKey, accordionKeys, state, key) {
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
                    <div key={'div_' + i }
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
    renderButton(accordion, tabKey, accordionKeys, buttonKey, state, key) {
        let button = accordion.buttons[buttonKey];
        let children = null;
        let id;
        if(this.props.boxSelected === -1) {
            id = this.props.navItemSelected;
        }else{
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
                if(typeof e.target !== 'undefined') {
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
                    if(accordion.buttons.__aspectRatio && accordion.buttons.__aspectRatio.checked) {
                        otherButton.value = otherButton.value * newButton.value / button.value;
                        if(!otherButton.auto) {
                            otherButton.displayValue = otherButton.value;
                        }
                    }

                    // If next values are going to be over 100%, prevent action
                    if((newButton.units === "%" && newButton.value > 100) || (otherButton.units === "%" && otherButton.value > 100)) {
                        return;
                    }

                    if(buttonKey === "__width") {
                        this.props.onBoxResized(id, newButton, otherButton);
                    }else{
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
                    if (!value) {return;}
                }

                this.props.onToolbarUpdated(id, tabKey, accordionKeys, buttonKey, value);

                if (!button.autoManaged) {
                    if(!button.callback) {
                        this.handlecanvasToolbar(button.__name, value);
                    }else{
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
                    button.__name), <label key={buttonKey + 'label'} style={{ display: 'inline-block' }}>{props.label}</label>]
            );
        }

        if (button.type === 'conditionalText') {
            props.style.marginTop = '5px';
            props.style.marginBottom = '15px';

            return React.createElement(
                FormGroup,
                { key: button.__name, style: { display: accordion.buttons[button.associatedKey].checked ? "block" : "none" } },
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
                        (<span />) :
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
        if(button.type === 'range') {
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
    renderOption(option) {
        return (
            <span>{option.label}<i style={{ color: option.color, float: 'right' }} className="fa fa-stop" /></span>
        );
    }

    /**
     * Rende option value
     * @param option Option object wihth its label
     * @returns {code}
     */
    renderValue(option) {
        return (
            <span>{option.label}</span>
        );
    }

}
