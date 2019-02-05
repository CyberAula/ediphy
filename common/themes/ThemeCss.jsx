import React from 'react';
export default class ThemeCss extends React.Component {
    render() {

        console.log('ThemeCss');
        console.log(this.props.theme);
        return <link rel="stylesheet" type="text/css" href={customCss} />;
    }
}
