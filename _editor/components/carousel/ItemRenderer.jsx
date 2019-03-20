import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './ItemRenderer.scss';
import EditorIndexTitle from "./editor_index_title/EditorIndexTitle";

const Folder = ({ name, collapsed, index, onToggleCollapse, id, navItems, onNavItemNameChanged, viewToolbars }) => {
    const handleClick = () => {
        onToggleCollapse(index);
    };
    return (
        <div className={collapsed ? 'folder collapsed' : 'folder'} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <button className={'toggleCollapseHandle' } onClick={handleClick}>
                <i className={collapsed ? "material-icons folder collapsed" : "material-icons folder"}>
                    keyboard_arrow_down
                </i>
            </button>
            <EditorIndexTitle id={id}
                index={navItems[navItems[id].parent].children.indexOf(id) + 1 + '.'}
                title={viewToolbars[id].viewName}
                hidden={navItems[id].hidden}
                onNameChanged={onNavItemNameChanged} />
        </div>
    );
};
Folder.propTypes = {
    name: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
    index: PropTypes.number.isRequired,
    onToggleCollapse: PropTypes.func.isRequired,
};
Folder.defaultProps = {
    collapsed: false,
};

const File = ({ name, collapsed, id, navItems, onNavItemNameChanged, viewToolbars }) => (
    <div className={collapsed ? 'file collapsed' : 'file'}>
        <i className={classNames(style.icon, 'fa fa-file-o')} />
        <EditorIndexTitle id={id}
            index={navItems[navItems[id].parent].children.indexOf(id) + 1 + '.'}
            title={viewToolbars[id].viewName}
            hidden={navItems[id].hidden}
            onNameChanged={onNavItemNameChanged} />
    </div>
);
File.propTypes = {
    name: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
};

File.defaultProps = {
    collapsed: false,
};

const ItemRenderer = (props) => {
    const { connectDragSource, connectDragPreview, connectDropTarget, isDragging, isClosestDragging, type, path, onIndexSelected }
        = props;
    console.log(props);
    return connectDragSource(connectDragPreview(connectDropTarget(
        <div className={"carousselContainer"} style={{ paddingLeft: path.length * 20 }} onMouseDown={() => onIndexSelected(props.id)}>
            {type === 'folder' && <Folder {...props} />}
            {type === 'file' && <File {...props} />}
        </div>,
    )));
};

ItemRenderer.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['folder', 'file']).isRequired,
    collapsed: PropTypes.bool,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
};

export default ItemRenderer;
