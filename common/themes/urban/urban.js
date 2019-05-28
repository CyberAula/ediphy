
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
    viewName: ['Urban', 'Urbano'],
    font: 'Permanent Marker',
    background: {
        f16_9: [
            'url(/themes/urban/background_images/urban_169.jpg)',
        ],
        f4_3: [
            'url(/themes/urban/background_images/urban_43.jpg)',
        ],
    },
    colors: {
        themeColor1: '#525252',
        themeColor2: '#C4C4C4',
        themeColor3: '#E18220',
        themeColor4: '#BFA055',
        themeColor5: '#525252',
        themeColor6: '#000000',
        themeColor7: '#FFFFFF',
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
        template7: { left: 'seven.jpg' },
    },
};
