import i18n from "i18next";

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
            'orange0.jpg',
            'orange1.jpg',
        ],
        f4_3: [
            'orange0.jpg',
            'orange1.jpg',
        ],
    },
    colors: {
        themeColor1: '#D1550F',
        themeColor2: '#ff9a3c',
        themeColor3: '#ff9a3c',
        themeColor4: '#ff9a3c',
        themeColor5: '#ff9a3c',
        themeColor6: '#1d1d1d',
        themeColor7: '#243635',
        themeColor12: '#ffffff', // Docs color background
        themeColor13: '#9A9A9A', // Not last element of breadcrumb
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
    templates: [
        {
            "name": i18n.t('templates.template1'),
            "boxes": [
                {
                    "box": {
                        "x": "0",
                        "y": "0",
                        "width": "25%",
                        "height": "100%",
                    },
                    "toolbar": {
                        "name": "HotspotImages",
                        "url": `templates/template1/left`,
                    },
                    "thumbnail": {
                        "icon": "filter_hdr",
                        "icon_color": "#D1550F",
                        "color": "#ff9a3c",
                    },
                },
                {
                    "box": {
                        "x": "30%",
                        "y": "10%",
                        "width": "60%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'>" + i18n.t('templates.text_images') + "</h1>",
                        "style": { "color": 'var(--themeColor1)' },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "#D1550F",
                    },
                },
                {
                    "box": {
                        "x": "30%",
                        "y": "30%",
                        "width": "60%",
                        "height": "40%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque diam urna, hendrerit porta sollicitudin nec, gravida quis massa. Aenean ac mi nulla. Phasellus ac dui consectetur, ultrices dui at, convallis quam. Quisque ac varius nibh. Pellentesque egestas, sem a placerat laoreet, enim lectus volutpat nisi, at vulputate tortor leo ac risus. Mauris pretium et enim eu faucibus. Vestibulum ornare odio eget eros ullamcorper, et iaculis libero venenatis. </p>",
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#706F6F",
                        "color": "#B2B2B2",
                    },
                },
            ],
        },
    ],
};
