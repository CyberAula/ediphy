import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';
import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide } from '../../common/utils';
import { Grid, Row, Col } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { changeFontBase } from "../../common/common_tools";
import ReactResizeDetector from 'react-resize-detector';

window.html2canvas = html2canvas;

export default function printToPDF(state, callback) {
    if (!jsPDF) {
        callback(true);
        return;
    }
    let navItemsIds = state.navItemsIds;
    let navItems = state.navItemsById;
    let boxes = state.boxesById;
    let containedViews = state.containedViewsById;
    let viewToolbars = state.viewToolbarsById;
    let pluginToolbars = state.pluginToolbarsById;
    let globalConfig = state.globalConfig;
    let exercises = state.exercises;
    let title = globalConfig.title || 'Ediphy';
    let author = globalConfig.author || 'Ediphy';
    let keywords = globalConfig.keywords;
    let canvasRatio = globalConfig.canvasRatio;

    let notSections = state.navItemsIds.filter(nav=> {
        return !navItems[nav].hidden && (Ediphy.Config.sections_have_content || !isSection(nav));
    });

    const SLIDE_BASE = 785;
    const DOC_BASE = 990;
    const A4_RATIO = 1.4142;
    let addHTML;
    addHTML = function(navs, last) {

        console.log('STATE: ' + JSON.stringify(state));

        let currentView = navs[0];
        console.log(currentView);
        let slide = ((isCV && isSlirde(containedViews[currentView].type)) ||
            (!isCV && isSlide(navItems[currentView].type)));

        let viewport = slide ? { width: SLIDE_BASE * canvasRatio, height: SLIDE_BASE } : {
            width: DOC_BASE,
            height: DOC_BASE * A4_RATIO,
        };
        if (slide && navItems[currentView] && navItems[currentView].customSize) {
            viewport = navItems[currentView].customSize;
        }
        let i = notSections.length - navs.length;

        // Me creo un div para la página
        let pageContainer = document.createElement('div');
        // Añado div al DOM
        document.body.appendChild(pageContainer);
        // Deduzco si slide o page
        let slideClass = slide ? "pcw_slide" : "pcw_doc";
        pageContainer.id = "pageContainer_" + i;

        pageContainer.className = ((i % 2) == 0) ? "pageToPrint" : "pageToPrint breakPage";
        // Asigno la anchura y altura del div dependiendo si es page o slide
        pageContainer.style.width = viewport.width + 'px';
        console.log('Viewport width: ' + viewport.width);
        pageContainer.style.height = slide ? (viewport.height + 'px') : 'auto';
        console.log('Viewport height: ' + viewport.height);
        // Añado pagebreak después del div FUNCIONA?

        let style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';

        document.getElementsByTagName('head')[0].appendChild(style);
        console.log(style);
        let isCV = isContainedView(currentView);
        let props = {
            boxes, changeCurrentView: (element) => {
            }, canvasRatio, containedViews,
            currentView, navItems, viewToolbars, pluginToolbars, title, triggeredMarks: [],
            showCanvas: (!isContainedView(currentView)), removeLastView: () => {
            }, richElementsState: {},
            viewsArray: [currentView], setAnswer: () => {
            }, submitPage: () => {
            }, exercises: exercises[currentView],
        };
        let visorContent = !isCV ? (<VisorCanvas {...props} fromPDF/>) : (<VisorContainedCanvas {...props} fromPDF/>);
        let app = (<div id="page-content-wrapper" className={slideClass + " page-content-wrapper printApp"}
            style={{ height: '100%', backgroundColor: 'white' }}>
            <Grid fluid id="visorAppContent" style={{ height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={12} style={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
                        {visorContent}
                    </Col>
                </Row>
            </Grid>

        </div>);
        ReactDOM.render((app), pageContainer, (a) => {
            setTimeout(
                () => {
                    if(last) {
                        window.print();
                        callback();
                    } else {
                        addHTML(navs.slice(1), navs.length <= 2);
                    }
                }, 5);
        });

    };
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
