import loadFont from './font_loader';
import { setRgbaAlpha } from "../common_tools";

/* export const THEMES = {
    default: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Ubuntu',
        background: [
            '#FFFFFF',
        ],
        colors: {
            themeColor1: '#17CFC8',
            themeColor2: '#ff444d',
            themeColor3: '#4bff9f',
            themeColor4: '#65caff',
            themeColor5: '#ffbe45',
        },
        images: {
            template1: { left: 'colors_texture.jpg' },
            template3: { topLeft: 'forest.jpg', topRight: 'jungle.jpg', bottomLeft: 'desert.jpg', bottomRight: 'meadow.jpg' },
            template7: { left: 'placeholder.svg' },
        },
    },
    orange: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Merriweather',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
        colors: {
            themeColor1: '#D1550F',
            themeColor2: '#17CFC8',
        },
        images: {
            template1: { left: '' },
            template3: { topLeft: 'fruit1.jpg', topRight: 'fruit2.jpg', bottomLeft: 'fruit3.jpeg', bottomRight: 'fruit4.jpg' },
            template7: { left: '' },
        },
    },
    test0: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Indie Flower',
        background: [
            "green",
        ],
        colors: {
            themeColor1: '#AFB2B1',
            themeColor2: 'grey',
        },
        images: {
            template1: { left: '' },
            template3: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
            template7: { left: '' },
        },
    },
    test1: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Amatic SC',
        background: [
            'url(/themes/test2/background_images/blur2.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
        images: {
            template1: { left: '' },
            template3: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
            template7: { left: '' },
        },
    },
    test2: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Great Vibes',
        background: [
            'url(/themes/test2/background_images/blur0.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
        images: {
            template1: { left: '' },
            template3: { topLeft: '', topRight: '', bottomLeft: '', bottomRight: '' },
            template7: { left: '' },
        },
    },
    test3: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Anton',
        background: [
            'url(/themes/test3/background_images/test30.jpg)',
            'url(/themes/test3/background_images/test30.jpg)',
            'orange',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
    },
    test4: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Lobster',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
    },
    test5: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
    },
    test6: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Orbitron',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
    },
    test7: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        font: 'Poiret One',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themeColor1: 'black',
            themeColor2: 'black',
        },
    },

};*/

export function generateThemes() {
    let THEMES = {};
    let CONFIG = require('../../core/config');
    CONFIG.default.themeList.map((theme, index) => {
        THEMES[theme] = require(`./${theme}/${theme}`).DEFINITION;
    });

    return THEMES;
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

    // let colorOrderStr = colorOrder === 1 ? 'Primary' : colorOrder === 2 ? 'Secondary' : colorOrder.toString();
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
        colors: toolbar.colors ? toolbar.colors : getThemeColors(theme),
        font: toolbar.font ? toolbar.font : getThemeFont(theme),
    };
}

export const THEMES = generateThemes();

