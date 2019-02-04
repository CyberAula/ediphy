let WebFont = require('webfontloader');

const loadFont = (font) => {
    console.log('loading fonts...');
    console.log(font);
    WebFont.load({
        google: {
            families: [font],
        },
    });
};

export default loadFont;
