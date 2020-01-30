import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './ItemRenderer.scss';
import './carouselList/_carouselList.scss';

import EditorIndexTitle from "./editorIndexTitle/EditorIndexTitle";
import { isSlide } from "../../../common/utils";
import iconPDF from "../../../dist/images/file-pdf.svg";
import { CarouselContainer, FolderContainer, FileContainer, ToggleCollapseHandle } from './Styles';

const Folder = ({ collapsed, index, path, onToggleCollapse, id, navItemsById, onNavItemNameChanged, viewToolbarsById, indexSelected }) => {
    const handleClick = () => {
        onToggleCollapse(index);
    };
    const classCollapsed = collapsed ? 'collapsed' : '';
    const classIndexSelected = id === indexSelected ? ' classIndexSelected ' : ' ';
    return (
        <FolderContainer className={'folder navItemBlock ' + classCollapsed + classIndexSelected}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: (path.length) * 10 }}
        >
            <ToggleCollapseHandle className={'toggleCollapseHandle'} onClick={handleClick}>
                <i className={collapsed ? "material-icons collapsed" : "material-icons "} style={{ height: '12px', width: '36px' }}>
                    keyboard_arrow_down
                </i>
            </ToggleCollapseHandle>
            <EditorIndexTitle id={id}
                index={navItemsById[navItemsById[id].parent].children.indexOf(id) + 1 + '.'}
                title={viewToolbarsById[id].viewName}
                hidden={navItemsById[id].hidden}
                selected={indexSelected}
                onNameChanged={onNavItemNameChanged} />
        </FolderContainer>
    );
};

const File = ({ collapsed, id, path, navItemsById, onNavItemNameChanged, viewToolbarsById, indexSelected, containedViewSelected }) => {
    const classCollapsed = collapsed ? 'collapsed' : '';
    const classIndexSelected = id === indexSelected ? ' classIndexSelected ' : ' ';
    const classContainedViewSelected = id === containedViewSelected ? ' selected ' : ' notSelected ';
    return (<FileContainer className={'file navItemBlock ' + classCollapsed + classIndexSelected + classContainedViewSelected}
        style={{ marginLeft: path.length * 10 }} >
        {(navItemsById[id].customSize === 0) ?
            <i className="material-icons fileIcon" style={{ height: '12px', width: '36px' }}>{isSlide(navItemsById[id].type) ? "slideshow" : "insert_drive_file"}</i>
            : <img className="svgIcon" src={iconPDF} alt={'PDF'} />}
        <EditorIndexTitle id={id}
            index={navItemsById[navItemsById[id].parent].children.indexOf(id) + 1 + '.'}
            title={viewToolbarsById[id].viewName}
            hidden={navItemsById[id].hidden}
            selected={indexSelected}
            onNameChanged={onNavItemNameChanged} />
    </FileContainer>);
};

class CarouselItemRenderer extends Component {

    render() {
        const { id, navItemSelected, connectDragSource, connectDragPreview, connectDropTarget, type } = this.props;
        const collapsed = this.props.collapsed ? 'collapsed ' : '';
        const selected = type === 'file' && id === navItemSelected ? 'selected ' : ' ';

        return connectDragSource(connectDragPreview(connectDropTarget(
            <div>
                <CarouselContainer className={collapsed + selected + 'is' + type}
                    onMouseDown={this.onMouseDown}
                    onDoubleClick={this.onDoubleClick}>
                    {type === 'folder' && <Folder {...this.props} />}
                    {type === 'file' && <File {...this.props} />}
                </CarouselContainer>
            </div>
        )));
    }

    onMouseDown = () => this.props.onIndexSelected(this.props.id);

    onDoubleClick = e => {
        this.props.onNavItemSelected(this.props.id);
        e.stopPropagation();
    };
}

CarouselItemRenderer.propTypes = {
    /**
     * Global parent of navItemsById (0)
     */
    id: PropTypes.any,
    /**
     * Indicates whether the carousel has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     *  Object containing all contained views (identified by its ID)
     */
    containedViewsById: PropTypes.object,
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
    navItemsById: PropTypes.object,
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
     * Callback for reordering navItemsById
     */
    onNavItemReordered: PropTypes.func,
    /**
     * Selects a view
     */
    onNavItemSelected: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbarsById: PropTypes.object,
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
     *  Array of navItemsById path in tree to current navItem
     */
    path: PropTypes.array,
};

Folder.propTypes = {
    /**
     * Id of the current sortable element
     */
    id: PropTypes.string,
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
     *  Array of navItemsById path in tree to current navItem
     */
    path: PropTypes.array,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItemsById: PropTypes.object,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbarsById: PropTypes.object,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
};
File.propTypes = {
    /**
     * Id of the current sortable element
     */
    id: PropTypes.string,
    /**
     * Indicates if current sortable element is collapsed
     */
    collapsed: PropTypes.bool,
    /**
     *  Array of navItemsById path in tree to current navItem
     */
    path: PropTypes.array,
    /**
     * Dictionary containing all created views, each one with its *id* as the key
     */
    navItemsById: PropTypes.object,
    /**
     * Callback for renaming view
     */
    onNavItemNameChanged: PropTypes.func,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbarsById: PropTypes.object,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Selected contained view
     */
    containedViewSelected: PropTypes.any,
};

export default CarouselItemRenderer;
