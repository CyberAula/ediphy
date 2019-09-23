import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Cookies from "universal-cookie";
import { Grid, Col, Row } from 'react-bootstrap';

import ActionsRibbon from '../components/navBar/actionsRibbon/ActionsRibbon';
import AlertModal from "../components/modals/AlertModal";
import AutoSave from '../components/autosave/AutoSave';
import ContainedCanvas from '../components/richPlugins/containedCanvas/ContainedCanvas';
import DnDListener from "../components/common/dndListener/DnDListener";
import Ediphy from '../../core/editor/main';
import EdiphyTour from '../components/joyride/EdiphyTour';
import EditorCanvas from '../components/canvas/editorCanvas/EditorCanvas';
import EditorCarousel from '../components/carousel/editorCarousel/EditorCarousel';
import EditorNavBar from '../components/navBar/editorNavBar/EditorNavBar';
import FileModal from '../components/externalProvider/fileModal/FileModal';
import HelpModal from "../components/modals/HelpModal";
import InitModal from "../components/modals/InitModal";
import KeyListener from "../components/common/keyListener/KeyListener";
import PluginConfigModal from '../components/pluginConfigModal/PluginConfigModal';
import PluginRibbon from '../components/navBar/pluginRibbon/PluginRibbon';
import RichMarksModal from '../components/richPlugins/richMarksModal/RichMarksModal';
import ServerFeedback from '../components/serverFeedback/ServerFeedback';
import Toolbar from '../components/toolbar/toolbar/Toolbar';
import Visor from '../../_visor/containers/Visor';

import { isSection } from '../../common/utils';
import { handleBoxes, handleContainedViews, handleSortableContainers, handleMarks,
    handleModals, handleToolbars, handleExercises, handleCanvas,
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
        const { boxSelected, navItemSelected, containedViewSelected, pluginToolbarsById,
            globalConfig, reactUI, status, everPublished } = this.props;

        const ribbonHeight = reactUI.hideTab === 'hide' ? 0 : 50;
        const disabled = (navItemSelected === 0 && containedViewSelected === 0)
            || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected));

        let pluginSelected = false;
        try {
            pluginSelected = Ediphy.Plugins.get(pluginToolbarsById[boxSelected].config.name);
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
                    <EdiphyTour/>
                    <HelpModal/>
                    <InitModal showTour={this.handleModals.showTour}/>
                    <ServerFeedback/>
                    <AlertModal/>
                    <EditorNavBar globalConfig={{ ...globalConfig, status, everPublished }} handleExportImport={this.handleExportImport}/>
                    {Ediphy.Config.autosave_time > 1000 && <AutoSave save={this.handleExportImport.save}/>})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel/>

                    <Col id="colRight" xs={12}
                        style={{ height: (reactUI.carouselFull ? 0 : '100%'),
                            width: (reactUI.carouselShow ? 'calc(100% - 212px)' : 'calc(100% - 80px)') }}>
                        <Row id="actionsRibbon">
                            <ActionsRibbon ribbonHeight={ ribbonHeight + 'px'}/>
                        </Row>

                        <Row id="ribbonRow" style={{ top: '-1px', left: (reactUI.carouselShow ? '15px' : '147px') }}>
                            <PluginRibbon disabled={disabled} ribbonHeight={ ribbonHeight + 'px'}/>
                        </Row>

                        <Row id="canvasRow" style={{ height: 'calc(100% - ' + ribbonHeight + 'px)' }}>
                            <EditorCanvas {...canvasProps}/>
                            <ContainedCanvas {...canvasProps}/>
                        </Row>
                    </Col>
                </Row>
                <Visor id="visor"
                    state={{
                        ...currentState.undoGroup.present,
                        filesUploaded: currentState.filesUploaded,
                        status: currentState.status }}
                />
                <Toolbar top={(60 + ribbonHeight) + 'px'}/>
                <PluginConfigModal id={reactUI.pluginConfigModal}/>
                <RichMarksModal
                    defaultValueMark={defaultMarkValue}
                    validateValueInput={validateMarkValueInput}
                />
                <FileModal
                    disabled={disabled}
                    handleExportImport={this.handleExportImport}
                />
                <KeyListener/>
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
        this.handleSortableContainers = handleSortableContainers(this);
        this.handleToolbars = handleToolbars(this);
        this.handleCanvas = handleCanvas(this);
    }
}

function mapStateToProps(state) {
    const { reactUI, status, everPublished } = state;
    const { boxSelected, navItemSelected, containedViewSelected, pluginToolbarsById, globalConfig } = state.undoGroup.present;
    return {
        boxSelected, containedViewSelected, navItemSelected, pluginToolbarsById, globalConfig, reactUI, status, everPublished,
    };
}

export default connect(mapStateToProps)(EditorApp);

EditorApp.propTypes = {
    boxSelected: PropTypes.any,
    containedViewSelected: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    everPublished: PropTypes.bool,
    globalConfig: PropTypes.object.isRequired,
    navItemSelected: PropTypes.any,
    pluginToolbarsById: PropTypes.object,
    reactUI: PropTypes.object,
    status: PropTypes.string,
    store: PropTypes.object,
};
