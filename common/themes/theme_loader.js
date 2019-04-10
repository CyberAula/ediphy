import loadFont from './font_loader';
import { setRgbaAlpha } from "../common_tools";

export const THEMES = {
    default: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Ubuntu',
        background: [
            "white",
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    orange: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Merriweather',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
        colors: {
            themePrimaryColor: '#D1550F',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test0: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Indie Flower',
        background: [
            "green",
        ],
        colors: {
            themePrimaryColor: '#AFB2B1',
            themeSecondaryColor: 'grey',
        },
    },
    test1: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Amatic SC',
        background: [
            'url(/themes/test2/background_images/blur2.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test2: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Great Vibes',
        background: [
            'url(/themes/test2/background_images/blur0.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test3: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Anton',
        background: [
            'url(/themes/test3/background_images/test30.jpg)',
            'url(/themes/test3/background_images/test30.jpg)',
            'orange',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test4: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Lobster',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test5: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test6: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Orbitron',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },
    test7: {
        viewName: ['EDiphy classic', 'EDiphy clásico'],
        fonts: 'Poiret One',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: 'black',
            themeSecondaryColor: 'black',
        },
    },

};

export function loadTheme(theme) {
    let font = THEMES[theme] ? THEMES[theme].fonts : 'Ubuntu Sans';
    loadFont(font);
}

export function getThemes() {
    return Object.keys(THEMES);
}

export function getThemeColors(theme) {
    return THEMES[theme].colors;
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
    let colorOrderStr = colorOrder === 1 ? 'Primary' : colorOrder === 2 ? 'Secondary' : colorOrder.toString();
    let colorName = '--theme' + colorOrderStr + 'Color';
    let colorTransparentName = colorName + 'Transparent';
    return generateTransparents ? { [ colorName ]: color, [colorTransparentName]: setRgbaAlpha(color, 0.15) } : { [colorName]: color };
}

export function generateCustomFont(font) {
    return { '--themePrimaryFont': font };
}

export function getThemeFont(theme = 'default') {
    return THEMES[theme].fonts;
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

