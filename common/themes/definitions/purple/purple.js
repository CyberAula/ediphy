
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
    viewName: ['Purple', 'Morado'],
    font: 'Inconsolata',
    background: {
        f16_9: [
            'purple_169.jpg',
            'purple_169_1.jpg',
            'purple_169_2.jpg',
            'purple_169_12.jpg',
        ],
        f4_3: [
            'purple_43.jpg',
            'purple_43_1.jpg',
            'purple_43_2.jpg',
            'purple_43_12.jpg',
        ],
    },
    colors: {
        themeColor1: '#5F4A98',
        themeColor2: '#7780BD',
        themeColor3: '#6761A8',
        themeColor4: '#95B5DB',
        themeColor5: '#8989C2',
        themeColor6: '#302150',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#F62B73',
        themeColor10: 'white',
    },
    images: {
        template1: { left: 'left.jpg', background: 1 },
        template2: { background: 2 },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg', background: 2 },
        template7: { left: 'seven.jpg' },
        template12: { background: 3 },
    },
};
