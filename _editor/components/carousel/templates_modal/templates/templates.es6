import i18n from 'i18next';
export const templates = () => { return (
    [{
        "image": require("./img/T1.svg"),
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
                    "url": "https://farm8.staticflickr.com/7287/9543740601_8bfde7ad9d_k.jpg",
                },
                "thumbnail": {
                    "icon": "filter_hdr",
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
                    "text": "<h1 class='no_margins'>Título</h1>",
                },
                "thumbnail": {
                    "icon": "",
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
                    "icon": "",
                    "color": "#B2B2B2",
                },
            },
        ],
    }]);
};
