import { THEMES } from './theme_loader';

export function loadBackground(theme = 'default', index = 0, aspectRatio = 16 / 9) {
    let i = THEMES[theme].images.hasOwnProperty('template' + index)
            && THEMES[theme].images['template' + index].background
        ? THEMES[theme].images['template' + index].background : 0;
    let ar = aspectRatio === 16 / 9 ? 'f16_9' : 'f4_3';
    return (THEMES[theme] && THEMES[theme].background && THEMES[theme].background[ar]) ? THEMES[theme].background[ar][i] : '#ffffff';
}

export function isBackgroundColor(theme, index = 0, aspectRatio = 16 / 9) {
    let ar = aspectRatio === 16 / 9 ? 'f16_9' : 'f4_3';
    let i = THEMES[theme].images.hasOwnProperty('template' + index) && THEMES[theme].images['template' + index].background ? THEMES[theme].images['template' + index].background : 0;
    return (THEMES[theme] && THEMES[theme].background && THEMES[theme].background[ar].hasOwnProperty(i) && THEMES[theme].background[ar][i].indexOf('url') === -1);
}

export function getThemeBackgrounds(theme) {
    theme = (theme === undefined || theme === null) ? 'default' : theme;
    return THEMES[theme].background;
}

export function getBackgroundIndex(theme = 'default', back = 0) {
    return back ? getThemeBackgrounds(theme).indexOf(back) : 0;
}

export function getBackground(theme = 'default', index = 0, aspectRatio = 16 / 9) {
    let i = THEMES[theme].images.hasOwnProperty('template' + index) && THEMES[theme].images['template' + index].background ? THEMES[theme].images['template' + index].background : 0;
    let ar = aspectRatio === 16 / 9 ? 'f16_9' : 'f4_3';
    return THEMES[theme].background[ar][i];
}

export function loadBackgroundStyle(show, toolbar, styleConfig = {}, visor = false, aspectRatio = 16 / 9, index = 0) {
    let { background, backgroundAttr, backgroundZoom } = toolbar;
    let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;

    index = !isNaN(index) ? index : 0;
    let isColor = toolbar && (/(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/ig).test(background);
    let isCustom = toolbar && toolbar.customBackground;
    let isCustomColor = (toolbar && theme) ? isBackgroundColor(theme, index, aspectRatio) : false;

    let urlImage = background.indexOf('url') === -1 && background.indexOf('image/jpeg') !== -1 ? 'url(' + background + ')' : background;
    let visibility = show ? 'visible' : 'hidden';
    let backgroundColor = isCustom ? isColor ? background : '' : isCustomColor ? loadBackground(theme, index, aspectRatio) : '';
    let backgroundImage = isCustom ? !isColor ? urlImage : '' : !isCustomColor ? loadBackground(theme, index, aspectRatio) : '';
    let backgroundSize = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'repeat')) ? (backgroundZoom !== undefined ? (backgroundZoom + '%') : '100%') : 'cover';
    let backgroundRepeat = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'full')) ? 'no-repeat' : 'repeat';
    let backgroundPosition = (toolbar && background && (backgroundAttr === 'centered' || backgroundAttr === 'full')) ? 'center center' : '0% 0%';
    let zIndex = visor ? '' : '0';
    return { visibility, backgroundColor, backgroundSize, backgroundRepeat, backgroundPosition, zIndex, backgroundImage };
}

export function loadBackgroundStylePreview(theme) {
    let background = loadBackground(theme, 0);
    return { [background.indexOf('url') === -1 ? 'backgroundColor' : 'backgroundImage']: background, backgroundSize: "cover", fontSize: '7px', height: '100%' };
}
