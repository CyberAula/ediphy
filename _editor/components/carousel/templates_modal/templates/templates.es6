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
                    "src": "https://farm8.staticflickr.com/7316/16374306268_ed24674dc3_b.jpg",
                },
            },
            {
                "box": {
                    "x": "30%",
                    "y": "10%",
                    "width": "60%",
                    "height": "10%",
                },
                "toolbar": {
                    "name": "BasicText",
                },
            },
            {
                "box": {
                    "x": "30%",
                    "y": "20%",
                    "width": "60%",
                    "height": "30%",
                },
                "toolbar": {
                    "name": "BasicText",
                },
            },
        ],
    }]);
};
