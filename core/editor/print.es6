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
    let DOC_BASE = 990;
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
    let drawBorder = options.drawBorder || false;

    let hideDocs = false;
    let hideSlides = false;

    let bigContainer;

    let treatAsImportedDoc = false;

    let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
    const SAFARI_HEIGHT = 1300;
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

    cssPagedMedia.display = function(display) {
        cssPagedMedia('body {display:' + display + '}');
    };

    addHTML = function(navs, last) {

        let elementClass = "pageToPrint";
        let requiresFullPage = false;
        let currentView = navs[0];
        let assignUpDown = true;
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
            (!isCV && isSlide(navItems[currentView].type)));

        treatAsImportedDoc = ((slide && navItems[currentView].customSize === 0));
        let isAnImportedDoc = (slide && navItems[currentView].customSize !== 0);

        let importedDoc = (currentView.customSize !== 0);
        let i = notSections.length - navs.length;

        let viewport;
        let miniViewport;

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
            if(treatAsImportedDoc) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 800;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };

                    miniViewport = viewport;

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 999;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };

                    miniViewport = viewport;

                }
            }

            break;
        case "fullSlide":
            cssPagedMedia.size('landscape');
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
            cssPagedMedia.size('portrait');
            hideDocs = true;
            DOC_BASE = 999;
            slidesPerPage = 2;
            if (isSafari) {
                DOC_BASE = 999;
            }
            viewport = (slide) ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
                width: DOC_BASE,
                height: "auto",
            };
            if(treatAsImportedDoc) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 600;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };

                    miniViewport = viewport;

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 999;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };

                    miniViewport = viewport;

                }
            }
            break;
        case "slideComments":
            cssPagedMedia.size('portrait');
            hideDocs = true;
            DOC_BASE = 999;
            slidesPerPage = 2;
            if (isSafari) {
                DOC_BASE = 999;
            }
            viewport = (slide) ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
                width: DOC_BASE,
                height: "auto",
            };
            if(treatAsImportedDoc) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = 650;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight * 0.95,
                        width: expectedHeight * canvasRatio * 0.95,
                    };
                    miniViewport = viewport;

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 700;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };
                    miniViewport = viewport;
                }
            }
            break;
        case "fourSlide":
            cssPagedMedia.size('landscape');
            slidesPerPage = 4;
            hideDocs = true;
            DOC_BASE = 600;
            SLIDE_BASE = 550;
            if (isSafari) {
                DOC_BASE = 500;
            }

            viewport = (slide) ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
                width: DOC_BASE,
                height: "auto",
            };

            if(treatAsImportedDoc) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = isSafari ? 420 : 450;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };
                    miniViewport = viewport;

                } else if (canvasRatio === 16 / 9)
                {
                    SLIDE_BASE = 550;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
                    };
                    miniViewport = viewport;
                }

            }
            break;
        case "fullDoc":
            cssPagedMedia.size('portrait');
            hideSlides = true;
            slidesPerPage = 1;
            break;
        case "twoDoc":
            cssPagedMedia.size('landscape');
            slidesPerPage = 2;
            hideSlides = true;
            elementClass = elementClass + " twoColumn";
            break;
        }
        let slideClass = slide ? (drawBorder ? "pwc_slide drawBorders" : "pwc_slide") : (drawBorder ? "pwc_doc" : "pwc_doc");

        if (slidesPerPage !== 4) {
            viewport = (slide) ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
                width: DOC_BASE,
                height: "auto",
            };
        }
        expectedWidth = viewport.width;

        if (hideSlides && slide) {
            elementClass = elementClass + " not_show";
        }

        // Me creo un div para la página
        let pageContainer = document.createElement('div');

        console.log('[INFO] is this aslide?' + slide);
        console.log('[INFO] is this fp?' + requiresFullPage);

        // Asigno la anchura y altura del div dependiendo si es page o slide
        pageContainer.style.width = DOC_BASE + 'px';
        pageContainer.style.height = (slide && !requiresFullPage) ? ((isSafari) ? SAFARI_HEIGHT / 2 + 'px' : CHROME_HEIGHT / 2 + 'px') : 'auto';

        if (slidesPerPage === 1 || optionName === "twoDoc") {
            pageContainer.style.height = '975px';
            if(isSafari) {
                pageContainer.style.height = '670px';
            }
            if(!slide) {
                pageContainer.style.height = 'auto';
            }
        } else if (slidesPerPage === 4) {
            // pageContainer.style.height = miniViewport.height + 'px';
            // pageContainer.style.width = miniViewport.width + 'px';
            pageContainer.style.height = '49%';
            pageContainer.style.width = '49%';
        }
        pageContainer.id = "pageContainer_" + i;

        // Caso de que sea un documento importado
        if (treatAsImportedDoc || navItems[currentView].customSize) {
            if(firstElementPage && forcePageBreak) {
                elementClass = elementClass + " upOnPage";
                firstElementPage = false;
                elemsUsed = 0;
            }
            viewport = treatAsImportedDoc ? viewport : navItems[currentView].customSize;

            customAspectRatio = viewport.width / viewport.height;

            if (customAspectRatio < A4_RATIO) {
                elementClass = elementClass + " portraitDoc heightLimited upOnPage";
                requiresFullPage = true;
                expectedHeight = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                viewport.height = expectedHeight;
                expectedWidth = expectedHeight * customAspectRatio;
                viewport.width = expectedWidth;

                if (slidesPerPage === 4) {
                    elementClass = elementClass + " pageContainer";
                    expectedHeight = '100%';
                    expectedWidth = 100 * A4_RATIO * customAspectRatio + '%';
                }
                elemsUsed = -1;
            } else if ((customAspectRatio >= A4_RATIO) && (customAspectRatio < 1)) {
                elementClass = elementClass + " portraitDoc widthLimited upOnPage";
                requiresFullPage = true;
                expectedWidth = DOC_BASE;
                viewport.width = expectedWidth;
                expectedHeight = expectedWidth / customAspectRatio;
                viewport.height = expectedHeight;

                if (slidesPerPage === 4) {
                    elementClass = elementClass + " pageContainer";
                    expectedHeight = '100%';
                    expectedWidth = 100 * A4_RATIO * customAspectRatio + '%';
                }
                elemsUsed = -1;
            } else if ((customAspectRatio >= 1) && (customAspectRatio < (1 / A4_RATIO))) {
                elementClass = elementClass + " pageContainer landscapeDoc heightLimited";
                expectedHeight = isSafari ? SAFARI_HEIGHT / 2 : CHROME_HEIGHT / 2;
                viewport.height = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight;
                expectedWidth = expectedHeight * customAspectRatio;
                viewport.width = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth;

                if(customAspectRatio === (4 / 3)) {
                    expectedHeight = isSafari ? SAFARI_HEIGHT / 2 * 0.95 : CHROME_HEIGHT / 2 * 0.95;
                    viewport.height = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight;
                    expectedWidth = expectedHeight * customAspectRatio;
                    viewport.width = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth;
                }

            } else if (customAspectRatio > (1 / A4_RATIO)) {
                elementClass = elementClass + " pageContainer landscapeDoc widthLimited";
                expectedWidth = DOC_BASE;
                viewport.width = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth;
                expectedHeight = expectedWidth / customAspectRatio;
                viewport.height = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight;
            }

            if (slidesPerPage === 4 && isAnImportedDoc) {
                elementClass = elementClass + " pageContainer";

                if (customAspectRatio > 1 / A4_RATIO) {
                    expectedWidth = '100%';
                    expectedHeight = isSafari ? (((108 / customAspectRatio / A4_RATIO)) + '%') : (((104 / customAspectRatio / A4_RATIO)) + '%');
                }

                else {
                    expectedHeight = '100%';
                    expectedWidth = isSafari ? ((92 * A4_RATIO * customAspectRatio) + '%') : ((96 * A4_RATIO * customAspectRatio) + '%');
                }
            }

            if(treatAsImportedDoc) {
                // navItems[currentView].customSize = 0;
            }
        } else {
            firstElementPage = true;
        }

        console.log('[INFO] Viewport.height is: ' + viewport.height);
        console.log('[INFO] SLIDE_BASE is: ' + SLIDE_BASE);

        // Añado clase según tipo de slide/documento
        switch (viewport.height) {
        case isSafari ? SAFARI_HEIGHT / 2 * 0.95 : CHROME_HEIGHT / 2 * 0.95:
            elementClass = elementClass + " pageContainer slide43";
            slideCounter++;
            break;
        case SLIDE_BASE * 9 / 16:
            elementClass = elementClass + " pageContainer slide169";
            slideCounter++;
            break;
        default: // Se trata de un documento importado o A4
            if (navItems[currentView].customSize || treatAsImportedDoc) {
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
        let upOrDownSlide;
        if(!slidesWithComments && assignUpDown) {
            upOrDownSlide = (elemsUsed % slidesPerPage === 0) ? (firstPage ? "" : (slide) ? "upOnPage" : "breakPage") : "breakPage";
        }

        if(assignUpDown) {
            elementClass = elementClass + " " + upOrDownSlide;

        }
        elemsUsed++;

        pageContainer.className = elementClass;

        if(slidesPerPage === 1) {

            if (canvasRatio > (1 / A4_RATIO)) {
                expectedWidth = DOC_BASE;
                expectedHeight = expectedWidth / canvasRatio;
            } else {
                expectedHeight = isSafari ? 670 * 0.95 : 975 * 0.95;
                expectedWidth = expectedHeight * canvasRatio;
            }

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
            expectedWidth: ((slidesPerPage === 4) && treatAsImportedDoc) ? miniViewport.width : expectedWidth,
        };

        let visorContent = !isCV ? (<VisorCanvas {...props} fromPDF />) : (<VisorContainedCanvas {...props} fromPDF/>);
        let app = (<div id="page-content-wrapper" className={slideClass + " page-content-wrapper printApp"}
            style={{ width: slide ? ((slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth) : 'auto', height: slide ? ((slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight) : 'auto', backgroundColor: 'white' }}>
            <Grid fluid id="visorAppContent" style={{ height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={12} style={{ height: '100%', paddingLeft: 0, paddingRight: 0 }}>
                        {visorContent}
                    </Col>
                </Row>
            </Grid>
        </div>);
        // Añado div al DOM
        document.body.appendChild(pageContainer);

        if (slidesWithComments && slide) {
            let pageContainerComments = document.createElement('div');
            let table = (<div width="100%"><table width="100%">
                <tr><td className={"commentLine firstLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
                <tr><td className={"commentLine"} /></tr>
            </table></div>);
            pageContainerComments.id = 'containerComments_' + i;
            document.body.appendChild(pageContainerComments);
            pageContainerComments.style.height = pageContainer.style.height;
            pageContainerComments.style.width = pageContainer.style.width;
            pageContainerComments.style.pageBreakAfter = "always";
            pageContainerComments.className = "pageToPrint comment_box";
            ReactDOM.render((table), pageContainerComments);
        }
        firstPage = false;
        ReactDOM.render((app), pageContainer, (a) => {
            setTimeout(
                () => {

                    let doc = document.getElementById('pageContainer_' + i);
                    if (optionName === 'twoDocNOP') {
                        if (doc.className.includes('otherDoc')) {
                            let A4Height = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                            if (doc.clientHeight > A4Height) {
                                let numSlices = Math.ceil(doc.clientHeight / A4Height);
                                for (let i = 0; i < numSlices; i++) {
                                    let slice = document.createElement('div');
                                    slice = pageContainer.cloneNode(true);
                                    slice.id = pageContainer.id + '_slice_' + i;
                                    slice.style.height = '1000px';
                                    slice.style.width = A4Height / 2 + 'px';
                                    slice.style.overflow = 'hidden';
                                    if (optionName === "twoDoc") {

                                        slice.children[0].style.height = '1400px';
                                        slice.children[0].style.width = '999px';
                                        slice.children[0].style.transformOrigin = 'top left';
                                        let translateX = 100 + 140 * i;
                                        let translateY = 100 * i;
                                        // slice.children[0].style.transform = 'scale(0.5) rotate(-90deg) scale(2) translateX(-' + translateX + '%) translateY(-' + translateY + '%)';

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

                        numPages++;
                        let notToPrint = 0;

                        console.log('[INFO] EL número de páginas del documento es: ' + numPages);
                        for(let i = 0; i < numPages; i++) {
                            let doc = document.getElementById('pageContainer_' + i);

                            if (((doc && doc.className.includes('importedDoc')) || (doc && doc.className.includes('otherDoc'))) && (slidesPerPage !== 4) && (optionName !== "twoDoc")) {
                                let actualHeight = doc.clientHeight;
                                document.getElementById('pageContainer_' + i).style.height = actualHeight * 1.05 + 'px';
                            }
                            if(optionName === "twoDoc") {
                                if (doc.className.includes('otherDoc')) {
                                    let actualHeight = doc.clientHeight;
                                    document.getElementById('pageContainer_' + i).style.height = Math.ceil((actualHeight * 0.72 / 975 / 2)) * 975 + 'px';
                                    document.getElementById('pageContainer_' + i).style.width = '1400px';
                                }
                            }

                            if(doc.className.includes('not_show')) {
                                notToPrint++;
                            }
                        }
                        console.log('[INFO] Número de páginas que no se van a imprimir: ' + notToPrint);

                        if (notToPrint === numPages) {
                            deletePageContainers();
                            callback("nullPrint");
                            return;
                        }
                        if (slidesPerPage === 4) {
                            let index = -1;
                            let containersArray = [];
                            let counter = 0;
                            for (let i = 0; i < numPages; i++) {
                                let doc = document.getElementById('pageContainer_' + i);
                                doc.id = 'pageContainer_' + counter;
                                if(doc.className.includes('not_show')) {
                                    continue;
                                }
                                if (counter % 4 === 0) {
                                    index++;
                                    let bigContainer = document.createElement('div');
                                    bigContainer.id = 'bigContainer_' + index;
                                    bigContainer.className = 'pageToPrint bigContainer';
                                    bigContainer.style.height = '100%';
                                    bigContainer.style.width = '100%';
                                    containersArray.push(bigContainer);
                                    document.body.appendChild(containersArray[index]);
                                }
                                containersArray[index].appendChild(doc);
                                counter++;
                                if (i === (numPages - 1)) {
                                    let left = (4 - (counter % 4)) % 4;
                                    for (let f = left; f > 0; f--) {
                                        containersArray[index].appendChild(doc.cloneNode());
                                    }
                                }
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
        // deletePageContainers();
    }
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
