export const DEFINITION = {
    /*
    * viewName: [<Nombre del tema en inglés>, <Nombre del tema es español>],
    * font: Fuente principal del tema (tiene que ser de Google Fonts),
    * background: [
    *   Insertar colores o url a las imágenes del tema. Por ejemplo: 'url(/themes/orange/backgroundImages/orange0.jpg)',...
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
    viewName: ['Desktop', 'Escritorio'],
    font: 'Libre Franklin',
    background: {
        f16_9: [
            'desktop_169.jpg',
            '#FDFDFD',
        ],
        f4_3: [
            'desktop_43.jpg',
            '#FDFDFD',
        ],
    },
    colors: {
        themeColor1: '#780C0E',
        themeColor2: '#C86A6D',
        themeColor3: '#C86A6D',
        themeColor4: '#C86A6D',
        themeColor5: '#C86A6D',
        themeColor6: '#000000',
        themeColor8: '#ffffff',
        themeColor9: '#F62B73',
        themeColor10: 'white',
    },
    images: {
        template1: { left: 'left.jpg' },
        template2: { background: 1 },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg', background: 1 },
        template7: { left: 'seven.jpg' },
    },
};
