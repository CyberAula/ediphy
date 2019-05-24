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
    *   template3: { topLeft: 'fruit1.jpg', topRight: 'fruit2.jpg', bottomLeft: 'fruit3.jpeg', bottomRight: 'fruit4.jpg' },
    *   template7: { left: '' },
    * }
    * */
    viewName: ['EDiphy classic', 'EDiphy clásico'],
    font: 'Merriweather',
    background: {
        f16_9: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
        f4_3: [
            'url(/themes/orange/background_images/orange0.jpg)',
            'url(/themes/orange/background_images/orange1.jpg)',
        ],
    },
    colors: {
        themeColor1: '#D1550F',
        themeColor2: '#17CFC8',
        themeColor7: '#243635',
    },
    images: {
        template1: { left: '' },
        template3: {
            topLeft: 'fruit1.jpg',
            topRight: 'fruit2.jpg',
            bottomLeft: 'fruit3.jpeg',
            bottomRight: 'fruit4.jpg',
        },
        template7: { left: '' },
    },
};
