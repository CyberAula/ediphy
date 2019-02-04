import { THEMES } from './theme_loader';

export function loadBackground(theme, back = 0) {

    // if (THEMES[theme]){
    //     console.log('loading background...');
    //     console.log(THEMES[theme].background ? THEMES[theme].background[back] : '#ffffff');
    //     return THEMES[theme].background ? THEMES[theme].background[back] : '#ffffff';
    // } else {
    //     return '';
    // }

    return (THEMES[theme] && THEMES[theme].background) ? THEMES[theme].background[back] : '';
}
