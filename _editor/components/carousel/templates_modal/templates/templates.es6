export const templates = () => { return (
    [{
        "image": require("./img/T1.svg"),
        "boxes": [
            {
                "box": {
                    "x": "0",
                    "y": "0",
                },
                "toolbar": {
                    "width": "20%",
                    "height": "100%",
                    "name": "HotspotImages",
                },
            }, {
                "box": {
                    "x": "30%",
                    "y": "10%",
                },
                "toolbar": {
                    "width": "60%",
                    "height": "10%",
                    "name": "BasicText",
                },
            },
        ],
    }]);
};
