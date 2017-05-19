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
        // Add a queue of marks fired [{id: value, CurrentState: CLEAR, PENDING, DONE}] or array
        // Whenever the mark is ready trigger it
        let marks = this.getAllMarks();
        let richElementsState = this.state.richElementState;
        Dali.API_Private.listenEmission(Dali.API_Private.events.markTriggered, e=>{
            if(this.containsMarkValue(marks,e.detail.value)){
                if(e.detail.stateElement){ //checkIfTriggered
                    let new_mark = {};
                    new_mark[e.detail.id] = e.detail.value; //TODO: add this to state so it updates
                    this.setState({
                        triggeredMarks: this.getTriggeredMarks(marks,e.detail.value),
                        richElementState: Object.assign({}, richElementsState, new_mark)
                    });
                }else{
                    this.setState({triggeredMarks: this.getTriggeredMarks(marks,e.detail.value)});
                }
            }
        });
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.triggeredMarks.length !== 0 && nextState.triggeredMarks[0].currentState === 'PENDING'){
            let newMark = nextState.triggeredMarks.slice();
            newMark[0].currentState = 'TRIGGERED';
            this.setState({
                currentView:  nextState.currentView.concat([nextState.triggeredMarks[0].connection]),
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

    getTriggeredMarks(marks,mark_value){
        let state_marks = [];
        marks.forEach(mark_element=>{
            if(mark_element.value === mark_value){
                state_marks.push({
                    currentState:"PENDING",
                    id: mark_element.id,
                    value: mark_element.value,
                    connection:mark_element.connection
                });
            }
        });
        return state_marks;
    }

    getAllMarks() {
        let currentView = this.state.currentView[0];

        let boxes = this.getAllRichDescendantBoxes(currentView);
        let marks = [];
        boxes.forEach(box=>{
            Object.keys(Dali.State.toolbarsById[box].state.__marks).map(mark_element=>{
                marks.push(Dali.State.toolbarsById[box].state.__marks[mark_element]);
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

