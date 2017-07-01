import React, {Component} from 'react';
import CanvasVisorDoc from './CanvasVisorDoc';
import CanvasVisorSli from './CanvasVisorSli';
import {isSlide} from './../../../utils';

export default class CanvasVisor extends Component {

    render() {
        let visorContent;
        if (isSlide(this.props.navItemSelected.type)) {
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
                                           fromCV={false}/>;
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
                                           fromCV={false}/>;
            /* jshint ignore:end */
        }

        return (
            /* jshint ignore:start */
            visorContent
            /* jshint ignore:end */
        );
    }




}
