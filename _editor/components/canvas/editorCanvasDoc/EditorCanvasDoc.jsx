import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import Ediphy from '../../../../core/editor/main';
import EditorBoxSortable from '../editorBoxSortable/EditorBoxSortable';
import EditorShortcuts from '../editorShortcuts/EditorShortcuts';
import EditorHeader from '../editorHeader/EditorHeader';
import { getTitles, isSortableBox } from '../../../../common/utils';

import ThemeCSS from "../../../../common/themes/ThemeCSS";
import { getThemeColors } from "../../../../common/themes/themeLoader";
import { CanvasEditor, ScrollContainer } from "./Styles";
import { AirLayer, Canvas, InnerCanvas } from "../editorCanvas/Styles";

class EditorCanvasDoc extends Component {
    render() {
        const { aspectRatio, boxSelected, containedViewsById, containedViewSelected, fromCV, lastActionDispatched, navItemsById, navItemSelected, onToolbarUpdated, pluginToolbarsById, styleConfig, title, viewToolbarsById, handleBoxes, handleMarks } = this.props;

        const { onTextEditorToggled, onTitleChanged, onViewTitleChanged } = this.props.handleCanvas;
        const { openConfigModal, openFileModal } = this.props.handleModals;

        const itemSelected = fromCV ? containedViewsById[containedViewSelected] : navItemsById[navItemSelected];
        const titles = getTitles(itemSelected, viewToolbarsById, navItemsById, fromCV);

        let itemBoxes = itemSelected ? itemSelected.boxes : [];
        let show = itemSelected && itemSelected.id !== 0;

        let toolbar = viewToolbarsById[itemSelected.id];
        let theme = toolbar && toolbar.theme ? toolbar.theme : styleConfig && styleConfig.theme ? styleConfig.theme : 'default';
        let colors = toolbar && toolbar.colors ? toolbar.colors : getThemeColors(theme);
        console.log(toolbar);
        return (
            <Canvas id={(fromCV ? 'containedCanvas' : 'canvas')} md={12} xs={12} className="canvasDocClass safeZone"
                style={{ display: containedViewSelected !== 0 && !fromCV ? 'none' : 'initial' }}>

                <ScrollContainer className={"scrollcontainer parentRestrict " + theme}
                    style={{ backgroundColor: show ? toolbar.customBackground ? toolbar.background : 'var(--themeColor12)' : '#ffffff', display: show ? 'block' : 'none' }}
                    onMouseDown={e => {
                        if (e.target === e.currentTarget) {
                            handleBoxes.onBoxSelected(-1);
                            this.setState({ showTitle: false });
                        }
                        e.stopPropagation();
                    }}>
                    <EditorHeader
                        isDoc
                        titles={titles}
                        onBoxSelected={handleBoxes.onBoxSelected}
                        courseTitle={title}
                        onViewTitleChanged={onViewTitleChanged}
                        onTitleChanged={onTitleChanged}
                    />
                    <CanvasEditor className="outter" style={{ display: show ? 'block' : 'none' }}>
                        <AirLayer id={fromCV ? 'airlayer_cv' : 'airlayer'}
                            className={(fromCV ? 'airlayer_cv' : 'airlayer') + ' doc_air'}
                            style={{ visibility: (show ? 'visible' : 'hidden') }}>

                            <InnerCanvas id={fromCV ? "contained_maincontent" : "maincontent"}
                                className={'innercanvas doc'}
                                style={{ visibility: (show ? 'visible' : 'hidden'), paddingBottom: '10px' }}>

                                <br />
                                {itemBoxes.map(id => {
                                    if (!isSortableBox(id)) {
                                        return null;
                                    }
                                    return <EditorBoxSortable
                                        onBoxAdded={handleBoxes.onBoxAdded}
                                        onBoxDropped={handleBoxes.onBoxDropped}
                                        key={id}
                                        id={id}
                                        pageType={itemSelected.type || 0}
                                        page={itemSelected ? itemSelected.id : 0}
                                        themeColors={colors}
                                    />;
                                })}
                            </InnerCanvas>
                        </AirLayer>
                    </CanvasEditor>
                </ScrollContainer>
                <ThemeCSS
                    styleConfig={styleConfig}
                    aspectRatio={aspectRatio}
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
                    pointerEventsCallback={pluginToolbarsById[boxSelected] && pluginToolbarsById[boxSelected].config && pluginToolbarsById[boxSelected].config.name && Ediphy.Plugins.get(pluginToolbarsById[boxSelected].config.name) ? Ediphy.Plugins.get(pluginToolbarsById[boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={handleMarks.onMarkCreatorToggled}
                />
            </Canvas>
        );
    }
}

export default connect(mapStateToProps)(EditorCanvasDoc);

function mapStateToProps(state) {
    const { styleConfig } = state.undoGroup.present;
    return {
        styleConfig,
    };
}

EditorCanvasDoc.propTypes = {
    /**
     * Check if component is rendered from contained view
     */
    fromCV: PropTypes.bool,
    /**
     * Current Box selected. If there isn't, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItemsById: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Object containing every contained view (by id)
     */
    containedViewsById: PropTypes.object.isRequired,
    /**
     * Course title
     */
    title: PropTypes.string,
    /**
     * Object containing every view toolbar (by id)
     */
    viewToolbarsById: PropTypes.object.isRequired,
    /**
     * Object containing every plugin toolbar (by id)
     */
    pluginToolbarsById: PropTypes.object.isRequired,
    /**
     * Last action dispatched in Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
   * Callback for updating view toolbar
   */
    onToolbarUpdated: PropTypes.func,
    /**
     * Object containing style configuration
     */
    styleConfig: PropTypes.object,
    /**
     * Aspect ratio of slides
     */
    aspectRatio: PropTypes.number,
    /**
     * Collection of callbacks for boxes handling
     */
    handleBoxes: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for text and titles handling
     */
    handleCanvas: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for marks handling
     */
    handleMarks: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for modals handling
     */
    handleModals: PropTypes.object.isRequired,
};
