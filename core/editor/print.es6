import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';
import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide, isDocument } from '../../common/utils';
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
    let numPages = 0;
    let customAspectRatio = 0;
    let expectedWidth;
    let expectedHeight;

    let notSections = state.navItemsIds.filter(nav=> {
        return !navItems[nav].hidden && (Ediphy.Config.sections_have_content || !isSection(nav));
    });

    let SLIDE_BASE = 650;
    let DOC_BASE = 700;
    let A4_RATIO = 1 / 1.4142;
    let addHTML;

    let slideCounter = 0;
    let firstElementPage = true;
    let forcePageBreak = false;

    let elemsUsed = 0;
    let firstPage = true;

    let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
    const SAFARI_HEIGHT = 977.8;
    const CHROME_HEIGHT = 1000;

    addHTML = function(navs, last) {

        let elementClass;
        let requiresFullPage = false;
        let currentView = navs[0];
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
            (!isCV && isSlide(navItems[currentView].type)));

        let slidesPerPage = 2;

        switch(slidesPerPage) {
        case 1:
            break;
        case 2:
            if (canvasRatio === 4 / 3) {
                SLIDE_BASE = 650;
                expectedHeight = SLIDE_BASE / canvasRatio;
            } else if (canvasRatio === 16 / 9)
            {
                SLIDE_BASE = 700;
                expectedHeight = SLIDE_BASE / canvasRatio;
            }
            break;
        case 4:
            break;
        default:
            break;
        }

        let slideClass = slide ? "pwc_slide" : "pwc_doc";

        elementClass = "pageToPrint";

        let viewport = slide ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
            width: DOC_BASE,
            height: "auto",
        };

        expectedWidth = viewport.width;

        // Caso de que sea un documento importado
        if (slide && navItems[currentView] && navItems[currentView].customSize) {
            if(firstElementPage && forcePageBreak) {
                elementClass = elementClass + " upOnPage";
                firstElementPage = false;
            }
            viewport = navItems[currentView].customSize;
            customAspectRatio = viewport.width / viewport.height;

            if (customAspectRatio < 0.8) {
                elementClass = elementClass + " portraitDoc heightLimited upOnPage";
                requiresFullPage = true;
                expectedHeight = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                viewport.height = expectedHeight;
                expectedWidth = expectedHeight * customAspectRatio;
                viewport.width = expectedWidth;
                elemsUsed = -1;
            } else if ((customAspectRatio >= 0.8) && (customAspectRatio < 1)) {
                elementClass = elementClass + " portraitDoc widthLimited upOnPage";
                requiresFullPage = true;
                expectedWidth = 700;
                viewport.width = expectedWidth;
                expectedHeight = expectedWidth / customAspectRatio;
                viewport.height = expectedHeight;
                elemsUsed = -1;
            } else if ((customAspectRatio >= 1) && (customAspectRatio < (1 / A4_RATIO))) {
                elementClass = elementClass + " pageContainer landscapeDoc heightLimited";

                expectedHeight = isSafari ? SAFARI_HEIGHT / 2 : CHROME_HEIGHT / 2;
                viewport.height = expectedHeight;
                expectedWidth = expectedHeight * customAspectRatio;
                viewport.width = expectedWidth;

            } else if (customAspectRatio > (1 / A4_RATIO)) {

                elementClass = elementClass + " pageContainer landscapeDoc widthLimited";
                expectedWidth = 700;
                viewport.width = expectedWidth;
                expectedHeight = expectedWidth / customAspectRatio;
                viewport.height = expectedHeight;
            }
        } else {
            firstElementPage = true;
        }

        let i = notSections.length - navs.length;
        // Borro div creado anteriormente
        let toDelete = document.getElementById('pageContainer_' + i);
        if(toDelete) {
            toDelete.parentNode.removeChild(toDelete);
        }

        // Me creo un div para la página
        let pageContainer = document.createElement('div');
        // Añado div al DOM
        document.body.appendChild(pageContainer);

        // Asigno la anchura y altura del div dependiendo si es page o slide
        pageContainer.style.width = '700px';
        // width for chrome 522.5
        pageContainer.style.height = (slide && !requiresFullPage) ? ((isSafari) ? SAFARI_HEIGHT / 2 + 'px' : CHROME_HEIGHT / 2 + 'px') : 'auto';
        pageContainer.id = "pageContainer_" + i;

        // Añado clase según tipo de slide/documento
        switch (viewport.height) {
        case SLIDE_BASE * 3 / 4:
            elementClass = elementClass + " pageContainer slide43";
            slideCounter++;
            break;
        case SLIDE_BASE * 9 / 16:
            elementClass = elementClass + " pageContainer slide169";
            slideCounter++;
            break;
        default:
            if (navItems[currentView].customSize) {
                elementClass = elementClass + " importedDoc";
            } else {
                elementClass = elementClass + " otherDoc";
                elemsUsed = -1;
            }
            slideCounter = 0;
            break;
        }

        let upOrDownSlide = (elemsUsed % slidesPerPage === 0) ? (firstPage ? "" : "upOnPage") : "breakPage";
        firstPage = false;

        elementClass = elementClass + " " + upOrDownSlide;

        elemsUsed++;

        pageContainer.className = elementClass;

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
            expectedWidth: expectedWidth,
        };
        console.log('El expectedWidth del container ' + i + ' es ' + expectedWidth);
        console.log('El expectedHeight del container ' + i + ' es ' + expectedHeight);

        let visorContent = !isCV ? (<VisorCanvas {...props} fromPDF />) : (<VisorContainedCanvas {...props} fromPDF/>);
        let app = (<div id="page-content-wrapper" className={slideClass + " page-content-wrapper printApp"}
            style={{ width: slide ? expectedWidth : 'auto', height: slide ? expectedHeight : 'auto', backgroundColor: 'white' }}>
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

                        for(let i = 0; i <= numPages; i++) {
                            let actualHeight = document.getElementById('pageContainer_' + i).clientHeight;
                            document.getElementById('pageContainer_' + i).style.height = actualHeight + 'px';
                        }

                        window.print();

                        callback();
                    } else {

                        addHTML(navs.slice(1), navs.length <= 2);
                        numPages++;
                    }
                }, 55);
        });

    };
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
