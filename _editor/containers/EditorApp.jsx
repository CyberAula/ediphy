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
import { handleBoxes, handleContainedViews, handleSortableContainers, handleMarks,
    handleModals, handleNavItems, handleToolbars, handleExercises, handleCanvas,
    handleExportImport } from "../handlers";

const cookies = new Cookies();

/**
 * EditorApp. Main application component that renders everything else
 */
class EditorApp extends Component {

    constructor(props) {
        super(props);
        this.state = { alert: null };
        this.initializeHandlers();
    }

    render() {
        const currentState = this.props.store.getState();
        const { boxSelected, navItemSelected, containedViewSelected, isBusy, pluginToolbars,
            globalConfig, reactUI, status, everPublished } = this.props;

        const ribbonHeight = reactUI.hideTab === 'hide' ? 0 : 50;
        const disabled = (navItemSelected === 0 && containedViewSelected === 0)
            || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected));

        let pluginSelected = false;
        try {
            pluginSelected = Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name);
        } catch(e) {
        }
        const defaultMarkValue = pluginSelected ? pluginSelected.getConfig()?.defaultMarkValue : 0;
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
                        showTour={reactUI.showTour}
                        toggleTour={this.handleModals.toggleTour}
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
                        isBusy={isBusy}
                        save={this.handleExportImport.save}
                    />})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel
                        handleCanvas={this.handleCanvas}
                        handleContainedViews={this.handleContainedViews}
                        handleNavItems={this.handleNavItems}
                        onBoxAdded={this.handleBoxes.onBoxAdded}
                    />

                    <Col id="colRight" xs={12}
                        style={{ height: (reactUI.carouselFull ? 0 : '100%'),
                            width: (reactUI.carouselShow ? 'calc(100% - 212px)' : 'calc(100% - 80px)') }}>
                        <Row id="actionsRibbon">
                            <ActionsRibbon
                                onBoxDeleted={this.handleBoxes.onBoxDeleted}
                                ribbonHeight={ ribbonHeight + 'px'}
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
                    handleBoxes={this.handleBoxes}
                    handleContainedViews={this.handleContainedViews}
                    handleMarks={this.handleMarks}
                    handleModals={this.handleModals}
                    handleNavItems={this.handleNavItems}
                    handleSortableContainers={this.handleSortableContainers}
                    handleToolbars={this.handleToolbars}
                    onScoreConfig={this.handleExercises.onScoreConfig}
                    onTextEditorToggled={this.handleCanvas.onTextEditorToggled}
                    top={(60 + ribbonHeight) + 'px'}
                />
                <PluginConfigModal id={reactUI.pluginConfigModal}
                    openFileModal={this.handleModals.openFileModal}
                    updatePluginToolbar={this.handleToolbars.onPluginToolbarUpdated}
                />
                <RichMarksModal
                    defaultValueMark={defaultMarkValue}
                    handleMarks={this.handleMarks}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    validateValueInput={validateMarkValueInput}
                />
                <FileModal
                    disabled={disabled}
                    handleExportImport={this.handleExportImport}
                    handleNavItems={this.handleNavItems}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    onIndexSelected={this.handleCanvas.onIndexSelected}
                />
                <KeyListener
                    handleBoxes={this.handleBoxes}
                    handleNavItems={this.handleNavItems}
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

    initializeHandlers = () => {
        this.handleBoxes = handleBoxes(this);
        this.handleContainedViews = handleContainedViews(this);
        this.handleExercises = handleExercises(this);
        this.handleExportImport = handleExportImport(this);
        this.handleModals = handleModals(this);
        this.handleMarks = handleMarks(this);
        this.handleNavItems = handleNavItems(this);
        this.handleSortableContainers = handleSortableContainers(this);
        this.handleToolbars = handleToolbars(this);
        this.handleCanvas = handleCanvas(this);
    }
}

function mapStateToProps(state) {
    return {
        boxes: state.undoGroup.present.boxesById,
        boxLevelSelected: state.undoGroup.present.boxLevelSelected,
        boxSelected: state.undoGroup.present.boxSelected,
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        displayMode: state.undoGroup.present.displayMode,
        everPublished: state.everPublished,
        exercises: state.undoGroup.present.exercises,
        filesUploaded: state.filesUploaded,
        globalConfig: state.undoGroup.present.globalConfig,
        indexSelected: state.undoGroup.present.indexSelected,
        isBusy: state.undoGroup.present.isBusy,
        lastActionDispatched: state.undoGroup.present.lastActionDispatched || "",
        marks: state.undoGroup.present.marksById,
        navItems: state.undoGroup.present.navItemsById,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItemSelected: state.undoGroup.present.navItemSelected,
        pluginToolbars: state.undoGroup.present.pluginToolbarsById,
        reactUI: state.reactUI,
        redoDisabled: state.undoGroup.future.length === 0,
        status: state.status,
        title: state.undoGroup.present.globalConfig.title || '---',
        undoDisabled: state.undoGroup.past.length === 0,
        version: state.undoGroup.present.version,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorApp);

EditorApp.propTypes = {
    boxes: PropTypes.object.isRequired,
    boxLevelSelected: PropTypes.number,
    boxSelected: PropTypes.any,
    containedViews: PropTypes.object.isRequired,
    containedViewSelected: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    displayMode: PropTypes.any,
    everPublished: PropTypes.bool,
    exercises: PropTypes.object.isRequired,
    filesUploaded: PropTypes.any,
    globalConfig: PropTypes.object.isRequired,
    indexSelected: PropTypes.any,
    isBusy: PropTypes.any,
    lastActionDispatched: PropTypes.string,
    marks: PropTypes.object,
    navItems: PropTypes.object.isRequired,
    navItemsIds: PropTypes.array.isRequired,
    navItemSelected: PropTypes.any,
    pluginToolbars: PropTypes.object,
    reactUI: PropTypes.object,
    redoDisabled: PropTypes.bool,
    status: PropTypes.string,
    store: PropTypes.any,
    title: PropTypes.string,
    undoDisabled: PropTypes.bool,
    version: PropTypes.any,
    viewToolbars: PropTypes.object.isRequired,
};
