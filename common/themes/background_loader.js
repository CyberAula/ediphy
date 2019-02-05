import { THEMES } from './theme_loader';

export function loadBackground(theme = 'default', index = 0) {
    return (THEMES[theme] && THEMES[theme].background) ? THEMES[theme].background[index] : '#ffffff';
}

export function isBackgroundColor(theme, index = 0) {
    return (THEMES[theme] && THEMES[theme].background && THEMES[theme].background[index] && THEMES[theme].background[index].indexOf('url') === -1);
}

export function loadBackgroundStyle(show, toolbar, visor = false) {

    let { background, backgroundAttr, backgroundZoom, theme, themeBackground } = toolbar;
    let index = getBackgroundIndex(theme, themeBackground);

    let isColor = toolbar && (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(background);
    let isCustom = toolbar && toolbar.customBackground;
    let isCustomColor = (toolbar && theme) ? isBackgroundColor(theme, index) : false;

    let visibility = show ? 'visible' : 'hidden';
    let backgroundColor = isCustom ? isColor ? background : '' : isCustomColor ? loadBackground(theme, index) : '';
    let backgroundImage = isCustom ? !isColor ? background : '' : !isCustomColor ? loadBackground(theme, index) : '';
    let backgroundSize = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'repeat')) ? (backgroundZoom !== undefined ? (backgroundZoom + '%') : '100%') : 'cover';
    let backgroundRepeat = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'full')) ? 'no-repeat' : 'repeat';
    let backgroundPosition = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'full')) ? 'center center' : '0% 0%';
    let zIndex = visor ? '' : '0';

    return { visibility, backgroundColor, backgroundSize, backgroundRepeat, backgroundPosition, zIndex, backgroundImage };
}

export function getThemeBackgrounds(theme) {
    theme = (theme === undefined || theme === null) ? 'default' : theme;
    return THEMES[theme].background;
}

export function getBackgroundIndex(theme = 'default', back = 0) {
    return back ? getThemeBackgrounds(theme).indexOf(back) : 0;
}

export function getBackground(theme = 'default', index = 0) {
    return THEMES[theme].background[index];
}
