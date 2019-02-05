import { THEMES } from './theme_loader';

export function loadBackground(theme = 'default', back = 0, visor = false) {
    back = back ? getThemeBackgrounds(theme).indexOf(back) : 0;
    return (THEMES[theme] && THEMES[theme].background) ? THEMES[theme].background[back] : '#ffffff';
}

export function isBackgroundColor(theme, back = 0) {
    return (THEMES[theme] && THEMES[theme].background && THEMES[theme].background[back] && THEMES[theme].background[back].indexOf('url') === -1);
}

export function loadBackgroundStyle(show, toolbar, visor = false) {

    let isColor = toolbar && (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(toolbar.background);
    let isCustom = toolbar && toolbar.customBackground;
    let isCustomColor = (toolbar && toolbar.theme) ? isBackgroundColor(toolbar.theme) : false;
    let { background, backgroundAttr, backgroundZoom, theme, theme_background } = toolbar;

    let visibility = show ? 'visible' : 'hidden';
    let backgroundColor = isCustom ? isColor ? background : '' : isCustomColor ? loadBackground(theme, theme_background) : '';
    let backgroundImage = isCustom ? !isColor ? 'url(' + background + ')' : '' : !isCustomColor ? loadBackground(theme, theme_background) : '';
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
