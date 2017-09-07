import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import BoxVisor from './BoxVisor';
import BoxSortableVisor from './BoxSortableVisor';
import { Col, Button } from 'react-bootstrap';
import { isSortableBox, isSlide } from '../../../common/utils';
import CanvasVisorDoc from './CanvasVisorDoc';
import CanvasVisorSli from './CanvasVisorSli';
import { CSSTransition } from 'react-transition-group';

export default class ContainedCanvasVisor extends Component {

    componentDidMount() {

    }
    render() {
        let visorContent;
        if (isSlide(this.props.containedViews[this.props.currentView].type)) {
            visorContent = <CanvasVisorSli
                navItems={this.props.navItems}
                currentView={this.props.currentView}
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
                viewsArray={this.props.viewsArray}/>;
        }else{
            visorContent = <CanvasVisorDoc
                navItems={this.props.navItems}
                containedViews={this.props.containedViews}
                currentView={this.props.currentView}
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
                viewsArray={this.props.viewsArray}/>;
        }
        return (
            <CSSTransition
                key="anim"
                classNames={{
                    appear: 'appear',
                    appearActive: 'active-appear',
                    enter: 'enter',
                    enterActive: 'active-enter',
                    exit: 'exit',
                    exitActive: 'active-exit',
                }}
                timeout={{ enter: 500, exit: 300 }}>
                {visorContent}
            </CSSTransition>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.boxSelected !== -1) {
            this.setState({ showTitle: false });
        }
        document.getElementById('contained_maincontent').scrollTop = 0;

    }

    componentDidUpdate() {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
}
