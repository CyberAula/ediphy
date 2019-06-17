let WebFont = require('webfontloader');

const loadFont = (font) => {
    WebFont.load({
        google: {
            families: [font],
        },
    });
};

export default loadFont;
