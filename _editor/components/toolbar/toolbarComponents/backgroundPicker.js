import React from "react";
import i18n from "i18next";
import { Button, ControlLabel, FormGroup, Radio } from "react-bootstrap";

import ToolbarFileProvider from "../../externalProvider/fileModal/APIProviders/common/ToolbarFileProvider";
import ColorPicker from "../../common/colorPicker/ColorPicker";

import { handleCanvasToolbar } from "../../../../core/editor/toolbar/handleCanvasToolbar";
import { isColor, isSlide, isURI } from "../../../../common/utils";
/* eslint-disable react/prop-types */
export const BackgroundPicker = (button, props, toolbarProps, id, defaultBackground, onChange) => {

    let isSli = isSlide(toolbarProps.navItems[id].type);
    let background_attr = toolbarProps.viewToolbars[id].backgroundAttr;
    let background_attr_zoom = toolbarProps.viewToolbars[id].backgroundZoom ?? 100;

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
                    id={toolbarProps.navItemSelected}
                    key={button.__name}
                    formControlProps={{ ...props }}
                    label={'URL'}
                    value={(isURI || isColor || (props.value?.match && !props.value.match('http'))) ? '' : props.value.background}
                    openModal={toolbarProps.handleModals.openFileModal}
                    fileModalResult={toolbarProps.fileModalResult}
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
                value={(isColor && props.value) ? props.value.background : defaultBackground}
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
            <Button key={'button_' + button.__name} value={defaultBackground} onClick={onChange}
                className={'toolbarButton'}>
                <div key={props.label}>{i18n.t('background.reset_background')}</div>
            </Button>
        </FormGroup>
    );
};

export function handleBackground(e, toolbarProps, accordion, buttonKey, commitChanges, button, id) {
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
}
/* eslint-enable react/prop-types */
