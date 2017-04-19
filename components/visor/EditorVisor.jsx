import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Grid} from 'react-bootstrap';

import CanvasVisor from './components/CanvasVisor';
import ContainedCanvasVisor from './components/ContainedCanvasVisor';

require('es6-promise').polyfill();
require('./../../sass/style.scss');
require('./../../core/visor_entrypoint');

//TODO: define action to toggle different places

export default class Visor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: this.getCurrentView(Dali.State.navItemSelected, Dali.State.containedViewSelected)
        };
    }

    componentDidMount(){
        Dali.API_Private.listenEmission(Dali.API_Private.events.changeView, e => {
            this.setState({currentView: e.detail.id});
        });
    }

    getCurrentView(NIselected, CVselected){
        let currentView = (CVselected === 0) ? NIselected : CVselected;
        return currentView;
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
        //const currentView = this.getCurrentView(navItemSelected, containedViewSelected);

        return (
            /* jshint ignore:start */
            <Grid id="app" fluid={true} style={{height: '100%'}}>
                { this.state.currentView.indexOf("cv-") === -1 ?
                    (<CanvasVisor boxes={boxes}
                                boxSelected={boxSelected}
                                containedViews={containedViews}
                                navItems={navItems}
                                navItemSelected={navItems[navItemSelected]}
                                toolbars={toolbars}
                                title={title}
                                showCanvas={(navItemSelected !== 0)}
                    />) :
                    (<ContainedCanvasVisor boxes={boxes}
                                boxSelected={boxSelected}
                                containedViews={containedViews}
                                containedViewSelected={containedViewSelected}
                                navItems={navItems}
                                toolbars={toolbars}
                                title={title}
                                showCanvas={(navItemSelected !== 0)}
                    />)
                }
            </Grid>
            /* jshint ignore:end */
        );
    }
}

/* jshint ignore:start */
ReactDOM.render((<Visor />), document.getElementById('root'));
/* jshint ignore:end */

