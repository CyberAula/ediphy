import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import CanvasVisor from './../components/canvas/CanvasVisor';
import ContainedCanvasVisor from './../components/canvas/ContainedCanvasVisor';
import SideNavVisor from './../components/navigation/SideNavVisor';
import VisorPlayer from './../components/navigation/VisorPlayer';

import { isContainedView, isView } from './../../utils';
import ScormComponent from './../components/scorm/ScormComponent';
import i18n from './../../i18n';

require('es6-promise').polyfill();
require('typeface-ubuntu');
require('typeface-source-sans-pro');
require('./../../sass/style.scss');
require('./../../core/visor_entrypoint');

// TODO: define actions for visor?

export default class Visor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: [this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected)], /* This is the actual view rendering*/
            triggeredMarks: [],
            richElementState: {},
            backupElementStates: {},
            toggledSidebar: Dali.State.globalConfig.visorNav.sidebar ? Dali.State.globalConfig.visorNav.sidebar : (Dali.State.globalConfig.visorNav.sidebar === undefined),
            fromScorm: Dali.State.fromScorm,
        };

    }

    componentWillUnmount() {
        Dali.API_Private.cleanListener(Dali.API_Private.events.markTriggered);
    }
    componentWillMount() {
        // Get the event received check if exist and modify the state
        // Add a queue of marks fired [{id: value, CurrentState: PENDING, TRIGGERED, HOLD, DONE}] or array
        // Whenever the mark is ready trigger it
        this.mountFunction();
    }

    mountFunction() {
        let richElementsState = this.state.richElementState;

        // Marks Global Listener
        Dali.API_Private.listenEmission(Dali.API_Private.events.markTriggered, e=>{
            let marks = this.getAllMarks();
            let triggered_event = e.detail;
            let triggered_marks = this.getTriggeredMarks(marks, triggered_event);

            // clearMark | If actual Triggered Mark have passed e.detail.value and actual value is different or actual element doesn't need to clear the value
            triggered_marks = this.clearTriggeredValues(triggered_event, triggered_marks);

            // Just try to trigger if mark exists
            if(this.containsMarkValue(marks, triggered_event.value)) {
                // And is triggereable (not pending)
                let isTriggerable = this.isTriggereableMark(triggered_event, triggered_marks);
                if(isTriggerable) {
                    triggered_marks = this.putMarksOnHold(triggered_marks, triggered_event);
                    // If mark is storable (if make any sense to store to render something different like a video) do it else, don't
                    if(triggered_event.stateElement) {
                        let new_mark = {};
                        new_mark[triggered_event.id] = triggered_event.value;
                        this.setState({
                            triggeredMarks: triggered_marks,
                            richElementState: Object.assign({}, richElementsState, new_mark),
                        });
                    }else{
                        triggered_marks.forEach((mark, index)=>{
                            if(mark.id === isTriggerable.id) {
                                triggered_marks[index] = isTriggerable;
                            }
                        });

                        this.setState({ triggeredMarks: triggered_marks });

                    }
                }
            } else if(triggered_event.stateElement) {
                let backupElementStates = this.state.backupElementStates;
                let new_mark = {};
                new_mark[triggered_event.id] = triggered_event.value;
                this.setState({
                    backupElementStates: Object.assign({}, backupElementStates, new_mark),
                });
            }

        });
    }

    componentWillUpdate(nextProps, nextState) {
        // reset marks when navigating between main sections
        if(this.state.currentView.length !== nextState.currentView.length && isView(nextState.currentView[nextState.currentView.length - 1])) {
            this.setState({ triggeredMarks: [] });
        }

        if(nextState.triggeredMarks.length !== 0 && this.returnTriggereableMark(nextState.triggeredMarks)) {
            let newMark = this.returnTriggereableMark(nextState.triggeredMarks);

            nextState.triggeredMarks.forEach(mark=>{
                if(newMark.id === mark.id) {
                    mark.currentState = 'TRIGGERED';
                    mark.viewOrigin = this.state.currentView[this.state.currentView.length - 1];
                }
                return mark;
            });

            if(newMark.connectMode === 'new' || newMark.connectMode === "existing") {

                let array_trigger_mark = this.santinizeViewsArray(nextState.triggeredMarks, nextState.currentView.concat([newMark.connection]));
                let newcv = array_trigger_mark.length > 0 && array_trigger_mark[array_trigger_mark.length - 1] && isContainedView(array_trigger_mark[array_trigger_mark.length - 1]) ? array_trigger_mark[array_trigger_mark.length - 1] : 0;

                this.setState({
                    containedViewSelected: newcv,
                    currentView: array_trigger_mark,
                    triggeredMarks: nextState.triggeredMarks,
                });

            } else if(newMark.connectMode === "external") {

                let win = window.open(newMark.connection, '_blank');
                win.focus();
                let shiftExternal = nextState.triggeredMarks;
                shiftExternal.shift();
                this.setState({
                    triggeredMarks: shiftExternal,
                });

            }
        }

    }

    render() {
        if (window.State) {
            Dali.State = window.State;
        }

        let boxes = Dali.State.boxesById;
        let boxSelected = Dali.State.boxSelected;
        let navItems = Dali.State.navItemsById;
        let navItemsIds = Dali.State.navItemsIds;
        let containedViews = Dali.State.containedViewsById;
        let toolbars = Dali.State.toolbarsById;
        let globalConfig = Dali.State.globalConfig;
        let title = globalConfig.title;
        let ratio = globalConfig.canvasRatio;
        let visorNav = globalConfig.visorNav;
        let wrapperClasses = this.state.toggledSidebar ? "visorwrapper toggled" : "visorwrapper";
        let toggleIcon = this.state.toggledSidebar ? "keyboard_arrow_left" : "keyboard_arrow_right";
        let toggleColor = this.state.toggledSidebar ? "toggleColor" : "";
        let isCV = isContainedView(this.state.currentView);
        let isSlide = isCV && containedViews[this.getLastCurrentViewElement()] === "slide" ||
        !isCV && navItems[this.getLastCurrentViewElement()] === "slide" ?
            "pcw_slide" : "pcw_doc";

        return (
            /* jshint ignore:start */
            <div id="app"
                className={wrapperClasses} >
                <SideNavVisor
                    changeCurrentView={(page)=> {this.changeCurrentView(page);}}
                    courseTitle={title}
                    show={visorNav.sidebar}
                    currentViews={this.state.currentView}
                    navItemsById={navItems}
                    navItemsIds={navItemsIds}
                    toggled={this.state.toggledSidebar}/>
                <div id="page-content-wrapper"
                    className={isSlide}
                    style={{ height: '100%' }}>
                    <Grid fluid
                        style={{ height: '100%' }}>
                        <Row style={{ height: '100%' }}>
                            <Col lg={12} style={{ height: '100%' }}>
                                {visorNav.player ? (<VisorPlayer show={visorNav.player}
                                    changeCurrentView={(page)=> {this.changeCurrentView(page);}}
                                    currentViews={this.state.currentView}
                                    navItemsById={navItems}
                                    navItemsIds={navItemsIds}/>) : null}
                                {visorNav.sidebar ? (<Button id="visorNavButton"
                                    className={toggleColor}
                                    bsStyle="primary"
                                    onClick={e => {this.setState({ toggledSidebar: !this.state.toggledSidebar });}}>
                                    <i className="material-icons">{toggleIcon}</i>
                                </Button>) : null}

                                { !isContainedView(this.getLastCurrentViewElement()) ?
                                    (<CanvasVisor
                                        boxes={boxes}
                                        boxSelected={boxSelected}
                                        changeCurrentView={(element) => {this.changeCurrentView(element);}}
                                        canvasRatio={ratio}
                                        containedViews={containedViews}
                                        currentView={this.getLastCurrentViewElement()}
                                        navItems={navItems}
                                        removeLastView={()=>{this.removeLastView();}}
                                        richElementsState={this.state.richElementState}
                                        showCanvas={this.getLastCurrentViewElement().indexOf("cv-") === -1}
                                        title={title}
                                        toolbars={toolbars}
                                        triggeredMarks={this.state.triggeredMarks}
                                        viewsArray={this.state.currentView}
                                    />) :
                                    (<ContainedCanvasVisor
                                        boxes={boxes}
                                        boxSelected={boxSelected}
                                        changeCurrentView={(element) => {this.changeCurrentView(element);}}
                                        canvasRatio={ratio}
                                        containedViews={containedViews}
                                        currentView={this.getLastCurrentViewElement()}
                                        navItems={navItems}
                                        toolbars={toolbars}
                                        title={title}
                                        triggeredMarks={this.state.triggeredMarks}
                                        showCanvas={this.getLastCurrentViewElement().indexOf("cv-") !== -1}
                                        removeLastView={()=>{this.removeLastView();}}
                                        richElementsState={this.state.richElementState}
                                        viewsArray={this.state.currentView}
                                    />)
                                }
                            </Col>
                        </Row>
                    </Grid>
                </div>
                {this.state.fromScorm ? (
                    <ScormComponent
                        navItems={navItems}
                        navItemsIds={navItemsIds}
                        currentView={this.getLastCurrentViewElement()}
                        globalConfig={globalConfig}
                        changeCurrentView={(el)=>{this.changeCurrentView(el);}}
                    />) : (null)}
            </div>

            /* jshint ignore:end */
        );
    }

    /**
     * Get actualView REFACTOR: change name
     * @returns {String} currentView
     */
    getLastCurrentViewElement() {
        return this.state.currentView[this.state.currentView.length - 1];
    }

    /**
     * Navigation main method
     * @param {string} element - current Element to go
     */
    changeCurrentView(element) {
        if (isContainedView(element)) {
            this.setState({ currentView: [this.getCurrentView(this.state.navItemSelected, this.state.containedViewSelected), element] });
        } else {
            this.setState({ currentView: [element] });
            if(this.state.currentView.length > 1) {
                this.setState({ triggeredMarks: this.unTriggerLastMark(this.state.triggeredMarks),
                    richElementState: this.getActualBoxesStates(this.state.backupElementStates, this.state.richElementState) });
            }
        }
        this.mountFunction();

    }

    /**
     * This is used to get initial view and make sure is either containedView or NavItem
     * @param {string} NISelected - selected NavItem
     */
    getCurrentView(NIselected, CVselected) {
        let currentView = (CVselected === 0) ? NIselected : CVselected;
        return currentView;
    }

    /* Marks functions*/

    /**
     * Make sure if mark value exists
     * @param {Array} - Array of marks
     * @param {string}
     * @return {boolean} -  whether the mark exists or not in the array
     */
    containsMarkValue(marks, mark_value) {
        let exists = false;
        marks.forEach(mark_element=>{
            if(mark_element.value === mark_value) {
                exists = true;
            }
        });
        return exists;
    }

    /**
     * Returns if any is there any triggerable mark
     * @param triggeredMarks
     * @returns {Object, boolean}
     */
    returnTriggereableMark(triggeredMarks) {
        let isAnyTriggereableMark = false;
        let canBeTriggered = true;
        if(Array.isArray(triggeredMarks)) {
            triggeredMarks.forEach(mark=>{
                if (mark.currentState === 'TRIGGERED') {
                    canBeTriggered = false;
                }
                if(canBeTriggered && mark.currentState === 'PENDING' && !isAnyTriggereableMark) {
                    isAnyTriggereableMark = mark;
                }
            });
        }
        return isAnyTriggereableMark;
    }

    /**
     * Whether if the mark is triggereable or not
     * @param mark
     * @param triggerable_marks
     * @returns {boolean}
     */
    isTriggereableMark(mark, triggerable_marks) {
        let isAnyTriggereableMark = false;
        triggerable_marks.forEach(triggereable_mark=> {
            if (triggereable_mark.currentState === 'PENDING' && triggereable_mark.value === mark.value && triggereable_mark.box_id === mark.id) {
                if (!isAnyTriggereableMark) {
                    isAnyTriggereableMark = triggereable_mark;
                }
            }

            if (!mark.stateElement && triggereable_mark.value === mark.value && triggereable_mark.box_id === mark.id) {
                if (!isAnyTriggereableMark) {
                    isAnyTriggereableMark = triggereable_mark;
                    isAnyTriggereableMark.currentState = "PENDING";
                }
            }
        });
        return isAnyTriggereableMark;
    }

    /**
     * Change state of last mark triggered to done, this is used to go back
     * @param state
     * @returns {Array}
     */
    unTriggerLastMark(state) {
        let new_array = state;
        new_array.forEach(mark=>{
            if(mark.currentState === 'TRIGGERED') {
                mark.currentState = 'DONE';
            }
        });
        return new_array;
    }

    /**
     * Cleans Views Array
     * @param triggeredMarks
     * @param arrayViews
     * @returns {*}
     */
    santinizeViewsArray(triggeredMarks, arrayViews) {
        let final_array = arrayViews;

        triggeredMarks.forEach(mark=>{
            if(mark.currentState === "DONE" && final_array.indexOf(mark.connection) !== -1) {
                final_array.splice(final_array.indexOf(mark.connection), 1);

            }
        });

        return final_array;
    }

    /**
     * Cleans used 'DONE' values in triggeredMarks array
     * @param triggered_event
     * @param triggeredMarks
     * @returns {Array}
     */
    clearTriggeredValues(triggered_event, triggeredMarks) {
        let clean_array = [];

        if(triggeredMarks.length > 0) {
            if(!triggered_event.stateElement) {
                triggeredMarks.forEach(element=>{
                    if(element.currentState !== 'DONE' || triggered_event.id !== element.box_id) {
                        clean_array.push(element);
                    }
                });

            } else {
                triggeredMarks.forEach(element =>{
                    if(element.currentState !== "DONE" || element.value === triggered_event.value || element.box_id !== triggered_event.id) {
                        clean_array.push(element);
                    }
                });
            }
        }
        return clean_array;
    }

    /**
     * Get all marks triggered in the same event
     * @param marks
     * @param triggered_event
     * @returns {Array}
     */
    getTriggeredMarks(marks, triggered_event) {
        let state_marks = [];
        let previously_triggered_marks = this.state.triggeredMarks;
        if(previously_triggered_marks.length === 0) {
            marks.forEach(mark_element=>{
                if(mark_element.value === triggered_event.value && mark_element.box_id === triggered_event.id) {
                    state_marks.push({
                        currentState: "PENDING",
                        viewOrigin: this.state.currentView[this.state.currentView.length - 1],
                        id: mark_element.id,
                        value: mark_element.value,
                        connection: mark_element.connection,
                        box_id: mark_element.box_id,
                        connectMode: mark_element.connectMode,
                    });
                }
            });
        }else{
            // return only triggered MARKS
            state_marks = state_marks.concat(previously_triggered_marks);

            marks.forEach(triggered_mark=>{
                let is_different = true;
                for(let n in state_marks) {
                    if(state_marks[n].value === triggered_mark.value && state_marks[n].box_id === triggered_event.id) {
                        is_different = false;
                    }
                }

                if(is_different && triggered_event.value === triggered_mark.value && triggered_event.id === triggered_mark.box_id) {
                    state_marks.push({
                        currentState: "PENDING",
                        viewOrigin: this.state.currentView[this.state.currentView.length - 1],
                        id: triggered_mark.id,
                        value: triggered_mark.value,
                        connection: triggered_mark.connection,
                        box_id: triggered_mark.box_id,
                        connectMode: triggered_mark.connectMode,
                    });
                }

            });
        }

        return state_marks;
    }

    /**
     * Get all Mark of currentView
     * @returns {Array}
     */
    getAllMarks() {
        let currentView = this.state.currentView[this.state.currentView.length - 1];

        let boxes = this.getAllRichDescendantBoxes(currentView);
        let marks = [];
        boxes.forEach(box=>{
            Object.keys(Dali.State.toolbarsById[box].state.__marks).map(mark_element=>{
                let mark_box = Dali.State.toolbarsById[box].state.__marks[mark_element];
                mark_box.box_id = box;
                marks.push(mark_box);
            });
        });
        return marks;
    }

    putMarksOnHold(triggered_marks, mark_event) {
        let anyTriggeredMarks = false;
        let anyPendingMarks = false;

        triggered_marks.forEach(t_mark=>{
            if(t_mark.currentState === "PENDING") {
                anyPendingMarks = true;
            }
            if(t_mark.currentState === "TRIGGERED") {
                anyTriggeredMarks = true;
            }
        });

        let origin_marks = [];
        let markUntriggered = false;
        if(anyTriggeredMarks && anyPendingMarks) {
            triggered_marks.forEach(t_mark => {
                if (t_mark.viewOrigin !== undefined && t_mark.currentState === 'HOLD') {
                    origin_marks.push(t_mark.viewOrigin);
                }

                if (t_mark.currentState === 'TRIGGERED' && t_mark.viewOrigin !== undefined && origin_marks.indexOf(t_mark.viewOrigin) === -1) {
                    origin_marks.push(t_mark.viewOrigin);
                }
            });

            triggered_marks.forEach(t_mark=>{
                if (t_mark.currentState === 'PENDING' && t_mark.viewOrigin !== undefined && origin_marks.indexOf(t_mark.viewOrigin) === -1) {
                    markUntriggered = true;
                }
            });

            if(markUntriggered) {
                let newMarksArray = [];
                triggered_marks.forEach(t_mark=>{
                    if(t_mark.currentState === 'TRIGGERED') {
                        t_mark.currentState = 'HOLD';
                    }
                    newMarksArray.push(t_mark);
                });
                return newMarksArray;
            }
            return triggered_marks;

        }

        return triggered_marks;

    }

    /**
     * @param navItemID
     * @returns {Array}
     */
    getAllRichDescendantBoxes(navItemID) {
        let view = Dali.State.navItemsById[navItemID];
        if (isContainedView(navItemID)) {
            view = Dali.State.containedViewsById[navItemID];
        }
        let boxes = view.boxes;
        let newBoxes = [];

        let richBoxes = [];
        Object.keys(Dali.State.boxesById).map(box=>{

            if(boxes.indexOf(box) !== -1) {
                newBoxes.push(box);

                if(Object.keys(Dali.State.boxesById[box].children).length !== 0) {
                    Object.keys(Dali.State.boxesById[box].sortableContainers).map(second_box=>{
                        newBoxes = newBoxes.concat(Dali.State.boxesById[box].sortableContainers[second_box].children);
                    });
                }
            }
        });

        newBoxes.forEach(final=>{
            if(Dali.State.toolbarsById[final] && Dali.State.toolbarsById[final].config && Dali.State.toolbarsById[final].config.isRich) {
                richBoxes.push(final);
            }
        });
        return richBoxes;
    }

    getActualBoxesStates(backup, current) {
        let nextState = backup;
        nextState[this.state.triggeredMarks[0].box_id] = current[this.state.triggeredMarks[0].box_id];
        return nextState;
    }

    removeLastView() {
        let newViews = this.state.currentView.slice(0, -1);
        if (newViews.length > 0) {
            let lastView = newViews[newViews.length - 1];
            if (lastView.indexOf("cv-") === -1) {
                this.setState({ containedViewSelected: 0 });
            }
        }
        this.setState({
            currentView: newViews,
            triggeredMarks: this.unTriggerLastMark(this.state.triggeredMarks),
            richElementState: this.getActualBoxesStates(this.state.backupElementStates, this.state.richElementState),
        });
    }

}

ReactDOM.render((<Visor />), document.getElementById('root'));
