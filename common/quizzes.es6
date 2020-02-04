export const QUIZ_STYLE = {
    __name: Ediphy.i18n.t('HotspotImages.box_style'),
    icon: 'palette',
    buttons: {
        padding: {
            __name: Ediphy.i18n.t('HotspotImages.padding'),
            type: 'number',
            value: 10,
            min: 0,
            max: 100,
        },
        backgroundColor: {
            __name: Ediphy.i18n.t('HotspotImages.backgroundColor'),
            type: 'color',
            value: 'var(--themeColor8, #ffffff)',
        },
        borderWidth: {
            __name: Ediphy.i18n.t('HotspotImages.border_size'),
            type: 'number',
            value: 1,
            min: 0,
            max: 10,
        },
        borderStyle: {
            __name: Ediphy.i18n.t('HotspotImages.border_style'),
            type: 'select',
            value: 'solid',
            options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
        },
        borderColor: {
            __name: Ediphy.i18n.t('HotspotImages.border_color'),
            type: 'color',
            value: '#dbdbdb',
        },
        borderRadius: {
            __name: Ediphy.i18n.t('HotspotImages.radius'),
            type: 'number',
            value: 0,
            min: 0,
            max: 50,
        },
        opacity: {
            __name: Ediphy.i18n.t('HotspotImages.opacity'),
            type: 'range',
            value: 1,
            min: 0,
            max: 1,
            step: 0.01,
        },
    },
};

export const QUIZ_CONFIG = {
    category: 'evaluation',
    initialWidth: '60%',
    flavor: 'react',
    isComplex: true,
};
