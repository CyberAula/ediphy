import i18n from 'i18next';

export const testState = { present:
        {
            globalConfig: {
                title: "Ediphy",
                canvasRatio: 16 / 9,
                visorNav: {
                    player: true,
                    sidebar: true,
                    keyBindings: true,
                },
                trackProgress: true,
                age: {
                    min: 0,
                    max: 100,
                },
                context: 'school',
                rights: "Public Domain",
                keywords: [],
                typicalLearningTime: {
                    h: 0,
                    m: 0,
                    s: 0,
                },
                version: '1.0.0',
                thumbnail: '',
                status: 'draft',
                structure: 'linear',
                difficulty: 'easy',
            },
            displayMode: "list",
            imagesUploaded: [],
            indexSelected: -1,
            navItemsById: {
                0: {
                    id: 0,
                    children: [],
                    boxes: [],
                    level: 0,
                    type: '',
                    hidden: false,
                },
                "pa-1511252955865": {
                    id: 0,
                    children: [],
                    boxes: [],
                    level: 0,
                    type: '',
                    hidden: false,
                },
            },
            navItemsIds: ["pa-1511252955865"],
            navItemSelected: 0,
            marksById: {
                "rm-1511252975055": {
                    parent: 'bo-1511252970033',
                    id: "rm-1511252975055",
                    title: "new mark",
                    connectMode: "existing",
                    connection: "pa-1511252955865",
                    displayMode: "navigate",
                    value: "30.95,49.15",
                    color: "#222222",
                    oldConnection: 'cv-1511252975055',
                    newConnection: 'pa-1511252955865',
                },
            },
            containedViewsById: {
                'cv-1511252975055': {

                },
            },
            boxesById: { },
            viewToolbarsById: { },
            pluginToolbarsById: { },
            isBusy: "",
            fetchVishResults: { "results": [] },
        },
};
