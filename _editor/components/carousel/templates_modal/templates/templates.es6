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
                    "url": "https://farm8.staticflickr.com/7316/16374306268_ed24674dc3_b.jpg",
                },
            },
            {
                "box": {
                    "x": "30%",
                    "y": "10%",
                    "width": "60%",
                    "height": "15%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<h1>Título</h1>",
                },
            },
            {
                "box": {
                    "x": "30%",
                    "y": "25%",
                    "width": "60%",
                    "height": "30%",
                },
                "toolbar": {
                    "name": "BasicText",
                    "text": "<p>Escribe aquí tu texto. Incluso puedes poner una lista</p><ul><li>Punto 1</li><li>Punto 2</li><li>Punto 3...</li></ul>",
                },
            },
        ],
    }]);
};
