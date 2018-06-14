import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import SubmitButton from '../score/SubmitButton';
import Score from '../score/Score';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { aspectRatio } from '../../../common/common_tools';
import ReactResizeDetector from 'react-resize-detector';
import { isContainedView, isView } from '../../../common/utils';
import i18n from 'i18next';

export default class VisorCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '100%',
            height: '100%',
            marginTop: 0,
            marginBottom: 0,
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
        let thisView = this.props.viewsArray && this.props.viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(this.props.viewsArray[this.props.viewsArray.length - 2]) ? this.props.containedViews[this.props.viewsArray[this.props.viewsArray.length - 2]].name : this.props.navItems[this.props.viewsArray[this.props.viewsArray.length - 2]].name)) : i18n.t('messages.go_back');
        let backgroundIsUri = (/data\:/).test(toolbar.background);
        let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(toolbar.background);

        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );
        let animationType = "animation-zoom";
        console.log(this.props.fromPDF);
        let padding = (this.props.fromPDF ? '0px' : '');
        return (
            <Col id={isCV ? "containedCanvas" : "canvas"} md={12} xs={12} className={"canvasSliClass" + (isCV ? animationType : "")}
                style={{ display: 'initial', width: '100%', padding }}>

                <div id={isCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air'}
                    style={{ margin: '0 auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden'),
                        width: this.state.width, height: this.state.height, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom,
                    }}>

                    <div id={isCV ? "contained_maincontent" : "maincontent"}
                        className={'innercanvas sli'}
                        style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden'),
                            background: isColor ? toolbar.background : '',
                            backgroundImage: !isColor ? 'url(' + toolbar.background + ')' : '',
                            backgroundSize: toolbar.backgroundAttr === 'full' ? 'cover' : 'auto 100%',
                            backgroundRepeat: toolbar.backgroundAttr === 'centered' ? 'no-repeat' : 'repeat',
                            backgroundPosition: toolbar.backgroundAttr === 'centered' || toolbar.backgroundAttr === 'full' ? 'center center' : '0% 0%' }}>
                        {isCV ? (< OverlayTrigger placement="bottom" overlay={tooltip}>
                            <a href="#" className="btnOverBar cvBackButton" style={{ pointerEvents: this.props.viewsArray.length > 1 ? 'initial' : 'none', color: this.props.viewsArray.length > 1 ? 'black' : 'gray' }} onClick={a => {
                                document.getElementById("containedCanvas").classList.add("exitCanvas");
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
                                exercises={(this.props.exercises && this.props.exercises.exercises) ? this.props.exercises.exercises[id] : undefined}
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

                        <div className={"pageFooter" + (!this.props.exercises || !this.props.exercises.exercises || Object.keys(this.props.exercises.exercises).length === 0 ? " hidden" : "")}>
                            <SubmitButton onSubmit={()=>{this.props.submitPage(this.props.currentView);}} exercises={this.props.exercises} />
                            <Score exercises={this.props.exercises}/>
                        </div>

                    </div>
                </div>
                <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{
                    if (!this.props.fromPDF) {
                        this.aspectRatio(this.props, this.state);
                    }
                }} />
            </Col>
        );
    }
    componentDidUpdate() {
        // aspectRatio(this.props.canvasRatio);
    }

    componentDidMount() {
        let isCV = !isView(this.props.currentView);
        let itemSel = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        if (!this.props.fromPDF) {
            this.aspectRatio(this.props, this.state);
            window.addEventListener("resize", this.aspectRatioListener.bind(this));
        } else {

        }

    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.aspectRatioListener.bind(this));
    }

    aspectRatioListener() {
        this.aspectRatio();
    }

    aspectRatio(props = this.props, state = this.state) {
        let fromCV = !isView(props.currentView);
        let ar = props.canvasRatio;
        let itemSel = props.navItems[props.currentView] || props.containedViews[props.currentView];
        console.log(itemSel);
        let customSize = itemSel.customSize;
        let calculated = aspectRatio(ar, fromCV ? 'airlayer_cv' : 'airlayer', fromCV ? 'containedCanvas' : 'canvas', customSize);
        let { width, height, marginTop, marginBottom } = state;
        let current = { width, height, marginTop, marginBottom };
        if (JSON.stringify(calculated) !== JSON.stringify(current)) {
            console.log('wwwwww');
            this.setState({ ...calculated });
        }

    }

    componentWillUpdate(nextProps, nextState) {
        let itemSel = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let nextItemSel = nextProps.navItems[nextProps.currentView] || nextProps.containedViews[nextProps.currentView];
        if ((this.props.canvasRatio !== nextProps.canvasRatio) || (itemSel !== nextItemSel)) {
            let isCV = !isView(nextProps.currentView);
            window.canvasRatio = nextProps.canvasRatio;
            this.aspectRatio(nextProps, nextState);
        }

    }
}

VisorCanvasSli.propTypes = {
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Relación de aspecto para las diapositivas
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Cambia la vista actual
     */
    changeCurrentView: PropTypes.func.isRequired,
    /**
     * Contained views dictionary (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista actual
     */
    currentView: PropTypes.any,
    /**
     * Object containing all views (by id)
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
    /**
     * Function that triggers a mark
     */
    onMarkClicked: PropTypes.func,
};
