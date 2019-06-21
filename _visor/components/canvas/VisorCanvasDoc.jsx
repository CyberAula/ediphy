import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import SubmitButton from '../score/SubmitButton';
import Score from '../score/Score';
import VisorBoxSortable from './VisorBoxSortable';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { isContainedView, isSortableBox, isSection, isView } from '../../../common/utils';
import i18n from 'i18next';
import { getThemeColors } from "../../../common/themes/theme_loader";
import ThemeCSS from "../../../common/themes/ThemeCSS";

export default class VisorCanvasDoc extends Component {

    render() {
        let titles = [];
        let itemSelected = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let isCV = !isView(this.props.currentView);
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

        let boxes = isCV ? this.props.containedViews[this.props.currentView].boxes || [] : this.props.navItems[this.props.currentView].boxes || [];
        let thisView = this.props.viewsArray && this.props.viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(this.props.viewsArray[this.props.viewsArray.length - 2]) ? this.props.viewToolbars[this.props.viewsArray[this.props.viewsArray.length - 2]].viewName : this.props.viewToolbars[this.props.viewsArray[this.props.viewsArray.length - 2]].viewName)) : i18n.t('messages.go_back');
        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );

        let animationType = isCV ? "animation-zoom" : ""; // "animation-slide";

        let exercises = this.props.exercises[this.props.currentView];
        let toolbar = this.props.viewToolbars[this.props.currentView];

        let styleConfig = this.props.styleConfig;
        let theme = !toolbar || !toolbar.theme ? (styleConfig && styleConfig.theme ? styleConfig.theme : 'default') : toolbar.theme;
        let colors = toolbar.colors ? toolbar.colors : getThemeColors(theme);

        return (
            <Col id={(isCV ? "containedCanvas_" : "canvas_") + this.props.currentView} md={12} xs={12} className={(isCV ? "containedCanvasClass " : "canvasClass ") + animationType + (this.props.show ? "" : " hidden")}
                style={{ display: 'initial', padding: '0', width: '100%' }}>
                <div className={"safeZone"} style={{ height: 'inherit' }}>
                    <div className={"scrollcontainer " + theme} style={{ background: toolbar.background }}>
                        {isCV ? (< OverlayTrigger placement="bottom" overlay={tooltip}>
                            <a href="#" className="btnOverBar cvBackButton" style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }}
                                onClick={a => {
                                    ReactDOM.findDOMNode(this).classList.add("exitCanvas");
                                    setTimeout(function() {
                                        this.props.removeLastView();
                                    }.bind(this), 500);
                                    a.stopPropagation();
                                }}><i className="material-icons">close</i></a></OverlayTrigger>) : (<span />)}
                        <VisorHeader titles={titles}
                            courseTitle={this.props.title}
                            titleMode={itemSelected.titleMode}
                            navItems={this.props.navItems}
                            currentView={this.props.currentView}
                            viewToolbar={this.props.viewToolbars[this.props.currentView]}
                            containedViews={this.props.containedViews}
                            showButton/>
                        <div className="outter canvasvisor">
                            <div id={(isCV ? 'airlayer_cv_' : 'airlayer_') + this.props.currentView}
                                className={(isCV ? 'airlayer_cv' : 'airlayer') + ' doc_air'}
                                style={{ background: itemSelected.background, visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                                <div id={isCV ? "contained_maincontent" : "maincontent"}
                                    className={'innercanvas doc'}
                                    style={{ background: itemSelected.background, visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                                    <br/>

                                    {boxes.map(id => {
                                        let box = this.props.boxes[id];
                                        if (!isSortableBox(box.id)) {
                                            return null;
                                        }
                                        return <VisorBoxSortable key={id}
                                            id={id}
                                            exercises={exercises}
                                            show={this.props.show}
                                            boxes={this.props.boxes}
                                            changeCurrentView={this.props.changeCurrentView}
                                            currentView={this.props.currentView}
                                            fromScorm={this.props.fromScorm}
                                            toolbars={this.props.pluginToolbars}
                                            setAnswer={this.props.setAnswer}
                                            marks={this.props.marks}
                                            onMarkClicked={this.props.onMarkClicked}
                                            richElementsState={this.props.richElementsState}
                                            themeColors = {colors}/>;

                                    })}
                                </div>
                            </div>
                        </div>

                        {this.props.fromPDF || !(exercises) || !(exercises.exercises) ? null : <div className={"pageFooter" + (!exercises || !exercises.exercises || Object.keys(exercises.exercises).length === 0 ? " hidden" : "")}>
                            <SubmitButton onSubmit={()=>{this.props.submitPage(this.props.currentView);}} exercises={exercises} />
                            <Score exercises={exercises}/>
                        </div>}
                        <div className={(this.props.fromPDF === true) ? "pageEnd" : ""} />
                    </div>
                </div>
                {this.props.show ?
                    (<ThemeCSS
                        styleConfig={this.props.styleConfig}
                        aspectRatio = {this.props.aspectRatio}
                        theme={ theme }
                        fromPDF={this.props.fromPDF}
                        toolbar = {{ ...toolbar, colors: colors }}
                    />) : null}
            </Col>
        );
    }

    componentWillReceiveProps(nextProps) {
        /* if (this.props.currentView.id !== nextProps.currentView.id) {
            document.getElementById(!isView(this.props.currentView) ? "contained_maincontent" : "maincontent").scrollTop = 0;
        }*/
    }

}

VisorCanvasDoc.propTypes = {
    /**
    * Show the current view
    */
    show: PropTypes.bool,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
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
     * General style config
     */
    styleConfig: PropTypes.object,
    /**
     * Aspect ratio of the slides
     */
    aspectRatio: PropTypes.number,

};
