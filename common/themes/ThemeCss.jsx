import React from 'react';
import Sass from 'sass.js';
export default class ThemeCss extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            css: '',
        };
        this.publishThemeStyle = this.publishThemeStyle.bind(this);
        this.publishThemeStyle(this.props.theme);
    }

    componentWillUpdate(nextProps, nextState) {
        console.log(nextProps.theme, this.props.theme);
        if (nextProps.theme !== this.props.theme) {
            this.publishThemeStyle(nextProps.theme);
        }
    }

    publishThemeStyle(theme) {
        fetch(`/themes/${theme}/${theme}.scss`)
            .then(response => response.text())
            .then((data) => {
                let lines = data.split('\n');
                let linesTabbed = lines.map((line) => '\n\t' + line);
                let innerString = linesTabbed.reduce((a, b) => (b === '\n\t') ? a : a + b);
                let themeCss = '.wrapped {' + innerString + '\n}';
                let self = this;

                Sass.compile(themeCss, function(result) {
                    console.log(result.text);
                    if (result.status === 0) {
                        self.setState({ css: result.text });
                    }
                });

            });

    }

    render() {

        console.log(this.state.css);
        return <style dangerouslySetInnerHTML={{
            __html: this.state.css,
        }} />;
    }
}
