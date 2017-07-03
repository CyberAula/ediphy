import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import BoxSortableVisor from './BoxSortableVisor';
import {Col, Button} from 'react-bootstrap';
import {isSortableBox, isSlide} from './../../../utils';
import CanvasVisorDoc from './CanvasVisorDoc';
import CanvasVisorSli from './CanvasVisorSli';

export default class ContainedCanvasVisor extends Component {

    componentDidMount(){

    }
    render() {
        let visorContent;
        if (isSlide(this.props.containedViewSelected.type)) {
            /* jshint ignore:start */
            visorContent = <CanvasVisorSli navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           containedViewSelected={this.props.containedViewSelected}
                                           containedViews={this.props.containedViews}                                           
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           removeLastView={this.props.removeLastView}
                                           richElementsState={this.props.richElementsState}
                                           showCanvas={this.props.showCanvas}
                                           canvasRatio={this.props.canvasRatio}
                                           changeCurrentView={this.props.changeCurrentView}
                                           title={this.props.title}
                                           triggeredMarks={this.props.triggeredMarks}
                                           viewsArray={this.props.viewsArray}
                                           fromCV={true}/>;
            /* jshint ignore:end */
        }else{
            /* jshint ignore:start */
            visorContent = <CanvasVisorDoc navItemSelected={this.props.navItemSelected}
                                           navItems={this.props.navItems}
                                           containedViewSelected={this.props.containedViewSelected}
                                           containedViews={this.props.containedViews}
                                           boxes={this.props.boxes}
                                           boxSelected={this.props.boxSelected}
                                           boxLevelSelected={this.props.boxLevelSelected}
                                           toolbars={this.props.toolbars}
                                           removeLastView={this.props.removeLastView}
                                           richElementsState={this.props.richElementsState}
                                           showCanvas={this.props.showCanvas}
                                           changeCurrentView={this.props.changeCurrentView}
                                           title={this.props.title}
                                           triggeredMarks={this.props.triggeredMarks}
                                           viewsArray={this.props.viewsArray}
                                           fromCV={true}/>;
            /* jshint ignore:end */
        }

        return (
            /* jshint ignore:start */
            visorContent
            /* jshint ignore:end */
        );
    }
 

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({showTitle: false});
        }
        document.getElementById('contained_maincontent').scrollTop = 0;

    }


}
