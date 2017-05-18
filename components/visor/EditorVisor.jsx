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
        //
        // Add a queue of marks fired [{id: value, CurrentState: CLEAR, PENDING, DONE}] or array
        // Whenever the mark is ready trigger it

        let marks = this.getAllMarks();
        let box_id = this.props.id;
        Dali.API_Private.listenEmission(Dali.API_Private.events.markTriggered, e=>{
        });



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

    getAllMarks(){
        let currentView = this.state.currentView[0];

        Dali.State.toolbarsById[currentView];

    }

    getAllRichDescendantBoxes(searchingID){
        let boxes = Dali.State.navItemsById[searchingId].boxes;

        let newBoxes=[];

        Object.keys(Dali.State.boxesById).map(e=>{
            if(boxes.indexOf(e) !== -1){
                newBoxes.push(boxes[e]);


                if(Object.keys(Dali.State.boxesById(boxes[e])).length !== 0){
                    Object.keys(boxe[e].map(a=>{
                        boxes[e].
                    }));
                }
            }
        });

        newBoxes.


    }

}

/* jshint ignore:start */
ReactDOM.render((<Visor />), document.getElementById('root'));
/* jshint ignore:end */

