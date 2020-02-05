import i18n from 'i18next';
export const templates = () => { return (
    [{
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
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
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
                    "color": "#706F6F",
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
    {
        "name": i18n.t('templates.template2'),
        "boxes": [
            {
                "box": {
                    "x": "3%",
                    "y": "5%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<div class='template2_item custom_color'>" + i18n.t('templates.add_text') + "</div>",
                    "style": { "backgroundColor": 'var(--themeColor2)' },

                },
                "thumbnail": {
                    "icon": "format_align_left",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "51%",
                    "y": "5%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<div class='template2_item custom_color'>" + i18n.t('templates.add_text') + "</div>",
                    "style": { "backgroundColor": "var(--themeColor3)" },
                },
                "thumbnail": {
                    "icon": "format_align_left",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "3%",
                    "y": "52%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<div class='template2_item custom_color'>" + i18n.t('templates.add_text') + "</div>",
                    "style": { "backgroundColor": "var(--themeColor4)" },
                },
                "thumbnail": {
                    "icon": "format_align_left",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "51%",
                    "y": "52%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<div class='template2_item custom_color'>" + i18n.t('templates.add_text') + "</div>",
                    "style": { "backgroundColor": "var(--themeColor5)" },
                },
                "thumbnail": {
                    "icon": "format_align_left",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template3'),
        "boxes": [
            {
                "box": {
                    "x": "3%",
                    "y": "5%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "HotspotImages",
                    "url": `templates/template3/topLeft`,

                },
                "thumbnail": {
                    "icon": "filter_hdr",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "51%",
                    "y": "5%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "HotspotImages",
                    "url": `templates/template3/topRight`,
                },
                "thumbnail": {
                    "icon": "filter_hdr",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "3%",
                    "y": "52%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "HotspotImages",
                    "url": `templates/template3/bottomLeft`,
                },
                "thumbnail": {
                    "icon": "filter_hdr",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "51%",
                    "y": "52%",
                    "width": "45%",
                    "height": "43%",
                },
                "toolbar": {
                    "name": "HotspotImages",
                    "url": `templates/template3/bottomRight`,
                },
                "thumbnail": {
                    "icon": "filter_hdr",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template4'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.video') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "15%",
                    "width": "90%",
                    "height": "80%",
                },
                "toolbar": {
                    "name": "EnrichedPlayer",
                    "url": "https://www.youtube.com/watch?v=BV5P_V2Yyrc",
                },
                "thumbnail": {
                    "icon": "play_circle_outline",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template5'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.map') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "15%",
                    "width": "90%",
                    "height": "80%",
                },
                "toolbar": {
                    "name": "VirtualTour",
                },
                "thumbnail": {
                    "icon": "map",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template6'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.web') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "15%",
                    "width": "90%",
                    "height": "80%",
                },
                "toolbar": {
                    "name": "Webpage",
                    "url": "http://ging.github.io/ediphy/#/",
                },
                "thumbnail": {
                    "icon": "public",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template7'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.elements_list') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "22%",
                    "width": "43%",
                    "height": "73%",
                },
                "toolbar": {
                    "name": "HotspotImages",
                    "url": `templates/template7/left`,
                },
                "thumbnail": {
                    "icon": "filter_hdr",
                    "icon_color": "#B2B2B2",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "52%",
                    "y": "22%",
                    "width": "43%",
                    "height": "73%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<ul class='bulleted_list'><li>" + i18n.t('templates.first_element') + "</li><li>" + i18n.t('templates.second_element') + "</li><li>" + i18n.t('templates.third_element') + "</li><li>...</li> </ul>",
                },
                "thumbnail": {
                    "icon": "format_list_bulleted",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template8'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.ex_unique_response') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "23%",
                    "width": "90%",
                    "height": "auto",
                    "heightTemplate": "72%",
                },
                "toolbar": {
                    "name": "MultipleChoice",
                    "style": { "background-color": 'var(--themeColor8)' },
                },
                "thumbnail": {
                    "icon": "radio_button_checked",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template9'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.ex_multiple_response') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "23%",
                    "width": "90%",
                    "height": "auto",
                    "heightTemplate": "72%",
                },
                "toolbar": {
                    "name": "MultipleAnswer",
                    "style": { "background-color": 'var(--themeColor8)' },
                },
                "thumbnail": {
                    "icon": "check_box",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template10'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.ex_free_response') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "23%",
                    "width": "90%",
                    "height": "auto",
                    "heightTemplate": "72%",
                },
                "toolbar": {
                    "name": "FreeResponse",
                    "style": { "background-color": 'var(--themeColor8)' },
                },
                "thumbnail": {
                    "icon": "message",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template11'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "5%",
                    "width": "90%",
                    "height": "12%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "style": { "color": 'var(--themeColor1)' },
                    "text": "<h1 class='no_margins'>" + i18n.t('templates.ex_true_false') + "</h1>",
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "23%",
                    "width": "90%",
                    "height": "auto",
                    "heightTemplate": "72%",
                },
                "toolbar": {
                    "name": "TrueFalse",
                    "style": { "background-color": 'var(--themeColor8)' },
                },
                "thumbnail": {
                    "icon": "check_circle",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    {
        "name": i18n.t('templates.template12'),
        "boxes": [
            {
                "box": {
                    "x": "5%",
                    "y": "25%",
                    "width": "90%",
                    "height": "25%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<h1> Title </h1>",
                    "style": { "color": 'var(--themeColor1)', "fontSize": "3em", "fontWeight": "bold", "textAlign": "center" },
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "",
                    "color": "#706F6F",
                },
            },
            {
                "box": {
                    "x": "5%",
                    "y": "50%",
                    "width": "90%",
                    "height": "20%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<h2> Subtitle </h2>",
                    "style": { "color": 'var(--themeColor6)', "fontSize": "2em", "fontWeight": "bold", "textAlign": "center" },
                },
                "thumbnail": {
                    "icon": "",
                    "icon_color": "#706F6F",
                    "color": "#B2B2B2",
                },
            },
        ],
    },
    ]);
};
