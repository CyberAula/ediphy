
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
            'basic1_169.jpg',
            'basic2_169.jpg',
            'basic3_169.jpg',
            'basic4_169.jpg',
            'basic5_169.jpg',
            'basic6_169.jpg',

        ],
        f4_3: [
            'basic1_43.jpg',
            'basic2_43.jpg',
            'basic3_43.jpg',
            'basic4_43.jpg',
            'basic5_43.jpg',
            'basic6_43.jpg',
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
        themeColor8: '#1d2625',
        themeColor9: '#B46741', // Last element of breadcrumb
        themeColor10: 'white',
        themeColor12: '#1e2725',
        themeColor13: '#9A9A9A', // Not last element of breadcrumb
    },
    images: {
        template0: { background: 4 },
        template1: { background: 1, left: 'left.jpg' },
        template2: { background: 2 },
        template3: { background: 2, topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
        template12: { background: 3 },
        template13: { background: 5, flag: 'flag.png', flag2: 'flag2.png' },
        template14: { message: 'message.png' },
        template15: { background: 2, right: 'right.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },

    },

    templates: [
        {
            "name": 'proceso',
            "backgroundColor": '#454545',
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
                        "color": '#7ca4a1',
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
                        "url": `templates/template13/flag`,
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "#FFFFFF",
                        "color": "#7ca4a1",
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
                        "url": `templates/template13/flag2`,
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "#FFFFFF",
                        "color": "#526d6b",
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
                        "url": `templates/template13/flag`,
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "#FFFFFF",
                        "color": "#283534",
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
            "backgroundColor": '#454545',
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
                        "color": '#7ca4a1',
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
                        "url": `templates/template14/message`,
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "#283534",
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
                        "icon_color": "#d1d1d1",
                        "color": "",
                    },
                },
            ],

        },
        {
            "name": 'collage',
            "backgroundColor": '#454545',
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
                        "url": `templates/template15/bottomLeft`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#d1d1d1",
                        "color": '#3f5351',
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
                        "url": `templates/template15/right`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#d1d1d1",
                        "color": '#283534',
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
                        "url": `templates/template15/bottomRight`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#d1d1d1",
                        "color": '#364745',
                    },
                },
            ],

        },
    ],
};
