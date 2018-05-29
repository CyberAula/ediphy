import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';
import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide } from '../../common/utils';
import { Grid, Row, Col } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

    let pdf = new jsPDF('p', 'pt', 'a4');

    pdf.setProperties({
        title: title,
        author: author,
        keywords: globalConfig.keywords.map(k=> k.text).join(", "),
        creator: 'Ediphy',
        units: 'px',
    });
    pdf.deletePage(1);
    const SLIDE_BASE = 795;
    const DOC_BASE = 1000;
    const A4_RATIO = 1.4142;
    let addHTML = function(navs, last) {

        let currentView = navs[0];
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
        (!isCV && isSlide(navItems[currentView].type)));

        let viewport = slide ? { width: SLIDE_BASE * canvasRatio, height: SLIDE_BASE } : { width: DOC_BASE, height: DOC_BASE * A4_RATIO };
        if (slide && navItems[currentView] && navItems[currentView].customSize) {
            viewport = navItems[currentView].customSize;
        }
        let i = notSections.length - navs.length;

        pdf.addPage(viewport.width, viewport.height);

        let pageContainer = document.createElement('div');
        document.body.appendChild(pageContainer);
        let slideClass = slide ? "pcw_slide" : "pcw_doc";
        pageContainer.id = "pageContainer_" + i;
        pageContainer.style.width = viewport.width + 'px';
        pageContainer.style.height = slide ? (viewport.height + 'px') : 'auto';
        let isCV = isContainedView(currentView);
        let props = {
            boxes, changeCurrentView: (element) => { }, canvasRatio, containedViews,
            currentView, navItems, viewToolbars, pluginToolbars, title, triggeredMarks: [],
            showCanvas: (!isContainedView(currentView)), removeLastView: () => {}, richElementsState: {},
            viewsArray: [currentView], setAnswer: () => {}, submitPage: () => {}, exercises: exercises[currentView],
        };
        let visorContent = !isCV ? (<VisorCanvas {...props} fromPDF />) : (<VisorContainedCanvas {...props} fromPDF />);
        let app = (<div id="page-content-wrapper" className={slideClass + " page-content-wrapper printApp"} style={{ height: '100%', backgroundColor: 'white' }}>
            <Grid fluid id="visorAppContent" style={{ height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={12} style={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
                        {visorContent}
                    </Col>
                </Row>
            </Grid>
        </div>);
        ReactDOM.render((app), pageContainer, (a)=>{
            pdf.internal.scaleFactor = 1;
            setTimeout(function() {
                pdf.addHTML(pageContainer, { useCORS: true, pagesplit: true, retina: true }, function() {
                    if (last) {
                        pdf.save(title.split(" ").join("") + '.pdf');
                        callback();
                    } else {
                        addHTML(navs.slice(1), navs.length <= 2);
                    }
                    document.body.removeChild(pageContainer);

                });
            }, 6000);
        });

        /*
        html2canvas(pageContainer, {  useCORS: true, pagesplit: true ,  onrendered: function(canvas) {
         let imgData = canvas.toDataURL(
         'image/png', 1);
         // var doc = new jsPDF('p', 'mm');
         pdf.addImage(imgData, 'PNG', 1, 1);
         if(last) {
         pdf.save('web.pdf');
         } else {
         addHTML(navs.slice(1), navs.length <= 2);
         }
         document.body.removeChild(pageContainer);

         }
         });*/
    };
    // document.getElementById('airlayer').style.width = "";
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
