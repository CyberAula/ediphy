import loadFont from './font_loader';

export const THEMES = {
    default: {
        fonts: 'Ubuntu',
    },
    orange: {
        fonts: 'Merriweather',
    },
    test0: {
        fonts: 'Indie Flower',
    },
    test1: {
        fonts: 'Amatic SC',
    },
    test2: {
        fonts: 'Great Vibes',
    },
    test3: {
        fonts: 'Anton',
    },
    test4: {
        fonts: 'Lobster',
    },
    test5: {
        fonts: 'Amatic SC',
    },
    test6: {
        fonts: 'Orbitron',
    },
    test7: {
        fonts: 'Poiret One',
    },

};

export function loadTheme(theme) {
    let font = THEMES[theme] ? THEMES[theme].fonts : 'Ubuntu Sans';
    loadFont(font);
}

export function getThemes() {
    return Object.keys(THEMES);
}

