
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
    viewName: ['ETSIT', 'ETSIT'],
    font: 'Libre Franklin',
    background: {
        f16_9: [
            'url(/themes/etsit/background_images/cabecera_169.jpg)',
            'url(/themes/etsit/background_images/enBlanco_169.jpg)',
            'url(/themes/etsit/background_images/textoYFoto_169.jpg)',
            'url(/themes/etsit/background_images/titulo_169.jpg)',
            'url(/themes/etsit/background_images/comparacion_169.jpg)',
        ],
        f4_3: [
            'url(/themes/etsit/background_images/cabecera_43.jpg)',
            'url(/themes/etsit/background_images/enBlanco_43.jpg)',
            'url(/themes/etsit/background_images/textoYFoto_43.jpg)',
            'url(/themes/etsit/background_images/titulo_43.jpg)',
            'url(/themes/etsit/background_images/comparacion_43.jpg)',
        ],
    },
    colors: {
        themeColor1: '#F18E00',
        themeColor2: '#1D4F82',
        themeColor3: '#1D4F82',
        themeColor4: '#1D4F82',
        themeColor5: '#1D4F82',
        themeColor6: '#03213F',
        themeColor7: "#FFFFFF",
    },
    images: {
        template0: { background: 1 },
        template1: { left: 'left.jpg', background: 2 },
        template2: { background: 2 },
        template3: { background: 2, topLeft: 'topLeft.jpg', topRight: 'topRight.jpg', bottomLeft: 'bottomLeft.jpg', bottomRight: 'bottomRight.jpg' },
        template7: { left: 'seven.jpg' },
        template13: { proceso1: 'proceso1.png', proceso2: 'proceso2.png', proceso3: 'proceso3.png' },
        template12: { background: 3 },
        template14: { background: 4 },
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
                        "color": "#1D4F82",
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
                        "url": `templates/template13/proceso1`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#1D4F82",
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
                        "url": `templates/template13/proceso2`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#C4C4C4",
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
                        "url": `templates/template13/proceso3`,
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#F18E00",
                    },
                },
                {
                    "box": {
                        "x": "16%",
                        "y": "48%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 1 </h1>",
                        "style": { "color": 'var(--themeColor7)', "text-align": "center" },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "",
                    },
                },
                {
                    "box": {
                        "x": "40%",
                        "y": "48%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 2 </h1>",
                        "style": { "color": '#03213F', "text-align": "center" },
                    },
                    "thumbnail": {
                        "icon": "",
                        "icon_color": "",
                        "color": "",
                    },
                },
                {
                    "box": {
                        "x": "64%",
                        "y": "48%",
                        "width": "22%",
                        "height": "12%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Paso 3 </h1>",
                        "style": { "color": 'var(--themeColor7)', "text-align": "center" },
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
            "name": 'comparación',
            "boxes": [
                {
                    "box": {
                        "x": "3%",
                        "y": "10%",
                        "width": "60%",
                        "height": "35%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Comparado 1 </h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque diam urna, hendrerit porta sollicitudin nec, gravida quis massa. Aenean ac mi nulla. Phasellus ac dui consectetur, ultrices dui at, convallis quam. Quisque ac varius nibh. Pellentesque egestas, sem a placerat laoreet, enim lectus volutpat nisi, at vulputate tortor leo ac risus. Mauris pretium et enim eu faucibus. Vestibulum ornare odio eget eros ullamcorper, et iaculis libero venenatis. </p>",
                        "style": { "color": 'var(--themeColor7)' },
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#1D4F82",
                    },
                },
                {
                    "box": {
                        "x": "37%",
                        "y": "57%",
                        "width": "60%",
                        "height": "35%",
                    },
                    "toolbar": {
                        "name": "BasicText",
                        "text": "<h1 class='no_margins'> Comparado 2 </h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque diam urna, hendrerit porta sollicitudin nec, gravida quis massa. Aenean ac mi nulla. Phasellus ac dui consectetur, ultrices dui at, convallis quam. Quisque ac varius nibh. Pellentesque egestas, sem a placerat laoreet, enim lectus volutpat nisi, at vulputate tortor leo ac risus. Mauris pretium et enim eu faucibus. Vestibulum ornare odio eget eros ullamcorper, et iaculis libero venenatis. </p>",
                        "style": { "color": 'var(--themeColor7)' },
                    },
                    "thumbnail": {
                        "icon": "format_align_left",
                        "icon_color": "#FFFFFF",
                        "color": "#F18E00",
                    },
                },
            ],
        },
    ],
};
