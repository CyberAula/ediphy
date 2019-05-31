
export const DEFINITION = {
    /*
    * viewName: [<Nombre del tema en inglés>, <Nombre del tema es español>],
    * font: Fuente principal del tema (tiene que ser de Google Fonts),
    * background: [
    *   Insertar colores o url a las imágenes del tema. Por ejemplo: 'url(/themes/orange/background_images/orange0.jpg)',...
    * ],
    * colors: {
    *   themeColor1: color principal del tema,
    *   themeColor2:
    *   themeColor3:
    *   themeColor4:
    *   themeColor5:
    * },
    * images: {
    *   template1: { left: '' },
    *   template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
    *   template7: { left: '' },
    * }
    * */
    viewName: ['Natural', 'Natural'],
    font: 'Indie Flower',
    background: {
        f16_9: [
            'url(/themes/natural/background_images/natural_169.jpg)',
            'url(/themes/natural/background_images/natural_169_1.jpg)',
            '#D5CCC5',
        ],
        f4_3: [
            'url(/themes/natural/background_images/natural_43.jpg)',
            'url(/themes/natural/background_images/natural_43_1.jpg)',
            '#D5CCC5',
        ],
    },
    colors: {
        themeColor1: '#5A7B4F',
        themeColor2: '#AE5441',
        themeColor3: '#ADA24C',
        themeColor4: '#999975',
        themeColor5: '#763325',
        themeColor6: '#33441A',
    },
    images: {
        template1: { left: 'left.jpg', background: 1 },
        template2: { background: 2 },
        template3: { background: 2, topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
    },
};
