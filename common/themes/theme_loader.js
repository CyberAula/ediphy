import loadFont from './font_loader';
import { setRgbaAlpha } from "../common_tools";

export function generateThemes() {
    let THEMES = {};
    let CONFIG = require('../../core/config');
    CONFIG.default.themeList.map((theme, index) => {
        THEMES[theme] = require(`./${theme}/${theme}`).DEFINITION;
    });

    return THEMES;
}

export function getThemeTemplates(theme) {
    let definition = require(`./${theme}/${theme}`).DEFINITION;
    return definition.templates ? definition.templates : [];
}

export function loadTheme(theme) {
    let font = THEMES[theme] ? THEMES[theme].font : 'Ubuntu Sans';
    loadFont(font);
}

export function getThemes() {
    return Object.keys(THEMES);
}

export function getThemeColors(theme) {
    return THEMES[theme].colors;
}

export function getThemeImages(theme = 'default') {
    return THEMES[theme].images;
}

export function getColor(theme, colorOrder = 1) {
    let colorKey = Object.keys(THEMES[theme].colors)[colorOrder - 1];
    return THEMES[theme].colors[colorKey];
}

export function getCurrentColor(theme, colorOrder = 1) {
    let colorKey = Object.keys(THEMES[theme].colors)[colorOrder - 1];
    let styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--' + colorKey);
}

export function getCurrentFont() {
    let styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue('--themePrimaryFont');
}

export function generateCustomColors(color, colorOrder = 1, generateTransparents = true) {
    let colorName = '--themeColor' + colorOrder;
    let colorTransparentName = colorName + 'Transparent';
    return generateTransparents ? { [ colorName ]: color, [colorTransparentName]: setRgbaAlpha(color, 0.15) } : { [colorName]: color };
}

export function generateCustomFont(font) {
    return { '--themePrimaryFont': font };
}

export function getThemeFont(theme = 'default') {
    return THEMES[theme].font;
}

export function sanitizeThemeToolbar(toolbar, styleConfig = {}) {
    let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;

    return {
        ...toolbar,
        theme: theme,
        colors: toolbar.colors ? toolbar.colors : 0,
        font: toolbar.font ? toolbar.font : styleConfig.font,
    };
}

export const THEMES = generateThemes();

