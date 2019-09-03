import i18n from 'i18next';

export const emptyState = () => ({
    filesUploaded: {},
    status: 'draft',
    everPublished: false,
    undoGroup: {
        present: {
            globalConfig: {
                title: i18n.t('course_title'),
                canvasRatio: 16 / 9,
                visorNav: { player: true, sidebar: true, keyBindings: true },
                trackProgress: true,
                age: { min: 0, max: 100 },
                context: 'school',
                rights: "public",
                keywords: [],
                typicalLearningTime: { h: 0, m: 0, s: 0 },
                version: '1.0.0',
                thumbnail: '',
                status: 'draft',
                structure: 'linear',
                difficulty: 'easy',
                allowClone: true,
                allowDownload: true,
                allowComments: true,
            },
            displayMode: "list",
            indexSelected: -1,
            navItemsById: {
                0: { id: 0, children: [], boxes: [], level: 0, type: '', hidden: false },
            },
            navItemsIds: [],
            navItemSelected: 0,
            marksById: {},
            boxesById: { },
            viewToolbarsById: { },
            pluginToolbarsById: { },
            isBusy: "",
        },
    } });
