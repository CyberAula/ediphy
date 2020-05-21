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
    viewName: ['EDiphy classic', 'EDiphy clásico'],
    font: 'Ubuntu',
    background: {
        f16_9: [
            '#ffffff',
            'title_169.png',
            'mac_169.png',
            '#282828',

        ],
        f4_3: [
            '#ffffff',
            'title_43.png',
            'mac_43.png',
            '#282828',
        ],
    },
    colors: {
        themeColor1: '#282828',
        themeColor2: '#282828',
        themeColor3: '#282828',
        themeColor4: '#282828',
        themeColor5: '#282828',
        themeColor6: '#282828',
        themeColor12: '#ffffff', // Docs color background
        themeColor13: '#9A9A9A', // Not last element of breadcrumb
    },
    images: {
        template1: { left: 'colors_texture.jpg' },
        template3: { topLeft: 'topLeft.png', topRight: 'topRight.png', bottomLeft: 'bottomLeft.png', bottomRight: 'bottomRight.png' },
        template7: { left: 'placeholder.svg' },
        template13: { footer1: 'etsit.png', background: 1 },
        template14: { background: 2 },
    },

    templates: [
        {
            "name": 'tfg-title',
            "backgroundColor": '#ffffff',
            "boxes": [
                {
                    "box": {
                        "x": "4%",
                        "y": "2%",
                        "width": "92%",
                        "height": "46%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='tfg_title'> Desarrollo de nuevas funcionalidades para una aplicación web de autorí­a de contenidos de e-Learning </h1>",
                        "style": { "color": 'var(--themeColor6)', "textAlign": "right", "fontSize": "1.95em", "lineHeight": 1.3 },
                    },
                    "thumbnail": {
                        "icon": "title",
                        "icon_color": "#282828",
                        "color": "#7d7d7d",
                    },
                },
                {
                    "box": {
                        "x": "4%",
                        "y": "49%",
                        "width": "90%",
                        "height": "15%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h3 class='tfg_author'> Alfonso Daniel Jiménez Martínez </h3>",
                        "style": { "color": '#7d7d7d', "textAlign": "right", "fontSize": "1.1em", "lineHeight": 1.3 },
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
            "name": 'elearning',
            "backgroundColor": '#454545',
            "boxes": [
                {
                    "box": {
                        "x": "0%",
                        "y": "35%",
                        "width": "100%",
                        "height": "20%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "style": { "color": '#ffffff', "textAlign": "center", "fontSize": "3em" },
                        "text": "<h1 class='no_margins'> e-Learning </h1>",
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": '#7ca4a1',
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
