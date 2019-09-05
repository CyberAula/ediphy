/* eslint-disable react/prop-types */
import {
    Button,
    ControlLabel,
    FormControl,
    FormGroup,
    InputGroup,
    OverlayTrigger,
    Popover,
    Radio,
} from "react-bootstrap";
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import ColorPicker from "../../common/color-picker/ColorPicker";
import { getColor, getCurrentColor, getThemeFont } from "../../../../common/themes/theme_loader";
import i18n from "i18next";
import FontPicker from "../../common/font-picker/FontPicker";
import ThemePicker from "../../common/theme-picker/ThemePicker";
import { isSlide } from "../../../../common/utils";
import ToolbarFileProvider from "../../external_provider/file_modal/APIProviders/common/ToolbarFileProvider";
import Select from "react-select";
import RadioButtonFormGroup from "../radio_button_form_group/RadioButtonFormGroup";
import React from "react";

export const Checkbox = (button, onChange, props) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ToggleSwitch
                key={'sw_' + button.__name}
                {...props}
                onChange={onChange}
            />
            <label key={props.label} style={{ display: 'inline-block' }}>{props.label}</label>
        </FormGroup>);
};

export const Color = (button, onChange, props) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}> {button.__name} </ControlLabel>
            <ColorPicker
                key={props.label}
                value={props.value}
                onChange={onChange}
            />
        </FormGroup>);
};

export const PluginColor = (button, onChange, props, toolbarProps, id) => {
    let theme = toolbarProps.viewToolbars[id] && toolbarProps.viewToolbars[id].theme ? toolbarProps.viewToolbars[id].theme : 'default';
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}> Color </ControlLabel>
            <ColorPicker
                key={"cpicker_" + props.label}
                value={(props.value && props.value.color && props.value.custom) ? props.value.color : getCurrentColor(theme)}
                onChange={onChange}
            />
            <Button
                value={getColor(theme)}
                key={'button_' + button.__name}
                onClick={onChange}
                className={"toolbarButton"}
            >
                <div key={props.label}>{i18n.t('Style.restore_theme_color')}</div>
            </Button>
        </FormGroup>);
};

export const Font = (button, onChange, props) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label1_' + button.__name}> {i18n.t('Style.font')} </ControlLabel>
            <FontPicker
                apiKey={"AIzaSyCnIyhIyDVg6emwq8XigrPKDPgueOrZ4CE"}
                activeFont={props.value.hasOwnProperty('custom') ? props.value.font : props.value}
                options={{ themeFont: getThemeFont(props.theme) }}
                onChange={onChange}
            />
        </FormGroup>
    );
};

export const Theme = (button, onChange, props) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}> {i18n.t('Style.theme')} </ControlLabel>
            <ThemePicker
                key={'theme-picker' + props.label}
                currentTheme={props.currentTheme}
                currentItem={props.currentItem}
                onChange={onChange}
            />
        </FormGroup>
    );
};

export const Text = (button, onChange, props) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}> {button.__name} </ControlLabel>
            <FormControl
                {...props}
                onChange={onChange}
            />
        </FormGroup>
    );
};

export const ConditionalText = (button, props, onChange) => {
    return (
        <FormGroup key={button.__name} style={{ display: (props.accordionChecked ? "block" : "none") }}>
            {button.displayName && <ControlLabel key={'label_' + button.__name}>{button.__name}</ControlLabel>}
            <span key={'output_span_' + button.__name} className={'rangeOutput'}>
                {button.actualType === 'range' ? button.value : null}
            </span>
            {delete props.accordionChecked}
            <FormControl {...props} onChange={onChange}/>
        </FormGroup>
    );
};

export const Size = (button, onChange, props, accordionKeys, buttonKey, toolbar_plugin_state, toolbar_props, auto, autoSizeChange, unitsChange) => {
    if (accordionKeys[0] === 'structure' && (buttonKey === 'width' || buttonKey === 'height')) {
        let advancedPanel = (
            <FormGroup style={{ display: button.hide ? 'none' : 'block' }}>
                <ToggleSwitch label={i18n.t("Auto")}
                    checked={toolbar_plugin_state.structure[buttonKey] === "auto"}
                    onChange={autoSizeChange}/>
                {/* Disable px size in slides*/}
                {isSlide(toolbar_props.navItems[toolbar_props.navItemSelected].type) ?
                    (<span/>) :
                    (<div><br/>
                        <ControlLabel>{i18n.t("Units")}</ControlLabel>
                        <FormControl componentClass='select'
                            value={toolbar_plugin_state.structure[buttonKey + "Unit"]}
                            onChange={unitsChange}>
                            <option value="px">{i18n.t("Pixels")}</option>
                            <option value="%">{i18n.t("Percentage")}</option>
                        </FormControl></div>)}
            </FormGroup>
        );
        return (
            <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
                <ControlLabel key={"label_" + button.__name}>
                    {button.__name + (!auto ? " (" + toolbar_plugin_state.structure[buttonKey + "Unit"] + ")" : "")}
                </ControlLabel>
                <InputGroup>
                    <FormControl {...props} onChange={onChange}/>
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
    return null;
};

export const External = (button, props, toolbar_props, onChange) => {
    return (
        <ToolbarFileProvider
            id={toolbar_props.boxSelected}
            key={button.__name}
            formControlProps={props}
            openModal={toolbar_props.handleModals.openFileModal}
            buttontext={i18n.t('importFile.title')}
            fileModalResult={toolbar_props.fileModalResult}
            onChange={onChange}
            accept={button.accept}
            hide={button.hide}
        />);
};

export const Range = (button, props, onChange) => {
    props.className = "rangeInput";
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}> {button.__name} </ControlLabel>
            <span key={'output_span' + button.__name}
                className={'rangeOutput'}>{button.type === 'range' ? button.value : null}</span>
            <FormControl
                {...props}
                onChange={onChange}
            />
        </FormGroup>
    );
};

export const MySelect = (button, props, onChange) => {
    if (!button.multiple) {
        let children = button.options.map((option, index) => {
            let label = button.labels && button.labels[index] ? button.labels[index] : option;
            return (<option key={'child_' + index} value={option}>{label}</option>);
        });
        props.componentClass = 'select';
        return (
            <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
                <ControlLabel key={'label_' + button.__name}>{button.__name}</ControlLabel>
                <FormControl {...props} onChange={onChange}>{children}</FormControl>
            </FormGroup>
        );
    }
    props.multiple = 'multiple';
    props.options = button.options;
    props.multi = true;
    props.simpleValue = true;
    props.placeholder = i18n.t('MySelect');
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}>{button.__name}</ControlLabel>
            <Select {...props}/>
        </FormGroup>
    );
};

export const MyRadio = (button, props, onChange) => {
    props.style = props.style
        ? { ...props.style, style: { display: button.hide ? 'none' : 'block' } }
        : { style: { display: button.hide ? 'none' : 'block' } };
    let children = button.options.map((radio, index) => {
        return (
            <Radio key={index} name={button.__name} value={index} id={button.__name + radio}
                onChange={onChange} checked={button.value === button.options[index]}>
                {button.labels && button.labels[index] ? button.labels[index] : radio}
            </Radio>);
    });
    return (
        <FormGroup {...props} onChange={onChange}>
            <ControlLabel key={'child_0'}>{button.__name}</ControlLabel>
            {children}
        </FormGroup>
    );
};

export const FancyRadio = (button, buttonKey, toolbar_props) => {
    if (buttonKey === '__verticalAlign') {
        return (
            <RadioButtonFormGroup
                key={button.__name}
                title={button.__name}
                options={button.options}
                selected={button.value}
                click={opt => toolbar_props.handleBoxes.onVerticallyAlignBox(toolbar_props.boxSelected, opt)}
                tooltips={button.tooltips}
                icons={button.icons}
            />
        );
    }
    return null;
};

export const BackgroundPicker = (button, props, toolbar_props, isURI, isColor, default_background, isSli, background_attr, background_attr_zoom, onChange) => {
    const ImageDisplay = (options) => {
        return (
            <div key={'radioDislay'}>
                {options.map((option, i) => {
                    return (
                        <Radio key={i + '_' + option}
                            name={'image_display'}
                            checked={background_attr === option}
                            style={{ display: isColor ? "none" : "block" }}
                            onChange={onChange} value={option}>
                            {i18n.t(`background.${option}`)}
                        </Radio>
                    );
                })}
            </div>
        );
    };
    const ImagePicker = (
        <div key={'container_' + button.__name} style={{ display: 'block' }}>
            <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
                <ToolbarFileProvider
                    id={toolbar_props.navItemSelected}
                    key={button.__name}
                    formControlProps={{ ...props }}
                    label={'URL'}
                    value={(isURI || isColor || (props.value?.match && !props.value.match('http'))) ? '' : props.value.background}
                    openModal={toolbar_props.handleModals.openFileModal}
                    fileModalResult={toolbar_props.fileModalResult}
                    buttontext={i18n.t('importFile.title')}
                    onChange={onChange}
                    accept={"image/*"}
                />
            </FormGroup>
            {!isColor && ImageDisplay(['full', 'repeat', 'centered'])}
        </div>
    );
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label1_' + button.__name}>{i18n.t('background.background_color')}</ControlLabel>
            <ColorPicker
                key={'cpicker_' + props.label}
                value={(isColor && props.value) ? props.value.background : default_background}
                onChange={onChange}
            />
            {isSli && ImagePicker}
            {(!isColor && background_attr !== "full") && [
                <ControlLabel key={'label_zoom'}>{i18n.t('background.background_zoom')}</ControlLabel>,
                <span className="rangeOutput" style={{ marginTop: 0 }}>{background_attr_zoom}%</span>,
                <input key="image_display_zoom" name='image_display_zoom' type='range' min={1} max={200}
                    value={background_attr_zoom} style={{ display: isColor ? "none" : "block" }}
                    onChange={onChange}/>,
            ]}
            <br key={'br'}/>
            <ControlLabel key={'label_' + button.__name}>{i18n.t('background.reset_background')}</ControlLabel>
            <Button key={'button_' + button.__name} value={default_background} onClick={onChange}
                className={'toolbarButton'}>
                <div key={props.label}>{i18n.t('background.reset_background')}</div>
            </Button>
        </FormGroup>
    );
};

export const DefaultComponent = (button, props, onChange = undefined) => {
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label_' + button.__name}>{button.__name}</ControlLabel>
            <FormControl {...props} onChange={onChange || props.onChange}/>
        </FormGroup>
    );
};

/* eslint-enable react/prop-types */

