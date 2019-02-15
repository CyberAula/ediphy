import loadFont from './font_loader';

export const THEMES = {
    default: {
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
        fonts: 'Merriweather',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test0: {
        fonts: 'Indie Flower',
        background: [
            "black",
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test1: {
        fonts: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test2: {
        fonts: 'Great Vibes',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test3: {
        fonts: 'Anton',
        background: [
            'url(/themes/test3/background_images/test30.jpg)',
            'url(/themes/test3/background_images/test30.jpg)',
            'orange',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test4: {
        fonts: 'Lobster',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test5: {
        fonts: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test6: {
        fonts: 'Orbitron',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
        },
    },
    test7: {
        fonts: 'Poiret One',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
        colors: {
            themePrimaryColor: '#17CFC8',
            themeSecondaryColor: '#17CFC8',
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

export function sanitizeThemeToolbar(toolbar) {
    let theme = toolbar.theme ? toolbar.theme : 'default';
    return {
        ...toolbar,
        theme: theme,
        colors: toolbar.colors ? toolbar.colors : getThemeColors(theme),
    };
}

