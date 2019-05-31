
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
    viewName: ['UPM', 'UPM'],
    font: 'Libre Franklin',
    background: {
        f16_9: [
            'url(/themes/upm/background_images/upm_169.jpg)',
            'url(/themes/upm/background_images/upm_169_12.jpg)',
            'url(/themes/upm/background_images/upm_169_2.jpg)',

        ],
        f4_3: [
            'url(/themes/upm/background_images/upm_43.jpg)',
            'url(/themes/upm/background_images/upm_43_12.jpg)',
            'url(/themes/upm/background_images/upm_43_2.jpg)',
        ],
    },
    colors: {
        themeColor1: '#D2D2D2',
        themeColor2: '#DBE0EF',
        themeColor3: '#FFFFFF',
        themeColor4: '#FFFFFF',
        themeColor5: '#DBE0EF',
        themeColor6: '#0F3D59',
        themeColor7: '#0F3D59',
    },
    images: {
        template1: { left: 'left.jpg' },
        template2: { background: 2 },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg', background: 2 },
        template7: { left: 'seven.jpg' },
        template12: { background: 1 },

    },
};
