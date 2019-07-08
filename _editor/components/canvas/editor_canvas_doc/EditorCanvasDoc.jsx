import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorBox from '../editor_box/EditorBox';
import EditorBoxSortable from '../editor_box_sortable/EditorBoxSortable';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import { Col } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import Ediphy from '../../../../core/editor/main';
import { getTitles, isSortableBox, has, hasIt } from '../../../../common/utils';
import ThemeCSS from "../../../../common/themes/ThemeCSS";
import { getThemeColors } from "../../../../common/themes/theme_loader";
import { connect } from "react-redux";

class EditorCanvasDoc extends Component {
    render() {
        const { aspectRatio, boxes, boxSelected, boxLevelSelected, containedViewSelected, containedViews,
            exercises, fromCV, lastActionDispatched, marks, markCreatorId, navItemSelected, navItems, onTextEditorToggled,
            onTitleChanged, onToolbarUpdated, onViewTitleChanged, openConfigModal, openFileModal, pluginToolbars,
            styleConfig, title, viewToolbars, handleBoxes, handleMarks, handleSortableContainers } = this.props;

        const itemSelected = fromCV ? containedViewSelected : navItemSelected;
        const titles = getTitles(itemSelected, viewToolbars, navItems, fromCV);

        let itemBoxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;

        let toolbar = viewToolbars[itemSelected.id];
        let theme = toolbar && toolbar.theme ? toolbar.theme : styleConfig && styleConfig.theme ? styleConfig.theme : 'default';
        let colors = toolbar && toolbar.colors ? toolbar.colors : getThemeColors(theme);

        return (
            <Col id={(fromCV ? 'containedCanvas' : 'canvas')} md={12} xs={12} className="canvasDocClass safeZone"
                style={{ display: containedViewSelected !== 0 && !fromCV ? 'none' : 'initial' }}>

                <div className={"scrollcontainer parentRestrict " + theme}
                    style={{ backgroundColor: show ? toolbar.background : 'transparent', display: show ? 'block' : 'none' }}
                    onMouseDown={e => {
                        if (e.target === e.currentTarget) {
                            handleBoxes.onBoxSelected(-1);
                            this.setState({ showTitle: false });
                        }
                        e.stopPropagation();
                    }}>
                    <EditorHeader
                        titles={titles}
                        onBoxSelected={handleBoxes.onBoxSelected}
                        courseTitle={title}
                        navItem={navItemSelected}
                        navItems={navItems}
                        marks={marks}
                        containedView={containedViewSelected}
                        containedViews={containedViews}
                        pluginToolbars={pluginToolbars}
                        viewToolbars={viewToolbars}
                        boxes={boxes}
                        onViewTitleChanged={onViewTitleChanged}
                        onTitleChanged={onTitleChanged}
                    />
                    <div className="outter canvaseditor" style={{ display: show ? 'block' : 'none' }}>
                        <div id={fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={(fromCV ? 'airlayer_cv' : 'airlayer') + ' doc_air'}
                            style={{ visibility: (show ? 'visible' : 'hidden') }}>

                            <div id={fromCV ? "contained_maincontent" : "maincontent"}
                                className={'innercanvas doc'}
                                style={{ visibility: (show ? 'visible' : 'hidden'), paddingBottom: '10px' }}>

                                <br/>
                                {itemBoxes.map(id => {
                                    if (!isSortableBox(id)) {
                                        return null;
                                    }
                                    return <EditorBoxSortable
                                        key={id}
                                        id={id}
                                        boxLevelSelected={boxLevelSelected}
                                        boxSelected={boxSelected}
                                        boxes={boxes}
                                        exercises={exercises}
                                        containedViews={containedViews}
                                        containedViewSelected={containedViewSelected}
                                        pluginToolbars={pluginToolbars}
                                        lastActionDispatched={lastActionDispatched}
                                        handleBoxes = {handleBoxes}
                                        handleMarks={handleMarks}
                                        handleSortableContainers={handleSortableContainers}
                                        markCreatorId={markCreatorId}
                                        onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                        onTextEditorToggled={this.props.onTextEditorToggled}
                                        pageType={itemSelected.type || 0}
                                        setCorrectAnswer={this.props.setCorrectAnswer}
                                        page={itemSelected ? itemSelected.id : 0}
                                        marks={marks}
                                        onToolbarUpdated={onToolbarUpdated}
                                        themeColors={colors}
                                    />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <ThemeCSS
                    styleConfig={styleConfig}
                    aspectRatio = {aspectRatio}
                    theme={theme}
                    toolbar={{ ...toolbar, colors: colors }}
                />
                <EditorShortcuts
                    openConfigModal={openConfigModal}
                    isContained={fromCV}
                    onTextEditorToggled={onTextEditorToggled}
                    onBoxResized={handleBoxes.onBoxResized}
                    onBoxDeleted={handleBoxes.onBoxDeleted}
                    onToolbarUpdated={onToolbarUpdated}
                    openFileModal={openFileModal}
                    lastActionDispatched={lastActionDispatched}
                    pointerEventsCallback={pluginToolbars[boxSelected] && pluginToolbars[boxSelected].config && pluginToolbars[boxSelected].config.name && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name) ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={handleMarks.onMarkCreatorToggled}
                />
            </Col>
        );
    }
}

export default connect(mapStateToProps)(EditorCanvasDoc);

function mapStateToProps(state) {
    return {
        styleConfig: state.undoGroup.present.styleConfig,
    };
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
     * Identifier of the box that is creating a mark
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Callback for vertically aligning boxes inside a container
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
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
