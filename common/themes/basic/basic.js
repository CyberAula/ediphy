
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
    viewName: ['Basic', 'Básico'],
    font: 'Cairo',
    background: {
        f16_9: [
            'url(/themes/basic/background_images/basic1_169.jpg)',
            'url(/themes/basic/background_images/basic2_169.jpg)',
            'url(/themes/basic/background_images/basic3_169.jpg)',
            'url(/themes/basic/background_images/basic4_169.jpg)',
            'url(/themes/basic/background_images/basic5_169.jpg)',
            'url(/themes/basic/background_images/basic6_169.jpg)',

        ],
        f4_3: [
            'url(/themes/basic/background_images/basic1_43.jpg)',
            'url(/themes/basic/background_images/basic2_43.jpg)',
            'url(/themes/basic/background_images/basic3_43.jpg)',
            'url(/themes/basic/background_images/basic4_43.jpg)',
            'url(/themes/basic/background_images/basic5_43.jpg)',
            'url(/themes/basic/background_images/basic6_43.jpg)',

        ],
    },
    colors: {
        themeColor1: '#B46741',
        themeColor2: '#3A5153',
        themeColor3: '#3A5153',
        themeColor4: '#3A5153',
        themeColor5: '#3A5153',
        themeColor6: '#FFFFFF',
        themeColor7: '#FFFFFF',
    },
    images: {
        template0: { background: 4 },
        template1: { background: 1, left: 'left.jpg' },
        template2: { background: 2 },
        template3: { background: 2, topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
        template12: { background: 3 },
        template13: { background: 5 },
        template15: { background: 2 },

    },

    templates: [
        {
            "name": 'proceso',
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
                        "x": "14%",
                        "y": "40%",
                        "width": "26%",
                        "height": "20%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/flag.png`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#1D2625",
                    },
                },
                {
                    "box": {
                        "x": "38%",
                        "y": "40%",
                        "width": "26%",
                        "height": "20%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/flag2.png`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#1D2625",
                    },
                },
                {
                    "box": {
                        "x": "62%",
                        "y": "40%",
                        "width": "26%",
                        "height": "20%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/flag.png`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#1D2625",
                    },
                },
                {
                    "box": {
                        "x": "17%",
                        "y": "45%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 1 </h1>",
                        "style": { "color": 'var(--themeColor6)', "text-align": "center" },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "",
                    },
                },
                {
                    "box": {
                        "x": "41%",
                        "y": "45%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 2 </h1>",
                        "style": { "color": 'var(--themeColor6)', "text-align": "center" },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "",
                    },
                },
                {
                    "box": {
                        "x": "65%",
                        "y": "45%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 3 </h1>",
                        "style": { "color": 'var(--themeColor6)', "text-align": "center" },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "",
                    },
                },
            ],

        },
        {
            "name": 'cita',
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
                        "x": "26%",
                        "y": "31%",
                        "width": "48%",
                        "height": "62%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/message.png`,
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "#B9B1B1",
                    },
                },
                {
                    "box": {
                        "x": "28%",
                        "y": "35%",
                        "width": "44%",
                        "height": "45%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Cita </h1>",
                        "style": { "color": 'var(--themeColor6)' },
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "",
                    },
                },
            ],

        },
        {
            "name": 'collage',
            "boxes": [
                {
                    "box": {
                        "x": "5%",
                        "y": "3%",
                        "width": "40%",
                        "height": "46%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/bottomLeft.jpg`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#3A5153",
                        "color": '#1D2625',
                    },
                },
                {
                    "box": {
                        "x": "47%",
                        "y": "3%",
                        "width": "48%",
                        "height": "95%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/right.jpg`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#3A5153",
                        "color": '#1D2625',
                    },
                },
                {
                    "box": {
                        "x": "5%",
                        "y": "52%",
                        "width": "40%",
                        "height": "46%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `/themes/basic/bottomRight.jpg`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#3A5153",
                        "color": '#1D2625',
                    },
                },
            ],

        },
    ],
};
