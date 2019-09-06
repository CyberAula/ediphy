import { serialize } from '../../reducers/serializer';

if (global && !global._babelPolyfill) {
    require('babel-polyfill');
}

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import VisorCanvas from '../components/canvas/VisorCanvas';
import VisorContainedCanvas from '../components/canvas/VisorContainedCanvas';
import VisorSideNav from '../components/navigation/VisorSideNav';
import VisorPlayer from './../components/navigation/VisorPlayer';

import { isContainedView, isView, isSection, isPage } from '../../common/utils';
import ScormComponent from '../components/score/GradeComponent';
import i18n from '../../locales/i18n';

require('es6-promise').polyfill();
import 'typeface-ubuntu';
import 'typeface-source-sans-pro';
import '@trendmicro/react-toggle-switch/dist/react-toggle-switch.css';
import './../../sass/style.scss';
import '../../core/visor/visorEntrypoint';

/**
 * Visor app main component
 */
export default class Visor extends Component {
    constructor(props) {
        super(props);

        let initialView = this.getCurrentView(Ediphy.State.navItemSelected, Ediphy.State.containedViewSelected);
        if (!Ediphy.State.preview) {
            let remainingViews = Ediphy.State.navItemsIds.filter(n=>{
                let nav = Ediphy.State.navItemsById[n];
                let returnIt = isSection(nav.id) ? Ediphy.Config.sections_have_content : true;
                returnIt = returnIt && !nav.hidden;
                return returnIt ? nav.id : null;
            });
            if (remainingViews.length > 0) {
                initialView = remainingViews[0];
            }
        }

        this.timer = false;

        this.state = {
            currentView: [initialView], /* This is the actual view rendering*/
            triggeredMarks: [],
            showpop: false,
            richElementState: {},
            backupElementStates: {},
            toggledSidebar: false, // Ediphy.State.globalConfig.visorNav.sidebar ? Ediphy.State.globalConfig.visorNav.sidebar : (Ediphy.State.globalConfig.visorNav.sidebar === undefined),
            fromScorm: Ediphy.State.fromScorm,
            scoreInfo: { userName: "Anonymous", totalScore: 0, totalWeight: 0, completionProgress: 0 },
            mouseMoving: false,
            mouseOnPlayer: false,
            backwards: false,
        };

        if (!Ediphy.State.export) {
            window.export = (format = 'HTML') => {
                switch(format) {
                case 'SCORM12':
                    this.exportToScorm(false, ()=>{return true;}, false);
                    return true;
                case 'SCORM2004':
                    this.exportToScorm(true, ()=>{return true;}, false);
                    return true;
                case 'HTML':
                    this.exportToScorm('HTML', ()=>{return true;}, false);
                    return true;
                default:
                    return false;
                }
            };
        }
    }

    setHoverClass = () => {
        this.setState({ mouseOnPlayer: true });
    };

    deleteHoverClass = () => {
        this.setState({ mouseOnPlayer: false });
    };

    _onMouseMove = (e) => {
        if(!this.state.mouseMoving) {
            this.setState({ mouseMoving: true });
        }
        else {
            if(this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.setState({ mouseMoving: false });
            }, 2500);
        }
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        // reset marks when navigating between main sections
        if(this.state.currentView.length !== nextState.currentView.length && isView(nextState.currentView[nextState.currentView.length - 1])) {
            this.setState({ triggeredMarks: [] });
        }

        if (this.state.currentView.length > 1 && this.state.currentView.filter((i, v, a) => i.indexOf("pa-") !== -1).length > 1) {
            this.setState({ currentView: [this.state.currentView[this.state.currentView.length - 1]] });
        }

        // Mark triggering mechanism
        if(nextState.triggeredMarks.length !== 0 && this.returnTriggereableMark(nextState.triggeredMarks)) {
            let newMark = this.returnTriggereableMark(nextState.triggeredMarks);

            nextState.triggeredMarks.forEach(mark=>{
                if(newMark.id === mark.id) {
                    mark.currentState = 'TRIGGERED';
                    mark.viewOrigin = this.state.currentView[this.state.currentView.length - 1];
                }
                return mark;
            });

            // New or existing mark
            if(newMark.connectMode === 'new' || newMark.connectMode === "existing") {

                let array_trigger_mark = this.santinizeViewsArray(nextState.triggeredMarks, nextState.currentView.concat([newMark.connection]));
                let newcv = array_trigger_mark.length > 0 && array_trigger_mark[array_trigger_mark.length - 1] && isContainedView(array_trigger_mark[array_trigger_mark.length - 1]) ? array_trigger_mark[array_trigger_mark.length - 1] : 0;

                this.setState({
                    containedViewSelected: newcv,
                    currentView: array_trigger_mark,
                    triggeredMarks: nextState.triggeredMarks,
                });

            // External target
            } else if(newMark.connectMode === "external") {
                let win = window.open(newMark.connection, '_blank');
                win.focus();
                let shiftExternal = nextState.triggeredMarks;
                shiftExternal.shift();
                this.setState({
                    triggeredMarks: shiftExternal,
                });

            } else if(newMark.connectMode === "popup") {
                let shiftPop = nextState.triggeredMarks;
                shiftPop.shift();
                let markpop = document.getElementById('mark-' + newMark.id);
                if (markpop) { markpop.click();}
                this.setState({
                    showpop: !this.state.showpop,
                    triggeredMarks: shiftPop,
                });
            }
        }
    }

    componentDidMount() {
        /*
        * Add Key bindings to app
        * */
        if(Ediphy.State.globalConfig.visorNav.keyBindings) {
            // First get window focus so arrows work right away
            window.focus();
            window.onkeyup = function(e) {
                let key = e.keyCode ? e.keyCode : e.which;
                let navItemsIds = Ediphy.State.navItemsIds;
                let navItems = Ediphy.State.navItemsById;

                if (!Ediphy.Config.sections_have_content) {
                    navItemsIds = navItemsIds.filter((element)=>(element.indexOf("se") === -1));
                }
                navItemsIds = navItemsIds.filter(nav=> {return !navItems[nav].hidden;});
                let navItemSelected = this.state.currentView.reduce(element=> {
                    if (isPage(element)) {
                        return element;
                    }
                    return null;
                });

                let index = navItemsIds.indexOf(navItemSelected);
                let maxIndex = navItemsIds.length;
                let focusElement = document.activeElement.tagName.toLowerCase();
                if (focusElement !== 'input' && focusElement !== 'textarea') {
                    if (key === 37 || key === 33) {
                        this.changeCurrentView(navItemsIds[Math.max(index - 1, 0)], true);
                    } else if(key === 39 || key === 34) {
                        this.changeCurrentView(navItemsIds[Math.min(index + 1, maxIndex - 1)]);
                    }
                }

            }.bind(this);

        }
    }

    render() {
        if (window.State) {
            Ediphy.State = serialize({ "present": { ...window.State } }).present;
        }
        let { boxSelected, navItemsIds, globalConfig, styleConfig, containedViewsById, boxesById, marksById, navItemsById, viewToolbarsById, pluginToolbarsById } = Ediphy.State;
        let ediphy_document_id = Ediphy.State.id;
        let ediphy_platform = Ediphy.State.platform;
        let exercises = {};
        Object.keys(Ediphy.State.exercises).map((exercise, index)=>{
            if (containedViewsById[exercise] || (navItemsById[exercise] && !navItemsById[exercise].hidden)) {
                exercises[exercise] = Ediphy.State.exercises[exercise];
            }
        });
        let title = globalConfig.title;
        let ratio = globalConfig.canvasRatio;
        let visorNav = globalConfig.visorNav;
        let wrapperClasses = this.state.toggledSidebar ? "visorwrapper toggled" : "visorwrapper";
        let toggleIcon = this.state.toggledSidebar ? "keyboard_arrow_left" : "keyboard_arrow_right";
        let toggleColor = this.state.toggledSidebar ? "toggleColor" : "";
        let isCV = isContainedView(this.state.currentView);
        let isSlide = isCV && containedViewsById[this.getLastCurrentViewElement()] === "slide" ||
        !isCV && navItemsById[this.getLastCurrentViewElement()] === "slide" ?
            "pcw_slide" : "pcw_doc";

        let vishPlayer = (globalConfig.visorNav && globalConfig.visorNav.fixedPlayer !== undefined) ? globalConfig.visorNav.fixedPlayer : true;
        let currentView = this.getLastCurrentViewElement();
        let canvasProps = {
            boxes: boxesById,
            changeCurrentView: (element) => {this.changeCurrentView(element);},
            canvasRatio: ratio,
            containedViews: containedViewsById,
            currentView: currentView,
            fromScorm: this.state.fromScorm,
            navItems: navItemsById,
            navItemsIds,
            removeLastView: this.removeLastView,
            richElementsState: this.state.richElementState,
            title,
            marks: marksById,
            viewToolbars: viewToolbarsById,
            pluginToolbars: pluginToolbarsById,
            onMarkClicked: this.onMarkClicked,
            triggeredMarks: this.state.triggeredMarks,
            viewsArray: this.state.currentView,
            exportModalOpen: false,
            ediphy_document_id,
            ediphy_platform,
            exercises,
            styleConfig,
        };

        let navItemComponents = Object.keys(navItemsById).filter(nav=>isPage(nav)).map((nav, i)=>{
            return (
                <VisorCanvas key={i} {...canvasProps} selectedView={currentView} backwards = {this.state.backwards} currentView={nav} show={nav === currentView} z={ i + 10} showCanvas={nav.indexOf("cv-") === -1} />
            );
        });
        let cvComponents = Object.keys(containedViewsById).map((nav, i)=>{
            return <VisorContainedCanvas key={i} {...canvasProps} currentView={nav} show={nav === currentView} z={ i + navItemComponents.length } showCanvas={nav.indexOf("cv-") !== -1} />;
        });

        let content = [...navItemComponents, cvComponents];
        let empty = <div className="emptyPresentation">{i18n.t("EmptyPresentation")}</div>;
        let visorNavButtonClass = 'hoverPlayerSelector';
        visorNavButtonClass = this.state.mouseMoving ? visorNavButtonClass + ' appearButton' : visorNavButtonClass + ' fadeButton';
        visorNavButtonClass = this.state.mouseOnPlayer ? visorNavButtonClass + ' hoverPlayerOn' : visorNavButtonClass;
        return (
            <div id="app" ref={'app'}
                className={wrapperClasses}
                onMouseMove={this._onMouseMove}>
                <VisorSideNav
                    changeCurrentView={(page)=> {this.changeCurrentView(page);}}
                    courseTitle={title}
                    show={visorNav.sidebar}
                    showScore={!globalConfig.hideGlobalScore}
                    currentViews={this.state.currentView}
                    navItemsById={navItemsById}
                    navItemsIds={navItemsIds.filter(nav=> {return !navItemsById[nav].hidden;})}
                    viewToolbars={viewToolbarsById}
                    scoreInfo={this.state.scoreInfo}
                    exercises={exercises}
                    toggled={this.state.toggledSidebar}/>
                <div id="page-content-wrapper"
                    className={isSlide + " page-content-wrapper"}
                    style={{ height: '100%' }}>
                    <Grid fluid id="visorAppContent"
                        style={{ height: '100%' }}>
                        <Row style={{ height: vishPlayer ? 'calc(100% - 38px)' : '100%' }}>
                            <Col lg={12} style={{ height: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
                                <ScormComponent
                                    fadePlayerClass={visorNavButtonClass}
                                    setHover={this.setHoverClass}
                                    deleteHover = {this.deleteHoverClass}
                                    updateScore={(scoreInfo)=>{this.setState({ scoreInfo });}}
                                    navItemsIds={navItemsIds.filter(nav=> {return !navItemsById[nav].hidden;})}
                                    containedViews={containedViewsById}
                                    currentView={currentView}
                                    navItemsById={navItemsById}
                                    globalConfig={globalConfig}
                                    styleConfig={styleConfig}
                                    exercises={exercises}
                                    pluginToolbars={pluginToolbarsById}
                                    fromScorm={this.state.fromScorm}
                                    changeCurrentView={(el)=>{this.changeCurrentView(el);}}>
                                    {currentView ? content : empty}
                                </ScormComponent>
                                { !vishPlayer ? (
                                    <VisorPlayer
                                        fadePlayerClass={visorNavButtonClass}
                                        setHover={this.setHoverClass}
                                        deleteHover = {this.deleteHoverClass}
                                        show={visorNav.player}
                                        changeCurrentView={(page, backwards)=> {this.changeCurrentView(page, backwards);}}
                                        currentViews={this.state.currentView}
                                        navItemsById={navItemsById}
                                        navItemsIds={navItemsIds.filter(nav=> {return !navItemsById[nav].hidden;})}/>) : null}
                                {visorNav.sidebar ? (<div className={"visorNavButtonDiv"} onMouseEnter={()=> this.setHoverClass()} onMouseLeave={()=>this.deleteHoverClass()}>
                                    <Button id="visorNavButton"
                                        className={toggleColor + visorNavButtonClass}
                                        bsStyle="primary"
                                        onClick={e => {
                                            this.setState({ toggledSidebar: !this.state.toggledSidebar });
                                            document.activeElement.blur();
                                        }}>
                                        <i className="material-icons">{toggleIcon}</i>
                                    </Button></div>) : null}
                            </Col>
                        </Row>
                        <Row style={{ height: '38px', display: vishPlayer ? 'block' : 'none' }}>
                            <Col lg={12} style={{ height: '100%', paddingLeft: '0px', paddingRight: '0px' }}>
                                <VisorPlayer
                                    fadePlayerClass={"appearButton"}
                                    setHover={this.setHoverClass}
                                    deleteHover = {this.deleteHoverClass}
                                    show={visorNav.player}
                                    changeCurrentView={(page, backwards)=> {this.changeCurrentView(page, backwards);}}
                                    currentViews={this.state.currentView}
                                    navItemsById={navItemsById}
                                    navItemsIds={navItemsIds.filter(nav=> {return !navItemsById[nav].hidden;})}/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>);

    }

    /**
   * Export to HTML or PDF
   * @param format
   * @param callback
   * @param selfContained
   */
    export(format, callback, options = false) {
        if(format === "PDF") {
            printToPDF(Ediphy.State, callback, options);
        } else {
            Ediphy.Visor.exportsHTML(Ediphy.State, callback, options);
        }
    }

    exportToScorm(is2004, callback, selfContained = false) {
        Ediphy.Visor.exportScorm(Ediphy.State, is2004, callback, selfContained);
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
    changeCurrentView(element, backwards = false) {
        if (isContainedView(element)) {
            this.setState({ currentView: [this.getCurrentView(this.state.navItemSelected, this.state.containedViewSelected), element], backwards: backwards });
        } else {
            this.setState({ currentView: [element], backwards: backwards });
            if(this.state.currentView.length > 1) {
                this.setState({ triggeredMarks: this.unTriggerLastMark(this.state.triggeredMarks),
                    richElementState: this.getActualBoxesStates(this.state.backupElementStates, this.state.richElementState), backwards: backwards });
            }
        }

    }

    /**
     * This is used to get initial view and make sure is either containedView or NavItem
     * @param {string} NISelected - selected NavItem
     */
    getCurrentView(NIselected, CVselected) {
        let navItemSelected = 0;
        if (Ediphy.State.navItemsById[NIselected] && !Ediphy.State.navItemsById[NIselected].hidden) {
            navItemSelected = NIselected;
        }
        let currentView = (CVselected === 0) ? navItemSelected : CVselected;
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

    onMarkClicked = (id, value, stateElement) => {
        let richElementsState = this.state.richElementState;
        let marks = this.getAllMarks();
        let triggered_event = { id, value, stateElement };
        let triggered_marks = this.getTriggeredMarks(marks, triggered_event);
        // clearMark | If actual Triggered Mark have passed e.detail.value and actual value is different or actual element doesn't need to clear the value
        triggered_marks = this.clearTriggeredValues(triggered_event, triggered_marks);

        // Just try to trigger if mark exists
        if(this.containsMarkValue(marks, triggered_event.value)) {
        // And is triggereable (not pending)
            let isTriggerable = this.isTriggereableMark(triggered_event, triggered_marks);
            if(isTriggerable) {
                triggered_marks = this.putMarksOnHold(triggered_marks, triggered_event);
                // If mark is storable (if make any sense to store to render something different like a video) do it, else don't
                if(triggered_event.stateElement) {
                    if(this.isNotInStateElement(triggered_event, this.state.richElementState)) {
                        let new_mark = {};
                        new_mark[triggered_event.id] = triggered_event.value;
                        this.setState({
                            triggeredMarks: triggered_marks,
                            richElementState: Object.assign({}, richElementsState, new_mark),
                        });
                    }
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
    };

    /**
     * Returns if any is there any triggerable mark
     * @param triggeredMarks
     * @returns Object Marks that are triggered
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
            if (triggereable_mark.currentState === 'PENDING' && triggereable_mark.value === mark.value && triggereable_mark.origin === mark.id) {
                if (!isAnyTriggereableMark) {
                    isAnyTriggereableMark = triggereable_mark;
                }
            }

            if (!mark.stateElement && triggereable_mark.value === mark.value && triggereable_mark.origin === mark.id) {
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

        final_array = final_array.reverse().filter((v, i, a) => {
            return a.indexOf(v) === i || v.indexOf("pa-") === -1;
        }).reverse();

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
                    if(element.currentState !== 'DONE' || triggered_event.id !== element.origin) {
                        clean_array.push(element);
                    }
                });

            } else {
                triggeredMarks.forEach(element =>{
                    if(element.currentState !== "DONE" || element.value === triggered_event.value || element.origin !== triggered_event.id) {
                        clean_array.push(element);
                    }
                });
            }
        }
        return clean_array;
    }

    /**
     * Provisional Method TODO: Verify if needed
     * @param triggered_event
     * @param richStateselement
     */
    clearStateElements(triggered_event, richStateselement) {
        if(richStateselement[triggered_event.id] !== undefined && parseFloat(triggered_event.value) > parseFloat(richStateselement[triggered_event.id]) + 1) {
            let newElementState = JSON.parse(JSON.stringify(richStateselement));
            newElementState[triggered_event.id] = undefined;
            return newElementState;
        }

        return richStateselement;
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
                if(mark_element.value === triggered_event.value && mark_element.origin === triggered_event.id) {
                    state_marks.push({
                        currentState: "PENDING",
                        viewOrigin: this.state.currentView[this.state.currentView.length - 1],
                        id: mark_element.id,
                        value: mark_element.value,
                        connection: mark_element.connection,
                        origin: mark_element.origin,
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
                    if(state_marks[n].value === triggered_mark.value && state_marks[n].origin === triggered_event.id) {
                        is_different = false;
                    }
                }

                if(is_different && triggered_event.value === triggered_mark.value && triggered_event.id === triggered_mark.origin) {
                    state_marks.push({
                        currentState: "PENDING",
                        viewOrigin: this.state.currentView[this.state.currentView.length - 1],
                        id: triggered_mark.id,
                        value: triggered_mark.value,
                        connection: triggered_mark.connection,
                        origin: triggered_mark.origin,
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
        Object.keys(Ediphy.State.marksById).forEach(mark=>{
            boxes.includes(Ediphy.State.marksById[mark].origin);
            marks.push(Ediphy.State.marksById[mark]);
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
        let view = Ediphy.State.navItemsById[navItemID];
        if (isContainedView(navItemID)) {
            view = Ediphy.State.containedViewsById[navItemID];
        }
        let boxes = view.boxes;
        let newBoxes = [];

        let richBoxes = [];
        Object.keys(Ediphy.State.boxesById).map(box=>{

            if(boxes.indexOf(box) !== -1) {
                newBoxes.push(box);

                if(Object.keys(Ediphy.State.boxesById[box].children).length !== 0) {
                    Object.keys(Ediphy.State.boxesById[box].sortableContainers).map(second_box=>{
                        newBoxes = newBoxes.concat(Ediphy.State.boxesById[box].sortableContainers[second_box].children);
                    });
                }
            }
        });

        newBoxes.forEach(final=>{
            if (Ediphy.State.pluginToolbarsById[final]
                && Ediphy.State.pluginToolbarsById[final].pluginId
                && Ediphy.State.pluginToolbarsById[final].pluginId !== "sortable_container"
                && Ediphy.Visor.Plugins[Ediphy.State.pluginToolbarsById[final].pluginId].getConfig().isRich) {
                richBoxes.push(final);
            }
        });
        return richBoxes;
    }

    /**
     * Get the current state for selected box
     * @param backup
     * @param current
     * @returns {*}
     */
    getActualBoxesStates(backup, current) {
        let nextState = backup;
        nextState[this.state.triggeredMarks[0].origin] = current[this.state.triggeredMarks[0].origin];
        return nextState;
    }

    /**
     * Detects if element is not already in state Element so its already triggered
     * @param triggered_event
     * @param richElementsState
     *
     */
    isNotInStateElement(triggered_event, richElementsState) {
        /* if(richElementsState[triggered_event.id] === triggered_event.value) {
            return false;
        }*/
        return true;
    }

    /**
     * Remove last view from queue of views
     */
    removeLastView = () => {
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
