import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import style from './ItemRenderer.scss';
import EditorIndexTitle from "./editor_index_title/EditorIndexTitle";
import { isSlide } from "../../../common/utils";
import iconPDF from "../../../dist/images/file-pdf.svg";

const Folder = ({ name, collapsed, index, path, onToggleCollapse, id, navItems, onNavItemNameChanged, viewToolbars, indexSelected, containedViewSelected }) => {
    const handleClick = () => {
        onToggleCollapse(index);
    };
    const classCollapsed = collapsed ? 'collapsed' : '';
    const classIndexSelected = id === indexSelected ? ' classIndexSelected ' : ' ';
    return (
        <div className={ 'folder navItemBlock ' + classCollapsed + classIndexSelected }
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: path.length * 20 }}
        >
            <button className={'toggleCollapseHandle' } onClick={handleClick}>
                <i className={collapsed ? "material-icons collapsed" : "material-icons "}>
                    keyboard_arrow_down
                </i>
            </button>
            <EditorIndexTitle id={id}
                index={navItems[navItems[id].parent].children.indexOf(id) + 1 + '.'}
                title={viewToolbars[id].viewName}
                hidden={navItems[id].hidden}
                selected={ indexSelected }
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

const File = ({ name, collapsed, id, path, navItems, onNavItemNameChanged, viewToolbars, indexSelected, containedViewSelected }) => {
    const classCollapsed = collapsed ? 'collapsed' : '';
    const classIndexSelected = id === indexSelected ? ' classIndexSelected ' : ' ';
    const classContainedViewSelected = id === containedViewSelected ? ' selected ' : ' notSelected ';
    return (<div className={ 'file navItemBlock ' + classCollapsed + classIndexSelected + classContainedViewSelected }
        style={{ marginLeft: path.length * 20 } } >
        {(navItems[id].customSize === 0) ?
            <i className="material-icons fileIcon">{isSlide(navItems[id].type) ? "slideshow" : "insert_drive_file"}</i>
            : <img className="svgIcon" src={iconPDF}/>}
        <EditorIndexTitle id={id}
            index={navItems[navItems[id].parent].children.indexOf(id) + 1 + '.'}
            title={viewToolbars[id].viewName}
            hidden={navItems[id].hidden}
            selected={ indexSelected }
            onNameChanged={onNavItemNameChanged}/>
    </div>);
};
File.propTypes = {
    name: PropTypes.string.isRequired,
    collapsed: PropTypes.bool,
};

File.defaultProps = {
    collapsed: false,
};

const ItemRenderer = (props) => {
    const { id, navItemSelected, connectDragSource, connectDragPreview, connectDropTarget, isDragging, isClosestDragging, type, path, onIndexSelected, onNavItemSelected }
        = props;
    const collapsed = props.collapsed ? 'collapsed ' : '';
    const selected = type === 'file' && id === navItemSelected ? 'selected ' : '';
    return connectDragSource(connectDragPreview(connectDropTarget(
        <div className={"carousselContainer " + collapsed + selected}
            onMouseDown={e => {
                onIndexSelected(id);
                // e.stopPropagation();
            }}
            onDoubleClick={e => {
                onNavItemSelected(id);
                e.stopPropagation();
            }}>
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
