import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import SubmitButton from '../scorm/SubmitButton';
import Score from '../scorm/Score';
import VisorBoxSortable from './VisorBoxSortable';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { isContainedView, isSortableBox, isSection, isView } from '../../../common/utils';
import i18n from 'i18next';

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

        let maincontent = isCV ? document.getElementById('contained_maincontent') : document.getElementById('maincontent');
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = isCV ? this.props.containedViews[this.props.currentView].boxes || [] : this.props.navItems[this.props.currentView].boxes || [];
        let thisView = this.props.viewsArray && this.props.viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(this.props.viewsArray[this.props.viewsArray.length - 2]) ? this.props.containedViews[this.props.viewsArray[this.props.viewsArray.length - 2]].name : this.props.navItems[this.props.viewsArray[this.props.viewsArray.length - 2]].name)) : i18n.t('messages.go_back');

        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );

        let animationType = isCV ? "animation-zoom" : ""; // "animation-slide";

        let marks = {};

        return (

            <Col id={isCV ? "containedCanvas" : "canvas"} md={12} xs={12} className={animationType}
                style={{ display: 'initial', padding: '0', width: '100%' }}>
                <div className="scrollcontainer" style={{ background: itemSelected.background }}>
                    {isCV ? (< OverlayTrigger placement="bottom" overlay={tooltip}>
                        <a href="#" className="btnOverBar cvBackButton" style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }}
                            onClick={a => {
                                document.getElementById("containedCanvas").classList.add("exitCanvas");
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
                        <div id={isCV ? 'airlayer_cv' : 'airlayer'}
                            className={'doc_air'}
                            style={{ background: itemSelected.background, visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                            <div id={isCV ? "contained_maincontent" : "maincontent"}
                                onClick={e => {
                                    this.setState({ showTitle: false });
                                }}
                                className={'innercanvas doc'}
                                style={{ background: itemSelected.background, visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                                <br/>

                                {boxes.map(id => {
                                    let box = this.props.boxes[id];
                                    if (!isSortableBox(box.id)) {
                                        return null;
                                        /* return <VisorBox key={id}
                                            id={id}
                                            exercises={(this.props.exercises && this.props.exercises.exercises) ? this.props.exercises.exercises[id] : undefined}
                                            boxes={this.props.boxes}
                                            changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                            currentView={this.props.currentView}
                                            fromScorm={this.props.fromScorm}
                                            toolbars={this.props.pluginToolbars}
                                            setAnswer={this.props.setAnswer}
                                            marks={marks}
                                            richElementsState={this.props.richElementsState}/>;*/
                                    }
                                    return <VisorBoxSortable key={id}
                                        id={id}
                                        exercises={this.props.exercises}
                                        boxes={this.props.boxes}
                                        changeCurrentView={this.props.changeCurrentView}
                                        currentView={this.props.currentView}
                                        fromScorm={this.props.fromScorm}
                                        toolbars={this.props.pluginToolbars}
                                        setAnswer={this.props.setAnswer}
                                        marks={this.props.marks}
                                        onMarkClicked={this.props.onMarkClicked}
                                        richElementsState={this.props.richElementsState}/>;

                                })}
                            </div>
                        </div>
                    </div>
                    <div className={"pageFooter" + (!this.props.exercises || !this.props.exercises.exercises || Object.keys(this.props.exercises.exercises).length === 0 ? " hidden" : "")}>
                        <SubmitButton onSubmit={()=>{this.props.submitPage(this.props.currentView);}} exercises={this.props.exercises} />
                        <Score exercises={this.props.exercises}/>
                    </div>

                </div>
            </Col>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentView.id !== nextProps.currentView.id) {
            document.getElementById(!isView(this.props.currentView) ? "contained_maincontent" : "maincontent").scrollTop = 0;
        }
    }

}

VisorCanvasDoc.propTypes = {
    /**
     * Diccionario que contiene todas las cajas
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Elimina la última vista
     */
    removeLastView: PropTypes.func.isRequired,
    /**
     * Estado del plugin enriquecido en la transición
     */
    richElementsState: PropTypes.object,
    /**
     * Indicador de si se muestra el canvas (tiene que haber un navItem seleccionado)
     */
    showCanvas: PropTypes.bool,
    /**
     * Título del curso
     */
    title: PropTypes.any,
    /**
     *  Array de vistas
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
};
