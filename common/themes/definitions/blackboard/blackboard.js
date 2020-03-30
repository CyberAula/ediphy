
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
    viewName: ['Blackboard', 'Pizarra'],
    font: 'Gloria Hallelujah',
    background: {
        f16_9: [
            'blackboard_169.jpg',
        ],
        f4_3: [
            'blackboard_43.jpg',
        ],
    },
    colors: {
        themeColor1: '#FDF29A',
        themeColor2: '#F287AD',
        themeColor3: '#C6E58C',
        themeColor4: '#9BDEEB',
        themeColor5: '#FEC997',
        themeColor6: '#FFFFFF',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#C6E58C',
        themeColor10: 'black',
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
    },
};
