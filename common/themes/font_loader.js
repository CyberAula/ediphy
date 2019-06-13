let WebFont = require('webfontloader');

const loadFont = (font) => {
    console.log('loading font: ' + font);
    WebFont.load({
        google: {
            families: [font],
        },
    });
};

export default loadFont;
