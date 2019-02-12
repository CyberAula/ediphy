import React from 'react';
export default class ThemeCss extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            css: '',
            themes: {},
        };
        this.publishThemeStyle = this.publishThemeStyle.bind(this);
        this.loadThemes = this.loadThemes.bind(this);
        this.addClass = this.addClass.bind(this);
        this.processCSS = this.processCSS.bind(this);

        this.loadThemes();

    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.theme !== this.props.theme) {
            // this.publishThemeStyle(nextProps.theme);
        }
    }

    loadThemes() {
        fetch(`/theme.css`)
            .then(res => res.text())
            .then(data => {
                console.log('CSS GENERATED');
                console.log(this.processCSS(data).reduce((a, b) => a + '\n' + b));
            });
    }

    addClass(line, newClass) {
        return '.' + newClass + ' ' + line;
    }

    processCSS(css) {
        let lines = css.split('\n');
        return lines.map(line => {
            if (!line.includes('{')) {
                return line;
            }
            line = this.addClass(line, 'wrapped');
            return line;

        });
    }

    publishThemeStyle(theme) {
        fetch(`/theme.css`)
            .then(response => response.text())
            .then((data) => {
                let lines = data.split('\n');
                let linesTabbed = lines.map((line) => '\n\t' + line);
                let innerString = linesTabbed.reduce((a, b) => (b === '\n\t') ? a : a + b);
                let themeCss = '.wrapped {' + innerString + '\n}';

                this.setState({ css: themeCss });
            });

    }

    render() {
        return <style dangerouslySetInnerHTML={{
            __html: this.state.css,
        }} />;
    }
}
