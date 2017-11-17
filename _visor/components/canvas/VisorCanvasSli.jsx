import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisorBox from './VisorBox';
import { Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import VisorHeader from './VisorHeader';
import { aspectRatio } from '../../../common/common_tools';
import ReactResizeDetector from 'react-resize-detector';
import { isContainedView, isView } from '../../../common/utils';
import i18n from 'i18next';

export default class VisorCanvasSli extends Component {

    render() {

        let titles = [];
        let itemSelected = this.props.navItems[this.props.currentView] || this.props.containedViews[this.props.currentView];
        let isCV = !isView(this.props.currentView);

        if (itemSelected.id !== 0 && !isCV) {
            titles.push(itemSelected.name);
            let parent = itemSelected.parent;
            while (parent !== 0) {
                titles.push(this.props.navItems[parent].name);
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
        // aspectRatio(this.props.aspectRatio);
        let boxes = isCV ? this.props.containedViews[this.props.currentView].boxes || [] : this.props.navItems[this.props.currentView].boxes || [];
        let thisView = this.props.viewsArray && this.props.viewsArray.length > 1 ? (i18n.t('messages.go_back_to') + (isContainedView(this.props.viewsArray[this.props.viewsArray.length - 2]) ? this.props.containedViews[this.props.viewsArray[this.props.viewsArray.length - 2]].name : this.props.navItems[this.props.viewsArray[this.props.viewsArray.length - 2]].name)) : i18n.t('messages.go_back');

        const tooltip = (
            <Tooltip id="tooltip">{thisView}</Tooltip>
        );
        let animationType = "animation-zoom";
        return (
            <Col id={isCV ? "containedCanvas" : "canvas"} md={12} xs={12} className={isCV ? animationType : ""}
                style={{ display: 'initial', padding: '0', width: '100%' }}>

                <div id={isCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air'}
                    style={{ margin: '0 auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>

                    <div id={isCV ? "contained_maincontent" : "maincontent"}
                        onClick={e => {
                            this.setState({ showTitle: false });
                        }}
                        className={'innercanvas sli'}
                        style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>
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
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            currentView={this.props.currentView}
                            containedViews={this.props.containedViews}
                            titleModeToggled={this.props.titleModeToggled}
                            onUnitNumberChanged={this.props.onUnitNumberChanged}
                            showButton/>

                        <br/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            display: (this.props.boxLevelSelected > 0) ? "block" : "none",
                            visibility: (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                        }} />

                        {boxes.map(id => {
                            let box = this.props.boxes[id];

                            return <VisorBox key={id}
                                id={id}
                                boxes={this.props.boxes}
                                boxSelected={this.props.boxSelected}
                                boxLevelSelected={this.props.boxLevelSelected}
                                changeCurrentView={(element)=>{this.props.changeCurrentView(element);}}
                                currentView={this.props.currentView}
                                toolbars={this.props.toolbars}
                                richElementsState={this.props.richElementsState}/>;

                        })}

                        <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{
                            aspectRatio(this.props.canvasRatio, isCV ? 'airlayer_cv' : 'airlayer', isCV ? "containedCanvas" : "canvas");
                        }} />
                    </div>
                </div>

            </Col>
        );
    }
    componentDidUpdate() {
        // aspectRatio(this.props.canvasRatio);
    }

    componentDidMount() {
        let isCV = !isView(this.props.currentView);
        aspectRatio(this.props.canvasRatio, isCV ? 'airlayer_cv' : 'airlayer', isCV ? "containedCanvas" : "canvas");

        // window.addEventListener("resize", aspectRatio);
    }
    componentWillUnmount() {
        // window.removeEventListener("resize", aspectRatio);
    }

    componentWillUpdate(nextProps) {
        if (this.props.canvasRatio !== nextProps.canvasRatio) {
            let isCV = !isView(nextProps.currentView);
            window.canvasRatio = nextProps.canvasRatio;
            // window.removeEventListener("resize", aspectRatio);
            aspectRatio(nextProps.canvasRatio, isCV ? 'airlayer_cv' : 'airlayer', isCV ? "containedCanvas" : "canvas");
            // window.addEventListener("resize", aspectRatio);
        }

    }

}

VisorCanvasSli.propTypes = {
    /**
     * Diccionario que contiene todas las cajas
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
     * Diccionario que contiene todas las toolbars
     */
    toolbars: PropTypes.object,
    /**
     * Lista de marcas en curso o lanzadas
     */
    triggeredMarks: PropTypes.array,
    /**
     *  Array de vistas
     */
    viewsArray: PropTypes.array,
};
