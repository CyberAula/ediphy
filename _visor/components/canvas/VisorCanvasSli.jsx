import React, { Component } from 'react';

import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import SubmitButton from '../score/SubmitButton';
import Score from '../score/Score';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { aspectRatio, changeFontBase } from '../../../common/commonTools';
import ReactResizeDetector from 'react-resize-detector';
import { isContainedView, isView } from '../../../common/utils';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import { Animated } from "react-animated-css";

import { loadBackgroundStyle } from "../../../common/themes/backgroundLoader";
import ThemeCSS from '../../../common/themes/ThemeCSS';
import { getThemeColors } from "../../../common/themes/themeLoader";
import { getTransition } from "../../../common/themes/transitions/transitions";

export default class VisorCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '100%',
            height: '100%',
            marginTop: 0,
            marginBottom: 0,
            fontBase: 14,
            previousView: '',
        };
        this.TRANSITION_TIME = 800;
    }

    render() {
        let { viewsArray, navItems, currentView, containedViews, viewToolbars, styleConfig, exercises } = this.props;

        let titles = [];
        let itemSelected = navItems[currentView] || containedViews[currentView];
        let isCV = !isView(currentView);
        let toolbar = viewToolbars[currentView];

        let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;
        let colors = toolbar.colors ? toolbar.colors : getThemeColors(theme);
        let transition = getTransition(styleConfig, this.props.fromPDF, isCV, this.props.backwards);
        let isVisible = this.props.show || currentView === this.state.previousView;

        if (itemSelected !== 0 && !isCV) {
            let title = viewToolbars[currentView].viewName;
            titles.push(title);
            let parent = itemSelected.parent;
            while (parent !== 0) {
                let title2 = viewToolbars[parent].viewName;
                titles.push(title2);
                parent = navItems[parent].parent;
            }
            titles.reverse();
        }

        let maincontent = isCV ? document.getElementById('contained_maincontent') : document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let boxes = isCV ? containedViews[currentView].boxes || [] : navItems[currentView].boxes || [];
        let thisView = viewsArray && viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(viewsArray[viewsArray.length - 2]) ? viewToolbars[viewsArray[viewsArray.length - 2]].viewName : viewToolbars[viewsArray[viewsArray.length - 2]].viewName)) : i18n.t('messages.go_back');

        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );
        let viewExercises = exercises[currentView];

        return (
            <Col ref={"canvas_" + this.props.currentView}
                id={(isCV ? "containedCanvas_" : "canvas_") + this.props.currentView}
                md={12} xs={12}
                className={(isCV ? "containedCanvasClass " : "canvasClass ") + " canvasSliClass safeZone "}
                style={{
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    display: 'float',
                    visibility: isVisible ? 'visible' : 'hidden',
                    zIndex: this.props.show ? 100 : this.props.z,
                    width: '100%',
                    padding: '0px',
                    overflow: 'hidden',
                    fontSize: this.state.fontBase ? (this.state.fontBase + 'px') : '14px' }}>

                <div id={(isCV ? 'airlayer_cv_' : 'airlayer_') + this.props.currentView}
                    className={' slide_air airlayer'}
                    style={{ margin: '0 auto',
                        width: this.state.width,
                        height: this.state.height,
                        marginTop: this.state.marginTop,
                        marginBottom: this.state.marginBottom,
                    }}>

                    <Animated
                        key={this.props.selectedView}
                        animationIn={transition.in}
                        animationOut={transition.out}
                        animationInDuration={this.TRANSITION_TIME}
                        animationOutDuration={this.TRANSITION_TIME}
                        isVisible={this.props.show && this.state.show}
                        style={{ height: '100%', width: '100%' }}
                    >

                        <div id={isCV ? "contained_maincontent" : "maincontent"}
                            className={'innercanvas sli ' + theme + ' ' + this.props.currentView}
                            style={{ ...loadBackgroundStyle(this.props.showCanvas, toolbar, styleConfig, true, this.props.canvasRatio, itemSelected.background),
                                visibility: isVisible ? 'visible' : 'hidden' }}>
                            {isCV ? (< OverlayTrigger placement="bottom" overlay={tooltip}>
                                <a href="#"
                                    className="btnOverBar cvBackButton"
                                    style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }}
                                    onClick={this.onCloseContainedView}>
                                    <i className="material-icons">close</i></a></OverlayTrigger>) : (<span />)}
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
                                return <VisorBox key={id}
                                    id={id}
                                    show={isVisible}
                                    exercises={(viewExercises && viewExercises.exercises) ? viewExercises.exercises[id] : undefined}
                                    boxes={this.props.boxes}
                                    changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                    currentView={this.props.currentView}
                                    fromScorm={this.props.fromScorm}
                                    toolbars={this.props.pluginToolbars}
                                    marks={this.props.marks}
                                    setAnswer={this.props.setAnswer}
                                    onMarkClicked={this.props.onMarkClicked}
                                    richElementsState={this.props.richElementsState}
                                    themeColors={colors}
                                />;
                            })}

                            {this.props.fromPDF || !viewExercises || !viewExercises.exercises ? null : <div className={"pageFooter" + (!viewExercises || !viewExercises.exercises || Object.keys(viewExercises.exercises).length === 0 ? " hidden" : "")}>
                                <SubmitButton onSubmit={()=>{this.props.submitPage(this.props.currentView);}} exercises={viewExercises} />
                                <Score exercises={viewExercises}/>
                            </div>}

                        </div>
                    </Animated>
                </div>

                {this.props.show ?
                    (<ThemeCSS
                        styleConfig={this.props.styleConfig}
                        aspectRatio = {this.props.aspectRatio}
                        theme={ theme }
                        toolbar = {{ ...toolbar, colors: colors }}
                        template = { itemSelected.background ? itemSelected.background : 0 }
                        fromPDF={this.props.fromPDF}
                        currentView={this.props.currentView}
                    />) : null}

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

    setTimeoutTransition(time) {
        return setTimeout(() => this.setState({ previousView: '' }), time);
    }

    onCloseContainedView = (event) => {
        this.setState({ show: false }, () => {
            setTimeout(this.props.removeLastView, this.TRANSITION_TIME);
            event.persist();
        });
    };

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        // Manage transition so animation in and out are simultaneous
        if (!nextProps.show && this.props.show) {
            let backwards = nextProps.navItemsIds.indexOf(nextProps.selectedView) < this.props.navItemsIds.indexOf(this.props.selectedView);
            this.setState({ backwards, show: true, previousView: nextProps.currentView }, () => this.setTimeoutTransition(this.TRANSITION_TIME));
        } else if(nextProps.show && !this.props.show) {
            let backwards = nextProps.navItemsIds.indexOf(nextProps.selectedView) <= this.props.navItemsIds.indexOf(this.props.selectedView);
            this.setState({ backwards: backwards });
        }
        let itemSel = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let nextItemSel = nextProps.navItems[nextProps.currentView] || nextProps.containedViews[nextProps.currentView];
        if ((this.props.canvasRatio !== nextProps.canvasRatio) || (itemSel !== nextItemSel)) {
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
    /**
     * General style config
     */
    styleConfig: PropTypes.object,
    /**
     * Indicates the aspect ratio of the slides
     */
    aspectRatio: PropTypes.number,
    /**
     * Indicates the zIndex of the slide
     */
    z: PropTypes.number,
    /**
     * Indicates if user is navigating backwards
     */
    backwards: PropTypes.bool,
    /**
     * Indicates the current slide selected
     */
    selectedView: PropTypes.string,
    /**
     * Array of ordered navItems
     */
    navItemsIds: PropTypes.array,
};
