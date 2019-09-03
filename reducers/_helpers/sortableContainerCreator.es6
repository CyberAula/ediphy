import { isBox } from '../../common/utils';

export function sortableContainerCreator(key = "", children = [], height = "auto", parent) {
    return {
        children: children,
        style: {
            padding: '0px',
            borderColor: '#ffffff',
            borderWidth: '0px',
            borderStyle: 'solid',
            opacity: '1',
            textAlign: isBox(parent) ? 'left' : 'center',
            className: '',
        },
        height: height,
        key: key,
        colDistribution: [100],
        cols: [
            [100],
        ],
    };
}
