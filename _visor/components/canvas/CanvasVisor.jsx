import React, { Component } from 'react';
import CanvasVisorDoc from './CanvasVisorDoc';
import CanvasVisorSli from './CanvasVisorSli';
import { isSlide } from '../../../common/utils';

export default class CanvasVisor extends Component {

    render() {
        let visorContent;
        if (isSlide(this.props.navItems[this.props.currentView].type)) {
            visorContent = <CanvasVisorSli
                boxes={this.props.boxes}
                boxLevelSelected={this.props.boxLevelSelected}
                boxSelected={this.props.boxSelected}
                canvasRatio={this.props.canvasRatio}
                changeCurrentView={this.props.changeCurrentView}
                containedViews={this.props.containedViews}
                currentView={this.props.currentView}
                navItems={this.props.navItems}
                removeLastView={this.props.removeLastView}
                richElementsState={this.props.richElementsState}
                showCanvas={this.props.showCanvas}
                title={this.props.title}
                toolbars={this.props.toolbars}
                triggeredMarks={this.props.triggeredMarks}
                viewsArray={this.props.viewsArray}/>;
        }else{
            visorContent = <CanvasVisorDoc
                boxes={this.props.boxes}
                boxLevelSelected={this.props.boxLevelSelected}
                boxSelected={this.props.boxSelected}
                containedViews={this.props.containedViews}
                changeCurrentView={this.props.changeCurrentView}
                currentView={this.props.currentView}
                navItems={this.props.navItems}
                removeLastView={this.props.removeLastView}
                richElementsState={this.props.richElementsState}
                showCanvas={this.props.showCanvas}
                toolbars={this.props.toolbars}
                title={this.props.title}
                triggeredMarks={this.props.triggeredMarks}
                viewsArray={this.props.viewsArray}/>;
        }

        return (
            visorContent
        );
    }

    componentDidUpdate() {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }

}
