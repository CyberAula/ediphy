import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import { Grid, Col, Row } from 'react-bootstrap';
import {
    addNavItem, selectNavItem, expandNavItem, deleteNavItem, reorderNavItem, toggleNavItem,
    addBox, selectBox, moveBox, resizeBox, updateBox, deleteBox, reorderSortableContainer, dropBox, increaseBoxLevel,
    resizeSortableContainer, deleteSortableContainer, changeCols, changeRows, changeBackground, changeSortableProps,
    reorderBoxes, verticallyAlignBox, selectIndex, duplicateNavItem,
    toggleTextEditor, configScore, exportStateAsync, importState, changeGlobalConfig,
    uploadVishResourceAsync, importEdi, deleteContainedView, selectContainedView,
    addRichMark, editRichMark, moveRichMark, deleteRichMark, setCorrectAnswer,
    updateViewToolbar, updatePluginToolbar, updateUI, addNavItems, uploadEdiphyResourceAsync, deleteRemoteFileVishAsync, deleteRemoteFileEdiphyAsync,
} from '../../common/actions';
import EditorCanvas from '../components/canvas/editor_canvas/EditorCanvas';
import ContainedCanvas from '../components/rich_plugins/contained_canvas/ContainedCanvas';
import EditorCarousel from '../components/carousel/editor_carousel/EditorCarousel';
import PluginConfigModal from '../components/plugin_config_modal/PluginConfigModal';
import Visor from '../../_visor/containers/Visor';
import PluginRibbon from '../components/nav_bar/plugin_ribbon/PluginRibbon';
import ActionsRibbon from '../components/nav_bar/actions_ribbon/ActionsRibbon';
import EditorNavBar from '../components/nav_bar/editor_nav_bar/EditorNavBar';
import ServerFeedback from '../components/server_feedback/ServerFeedback';
import Toolbar from '../components/toolbar/toolbar/Toolbar';
import RichMarksModal from '../components/rich_plugins/rich_marks_modal/RichMarksModal';
import AutoSave from '../components/autosave/AutoSave';
import Alert from '../components/common/alert/Alert';
import ToggleSwitch from '@trendmicro/react-toggle-switch';
import i18n from 'i18next';
import { parsePluginContainers, parsePluginContainersReact } from '../../common/plugins_inside_plugins';
import Ediphy from '../../core/editor/main';
import printToPDF from '../../core/editor/print';
import { isSortableBox, isSection, isContainedView, getDescendantLinkedBoxes, isBox, getDescendantBoxes, getDescendantBoxesFromContainer } from '../../common/utils';
import 'typeface-ubuntu';
import 'typeface-source-sans-pro';
import PropTypes from 'prop-types';
import { ID_PREFIX_BOX } from '../../common/constants';
import { createBox } from '../../common/common_tools';
import FileModal from '../components/external_provider/file_modal/FileModal';
import EdiphyTour from '../components/joyride/EdiphyTour';
import { serialize } from '../../reducers/serializer';
import toMoodleXML from "../../core/editor/moodle_xml.es6";
import HelpModal from "../components/modals/HelpModal";
import InitModal from "../components/modals/InitModal";
import Cookies from "universal-cookie";
const cookies = new Cookies();

/**
 * EditorApp. Main application component that renders everything else
 */
class EditorApp extends Component {

    state = { alert: null };

    render() {
        const currentState = this.props.store.getState();
        const { boxSelected, navItemSelected, containedViewSelected, isBusy, pluginToolbars, globalConfig,
            reactUI, status, everPublished } = this.props;

        const ribbonHeight = reactUI.hideTab === 'hide' ? 0 : 50;
        const disabled = (navItemSelected === 0 && containedViewSelected === 0) || (!Ediphy.Config.sections_have_content && navItemSelected && isSection(navItemSelected));

        const canGetPlugin = pluginToolbars[boxSelected] && pluginToolbars[boxSelected].config && Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name);
        const defaultMarkValue = canGetPlugin ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).getConfig().defaultMarkValue : 0;
        const validateMarkValueInput = canGetPlugin ? Ediphy.Plugins.get(pluginToolbars[boxSelected].config.name).validateValueInput : null;

        const canvasProps = {
            handleBoxes: this.handleBoxes,
            handleMarks: this.handleMarks,
            handleSortableContainers: this.handleSortableContainers,
            onContainedViewSelected: this.handleContainedViews.onContainedViewSelected,
            onTextEditorToggled: this.onTextEditorToggled,
            onTitleChanged: this.onTitleChanged,
            onToolbarUpdated: this.handleToolbars.onToolbarUpdated,
            onViewTitleChanged: this.onViewTitleChanged,
            openConfigModal: this.openConfigModal,
            openFileModal: this.openFileModal,
            setCorrectAnswer: this.handleExercises.setCorrectAnswer,
        };

        return (
            <Grid id="app" fluid style={{ height: '100%', overflow: 'hidden' }} ref={'app'}>
                <Row className="navBar">
                    {reactUI.showTour && <EdiphyTour toggleTour={this.toggleTour} showTour={reactUI.showTour}/>}
                    <HelpModal showTour={this.showTour}/>
                    <InitModal showTour={this.showTour}/>

                    {this.state.alert}
                    <EditorNavBar
                        globalConfig={{ ...globalConfig, status, everPublished }}
                        export={this.handleExportImport.exportResource}
                        scorm={this.handleExportImport.exportToScorm}
                        save={this.save}
                    />
                    {Ediphy.Config.autosave_time > 1000 &&
                    <AutoSave
                        save={this.save}
                        isBusy={isBusy}
                    />})
                </Row>
                <Row style={{ height: 'calc(100% - 60px)' }} id="mainRow">
                    <EditorCarousel
                        onBoxAdded={this.handleBoxes.onBoxAdded}
                        handleContainedViews={this.handleContainedViews}
                        handleNavItems={this.handleNavItems}
                        onIndexSelected={this.onIndexSelected}
                        onTitleChanged={this.onTitleChanged}
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
                                ribbonHeight={ ribbonHeight + 'px'} />
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
                <ServerFeedback
                    title={i18n.t("messages.save_changes")}
                    isBusy={isBusy}
                />
                <Visor id="visor"
                    state={{
                        ...currentState.undoGroup.present,
                        filesUploaded: currentState.filesUploaded,
                        status: currentState.status }}
                />
                <PluginConfigModal id={reactUI.pluginConfigModal}
                    openFileModal={this.openFileModal}
                    updatePluginToolbar={this.handleToolbars.onPluginToolbarUpdated}
                />
                <RichMarksModal
                    defaultValueMark={defaultMarkValue}
                    validateValueInput={validateMarkValueInput}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    handleMarks={this.handleMarks}
                />
                <Toolbar
                    top={(60 + ribbonHeight) + 'px'}
                    handleBoxes={this.handleBoxes}
                    handleNavItems={this.handleNavItems}
                    handleContainedViews={this.handleContainedViews}
                    handleMarks={this.handleMarks}
                    handleSortableContainers={this.handleSortableContainers}
                    handleToolbars={this.handleToolbars}
                    onBackgroundChanged={this.onBackgroundChanged}
                    onScoreConfig={this.handleExercises.onScoreConfig}
                    onTextEditorToggled={this.onTextEditorToggled}
                    openConfigModal={this.openConfigModal}
                    openFileModal={this.openFileModal}
                />
                <FileModal
                    disabled={disabled}
                    onBoxAdded={this.handleBoxes.onBoxAdded}
                    importEdi={this.importEdi}
                    deleteFileFromServer={this.deleteFileFromServer}
                    handleNavItems={this.handleNavItems}
                    onIndexSelected={this.onIndexSelected}
                    uploadFunction={this.uploadFunction}
                    close={this.closeFileModal}
                />
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
            this.props.dispatch(importState(serialize(JSON.parse(ediphy_editor_json))));
        }
        if (inProduction && isDoc) {
            window.oncontextmenu = function() {
                return false;
            };
        }
        document.addEventListener('keydown', this.keyListener);
        document.addEventListener('dragover', this.handleDnD.dragListener);
        document.addEventListener('dragleave', this.handleDnD.dragExitListener);
        document.addEventListener('drop', this.handleDnD.dropListener);
        document.addEventListener('dragstart', this.handleDnD.dragStartListener);

        if(cookies.get("ediphy_visitor") === undefined) {
            cookies.set("ediphy_visitor", true);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyListener);
        document.removeEventListener('dragover', this.handleDnD.dragListener);
        document.removeEventListener('dragleave', this.handleDnD.dragExitListener);
        document.removeEventListener('drop', this.handleDnD.dropListener);
        document.removeEventListener('dragstart', this.handleDnD.dragStartListener);
    }

    // //////////////////////////////////////////////////////////////////////////////////////////////////

    beforeUnloadAlert = () => {
        if(!this.props.reactUI.publishing) {
            return i18n.t('messages.exit_page');
        }
        return undefined;
    };

    deleteFileFromServer = (id, url, callback) => {
        let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
        let deleteFunction = inProduction ? deleteRemoteFileVishAsync : deleteRemoteFileEdiphyAsync;
        this.props.dispatch(deleteFunction(id, url, callback));
    };

    exportResource = (format, callback, options) => {
        let currentState = this.props.store.getState();
        switch (format) {
        case 'PDF':
            printToPDF(currentState.undoGroup.present, callback, options);
            break;
        case 'MoodleXML':
            toMoodleXML(currentState.undoGroup.present, callback, options);
            break;
        case 'edi':
            Ediphy.Visor.exportsEDI({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback);
            break;
        default:
            Ediphy.Visor.exportsHTML({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback, options);
            break;
        }
    };

    exportToScorm = () => (is2004, callback, selfContained = false) => {
        let currentState = this.props.store.getState();
        Ediphy.Visor.exportScorm({
            ...currentState.undoGroup.present,
            filesUploaded: currentState.filesUploaded,
            status: currentState.status }, is2004, callback, selfContained);
    };

    importEdi = (state) => this.props.dispatch(serialize(importEdi(state)));

    keyListener = (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 9) {
            e.preventDefault();
            return;
        }
        // Checks what element has the cursor focus currently
        let focus = document.activeElement.className;
        let notText = (!document.activeElement.type || focus.indexOf('rib') !== -1) && focus.indexOf('form-control') === -1 && focus.indexOf('tituloCurso') === -1 && focus.indexOf('cke_editable') === -1;

        // Ctrl + Z
        if (key === 90 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.undo());
            }
        }
        // Ctrl + Y
        if (key === 89 && e.ctrlKey) {
            if (notText) {
                this.props.dispatch(ActionCreators.redo());
            }
        }
        // Ctrl + A
        if (key === 192 && e.ctrlKey) {
            this.handleNavItems.onNavItemDuplicated(this.props.navItemSelected);
        }

        if (key === 80 && e.ctrlKey && e.shiftKey) {
            e.cancelBubble = true;
            e.preventDefault();

            e.stopImmediatePropagation();
            printToPDF(this.props.store.getState().undoGroup.present, (b)=>{if(b) {alert('Error');}});
        }

        // Supr
        else if (key === 46 || key === 8) {
            if (this.props.boxSelected !== -1 && !isSortableBox(this.props.boxSelected)) {
                // If it is not an input or any other kind of text edition AND there is a box selected, it deletes said box
                if (notText) {
                    let box = this.props.boxes[this.props.boxSelected];
                    let toolbar = this.props.pluginToolbars[this.props.boxSelected];
                    if (!toolbar.showTextEditor) {
                        this.handleBoxes.onBoxDeleted(box.id, box.parent, box.container, this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected);
                    }
                }
            }
        }

        if (key === 112) {
            e.preventDefault();
            this.props.dispatch(updateUI({ showHelpButton: true }));
        }
        if (key === 113) {
            e.preventDefault();
            this.props.dispatch(updateUI({ visorVisible: true }));
        }
    };

    onBackgroundChanged = (id, background) => this.props.dispatch(changeBackground(id, background));

    handleDnD = {

        dragExitListener: (ev) => {
            ev.preventDefault();
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.remove('dragging');
            }
        },

        dragListener: (ev) => {
            let { showFileUpload, blockDrag, fileUploadTab } = this.props.reactUI;
            if (!showFileUpload && !blockDrag) {
                this.props.dispatch(updateUI({
                    showFileUpload: '*',
                    fileModalResult: { id: undefined, value: undefined },
                    fileUploadTab: 0,
                }));
            }
            if (showFileUpload && fileUploadTab !== 0) {
                this.props.dispatch(updateUI({ fileUploadTab: 0 }));
            }
            ev.preventDefault();
            if (ev.target.parentNode && ev.target.parentNode.classList.contains('fileInput')) {
                ev.target.parentNode.classList.add('dragging');
            }
        },

        dragStartListener: () => this.props.dispatch(updateUI({ blockDrag: true })),

        dropListener: (ev) => {
            if (ev.target.tagName === 'INPUT' && ev.target.type === 'file') {
            } else {
                ev.preventDefault();
            }
            this.props.dispatch(updateUI({ blockDrag: false }));
        },
    };

    handleBoxes = {

        onBoxAdded: (...params) => this.props.dispatch(addBox(...params)),

        onBoxDeleted: (id, parent, container, page) => {
            let bx = getDescendantBoxes(this.props.boxes[id], this.props.boxes);
            let cvs = [...this.props.boxes[id].containedViews];
            bx.map(box=>{
                cvs = [...cvs, ...this.props.boxes[box].containedViews];
            });
            this.props.dispatch(deleteBox(id,
                parent,
                container,
                bx,
                cvs,
                page));
        },

        onBoxSelected: (id) => this.props.dispatch(selectBox(id, this.props.boxes[id])),

        onBoxLevelIncreased: () => this.props.dispatch(increaseBoxLevel()),

        onBoxMoved: (...params) => this.props.dispatch(moveBox(...params)),

        onBoxResized: (id, structure) => this.props.dispatch(resizeBox(id, structure)),

        onBoxDropped: (...params) => this.props.dispatch(dropBox(...params)),

        onBoxesInsideSortableReorder: (parent, container, order) => this.props.dispatch(reorderBoxes(parent, container, order)),

        onColsChanged: (...params) => this.props.dispatch(changeCols(...params)),

        onRowsChanged: (...params) => this.props.dispatch(changeRows(...params)),

        onVerticallyAlignBox: (id, verticalAlign) => this.props.dispatch(verticallyAlignBox(id, verticalAlign)),

    };

    handleContainedViews = {

        onContainedViewNameChanged: (id, titleStr) => this.props.dispatch(updateViewToolbar(id, titleStr)),

        onContainedViewSelected: (id) => this.props.dispatch(selectContainedView(id)),

        onContainedViewDeleted: (cvid) => {
            let boxesRemoving = [];
            this.props.containedViews[cvid].boxes.map(boxId => {
                boxesRemoving.push(boxId);
                boxesRemoving = boxesRemoving.concat(getDescendantBoxes(this.props.boxes[boxId], this.props.boxes));
            });
            this.props.dispatch(deleteContainedView([cvid], boxesRemoving, this.props.containedViews[cvid].parent));
        },
    };

    handleMarks = {

        addMarkShortcut: (mark) => {
            let state = JSON.parse(JSON.stringify(this.props.pluginToolbars[this.props.boxSelected].state));
            state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
            if(mark.connection.id) {
                state.__marks[mark.id].connection = mark.connection.id;
            }
            this.props.dispatch(addRichMark(this.props.boxSelected, mark, state));
        },

        deleteMarkCreator: () => this.props.dispatch(updateUI({ markCreatorVisible: false })),

        onMarkCreatorToggled: (id) => this.props.dispatch(updateUI({ markCreatorVisible: id })),

        onRichMarkAdded: (mark, view, viewToolbar) => this.props.dispatch(addRichMark(mark, view, viewToolbar)),

        onRichMarkMoved: (mark, value) => this.props.dispatch(moveRichMark(mark, value)),

        onRichMarkDeleted: (id) => {
            let cvid = this.props.marks[id].connection;
            // This checks if the deleted mark leaves an orphan contained view, and displays a message asking if the user would like to delete it as well
            if (isContainedView(cvid)) {
                let thiscv = this.props.containedViews[cvid];
                if (Object.keys(thiscv.parent).length === 1) {
                    let confirmText = i18n.t("messages.confirm_delete_CV_also_1") + this.props.viewToolbars[cvid].viewName + i18n.t("messages.confirm_delete_CV_also_2");
                    let alertComponent = (<Alert className="pageModal"
                        show
                        hasHeader
                        title={<span><i style={{ fontSize: '14px', marginRight: '5px' }} className="material-icons">delete</i>{i18n.t("messages.confirm_delete_cv")}</span>}
                        cancelButton
                        acceptButtonText={i18n.t("messages.OK")}
                        onClose={(bool)=>{
                            if (bool) {
                                this.props.dispatch(deleteRichMark(this.props.marks[id]));
                                let deleteAlsoCV = document.getElementById('deleteAlsoCv').classList.toString().indexOf('checked') > 0;
                                if(deleteAlsoCV) {
                                    let boxesRemoving = [];
                                    this.props.containedViews[cvid].boxes.map(boxId => {
                                        boxesRemoving.push(boxId);
                                        boxesRemoving = boxesRemoving.concat(getDescendantBoxes(this.props.boxes[boxId], this.props.boxes));
                                    });

                                    this.props.dispatch(deleteContainedView([cvid], boxesRemoving, thiscv.parent));
                                }
                            } else {

                            }
                            this.setState({ alert: null });}}>
                        <span> {confirmText} </span><br/>
                        <ToggleSwitch id="deleteAlsoCv" style={{ margin: '10px' }}/>
                        {i18n.t("messages.confirm_delete_cv_as_well")}
                    </Alert>);
                    this.setState({ alert: alertComponent });
                    return;
                }
            }
            this.props.dispatch(deleteRichMark(marks[id]));
        },

        onRichMarkEditPressed: (mark) => this.props.dispatch(updateUI({ currentRichMark: mark })),

        onRichMarkUpdated: (mark, view, viewToolbar) =>
        // (mark, createNew) => {
        // let boxSelected = this.props.boxSelected;
        // let mark_exist = this.props.marks[mark.id] !== undefined;
        // if (mark_exist) {
        //
        // }
        // let state = this.props.store.getState();
        // let oldConnection = state.__marks[mark.id] ? state.__marks[mark.id].connection : 0;
        // state.__marks[mark.id] = JSON.parse(JSON.stringify(mark));
        // let newConnection = mark.connection;
        // if (mark.connection.id) {
        //     newConnection = mark.connection.id;
        //     state.__marks[mark.id].connection = mark.connection.id;
        // }
        //
        // this.props.dispatch(editRichMark(boxSelected, state, mark, oldConnection, newConnection));
        {
            this.props.dispatch(editRichMark(mark, view, viewToolbar));
        },

        onRichMarksModalToggled: (value, boxId = -1) => {
            const reactUI = this.props.reactUI;
            this.props.dispatch(updateUI({ richMarksVisible: !reactUI.richMarksVisible }));
            this.props.dispatch(updateUI({ markCursorValue: value }));
            if(reactUI.richMarksVisible) {
                this.props.dispatch(updateUI({
                    currentRichMark: null,
                    markCursorValue: null,
                }));
            }
            this.props.dispatch(selectBox(boxId, this.props.boxes[boxId]));
        },
    };

    handleNavItems = {

        onNavItemNameChanged: (id, titleStr) => this.props.dispatch(updateViewToolbar(id, titleStr)),

        onNavItemAdded: (id, name, parent, type, position, background, customSize, hideTitles, hasContent, sortable_id) => {
            this.props.dispatch(addNavItem(
                id,
                name,
                parent,
                type,
                position,
                background,
                customSize,
                hideTitles,
                (type !== 'section' || (type === 'section' && Ediphy.Config.sections_have_content)),
                sortable_id));
        },

        onNavItemsAdded: (navs, parent) => this.props.dispatch(addNavItems(navs, parent)),

        onNavItemDuplicated: (id) => {
            if (id && this.props.navItems[id]) {
                let newBoxes = [];
                let navItem = this.props.navItems[id];
                let linkedCVs = {};
                if (navItem.boxes) {
                    newBoxes = newBoxes.concat(navItem.boxes);
                    navItem.boxes.forEach(b => {
                        let box = this.props.boxes[b];
                        if (box.sortableContainers) {
                            for (let sc in box.sortableContainers) {
                                if (box.sortableContainers[sc].children) {
                                    newBoxes = newBoxes.concat(box.sortableContainers[sc].children);
                                    box.sortableContainers[sc].children.forEach(bo => {
                                        let bx = this.props.boxes[bo];
                                        if (bx.sortableContainers) {
                                            for (let scc in bx.sortableContainers) {
                                                if (bx.sortableContainers[scc].children) {
                                                    newBoxes = newBoxes.concat(bx.sortableContainers[scc].children);
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
                let newBoxesMap = {};
                newBoxes.map(box => {
                    linkedCVs[box] = [...this.props.boxes[box].containedViews];
                    newBoxesMap[box] = box + Date.now(); });
                this.props.dispatch(duplicateNavItem(id, id + Date.now(), newBoxesMap, Date.now(), linkedCVs));
            }
        },

        onNavItemSelected: (id) => this.props.dispatch(selectNavItem(id)),

        onNavItemExpanded: (id, value) => this.props.dispatch(expandNavItem(id, value)),

        onNavItemDeleted: (navsel) => {
            let viewRemoving = [navsel].concat(this.getDescendantViews(this.props.navItems[navsel]));
            let boxesRemoving = [];
            let containedRemoving = {};
            viewRemoving.map(id => {
                this.props.navItems[id].boxes.map(boxId => {
                    boxesRemoving.push(boxId);
                    boxesRemoving = boxesRemoving.concat(getDescendantBoxes(this.props.boxes[boxId], this.props.boxes));
                });
            });
            let marksRemoving = getDescendantLinkedBoxes(viewRemoving, this.props.navItems) || [];
            dispatch(deleteNavItem(
                viewRemoving,
                this.props.navItems[navsel].parent,
                boxesRemoving,
                containedRemoving,
                marksRemoving));
        },

        onNavItemReordered: (...params) => this.props.dispatch(reorderNavItem(...params)),

        onNavItemToggled: () => this.props.dispatch(toggleNavItem(this.props.navItemSelected)),
    };

    handleSortableContainers = {

        onSortableContainerResized: (id, parent, height) => this.props.dispatch(resizeSortableContainer(id, parent, height)),

        onSortableContainerReordered: (ids, parent) => this.props.dispatch(reorderSortableContainer(ids, parent)),

        onSortableContainerDeleted: (id, parent) => {
            let boxes = this.props.boxes;
            let containedViews = this.props.containedViews;
            let page = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
            let descBoxes = getDescendantBoxesFromContainer(boxes[parent], id, this.props.boxes, this.props.containedViews);
            let cvs = {};
            for (let b in descBoxes) {
                let box = boxes[descBoxes[b]];
                for (let cv in box.containedViews) {
                    if (!cvs[box.containedViews[cv]]) {
                        cvs[box.containedViews[cv]] = [box.id];
                    } else if (cvs[containedViews[cv]].indexOf(box.id) === -1) {
                        cvs[box.containedViews[cv]].push(box.id);
                    }
                }
            }
            this.props.dispatch(deleteSortableContainer(id, parent, descBoxes, cvs, page));
        },

        onSortablePropsChanged: (...params) => this.props.dispatch(changeSortableProps(...params)),

    };

    handleToolbars = {

        onToolbarUpdated: (id, tab, accordion, name, value) => {
            if (isBox(id) || isSortableBox(id)) {
                let toolbar = this.props.pluginToolbars[id];
                let pluginAPI = Ediphy.Plugins.get(toolbar.pluginId);
                let config = pluginAPI.getConfig();
                let deletedBoxes = [];
                if (config.isComplex && accordion === 'state') {
                    let newPluginState = JSON.parse(JSON.stringify(toolbar.state));
                    newPluginState[name] = value;
                    let pluginContainerIds = {};// newPluginState.__pluginContainerIds;
                    let defaultBoxes = {};
                    if (config.flavor !== "react") {
                        let content = pluginAPI.getRenderTemplate(newPluginState);
                        parsePluginContainers(content, pluginContainerIds);
                    } else {
                        let content = pluginAPI.getRenderTemplate(newPluginState, { exercises: { correctAnswer: true } });
                        parsePluginContainersReact(content, pluginContainerIds, defaultBoxes);
                    }
                    if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length < Object.keys(pluginContainerIds).length)) {
                        for (let s in pluginContainerIds) {
                            if (!toolbar.state.__pluginContainerIds[s]) {
                                if (defaultBoxes[s]) {
                                    let page = this.props.containedViewSelected && this.props.containedViewSelected !== 0 ? this.props.containedViewSelected : this.props.navItemSelected;
                                    this.props.dispatch(updatePluginToolbar(id, tab, accordion,
                                        [name, "__pluginContainerIds"],
                                        [value, pluginContainerIds]));
                                    defaultBoxes[s].map((newBox, ind) => {
                                        createBox({
                                            parent: id,
                                            page,
                                            container: s,
                                            isDefaultPlugin: true,
                                            initialState: newBox.initialState,
                                            id: ID_PREFIX_BOX + Date.now() + '_' + ind,
                                            draggable: true,
                                            resizable: this.props.boxes[id].resizable,
                                        }, newBox.type, false,
                                        (...params)=>{this.props.dispatch(addBox(...params));},
                                        this.props.boxes);
                                    });

                                }
                            }
                        }
                        return;
                    } else if (toolbar.state.__pluginContainerIds && (Object.keys(toolbar.state.__pluginContainerIds).length > Object.keys(pluginContainerIds).length)) {
                        for (let s in toolbar.state.__pluginContainerIds) {
                            if (!pluginContainerIds[s]) {
                                if (this.props.boxes[id].sortableContainers[s].children) {
                                    deletedBoxes = deletedBoxes.concat(this.props.boxes[id].sortableContainers[s].children);
                                }
                            }
                        }
                    }
                    this.props.dispatch(updatePluginToolbar(id, tab, accordion,
                        [name, "__pluginContainerIds"],
                        [value, pluginContainerIds], deletedBoxes));
                    return;
                }
                this.props.dispatch(updatePluginToolbar(id, tab, accordion, name, value, deletedBoxes));
            } else {
                this.props.dispatch(updateViewToolbar(id, tab, accordion, name, value));
            }
        },

        onPluginToolbarUpdated: (id, state) => this.props.dispatch(updateBox(id, "", this.props.pluginToolbars[this.props.reactUI.pluginConfigModal], state)),

        onViewToolbarUpdated: (id, toolbar) => this.props.dispatch(updateViewToolbar(id, toolbar)),
    };

    handleExercises = {

        onScoreConfig: (id, button, value, page) => this.props.dispatch(configScore(id, button, value, page)),

        setCorrectAnswer: (id, correctAnswer, page) => this.props.dispatch(setCorrectAnswer(id, correctAnswer, page)),
    };

    handleExportImport = {
        deleteFileFromServer: (id, url, callback) => {
            let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
            let deleteFunction = inProduction ? deleteRemoteFileVishAsync : deleteRemoteFileEdiphyAsync;
            this.props.dispatch(deleteFunction(id, url, callback));
        },

        exportResource: (format, callback, options) => {
            let currentState = this.props.store.getState();
            switch (format) {
            case 'PDF':
                printToPDF(currentState.undoGroup.present, callback, options);
                break;
            case 'MoodleXML':
                toMoodleXML(currentState.undoGroup.present, callback, options);
                break;
            case 'edi':
                Ediphy.Visor.exportsEDI({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback);
                break;
            default:
                Ediphy.Visor.exportsHTML({ ...currentState.undoGroup.present, filesUploaded: currentState.filesUploaded }, callback, options);
                break;
            }
        },

        exportToScorm: () => (is2004, callback, selfContained = false) => {
            let currentState = this.props.store.getState();
            Ediphy.Visor.exportScorm({
                ...currentState.undoGroup.present,
                filesUploaded: currentState.filesUploaded,
                status: currentState.status }, is2004, callback, selfContained);
        },

        importEdi: (state) => this.props.dispatch(serialize(importEdi(state))),

        uploadFunction: (query, keywords, callback) => {
            let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
            let uploadFunction = inProduction ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
            this.props.dispatch(uploadFunction(query, keywords, callback));
        },

    };

    onIndexSelected = (id) => this.props.dispatch(selectIndex(id));

    onGridToggle = () => this.props.dispatch(updateUI({ grid: !this.props.reactUI.grid }));

    onTitleChanged = (id = 'title', titleStr) => this.props.dispatch(changeGlobalConfig(id, titleStr));

    openFileModal = (id = undefined, accept) => {
        this.props.dispatch((updateUI({
            showFileUpload: accept,
            fileUploadTab: 1,
            fileModalResult: { id, value: undefined },
        })));
    };

    onTextEditorToggled = (caller, value, text, content) => {
        let pluginToolbar = this.props.pluginToolbars[caller];
        if(pluginToolbar && pluginToolbar.pluginId !== "sortable_container") {
            let state = Object.assign({}, pluginToolbar.state, { __text: text });
            let toolbar = Ediphy.Plugins.get(pluginToolbar.pluginId).getToolbar(state);

            this.props.dispatch(toggleTextEditor(caller, value));
            if (!value && text && content) {
                this.props.dispatch(updateBox(caller, content, toolbar, state));
            }
        }
    };

    onViewTitleChanged = (id, titles) => this.props.dispatch(updateViewToolbar(id, titles));

    openConfigModal = (id) => this.props.dispatch(updateUI({ pluginConfigModal: id }));

    save = (win) => this.props.dispatch(exportStateAsync({ ...this.props.store.getState() }, win));

    showTour = () => {
        this.props.dispatch(updateUI({
            showTour: true,
            showHelpButton: false,
        }));
    };

    toggleTour = (tour) => this.props.dispatch(updateUI({ showTour: tour }));

    uploadFunction = (query, keywords, callback) => {
        let inProduction = (process.env.NODE_ENV === 'production' && process.env.DOC !== 'doc');
        let uploadFunction = inProduction ? uploadVishResourceAsync : uploadEdiphyResourceAsync;
        this.props.dispatch(uploadFunction(query, keywords, callback));
    };

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
