import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';
import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide } from '../../common/utils';
import { Grid, Row, Col } from 'react-bootstrap';

const pdflib = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.min');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);

pdflib.PDFJS.workerSrc = pdfjsWorkerBlobURL;

export default function printToPDF(state) {
    let navItemsIds = state.navItemsIds;
    let navItems = state.navItemsById;
    let boxes = state.boxesById;
    let containedViews = state.containedViewsById;
    let toolbars = state.toolbarsById;
    let globalConfig = state.globalConfig;
    let exercises = state.exercises;
    let title = globalConfig.title;
    let canvasRatio = globalConfig.canvasRatio;

    let notSections = state.navItemsIds.filter(nav=> {
        return !navItems[nav].hidden && (Ediphy.Config.sections_have_content || !isSection(nav));
    });

    let pdf;

    let addHTML = function(navs, last) {

        let currentView = navs[0];
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
        (!isCV && isSlide(navItems[currentView].type)));
        let slideClass = slide ? "pcw_slide" : "pcw_doc";
        let viewport = slide ? { width: 595 * canvasRatio, height: 595 } : { width: 841, height: 595 };
        if (slide && navItems[currentView] && navItems[currentView].customSize) {
            viewport = navItems[currentView].customSize;
        }
        let i = notSections.length - navs.length;

        if (i === 0) {
            pdf = new jsPDF(slide ? 'l' : 'p', 'pt', [viewport.width, viewport.height], false);

        } else {
            pdf.addPage(viewport.width, viewport.height);
        }

        let pageContainer = document.createElement('div');
        document.body.appendChild(pageContainer);

        pageContainer.id = "pageContainer_" + i;
        pageContainer.style.width = viewport.width + 'px';
        pageContainer.style.height = slide ? (viewport.height + 'px') : 'auto';
        let isCV = isContainedView(currentView);
        let props = {
            boxes, changeCurrentView: (element) => { }, canvasRatio, containedViews,
            currentView, navItems, toolbars, title, triggeredMarks: [],
            showCanvas: (!isContainedView(currentView)), removeLastView: () => {}, richElementsState: {},
            viewsArray: [currentView], setAnswer: () => {}, submitPage: () => {}, exercises: exercises[currentView],
        };
        let visorContent = !isCV ? (<VisorCanvas {...props} />) : (<VisorContainedCanvas {...props} />);
        let app = (<div id="page-content-wrapper" className={slideClass + " page-content-wrapper printApp"} style={{ height: '100%', backgroundColor: 'white' }}>
            <Grid fluid id="visorAppContent" style={{ height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={12} style={{ height: '100%' }}>
                        {visorContent}
                    </Col>
                </Row>
            </Grid>
        </div>);
        ReactDOM.render((app), pageContainer);

        pdf.addHTML(pageContainer, { useCORS: true, pagesplit: true }, function() {
            if(last) {
                pdf.save('web.pdf');
            } else {
                addHTML(navs.slice(1), navs.length <= 2);
            }
            document.body.removeChild(pageContainer);

        });
    };
    // document.getElementById('airlayer').style.width = "";
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
