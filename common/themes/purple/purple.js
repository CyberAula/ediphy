
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
            'url(/themes/purple/background_images/purple_169.jpg)',
        ],
        f4_3: [
            'url(/themes/purple/background_images/purple_43.jpg)',
        ],
    },
    colors: {
        themeColor1: '#5F4A98',
        themeColor2: '#7780BD',
        themeColor3: '#6761A8',
        themeColor4: '#95B5DB',
        themeColor5: '#8989C2',
        themeColor6: '#302150',
    },
    images: {
        template1: { left: 'left.jpg' },
        template3: { topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
    },
};
