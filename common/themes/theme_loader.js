import loadFont from './font_loader';

export const THEMES = {
    default: {
        fonts: 'Ubuntu',
        background: [
            "white",
        ],
    },
    orange: {
        fonts: 'Merriweather',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
    },
    test0: {
        fonts: 'Indie Flower',
        background: [
            "black",
        ],
    },
    test1: {
        fonts: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },
    test2: {
        fonts: 'Great Vibes',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },
    test3: {
        fonts: 'Anton',
        background: [
            'url(/themes/test3/background_images/test30.jpg)',
            'url(/themes/test3/background_images/test30.jpg)',
            'orange',
        ],
    },
    test4: {
        fonts: 'Lobster',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },
    test5: {
        fonts: 'Amatic SC',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },
    test6: {
        fonts: 'Orbitron',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },
    test7: {
        fonts: 'Poiret One',
        background: [
            'url(/themes/orange/background_images/orange0.jpg)',
        ],
    },

};

export function loadTheme(theme) {
    let font = THEMES[theme] ? THEMES[theme].fonts : 'Ubuntu Sans';
    loadFont(font);
}

export function getThemes() {
    return Object.keys(THEMES);
}

