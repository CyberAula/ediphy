export const TRANSITIONS = [
    {
        key: 'none',
        viewName: ['None', 'Ninguna'],
        image: './transitions/none.png',
        transition: {
            in: 'none',
            out: 'none',
            backwards: {
                in: '',
                out: '',
            },
        },
    },
    {
        key: 'opacity',
        viewName: ['Opacity', 'Disolver'],
        image: './transitions/opacity.png',
        transition: {
            in: 'fadeIn',
            out: 'fadeOut',
            backwards: {
                in: 'fadeIn',
                out: 'fadeOut',
            },
        },
    },
    {
        key: 'horizontal',
        viewName: ['Horizontal', 'Horizontal'],
        image: './transitions/horizontal.png',
        transition: {
            in: 'slideInRight',
            out: 'slideOutLeft',
            backwards: {
                in: 'slideInLeft',
                out: 'slideOutRight',
            },
        },
    },
    {
        key: 'Vertical',
        viewName: ['Vertical', 'Vertical'],
        image: './transitions/vertical.png',
        transition: {
            in: 'slideInDown',
            out: 'slideOutDown',
            backwards: {
                in: 'slideInUp',
                out: 'slideOutUp',
            },
        },
    },
    {
        key: 'zoom',
        viewName: ['Zoom', 'Zoom'],
        image: './transitions/zoom.png',
        transition: {
            in: 'zoomOut',
            out: '',
            backwards: {
                in: 'zoomOut',
                out: '',
            },
        },
    },
    {
        key: 'RotOut',
        viewName: ['Rotate corner', 'Girar esquina'],
        image: './transitions/rotOut.png',
        transition: {
            in: 'rotateInDownLeft',
            out: 'rotateOutDownLeft',
            backwards: {
                in: 'rotateInUpLeft',
                out: 'rotateOutUpLeft',
            },
        },
    },
    {
        key: 'rotate',
        viewName: ['Rotate', 'Rotar'],
        image: './transitions/rotate.png',
        transition: {
            in: 'rotateIn',
            out: 'rotateOutUpLeft',
            backwards: {
                in: '',
                out: '',
            },
        },
    },
    {
        key: 'flip',
        viewName: ['Flip', 'Flip'],
        image: './transitions/flip.png',
        transition: {
            in: 'flipInX',
            out: 'fadeOut',
            backwards: {
                in: '',
                out: '',
            },
        },
    },
];

export function getTransition(styleConfig, fromPDF = false, isCV = false, backwards = false) {
    let hasTransition = styleConfig.hasOwnProperty('transition');
    let transition = hasTransition && !fromPDF ? TRANSITIONS[styleConfig.transition].transition : TRANSITIONS[0].transition;
    transition = isCV ? TRANSITIONS[4].transition : transition;
    transition = backwards ? transition.backwards : transition;
    return transition;
}
