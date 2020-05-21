
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
    viewName: ['ViSH 6', 'ViSH 6'],
    font: 'Maven Pro',
    background: {
        f16_9: [
            'vish6_169.jpeg',
        ],
        f4_3: [
            'vish6_43.jpg',
        ],
    },
    colors: {
        themeColor1: '#164278',
        themeColor2: '#4C92E8',
        themeColor3: '#AACBF4',
        themeColor4: '#3C6CA7',
        themeColor5: '#D7E7FA',
        themeColor6: '#164278',
        themeColor8: 'rgba(0,0,0,0)',
        themeColor9: '#164278',
        themeColor10: 'white',
        themeColor12: '#ffffff', // Docs color background
        themeColor13: '#9A9A9A', // Not last element of breadcrumb
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'vish.svg', topRight: 'vish.svg', bottomLeft: 'vish.svg', bottomRight: 'vish.svg' },
        template7: { left: 'vish.svg' },
    },
};
