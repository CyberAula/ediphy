import React from 'react';
import PropTypes from "prop-types";
import { getThemeColors, getThemeFont, THEMES } from './theme_loader';
import loadFont from './font_loader';
import { setRgbaAlpha } from "../common_tools";
import { translatePxToEm } from "./cssParser";
import { getThemeBackgrounds } from "./background_loader";

export default class ThemeCSS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            css: '',
            themesStartIndex: {},
            currentThemeCSS: '',
        };
        this.loadCSS = this.loadCSS.bind(this);
        this.processCSS = this.processCSS.bind(this);
        this.getThemeCSS = this.getThemeCSS.bind(this);
        this.updateCustomProperty = this.updateCustomProperty.bind(this);
        this.loadColorsCustomProperties = this.loadColorsCustomProperties.bind(this);

        this.loadCSS();
    }

    componentWillMount() {
        this.loadCSS();
        let colors = Object.keys(this.props.toolbar.colors).length ? this.props.toolbar.colors : THEMES[this.props.theme].colors;
        let font = this.props.toolbar.font ? this.props.toolbar.font : this.props.styleConfig.font ? this.props.styleConfig.font : getThemeFont(this.props.toolbar.theme);
        this.loadColorsCustomProperties(colors);
        loadFont(font);
        this.updateCustomProperty('--themePrimaryFont', font);
    }

    componentDidUpdate(prevProps, prevState) {

        let selectedItemChanged = prevProps.toolbar.id !== this.props.toolbar.id;
        let styleConfigChanged = prevProps.styleConfig.theme !== this.props.styleConfig.theme || prevProps.styleConfig.font !== this.props.styleConfig.font || prevProps.styleConfig.color !== this.props.styleConfig.color;

        let itemThemeChanged = prevProps.theme !== this.props.theme;
        let itemFontChanged = prevProps.toolbar.font !== this.props.toolbar.font;
        let itemColorChanged = prevProps.toolbar.colors !== this.props.toolbar.colors;

        if (itemThemeChanged || selectedItemChanged || styleConfigChanged) {
            let theme = this.props.theme ? this.props.theme : this.props.styleConfig.theme;
            this.getThemeCSS(theme);
            this.loadColorsCustomProperties(getThemeColors(theme));
            loadFont(getThemeFont(theme));
            if(!prevProps.toolbar.font || !prevProps.toolbar.theme || prevProps.toolbar.font === getThemeFont(prevProps.theme)) {
                this.updateCustomProperty('--themePrimaryFont', getThemeFont(theme));
            }
        }

        if (itemColorChanged || selectedItemChanged || styleConfigChanged) {
            let isCustomColor = Object.values(this.props.toolbar.colors).length !== 0;
            let colors = isCustomColor ? this.props.toolbar.colors : { themePrimaryColor: this.props.styleConfig.color };
            this.loadColorsCustomProperties(colors);
        }

        if (itemFontChanged || selectedItemChanged || styleConfigChanged) {
            let isCustomFont = this.props.toolbar.font;
            let font = isCustomFont ? this.props.toolbar.font : this.props.styleConfig.font;
            loadFont(font);
            this.updateCustomProperty('--themePrimaryFont', font);
        }
    }

    loadCSS() {
        fetch(`/theme.css`) // Webpack output CSS
            .then(res => res.text())
            .then(data => {
                let processedData = this.processCSS(data);
                this.setState({ themesStartIndex: processedData.themesStartIndex, css: processedData.safeCSS }, () => {
                    this.getThemeCSS(this.props.theme);
                });
            });
    }

    processCSS(css) {
        let lines = css.split('\n');
        let themesStartIndex = {};
        let themeNames = Object.keys(THEMES);
        let safeCSS = lines.map((line, index) => {
            line = line.includes('{') ? '.safeZone ' + line : translatePxToEm(line);
            if (line.includes('.' + themeNames[0])) {
                themesStartIndex[themeNames[0]] = index;
                themeNames.splice(0, 1);
            }
            return line;
        });

        return { safeCSS, themesStartIndex };
    }

    getThemeCSS(theme) {
        let { css, themesStartIndex } = this.state;
        let themeNames = Object.keys(THEMES);

        let isLastTheme = themeNames.indexOf(theme) === themeNames.length - 1;
        let nextLevel = themeNames[(themeNames.indexOf(theme) + 1)];
        let nextLevelIndex = isLastTheme ? css.length : themesStartIndex[nextLevel];
        let currentThemeIndex = themesStartIndex[theme];

        let chunkArr = css.slice(currentThemeIndex, nextLevelIndex);
        let chunkStr = Object.values(chunkArr).reduce((l1, l2) => l1 + '\n' + l2);

        this.setState({ currentThemeCSS: chunkStr });
    }

    updateCustomProperty(property, newValue) {
        document.documentElement.style.setProperty(property, newValue);
    }

    loadColorsCustomProperties(colors) {
        Object.keys(colors).map((cPropKey) => {
            this.updateCustomProperty('--' + cPropKey, colors[cPropKey]);
            this.updateCustomProperty('--' + cPropKey + 'Transparent', setRgbaAlpha(colors[cPropKey], 0.15));
        });
    }

    render() {
        return <style dangerouslySetInnerHTML={{
            __html: this.state.currentThemeCSS,
        }}/>;
    }
}

ThemeCSS.propTypes = {
    /**
     * Current theme
     */
    theme: PropTypes.string.isRequired,
    /**
     * Current selected view (by ID)
     */
    toolbar: PropTypes.any.isRequired,
};
