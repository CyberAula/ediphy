export const TRANSITIONS = [
    {
        key: 'none',
        viewName: ['None', 'Ninguna'],
        image: 'transitions/none.png',
        transition: {
            in: 'none',
            out: 'none',
        },
    },
    {
        key: 'opacity',
        viewName: ['Opacity', 'Disolver'],
        image: '/transitions/opacity.png',
        transition: {
            in: 'fadeIn',
            out: 'fadeOut',
        },
    },
    {
        key: 'horizontal',
        viewName: ['Horizontal', 'Horizontal'],
        image: '/transitions/horizontal.png',
        transition: {
            in: 'slideInRight',
            out: 'slideOutLeft',
        },
    },
    {
        key: 'Vertical',
        viewName: ['Vertical', 'Vertical'],
        image: '/transitions/vertical.png',
        transition: {
            in: 'slideInDown',
            out: 'slideOutDown',
        },
    },
    {
        key: 'zoom',
        viewName: ['Zoom', 'Zoom'],
        image: '/transitions/zoom.png',
        transition: {
            in: 'zoomOut',
            out: 'zoomIn',
        },
    },
    {
        key: 'RotOut',
        viewName: ['Rotate corner', 'Girar esquina'],
        image: '/transitions/rotOut.png',
        transition: {
            in: 'rotateInDownLeft',
            out: 'rotateOutDownLeft',
        },
    },
    {
        key: 'rotate',
        viewName: ['Rotate', 'Rotar'],
        image: '/transitions/rotate.png',
        transition: {
            in: 'rotateIn',
            out: 'rotateOutUpLeft',
        },
    },
    {
        key: 'flip',
        viewName: ['Flip', 'Flip'],
        image: '/transitions/flip.png',
        transition: {
            in: 'flipInX',
            out: 'fadeOut',
        },
    },
];
