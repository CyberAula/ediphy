
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
    viewName: ['Polygon', 'Polígono'],
    font: 'Cairo',
    background: {
        f16_9: [
            'url(/themes/polygon/background_images/polygon_169.jpg)',
            'url(/themes/polygon/background_images/polygon1_169.jpg)',
            'url(/themes/polygon/background_images/polygon2_169.jpg)',
            'url(/themes/polygon/background_images/polygon3_169.jpg)',
        ],
        f4_3: [
            'url(/themes/polygon/background_images/polygon_43.jpg)',
            'url(/themes/polygon/background_images/polygon1_43.jpg)',
            'url(/themes/polygon/background_images/polygon2_43.jpg)',
            'url(/themes/polygon/background_images/polygon3_43.jpg)',
        ],
    },
    colors: {
        themeColor1: '#DF0000',
        themeColor2: '#E2DAD8',
        themeColor3: '#E2DAD8',
        themeColor4: '#E2DAD8',
        themeColor5: '#E2DAD8',
        themeColor6: '#000000',
        themeColor7: '#DF0000',
    },
    images: {
        template0: { background: 2 },
        template1: { background: 1, left: 'left.jpg' },
        template2: { background: 2 },
        template3: { background: 2, topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
        template7: { left: 'seven.jpg' },
        template12: { background: 3 },
    },
    templates: [
        {
            "name": 'display',
            "boxes": [
                {
                    "box": {
                        "x": "5%",
                        "y": "6%",
                        "width": "90%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "style": { "color": 'var(--themeColor1)' },
                        "text": "<h1 class='no_margins'> Cabecera </h1>",
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": 'var(--themeColor1)',
                    },
                },
                {
                    "box": {
                        "x": "10%",
                        "y": "22%",
                        "width": "22%",
                        "height": "40%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/seven.jpg`,
                        "style": { "clipPath": "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" },
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#90E1EC",
                        "color": "#43BECE",
                    },
                },
                {
                    "box": {
                        "x": "39%",
                        "y": "22%",
                        "width": "22%",
                        "height": "40%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/seven.jpg`,
                        "style": { "clipPath": "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" },
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#90E1EC",
                        "color": "#43BECE",
                    },
                },
                {
                    "box": {
                        "x": "68%",
                        "y": "22%",
                        "width": "22%",
                        "height": "40%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/seven.jpg`,
                        "style": { "clipPath": "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" },
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#90E1EC",
                        "color": "#43BECE",
                    },
                },
                {
                    "box": {
                        "x": "19.5%",
                        "y": "62%",
                        "width": "3%",
                        "height": "10%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/arrow.png`,

                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": '',
                    },
                },
                {
                    "box": {
                        "x": "48.5%",
                        "y": "62%",
                        "width": "3%",
                        "height": "10%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/arrow.png`,

                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": '',
                    },
                },
                {
                    "box": {
                        "x": "77.5%",
                        "y": "62%",
                        "width": "3%",
                        "height": "10%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/polygon/arrow.png`,

                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": '',
                    },
                },

            ],
        },
    ],
};
