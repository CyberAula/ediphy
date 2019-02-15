import React from 'react';
import { THEMES } from './theme_loader';
import PropTypes from "prop-types";

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
        this.loadThemeCustomProperties = this.loadThemeCustomProperties.bind(this);

        this.loadCSS();
    }

    componentWillMount() {
        this.loadCSS();
        this.loadThemeCustomProperties();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.theme !== this.props.theme) {
            this.getThemeCSS(nextProps.theme);
        }

        if (nextProps.toolbar.colors.themePrimaryColor !== this.props.toolbar.colors.themePrimaryColor) {
            this.updateCustomProperty('--themePrimaryColor', nextProps.toolbar.colors.themePrimaryColor);
        }

        if (nextProps.toolbar.colors.themeSecondaryColor !== this.props.toolbar.colors.themeSecondaryColor) {
            this.updateCustomProperty('--themeSecondaryColor', nextProps.toolbar.colors.themeSecondaryColor);
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
            if (!line.includes('{')) {
                return line;
            }
            line = '.safeZone ' + line;
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
        let nextLevelIndex = isLastTheme ? css.length() : themesStartIndex[nextLevel];
        let currentThemeIndex = themesStartIndex[theme];

        let chunkArr = css.slice(currentThemeIndex, nextLevelIndex);
        let chunkStr = Object.values(chunkArr).reduce((l1, l2) => l1 + '\n' + l2);

        this.setState({ currentThemeCSS: chunkStr });
    }

    updateCustomProperty(property, newValue) {
        document.documentElement.style.setProperty(property, newValue);
    }

    loadThemeCustomProperties() {
        let colors = THEMES[this.props.theme].colors;

        Object.keys(colors).map((cPropKey) => {
            this.updateCustomProperty('--' + cPropKey, colors[cPropKey]);
        });
    }

    render() {
        return <style dangerouslySetInnerHTML={{
            __html: this.state.currentThemeCSS,
        }} />;
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
