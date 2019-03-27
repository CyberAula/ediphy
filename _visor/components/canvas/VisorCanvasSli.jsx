import React, { Component } from 'react';

import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import SubmitButton from '../score/SubmitButton';
import Score from '../score/Score';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { aspectRatio, changeFontBase } from '../../../common/common_tools';
import ReactResizeDetector from 'react-resize-detector';
import { isContainedView, isView } from '../../../common/utils';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
export default class VisorCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '100%',
            height: '100%',
            marginTop: 0,
            marginBottom: 0,
            fontBase: 14,
        };
    }

    render() {

        let titles = [];
        let itemSelected = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let isCV = !isView(this.props.currentView);
        let toolbar = this.props.viewToolbars[this.props.currentView];

        if (itemSelected !== 0 && !isCV) {
            let title = this.props.viewToolbars[this.props.currentView].viewName;
            titles.push(title);
            let parent = itemSelected.parent;
            while (parent !== 0) {
                let title2 = this.props.viewToolbars[parent].viewName;
                titles.push(title2);
                parent = this.props.navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = isCV ? document.getElementById('contained_maincontent') : document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = isCV ? this.props.containedViews[this.props.currentView].boxes || [] : this.props.navItems[this.props.currentView].boxes || [];
        let thisView = this.props.viewsArray && this.props.viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(this.props.viewsArray[this.props.viewsArray.length - 2]) ? this.props.viewToolbars[this.props.viewsArray[this.props.viewsArray.length - 2]].viewName : this.props.viewToolbars[this.props.viewsArray[this.props.viewsArray.length - 2]].viewName)) : i18n.t('messages.go_back');

        let backgroundIsUri = (/data\:/).test(toolbar.background);
        let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(toolbar.background);

        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );
        let exercises = this.props.exercises[this.props.currentView];

        let animationType = "animation-zoom";
        let padding = (this.props.fromPDF ? '0px' : '0px');

        return (
            <Col id={(isCV ? "containedCanvas_" : "canvas_") + this.props.currentView} md={12} xs={12} className={(isCV ? "containedCanvasClass " : "canvasClass ") + " canvasSliClass " + (isCV ? animationType : "") + (this.props.show ? "" : " hidden")}
                style={{ display: 'initial', width: '100%', padding, fontSize: this.state.fontBase ? (this.state.fontBase + 'px') : '14px' }}>

                <div id={(isCV ? 'airlayer_cv_' : 'airlayer_') + this.props.currentView}
                    className={' slide_air airlayer'}
                    style={{ margin: '0 auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden'),
                        width: this.state.width, height: this.state.height, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom,
                    }}>

                    <div id={isCV ? "contained_maincontent" : "maincontent"}
                        className={'innercanvas sli'}
                        style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden'),
                            background: isColor ? toolbar.background : '',
                            backgroundImage: !isColor ? 'url(' + toolbar.background + ')' : '',
                            backgroundSize: (toolbar && toolbar.background && (toolbar.backgroundAttr === 'centered' || toolbar.backgroundAttr === 'repeat')) ? (toolbar.backgroundZoom !== undefined ? (toolbar.backgroundZoom + '%') : '100%') : 'cover',
                            backgroundRepeat: toolbar.backgroundAttr === 'centered' ? 'no-repeat' : 'repeat',
                            backgroundPosition: toolbar.backgroundAttr === 'centered' || toolbar.backgroundAttr === 'full' ? 'center center' : '0% 0%' }}>
                        {isCV ? (< OverlayTrigger placement="bottom" overlay={tooltip}>
                            <a href="#" className="btnOverBar cvBackButton" style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }} onClick={a => {
                                ReactDOM.findDOMNode(this).classList.add("exitCanvas");
                                setTimeout(function() {
                                    this.props.removeLastView();
                                }.bind(this), 500);

                                a.stopPropagation();
                            }}><i className="material-icons">close</i></a></OverlayTrigger>) : (<span />)}
                        <VisorHeader titles={titles}
                            onShowTitle={()=>this.setState({ showTitle: true })}
                            courseTitle={this.props.title}
                            titleMode={itemSelected.titleMode}
                            navItems={this.props.navItems}
                            currentView={this.props.currentView}
                            viewToolbar={this.props.viewToolbars[this.props.currentView]}
                            containedViews={this.props.containedViews}
                            showButton/>
                        <br/>

                        {boxes.map(id => {
                            let box = this.props.boxes[id];
                            return <VisorBox key={id}
                                id={id}
                                show={this.props.show}
                                exercises={(exercises && exercises.exercises) ? exercises.exercises[id] : undefined}
                                boxes={this.props.boxes}
                                changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                currentView={this.props.currentView}
                                fromScorm={this.props.fromScorm}
                                toolbars={this.props.pluginToolbars}
                                marks={this.props.marks}
                                setAnswer={this.props.setAnswer}
                                onMarkClicked={this.props.onMarkClicked}
                                richElementsState={this.props.richElementsState}/>;
                        })}

                        {this.props.fromPDF || !exercises || !exercises.exercises ? null : <div className={"pageFooter" + (!exercises || !exercises.exercises || Object.keys(exercises.exercises).length === 0 ? " hidden" : "")}>
                            <SubmitButton onSubmit={()=>{this.props.submitPage(this.props.currentView);}} exercises={exercises} />
                            <Score exercises={exercises}/>
                        </div>}

                    </div>
                </div>
                <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{
                    if (!this.props.fromPDF) {
                        let calculated = this.aspectRatio(this.props, this.state);
                        this.setState({ fontBase: changeFontBase(calculated.width) });
                    } else if (this.props.fromPDF) {
                        this.setState({ fontBase: changeFontBase(this.props.expectedWidth) });
                    }
                }} />
            </Col>
        );
    }
    componentDidUpdate(prevProps) {
        // aspectRatio(this.props.canvasRatio);
        if(this.props.show && !prevProps.show) {
            this.aspectRatioListener();
        }
    }

    componentDidMount() {
        let isCV = !isView(this.props.currentView);
        let itemSel = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        if (!this.props.fromPDF) {
            let calculated = this.aspectRatio(this.props, this.state);
            this.setState({ fontBase: changeFontBase(calculated.width) });
            window.addEventListener("resize", this.aspectRatioListener.bind(this));
        } else {

        }

    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.aspectRatioListener.bind(this));
    }

    aspectRatioListener() {
        let calculated = this.aspectRatio();
        this.setState({ fontBase: changeFontBase(calculated.width) });
    }

    aspectRatio(props = this.props, state = this.state) {
        let fromCV = !isView(props.currentView);
        let ar = props.canvasRatio;
        let itemSel = props.navItems[props.currentView] || props.containedViews[props.currentView];
        let customSize = itemSel.customSize;
        let fromVisor = true;
        let calculated = aspectRatio(ar, (fromCV ? 'airlayer_cv_' : 'airlayer_') + props.currentView, (fromCV ? 'containedCanvas_' : 'canvas_') + props.currentView, customSize, fromVisor);
        let { width, height, marginTop, marginBottom } = state;
        let current = { width, height, marginTop, marginBottom };
        if (JSON.stringify(calculated) !== JSON.stringify(current)) {
            this.setState({ ...calculated });
        }
        return calculated;

    }

    componentWillUpdate(nextProps, nextState) {
        let itemSel = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let nextItemSel = nextProps.navItems[nextProps.currentView] || nextProps.containedViews[nextProps.currentView];
        if ((this.props.canvasRatio !== nextProps.canvasRatio) || (itemSel !== nextItemSel)) {
            let isCV = !isView(nextProps.currentView);
            window.canvasRatio = nextProps.canvasRatio;
            let calculated = this.aspectRatio(nextProps, nextState);
            this.setState({ fontBase: changeFontBase(calculated.width) });
        }

    }
}

VisorCanvasSli.propTypes = {
    /**
   * Show the current view
   */
    show: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Slide aspect ratio
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Changes current view
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Current view
     */
    currentView: PropTypes.any,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Function to delete last view
     */
    removeLastView: PropTypes.func.isRequired,
    /**
     * Rich plugin state during transition
     */
    richElementsState: PropTypes.object,
    /**
     * Show canvas (a navItem needs to be chosen)
     */
    showCanvas: PropTypes.bool,
    /**
     * Course title
     */
    title: PropTypes.any,
    /**
     *  Contains created views
     */
    viewsArray: PropTypes.array,
    /**
     * Whether the app is in SCORM mode or not
     */
    fromScorm: PropTypes.bool,
    /**
     * Object containing all the exercises in the course
     */
    exercises: PropTypes.object.isRequired,
    /**
     * Function for submitting a page Quiz
     */
    submitPage: PropTypes.func.isRequired,
    /**
     * Function for submitting a page Quiz
    */
    setAnswer: PropTypes.func.isRequired,
    /**
     * Pages toolbars
     */
    viewToolbars: PropTypes.object,
    /**
     * All marks
     */
    marks: PropTypes.object,
    /**
    * Boxes toolbars
    */
    pluginToolbars: PropTypes.object,
    /**
     * Function that triggers a mark
     */
    onMarkClicked: PropTypes.func,
    /**
     * Indicates if the content is being previewed in order to export it to PDF
     */
    fromPDF: PropTypes.bool,
    /**
     * Indicates the expected width for PDF exportation.
     */
    expectedWidth: PropTypes.number,
};
