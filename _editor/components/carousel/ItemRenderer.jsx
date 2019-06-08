import React from 'react';
import PropTypes from 'prop-types';

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

const ItemRenderer = (props) => {
    const { id, navItemSelected, connectDragSource, connectDragPreview, connectDropTarget, type, onIndexSelected, onNavItemSelected }
        = props;
    const collapsed = props.collapsed ? 'collapsed ' : '';
    const selected = type === 'file' && id === navItemSelected ? 'selected ' : ' ';
    return connectDragSource(connectDragPreview(connectDropTarget(
        <div className={"carousselContainer " + collapsed + selected + 'is' + type}
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
    /**
     * Global parent of navItems (0)
     */
    id: PropTypes.any,
    /**
     * Indicates whether the carousel has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     *  View/Contained view selected at the index
     */
    navItemsIds: PropTypes.array,
    /**
     * Callback for adding a new box
     */
    onBoxAdded: PropTypes.func,
    /**
     * Callback for selecting contained view
     */
    onContainedViewNameChanged: PropTypes.func,
    /**
     * Callback for renaming contained view
     */
    onContainedViewSelected: PropTypes.func,
    /**
     * Callback for renaming view
     */
    onIndexSelected: PropTypes.func,
    /**
     * Adds a new view
     */
    onNavItemAdded: PropTypes.func,
    /**
     * Expands navItem (only for sections)
     */
    onNavItemExpanded: PropTypes.func,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Callback for reordering navItems
     */
    onNavItemReordered: PropTypes.func,
    /**
     * Selects a view
     */
    onNavItemSelected: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * Object containing all the pages' toolbars
     */
    name: PropTypes.string,
    /**
     * Object containing all the pages' toolbars
     */
    type: PropTypes.oneOf(['folder', 'file']),
    /**
     * Indicates if objects is collapsed (not expanded)
     */
    collapsed: PropTypes.bool,
    /**
     * Function to connect Drag source
     */
    connectDragSource: PropTypes.func,
    /**
     * Manages preview when dragging
     */
    connectDragPreview: PropTypes.func,
    /**
     * Function to connect Drop target
     */
    connectDropTarget: PropTypes.func,
    /**
     * Boolean that indicates if object is dragging
     */
    isDragging: PropTypes.bool,
    /**
     *  Array of navItems path in tree to current navItem
     */
    path: PropTypes.array,
};

Folder.propTypes = {
    /**
     * Id of the current sortable element
     */
    id: PropTypes.string,
    /**
     * Name of the current sortable element
     */
    name: PropTypes.string,
    /**
     * Indicates if current sortable element is collapsed
     */
    collapsed: PropTypes.bool,
    /**
     * Index number within list of sortable containers
     */
    index: PropTypes.number,
    /**
     * Callback function for collapsing sections
     */
    onToggleCollapse: PropTypes.func,
    /**
     *  Array of navItems path in tree to current navItem
     */
    path: PropTypes.array,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
};
File.propTypes = {
    /**
     * Id of the current sortable element
     */
    id: PropTypes.string,
    /**
     * Name of the current sortable element
     */
    name: PropTypes.string,
    /**
     * Indicates if current sortable element is collapsed
     */
    collapsed: PropTypes.bool,
    /**
     *  Array of navItems path in tree to current navItem
     */
    path: PropTypes.array,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItems: PropTypes.object,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
};

export default ItemRenderer;
