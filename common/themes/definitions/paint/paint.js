
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
    viewName: ['Paint', 'Pintura'],
    font: 'Bree Serif',
    background: {
        f16_9: [
            'paint_169.jpg',
            'paint_169_12.jpg',
            'paint_169_2.jpg',
            'paint_169_1.jpg',
        ],
        f4_3: [
            'paint_43.jpg',
            'paint_43_12.jpg',
            'paint_43_2.jpg',
            'paint_43_1.jpg',
        ],
    },
    colors: {
        themeColor1: '#736567',
        themeColor2: '#B6D2C6',
        themeColor3: '#C7A39E',
        themeColor4: '#D1B989',
        themeColor5: '#8FADC1',
        themeColor6: '#401813',
        themeColor7: '#3E3839',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#B6D2C6',
        themeColor10: '#ffffff',
    },
    images: {
        template1: { left: 'left.jpg', background: 3 },
        template2: { background: 2 },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg', background: 2 },
        template7: { left: 'seven.jpg' },
        template12: { background: 1 },
    },
};
