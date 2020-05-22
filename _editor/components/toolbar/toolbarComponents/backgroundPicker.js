import React from "react";
import i18n from "i18next";
import { ControlLabel, FormGroup, Radio } from "react-bootstrap";

import ToolbarFileProvider from "../../externalProvider/fileModal/APIProviders/common/ToolbarFileProvider";
import ColorPicker from "../../common/colorPicker/ColorPicker";

import { handleCanvasToolbar } from "../../../../core/editor/toolbar/handleCanvasToolbar";
import { isColor, isSlide, isURI } from "../../../../common/utils";
import _handlers from "../../../handlers/_handlers";
import { RangeOutput, ToolbarButton } from "./Styles";
/* eslint-disable react/prop-types */
export const BackgroundPicker = (button, props, toolbar, id, defaultBackground, onChange) => {

    const isSli = isSlide(toolbar.props.navItemsById[id].type);
    const isBackURI = isURI(props.value.background);
    const isBackColor = isColor(props.value.background);

    const { backgroundAttr, backgroundZoom = 100 } = toolbar.props.viewToolbarsById[id];

    let h = _handlers(toolbar);
    const ImageDisplay = (options) => {
        return (
            <div key={'radioDislay'}>
                {options.map((option, i) => {
                    return (
                        <Radio key={i + '_' + option}
                            name={'image_display'}
                            checked={backgroundAttr === option}
                            style={{ display: isBackColor ? "none" : "block" }}
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
                    id={toolbar.props.navItemSelected}
                    key={button.__name}
                    formControlProps={{ ...props }}
                    label={'URL'}
                    value={(isBackURI || isBackColor || (props.value?.match && !props.value.match('http'))) ? '' : props.value.background}
                    openModal={h.openFileModal}
                    fileModalResult={toolbar.props.fileModalResult}
                    buttontext={i18n.t('importFile.title')}
                    onChange={onChange}
                    accept={"image/*"}
                />
            </FormGroup>
            {!isColor(props.value.background) && ImageDisplay(['full', 'repeat', 'centered'])}
        </div>
    );
    return (
        <FormGroup key={button.__name} style={{ display: button.hide ? 'none' : 'block' }}>
            <ControlLabel key={'label1_' + button.__name}>{i18n.t('background.backgroundColor')}</ControlLabel>
            <ColorPicker
                key={'cpicker_' + props.label}
                value={(isBackColor && props.value) ? props.value.background : defaultBackground}
                onChange={onChange}
            />
            {isSli && ImagePicker}
            {(!isBackColor && backgroundAttr !== "full") && [
                <ControlLabel key={'label_zoom'}>{i18n.t('background.backgroundZoom')}</ControlLabel>,
                <RangeOutput style={{ marginTop: 0 }}>{backgroundZoom}%</RangeOutput>,
                <input key="image_display_zoom" name='image_display_zoom' type='range' min={1} max={200}
                    value={backgroundZoom} style={{ display: isBackColor ? "none" : "block" }}
                    onChange={onChange}/>,
            ]}
            {/* <br key={'br'}/>*/}
            <ControlLabel key={'label_' + button.__name}>{i18n.t('background.resetBackground')}</ControlLabel>
            <ToolbarButton key={'button_' + button.__name} value={defaultBackground} onClick={onChange}>
                <div key={props.label}>{i18n.t('background.resetBackground')}</div>
            </ToolbarButton>
        </FormGroup>
    );
};

export function handleBackground(e, toolbar, accordion, buttonKey, commitChanges, button, id) {
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
            backgroundAttr: (toolbar.props.viewToolbarsById[id].backgroundAttr) ? toolbar.props.viewToolbarsById[id].backgroundAttr : 'repeat',
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
                    }, accordion, toolbar);
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
