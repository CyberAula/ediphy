import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Grid} from 'react-bootstrap';
import {isAncestorOrSibling} from './../../utils';

import CanvasVisor from './components/CanvasVisor';
import ContainedCanvasVisor from './components/ContainedCanvasVisor';

require('es6-promise').polyfill();
require('./../../sass/style.scss');
require('./../../core/visor_entrypoint');

//TODO: define actions for visor?

export default class Visor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: [this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected)],  /*This is the actual view rendering*/
            triggeredMarks: [],
            richElementState: {}
        };
    }

    componentDidMount(){
        //Get the event received check if exist and modify the state
        // Add a queue of marks fired [{id: value, CurrentState: PENDING, TRIGGERED, DONE}] or array
        // Whenever the mark is ready trigger it

        let marks = this.getAllMarks();
        let richElementsState = this.state.richElementState;

        // Marks Global Listener
        Dali.API_Private.listenEmission(Dali.API_Private.events.markTriggered, e=>{
            let triggered_event = e.detail;
            //clearMark | If actual Triggered Mark have passed e.detail.value and actual value is different or actual element doesn't need to clear the value
            //this.clearTriggeredValues(e.detail, marks, this.getTriggeredMarks(marks,e.detail.value));

            //Just try to trigger if mark exists
            if(this.containsMarkValue(marks,e.detail.value)){
                //And is triggereable (not pending)
                if(this.isTriggereableMark(triggered_event, this.getTriggeredMarks(marks,triggered_event))){
                    //If mark is storable (if make any sense to store to render something different like a video) do it else, don't
                    if(triggered_event.stateElement){
                        let new_mark = {};
                        new_mark[triggered_event.id] = triggered_event.value;
                        this.setState({
                            triggeredMarks: this.getTriggeredMarks(marks,triggered_event),
                            richElementState: Object.assign({}, richElementsState, new_mark)
                        });
                    }else{
                        this.setState({triggeredMarks: this.getTriggeredMarks(marks,triggered_event)});
                    }
                }
            }

        });
    }

    componentDidUpdate(nextProps, nextState){
        if(nextState.triggeredMarks.length !== 0 && this.returnTriggereableMark(nextState.triggeredMarks)){
            let newMark = this.returnTriggereableMark(nextState.triggeredMarks); //TODO: pro aquí va algo mal
            newMark.currentState = 'TRIGGERED';
            let array_trigger_mark = nextState.currentView.concat([newMark.connection]);

            this.setState({
                currentView: array_trigger_mark,
                triggeredMarks: newMark
            });
        }
    }

    render() {

        if(window.State){
            Dali.State = window.State;
        }

        let boxes = Dali.State.boxesById;
        let boxSelected = Dali.State.boxSelected;
        let navItems = Dali.State.navItemsById;
        let navItemSelected = Dali.State.navItemSelected;
        let containedViews = Dali.State.containedViewsById;
        let containedViewSelected = Dali.State.containedViewSelected;
        let toolbars = Dali.State.toolbarsById;
        let title = Dali.State.title;

        return (
            /* jshint ignore:start */
            <Grid id="app" fluid={true} style={{height: '100%'}}>
                { this.getLastCurrentViewElement().indexOf("cv-") === -1 ?
                    (<CanvasVisor boxes={boxes}
                                boxSelected={boxSelected}
                                changeCurrentView={(element) => {
                                    this.setState({currentView: [this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected), element]}); //Add a global state of Object Values so when transitioning you keep that value
                                }}
                                containedViews={containedViews}
                                currentView={this.getLastCurrentViewElement()}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                toolbars={toolbars}
                                title={title}
                                triggeredMarks={this.state.triggeredMarks}
                                showCanvas={this.getLastCurrentViewElement().indexOf("cv-") === -1}
                                removeLastView={()=>{
                                    this.setState({currentView: this.state.currentView.slice(0,-1)})
                                }}
                                richElementsState={this.state.richElementState}
                                viewsArray={this.state.currentView}
                    />) :
                    (<ContainedCanvasVisor boxes={boxes}
                                boxSelected={boxSelected}
                                changeCurrentView={(element) => {
                                   this.setState({currentView: [this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected), element]});
                                }}
                                containedViews={containedViews}
                                containedViewSelected={containedViewSelected}
                                navItems={navItems}
                                toolbars={toolbars}
                                title={title}
                                triggeredMarks={this.state.triggeredMarks}
                                showCanvas={this.getLastCurrentViewElement().indexOf("cv-") !== -1}
                                currentView={this.getLastCurrentViewElement()}
                                removeLastView={()=>{
                                   this.setState({currentView: this.state.currentView.slice(0,-1)})
                                }}
                                richElementsState={this.state.richElementState}
                                viewsArray={this.state.currentView}
                    />)
                }
            </Grid>
            /* jshint ignore:end */
        );
    }

    getLastCurrentViewElement(){
        return this.state.currentView[this.state.currentView.length - 1];
    }

    changeCurrentView(element){
        this.setState({currentView: [this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected), element]});
    }

    getCurrentView(NIselected, CVselected){
        let currentView = (CVselected === 0) ? NIselected : CVselected;
        return currentView;
    }

    /*Marks functions*/

    containsMarkValue(marks,mark_value){
        let exists = false;
        marks.forEach(mark_element=>{
            if(mark_element.value === mark_value){
                exists = true;
            }
        });
        return exists;
    }

    returnTriggereableMark(triggeredMarks){
        let isAnyTriggereableMark = false;
        if( Array.isArray(triggeredMarks)){
            triggeredMarks.forEach(mark=>{
                if(mark.currentState === 'PENDING' && !isAnyTriggereableMark){
                    isAnyTriggereableMark = mark;
                }
            });
        }
        return isAnyTriggereableMark;
    }

    /*Check if status is PENDING and not TRIGGERED*/
    isTriggereableMark(mark, triggerable_marks){
        let isAnyTriggereableMark = false;
        triggerable_marks.forEach(triggereable_mark=>{
           if (triggereable_mark.currentState === 'PENDING' && triggereable_mark.value === mark.value && triggereable_mark.box_id === mark.id){
               if(!isAnyTriggereableMark){
                    isAnyTriggereableMark = triggereable_mark;
               }
           }
        });
        return isAnyTriggereableMark;
    }

    /* Cleans */
    clearTriggeredValues(value, marks, triggeredMarks){
        // Clear TRIGGERED MARKS
        let marks_to_be_cleared = [];
        triggeredMarks.forEach(mark_to_check=>{
            if(value.value !== mark_to_check.value && mark_to_check.current_state === 'TRIGGERED'){
                marks_to_be_cleared.push(mark_to_check);
            }
        });

    }

    getTriggeredMarks(marks,triggered_event){
        let state_marks = [];
        let previously_triggered_marks = this.state.triggeredMarks;
        if(previously_triggered_marks.length === 0){
            marks.forEach(mark_element=>{
                if(mark_element.value === triggered_event.value && mark_element.box_id === triggered_event.id){
                    state_marks.push({
                        currentState:"PENDING",
                        id: mark_element.id,
                        value: mark_element.value,
                        connection:mark_element.connection,
                        box_id: mark_element.box_id
                    });
                }
            });
        }else{
            //return only triggered MARKS
            console.log("triggered_marks");
            state_marks = state_marks.concat(previously_triggered_marks);

            console.log("all_marks");
            marks.forEach(triggered_mark=>{
                let is_different = true;
                for(let n in state_marks){
                    if(state_marks[n].value === triggered_mark.value && state_marks[n].id === triggered_event.box_id ){
                        is_different = false;
                    }
                }

                if(is_different && triggered_event.value === triggered_mark.value && triggered_event.box_id === triggered_mark.id){
                    state_marks.push({
                        currentState:"PENDING",
                        id: triggered_mark.id,
                        value: triggered_mark.value,
                        connection:triggered_mark.connection,
                        box_id: triggered_mark.box_id
                    });
                }

            });
        }

        return state_marks;
    }

    getAllMarks() {
        let currentView = this.state.currentView[0];

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



    getAllRichDescendantBoxes(navItemID){
        let boxes = Dali.State.navItemsById[navItemID].boxes;

        let newBoxes = [];

        let richBoxes = [];
        Object.keys(Dali.State.boxesById).map(box=>{

            if(boxes.indexOf(box) !== -1){
                newBoxes.push(box);

                if(Object.keys(Dali.State.boxesById[box].children).length !== 0){
                    Object.keys(Dali.State.boxesById[box].sortableContainers).map(second_box=>{
                        newBoxes = newBoxes.concat(Dali.State.boxesById[box].sortableContainers[second_box].children);
                   });
                }
            }
        });

        newBoxes.forEach(final=>{
            if(Dali.State.toolbarsById[final] && Dali.State.toolbarsById[final].config && Dali.State.toolbarsById[final].config.isRich){
                richBoxes.push(final);
            }
        });
        return richBoxes;
    }
    /*Marks functions*/
}

/* jshint ignore:start */
ReactDOM.render((<Visor />), document.getElementById('root'));
/* jshint ignore:end */

