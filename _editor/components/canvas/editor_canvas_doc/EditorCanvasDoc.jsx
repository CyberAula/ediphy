import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorBox from '../editor_box/EditorBox';
import EditorBoxSortable from '../editor_box_sortable/EditorBoxSortable';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import { Col } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import Ediphy from '../../../../core/editor/main';
import { isSortableBox } from '../../../../common/utils';
import ThemeCSS from "../../../../common/themes/ThemeCSS";
import { getThemeColors } from "../../../../common/themes/theme_loader";

export default class EditorCanvasDoc extends Component {
    render() {
        let titles = [];
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        if (itemSelected.id !== 0) {
            let initialTitle = this.props.viewToolbars[itemSelected.id].viewName;
            titles.push(initialTitle);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.viewToolbars[parent].viewName);
                    parent = this.props.navItems[parent].parent;
                }
            }
            titles.reverse();
        }

        let boxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;

        let styleConfig = this.props.styleConfig;
        let toolbar = this.props.viewToolbars[itemSelected.id];
        let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;
        let colors = toolbar.colors ? toolbar.colors : getThemeColors(theme);

        let commonProps = { ...this.props,
            pageType: itemSelected.type || 0,
            themeColors: colors,
        };

        return (
            <Col id={(this.props.fromCV ? 'containedCanvas' : 'canvas')} md={12} xs={12} className="canvasDocClass safeZone"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>

                <div className={"scrollcontainer parentRestrict " + theme}
                    style={{ backgroundColor: show ? toolbar.background : 'transparent', display: show ? 'block' : 'none' }}
                    onMouseDown={e => {
                        if (e.target === e.currentTarget) {
                            this.props.onBoxSelected(-1);
                            this.setState({ showTitle: false });
                        }
                        e.stopPropagation();
                    }}>
                    { /* {this.props.boxSelected} - ({(this.props.boxSelected && this.props.boxes[this.props.boxSelected]) ? this.props.boxes[this.props.boxSelected].level : '-'}) - {this.props.boxLevelSelected} */ }
                    <EditorHeader titles={titles}
                        onBoxSelected={this.props.onBoxSelected}
                        courseTitle={this.props.title}
                        navItem={this.props.navItemSelected}
                        navItems={this.props.navItems}
                        marks={this.props.marks}
                        containedView={this.props.containedViewSelected}
                        containedViews={this.props.containedViews}
                        pluginToolbars={this.props.pluginToolbars}
                        viewToolbars={this.props.viewToolbars}
                        boxes={this.props.boxes}
                        onViewTitleChanged={this.props.onViewTitleChanged}
                        onTitleChanged={this.props.onTitleChanged}
                    />
                    <div className="outter canvaseditor" style={{ display: show ? 'block' : 'none' }}>
                        <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={(this.props.fromCV ? 'airlayer_cv' : 'airlayer') + ' doc_air'}
                            style={{ visibility: (show ? 'visible' : 'hidden') }}>

                            <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                                className={'innercanvas doc'}
                                style={{ visibility: (show ? 'visible' : 'hidden'), paddingBottom: '10px' }}>

                                <br/>

                                {boxes.map(id => {
                                    if (!isSortableBox(id)) {
                                        return null;
                                    }
                                    return <EditorBoxSortable key={id} {...commonProps}
                                        id={id} exercises={this.props.exercises} page={itemSelected ? itemSelected.id : 0} themeColors={colors} />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <ThemeCSS
                    styleConfig={this.props.styleConfig}
                    aspectRatio = {this.props.aspectRatio}
                    theme={theme}
                    toolbar={{ ...toolbar, colors: colors }}
                />
                <EditorShortcuts
                    openConfigModal={this.props.openConfigModal}
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    onToolbarUpdated={this.props.onToolbarUpdated}
                    navItemSelected={this.props.navItemSelected}
                    fileModalResult={this.props.fileModalResult}
                    openFileModal={this.props.openFileModal}
                    lastActionDispatched={this.props.lastActionDispatched}
                    pointerEventsCallback={this.props.pluginToolbars[this.props.boxSelected] && this.props.pluginToolbars[this.props.boxSelected].config && this.props.pluginToolbars[this.props.boxSelected].config.name && Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name) ? Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    pluginToolbar={this.props.pluginToolbars[this.props.boxSelected]}/>
            </Col>
        );
    }
}

EditorCanvasDoc.propTypes = {
    /**
     * Check if component is rendered from contained view
     */
    fromCV: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Selected box level (only plugins inside plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Course title
     */
    title: PropTypes.string.isRequired,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Callback for adding a mark shortcut
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Callback for deleting mark creator overlay
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identifier of the box that is creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Callback for toggling creation mark overlay
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Callback for deleting a box
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Callback for selecting a box
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Callback for increasing box level selected (only plugins inside plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Callback for moving a box
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Callback for resizing a box
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Callback for dropping a box
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Callback for vertically aligning boxes inside a container
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Callback for reordering boxes inside a container
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Callback for deleting a sortable container
     */
    onSortableContainerDeleted: PropTypes.func.isRequired,
    /**
     * Callback for reordering sortable containers
     */
    onSortableContainerReordered: PropTypes.func.isRequired,
    /**
     * Callback for resizing a sortable container
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Callback for toggling CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
   * Callback for toggling rich marks modal creator
   */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
     * Callback for moving marks
     */
    onRichMarkMoved: PropTypes.func.isRequired,
    /**
     * Callback for modify navitem title and subtitle
     */
    onViewTitleChanged: PropTypes.func.isRequired,
    /**
     * Callback for modify course title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
   * Object containing all exercises
   */
    exercises: PropTypes.object,
    /**
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,
    /**
   * Callback for setting the right answer of an exercise
   */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
   * Callback for updating view toolbar
   */
    onToolbarUpdated: PropTypes.func,
    /**
     * Last files uploaded to server or searched in modal
     */
    fileModalResult: PropTypes.object,
    /**
     * Function that opens the file search modal
     */
    openFileModal: PropTypes.func.isRequired,
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
    /**
     * Aspect ratio of slides
     */
    aspectRatio: PropTypes.number,
};
