import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';

import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide } from '../../common/utils';
import { Grid, Row, Col } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import '../../sass/print.css';

window.html2canvas = html2canvas;

export default function printToPDF(state, callback, options = { forcePageBreak: false, slidesPerPage: 2, slidesWithComments: false, optionName: "defaultOption", drawBorder: true }) {

    let navItems = state.navItemsById;
    let boxes = state.boxesById;
    let containedViews = state.containedViewsById;
    let viewToolbars = state.viewToolbarsById;
    let pluginToolbars = state.pluginToolbarsById;
    let globalConfig = state.globalConfig;
    let exercises = state.exercises;
    let title = globalConfig.title || 'Ediphy';
    let canvasRatio = globalConfig.canvasRatio;
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
    let elemsUsed = 0;
    let firstPage = true;
    let numPages = 0;

    let forcePageBreak = options.forcePageBreak || false;
    let slidesPerPage = options.slidesPerPage || 2;
    let slidesWithComments = options.slidesWithComments || false;
    let optionName = options.optionName || "defaultOption";
    let drawBorder = options.drawBorder || true;

    let hideDocs = false;
    let hideSlides = false;

    let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
    const SAFARI_HEIGHT = 1395;
    const CHROME_HEIGHT = 1400;

    let deletePageContainers = function() {
        let toDelete = document.getElementsByClassName('pageToPrint');
        while (toDelete.length > 0) {
            toDelete[0].parentNode.removeChild(toDelete[0]);
        }
    };

    // Me permite indicar desde JS la orientación del PDF, solo funciona en Chrome. El usuario en otros browsers tendrá que indicar landscape o portrait en el menú de impresión
    // https://stackoverflow.com/questions/11160260/can-javascript-change-the-value-of-page-css
    let cssPagedMedia = (function() {
        let style = document.createElement('style');
        document.head.appendChild(style);
        return function(rule) {
            style.innerHTML = rule;
        };
    })();

    cssPagedMedia.size = function(size) {
        cssPagedMedia('@page {size: ' + size + '}');
    };

    addHTML = function(navs, last) {

        let elementClass = "pageToPrint";
        let requiresFullPage = false;
        let currentView = navs[0];
        let assignUpDown = true;
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
            (!isCV && isSlide(navItems[currentView].type)));
        console.log(optionName);
        switch(optionName) {
        case "fullSlideDoc":
            cssPagedMedia.size('landscape');
            slidesPerPage = 1;
            DOC_BASE = 1550;
            if (isSafari) {
                DOC_BASE = 1000;
            }
            if (canvasRatio === 4 / 3) {
                SLIDE_BASE = 900;
                expectedHeight = SLIDE_BASE / canvasRatio;
            } else if (canvasRatio === 16 / 9)
            {
                SLIDE_BASE = 900;
                expectedHeight = SLIDE_BASE / canvasRatio;
            }
            break;
        case "twoSlideDoc":
            cssPagedMedia.size('portrait');
            DOC_BASE = 999;
            slidesPerPage = 2;
            if(slide && navItems[currentView].customSize === 0) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 650;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 700;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };

                }
            }

            break;
        case "fourSlideDoc":
            // TO DO
            slidesPerPage = 4;
            break;
        case "fullSlide":
            hideDocs = true;
            slidesPerPage = 1;
            DOC_BASE = 1550;
            if (isSafari) {
                DOC_BASE = 1000;
            }
            if (canvasRatio === 4 / 3) {
                SLIDE_BASE = 900;
                expectedHeight = SLIDE_BASE / canvasRatio;
            } else if (canvasRatio === 16 / 9)
            {
                SLIDE_BASE = 900;
                expectedHeight = SLIDE_BASE / canvasRatio;
            }
            break;
        case "twoSlide":
            hideDocs = true;
            DOC_BASE = 999;
            slidesPerPage = 2;
            if(slide && navItems[currentView].customSize === 0) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 650;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 700;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };

                }
            }
            break;
        case "slideComments":
            hideDocs = true;
            DOC_BASE = 999;
            slidesPerPage = 2;
            if(slide && navItems[currentView].customSize === 0) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 650;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 700;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    navItems[currentView].customSize = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };
                }
            }
            break;
        case "fourSlide":
            slidesPerPage = 4;
            hideDocs = true;
            break;
        case "fullDoc":
            hideSlides = true;
            slidesPerPage = 1;
            break;
        case "twoDoc":
            slidesPerPage = 2;
            hideSlides = true;
            break;

        }

        let slideClass = slide ? (drawBorder ? "pwc_slide drawBorders" : "pwc_slide") : "pwc_doc";

        let viewport = slide ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
            width: DOC_BASE,
            height: "auto",
        };

        expectedWidth = viewport.width;

        if (hideSlides && slide) {
            elementClass = elementClass + " not_show";
        }

        // Caso de que sea un documento importado
        if (slide && navItems[currentView] && navItems[currentView].customSize) {
            console.log('lo trato como elemento importado');
            if(firstElementPage && forcePageBreak) {
                elementClass = elementClass + " upOnPage";
                firstElementPage = false;
                elemsUsed = 0;
                console.log('elems used after firstelementpage: ' + elemsUsed);
            }
            viewport = navItems[currentView].customSize;
            customAspectRatio = viewport.width / viewport.height;

            console.log('custom aspect ratio is : ' + customAspectRatio);

            if (customAspectRatio < 0.7) {
                elementClass = elementClass + " portraitDoc heightLimited upOnPage";
                requiresFullPage = true;
                expectedHeight = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                viewport.height = expectedHeight;
                expectedWidth = expectedHeight * customAspectRatio;
                viewport.width = expectedWidth;
                elemsUsed = -1;
            } else if ((customAspectRatio >= 0.7) && (customAspectRatio < 1)) {
                elementClass = elementClass + " portraitDoc widthLimited upOnPage";
                requiresFullPage = true;
                expectedWidth = DOC_BASE;
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

                if(customAspectRatio === (4 / 3)) {
                    expectedHeight = isSafari ? SAFARI_HEIGHT / 2 * 0.95 : CHROME_HEIGHT / 2 * 0.95;
                    viewport.height = expectedHeight;
                    expectedWidth = expectedHeight * customAspectRatio;
                    viewport.width = expectedWidth;
                }

            } else if (customAspectRatio > (1 / A4_RATIO)) {
                elementClass = elementClass + " pageContainer landscapeDoc widthLimited";
                expectedWidth = DOC_BASE;
                viewport.width = expectedWidth;
                expectedHeight = expectedWidth / customAspectRatio;
                viewport.height = expectedHeight;
            }
        } else {
            firstElementPage = true;
        }

        let i = notSections.length - navs.length;

        // Me creo un div para la página
        let pageContainer = document.createElement('div');
        // Añado div al DOM
        document.body.appendChild(pageContainer);

        // Asigno la anchura y altura del div dependiendo si es page o slide
        pageContainer.style.width = DOC_BASE + 'px';
        pageContainer.style.height = (slide && !requiresFullPage) ? ((isSafari) ? SAFARI_HEIGHT / 2 + 'px' : CHROME_HEIGHT / 2 + 'px') : 'auto';

        if (slidesPerPage === 1) {
            pageContainer.style.height = '975px';
            if(isSafari) {
                pageContainer.style.height = '670px';
            }
            if(!slide) {
                console.log('Este elemento no es del tipo slide');
                pageContainer.style.height = 'auto';
            }
        }
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
        default: // Se trata de un documento importado o A4
            if (navItems[currentView].customSize) {
                elementClass = elementClass + " importedDoc";
            } else {
                elementClass = elementClass + " otherDoc";
                if(hideDocs) {
                    elementClass = elementClass + " not_show";
                    if(true) {
                        assignUpDown = false;
                        elemsUsed--;
                    }
                }
                else{
                    elemsUsed = -1;
                }
            }
            slideCounter = 0;
            break;
        }
        console.log('elemsUssed: ' + elemsUsed);
        let upOrDownSlide;
        if(!slidesWithComments && assignUpDown) {
            console.log('[INFO] elemsUsed%slidesPerPage: ' + elemsUsed % slidesPerPage);
            upOrDownSlide = (elemsUsed % slidesPerPage === 0) ? (firstPage ? "" : (slide) ? "upOnPage" : "breakPage") : "breakPage";
            console.log('[INFO] UpOrDownSlide:  ' + upOrDownSlide);
        }
        if (slidesWithComments && slide) {
            let pageContainerComments = document.createElement('div');
            pageContainerComments.id = 'containerComments_' + i;
            document.body.appendChild(pageContainerComments);
            console.log('He añadido un container de comments');
            pageContainerComments.style.height = pageContainer.style.height;
            pageContainerComments.style.width = pageContainer.style.width;
            pageContainerComments.style.pageBreakAfter = "always";
            pageContainerComments.className = "pageToPrint comment_box";
        }
        firstPage = false;

        if(assignUpDown) {
            elementClass = elementClass + " " + upOrDownSlide;

        }
        elemsUsed++;

        console.log('Elems used final : ' + elemsUsed);

        pageContainer.className = elementClass;

        if(slidesPerPage === 1) {

            if (canvasRatio > (1 / A4_RATIO)) {
                expectedWidth = DOC_BASE;
                expectedHeight = expectedWidth / canvasRatio;
            } else {
                expectedHeight = isSafari ? 670 * 0.95 : 975 * 0.95;
                expectedWidth = expectedHeight * canvasRatio;
            }

            console.log('the canvas ratio is ' + canvasRatio + ' and the expected height is ' + expectedHeight + ' and the expected width is ' + expectedWidth);
        }

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

                    let doc = document.getElementById('pageContainer_' + i);
                    if (optionName == 'fullSlideDoc') {
                        if (doc.className.includes('otherDoc')) {
                            console.log('[INFO] This element is a page');
                            let A4Height = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                            if (doc.clientHeight > A4Height) {
                                console.log('Page exceeds A4 dimensions. Slicing document...');
                                let numSlices = Math.ceil(doc.clientHeight / A4Height);
                                console.log(numPages);
                                for (let i = 0; i < numSlices; i++) {
                                    console.log('He entrado al for');
                                    let slice = document.createElement('div');
                                    slice = pageContainer.cloneNode(true);
                                    slice.id = pageContainer.id + '_slice_' + i;
                                    slice.style.height = '1000px';
                                    slice.style.width = A4Height + 'px';
                                    slice.style.overflow = 'hidden';
                                    if (optionName === "fullSlideDoc") {

                                        slice.children[0].style.height = '1400px';
                                        slice.children[0].style.width = '999px';
                                        slice.children[0].style.transformOrigin = 'top left';
                                        let translateX = 100 + 140 * i;
                                        let translateY = 100 * i;
                                        slice.children[0].style.transform = 'scale(0.5) rotate(-90deg) scale(2) translateX(-' + translateX + '%) translateY(-' + translateY + '%)';

                                        // contentSlice.children[0].style.transformOrigin = 'top left';
                                        // contentSlice.children[0].style.transform = 'rotate(-90deg) translateX(-999px)';
                                    }
                                    slice.children[0].style.marginTop = '-' + A4Height * i + 'px';

                                    document.body.appendChild(slice);

                                    // document.getElementById(slice.id).style.height =  document.getElementById(slice.id).clientHeight + 'px';
                                }
                                document.body.removeChild(document.getElementById(pageContainer.id));
                            }
                        }
                    }

                    if(last) {
                        for(let i = 0; i < numPages; i++) {
                            let doc = document.getElementById('pageContainer_' + i);
                            console.log('[INFO] Trying to read properties of doc ' + i);
                            if (doc && doc.className.includes('otherDoc')) {
                                let actualHeight = doc.clientHeight;
                                console.log('[INFO] Page height is :' + actualHeight);
                                document.getElementById('pageContainer_' + i).style.height = actualHeight * 1.05 + 'px';
                            }
                        }
                        window.print();
                        if(!isSafari) {
                            // deletePageContainers();
                        }
                        callback();

                    } else {

                        addHTML(navs.slice(1), navs.length <= 2);
                        numPages++;

                    }
                }, 500);
        });
    };
    if(isSafari) {
        deletePageContainers();
    }
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
