import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from "universal-cookie";
import { Grid, Col, Row } from 'react-bootstrap';

import ActionsRibbon from '../components/nav_bar/actions_ribbon/ActionsRibbon';
import AlertModal from "../components/modals/AlertModal";
import AutoSave from '../components/autosave/AutoSave';
import ContainedCanvas from '../components/rich_plugins/contained_canvas/ContainedCanvas';
import DnDListener from "../components/common/dnd_listener/DnDListener";
import Ediphy from '../../core/editor/main';
import EdiphyTour from '../components/joyride/EdiphyTour';
import EditorCanvas from '../components/canvas/editor_canvas/EditorCanvas';
import EditorCarousel from '../components/carousel/editor_carousel/EditorCarousel';
import EditorNavBar from '../components/nav_bar/editor_nav_bar/EditorNavBar';
import FileModal from '../components/external_provider/file_modal/FileModal';
import HelpModal from "../components/modals/HelpModal";
import InitModal from "../components/modals/InitModal";
import KeyListener from "../components/common/key_listener/KeyListener";
import PluginConfigModal from '../components/plugin_config_modal/PluginConfigModal';
import PluginRibbon from '../components/nav_bar/plugin_ribbon/PluginRibbon';
import RichMarksModal from '../components/rich_plugins/rich_marks_modal/RichMarksModal';
import ServerFeedback from '../components/server_feedback/ServerFeedback';
import Toolbar from '../components/toolbar/toolbar/Toolbar';
import Visor from '../../_visor/containers/Visor';

import { isSection } from '../../common/utils';
import { handle_boxes, handle_contained_views, handle_sortable_containers, handle_marks,
    handle_modals, handle_nav_items, handle_toolbars, handle_exercises, handle_canvas,
    handle_export_import } from "../handlers/combine_handlers";

const cookies = new Cookies();

/**
 * EditorApp. Main application component that renders everything else
 */
class EditorApp extends Component {

    constructor(props) {
        super(props);
        this.state = { alert: null };
        this.handleBoxes = handle_boxes(this);
        this.handleContainedViews = handle_contained_views(this);
        this.handleSortableContainers = handle_sortable_containers(this);
        this.handleModals = handle_modals(this);
        this.handleMarks = handle_marks(this);
        this.handleNavItems = handle_nav_items(this);
        this.handleToolbars = handle_toolbars(this);
        this.handleExercises = handle_exercises(this);
        this.handleCanvas = handle_canvas(this);
        this.handleExportImport = handle_export_import(this);
    }
    render() {
        const currentState = this.props.store.getState();
        const { boxSelected, navItemSelected, containedViewSelected, isBusy, pluginToolbars, globalConfig, reactUI, status, everPublished } = this.props;

        const ribbonHeight = reactUI.hideTab === 'hide' ? 0 : 50;
        const disabled = (navItemSelected === 0 && containedViewSelected === 0) || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected));

        const pluginSelected = pluginToolbars[boxSelected]
                                && pluginToolbars[boxSelected].config
                                && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name)
            ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name) : false;
        const defaultMarkValue = pluginSelected ? pluginSelected.getConfig().defaultMarkValue : 0;
        const validateMarkValueInput = pluginSelected ? pluginSelected.validateValueInput : null;

        const canvasProps = {
            handleBoxes: this.handleBoxes,
            handleCanvas: this.handleCanvas,
            handleMarks: this.handleMarks,
            handleModals: this.handleModals,
            handleSortableContainers: this.handleSortableContainers,
            onContainedViewSelected: this.handleContainedViews.onContainedViewSelected,
            onToolbarUpdated: this.handleToolbars.onToolbarUpdated,
            setCorrectAnswer: this.handleExercises.setCorrectAnswer,
        };

        return (
            <Grid id="app" fluid style={{ height: '100%', overflow: 'hidden' }} ref={'app'}>
                <Row className="navBar">
                    <EdiphyTour
                        toggleTour={this.handleModals.toggleTour}
                        showTour={reactUI.showTour}
                    />
                    <HelpModal
                        showTour={this.handleModals.showTour}
                    />
                    <InitModal
                        showTour={this.handleModals.showTour}
                    />
                    <ServerFeedback/>
                    <AlertModal/>

                    <EditorNavBar
                        globalConfig={{ ...globalConfig, status, everPublished }}
                        handleExportImport={this.handleExportImport}
                    />
                    {Ediphy.Config.autosave_time > 1000 &&
                    <AutoSave
                        save={this.handleExportImport.save}
                        isBusy={isBusy}
                    />})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel
                        onBoxAdded={this.handleBoxes.onBoxAdded}
                        handleContainedViews={this.handleContainedViews}
                        handleCanvas={this.handleCanvas}
                        handleNavItems={this.handleNavItems}
                    />

                    <Col id="colRight" xs={12}
                        style={{ height: (reactUI.carouselFull ? 0 : '100%'),
                            width: (reactUI.carouselShow ? 'calc(100% - 212px)' : 'calc(100% - 80px)') }}>
                        <Row id="actionsRibbon">
                            <ActionsRibbon
                                ribbonHeight={ ribbonHeight + 'px'}
                                onBoxDeleted={this.handleBoxes.onBoxDeleted}
                            />
                        </Row>

                        <Row id="ribbonRow" style={{ top: '-1px', left: (reactUI.carouselShow ? '15px' : '147px') }}>
                            <PluginRibbon
                                disabled={disabled}
                                onBoxAdded={this.handleBoxes.onBoxAdded}
                                ribbonHeight={ ribbonHeight + 'px'}
                            />
                        </Row>

                        <Row id="canvasRow" style={{ height: 'calc(100% - ' + ribbonHeight + 'px)' }}>
                            <EditorCanvas
                                {...canvasProps}
                            />
                            <ContainedCanvas
                                {...canvasProps}
                            />
                        </Row>
                    </Col>
                </Row>
                <Visor id="visor"
                    state={{
                        ...currentState.undoGroup.present,
                        filesUploaded: currentState.filesUploaded,
                        status: currentState.status }}
                />
                <Toolbar
                    top={(60 + ribbonHeight) + 'px'}
                    handleBoxes={this.handleBoxes}
                    handleNavItems={this.handleNavItems}
                    handleContainedViews={this.handleContainedViews}
                    handleMarks={this.handleMarks}
                    handleModals={this.handleModals}
                    handleSortableContainers={this.handleSortableContainers}
                    handleToolbars={this.handleToolbars}
                    onScoreConfig={this.handleExercises.onScoreConfig}
                    onTextEditorToggled={this.handleCanvas.onTextEditorToggled}
                />
                <PluginConfigModal id={reactUI.pluginConfigModal}
                    openFileModal={this.handleModals.openFileModal}
                    updatePluginToolbar={this.handleToolbars.onPluginToolbarUpdated}
                />
                <RichMarksModal
                    defaultValueMark={defaultMarkValue}
                    validateValueInput={validateMarkValueInput}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    handleMarks={this.handleMarks}
                />
                <FileModal
                    disabled={disabled}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    handleExportImport={this.handleExportImport}
                    handleNavItems={this.handleNavItems}
                    onIndexSelected={this.handleCanvas.onIndexSelected}
                />
                <KeyListener
                    handleNavItems={this.handleNavItems}
                    handleBoxes={this.handleBoxes}
                />
                <DnDListener/>
            </Grid>
        );
    }

    /**
     * After component mounts
     * Loads plugin API and sets listeners for plugin events, marks and keyboard keys pressed
     */
    componentDidMount() {

        const inProduction = process.env.NODE_ENV === 'production';
        const isDoc = process.env.DOC === 'doc';

        if (inProduction && !isDoc && ediphy_editor_json && ediphy_editor_json !== 'undefined') {
            this.handleExportImport.importState(ediphy_editor_json);
        }
        if (inProduction && isDoc) {
            window.oncontextmenu = () => false;
        }
        if(cookies.get("ediphy_visitor") === undefined) {
            cookies.set("ediphy_visitor", true);
        }
    }
}

function mapStateToProps(state) {
    return {
        reactUI: state.reactUI,
        version: state.undoGroup.present.version,
        status: state.status,
        everPublished: state.everPublished,
        globalConfig: state.undoGroup.present.globalConfig,
        title: state.undoGroup.present.globalConfig.title || '---',
        filesUploaded: state.filesUploaded,
        boxes: state.undoGroup.present.boxesById,
        boxSelected: state.undoGroup.present.boxSelected,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        indexSelected: state.undoGroup.present.indexSelected,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        undoDisabled: state.undoGroup.past.length === 0,
        redoDisabled: state.undoGroup.future.length === 0,
        displayMode: state.undoGroup.present.displayMode,
        marks: state.undoGroup.present.marksById,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
        exercises: state.undoGroup.present.exercises,
        isBusy: state.undoGroup.present.isBusy,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched || "",
    };
}

export default connect(mapStateToProps)(EditorApp);

EditorApp.propTypes = {
    globalConfig: PropTypes.object.isRequired,
    filesUploaded: PropTypes.any,
    boxes: PropTypes.object.isRequired,
    boxSelected: PropTypes.any,
    marks: PropTypes.object,
    navItems: PropTypes.object.isRequired,
    navItemSelected: PropTypes.any,
    containedViews: PropTypes.object.isRequired,
    containedViewSelected: PropTypes.any,
    pluginToolbars: PropTypes.object,
    viewToolbars: PropTypes.object.isRequired,
    isBusy: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    store: PropTypes.any,
    lastActionDispatched: PropTypes.string,
    status: PropTypes.string,
    everPublished: PropTypes.bool,
    reactUI: PropTypes.object,
    title: PropTypes.string,
};
