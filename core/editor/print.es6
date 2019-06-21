import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';

import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView, isSlide } from '../../common/utils';
import { Grid, Row, Col } from 'react-bootstrap';
import '../../sass/print.css';

export default function printToPDF(state, callback, options = { forcePageBreak: false, slidesPerPage: 2, slidesWithComments: false, optionName: "defaultOption", drawBorder: true }) {

    let navItemsOnly = JSON.parse(JSON.stringify(state.navItemsById));
    let boxes = JSON.parse(JSON.stringify(state.boxesById));
    let containedViews = JSON.parse(JSON.stringify(state.containedViewsById));

    let viewToolbars = state.viewToolbarsById;
    let pluginToolbars = state.pluginToolbarsById;
    let globalConfig = state.globalConfig;
    let styleConfig = state.styleConfig;
    let exercises = state.exercises;
    let title = globalConfig.title || 'Ediphy';
    let canvasRatio = globalConfig.canvasRatio;
    let customAspectRatio = 0;
    let expectedWidth;
    let expectedHeight;
    let marksById = state.marksById;
    let navItemsOriginals = navItemsOnly;
    let navItems = Object.assign(navItemsOriginals, containedViews);
    let idList = Object.keys(navItems);
    idList.splice(0, 1);

    let notSections = idList.filter(nav=> {
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
    let treatAsImportedDoc = false;
    let isSafari = (/constructor/i).test(window.HTMLElement) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification));
    let isFirefox = typeof InstallTrigger !== 'undefined';
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    let isLandscape = false;
    const SAFARI_HEIGHT = 1300;
    const CHROME_HEIGHT = 1400;
    let deletePageContainers = function(className) {
        let toDelete = document.getElementsByClassName(className);
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

    cssPagedMedia.size = function(size, margin) {
        cssPagedMedia('@page {size: ' + size + '; margin: ' + margin + '}');
    };

    cssPagedMedia.display = function(display) {
        cssPagedMedia('body {display:' + display + '}');
    };

    let ended = false;

    document.body.addEventListener('canceled', function() {
        ended = true;
    });

    addHTML = function(navs, last) {
        let elementClass = "pageToPrint " + currentView + ' ';
        let requiresFullPage = false;
        let currentView = navs[0];
        let assignUpDown = true;
        let slide = ((isCV && isSlide(containedViews[currentView].type)) ||
            (!isCV && isSlide(navItems[currentView].type)));
        treatAsImportedDoc = ((slide && navItems[currentView].customSize === 0));
        let isAnImportedDoc = (slide && navItems[currentView].customSize !== 0);
        let i = notSections.length - navs.length;
        let viewport;
        let miniViewport;
        let avoidComments = false;

        switch(optionName) {
        case "fullSlideDoc":
            cssPagedMedia.size('landscape', '1cm');
            isLandscape = true;
            slidesPerPage = 1;
            DOC_BASE = 1550;
            if (isSafari) {
                DOC_BASE = 1000;
            }
            if (canvasRatio === 4 / 3) {
                SLIDE_BASE = 1000;
                expectedHeight = SLIDE_BASE / canvasRatio;
            } else if (canvasRatio === 16 / 9)
            {
                SLIDE_BASE = 900;
                expectedHeight = SLIDE_BASE / canvasRatio;
            }
            break;
        case "twoSlideDoc":
            cssPagedMedia.size('portrait', '1cm');
            isLandscape = false;
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
        case "fullSlideCustom":
            SLIDE_BASE = 795;
            hideDocs = true;
            slidesPerPage = 1;
            // drawBorder = tr;
            viewport = {
                height: SLIDE_BASE,
                width: SLIDE_BASE * canvasRatio,
            };
            expectedHeight = viewport.height;
            expectedWidth = viewport.width;
            cssPagedMedia.size((viewport.width) + "px " + ((canvasRatio === (4 / 3)) ? viewport.height + 1 : viewport.height + 1) + "px ", "0");
            break;
        case "fullSlide":
            cssPagedMedia.size('landscape', "1cm");
            isLandscape = true;
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
            cssPagedMedia.size('portrait', "1cm");
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
            cssPagedMedia.size('portrait', "1cm");
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
            cssPagedMedia.size('landscape', "1cm");
            isLandscape = true;
            slidesPerPage = 4;
            hideDocs = true;
            DOC_BASE = 650;
            SLIDE_BASE = 600;
            if (isSafari) {
                DOC_BASE = 500;
            }

            viewport = (slide) ? { width: SLIDE_BASE, height: SLIDE_BASE / canvasRatio } : {
                width: DOC_BASE,
                height: "auto",
            };

            if(treatAsImportedDoc) {
                if (canvasRatio === 4 / 3) {
                    SLIDE_BASE = isSafari ? 420 : 570;
                    expectedHeight = SLIDE_BASE / canvasRatio;
                    viewport = {
                        height: expectedHeight,
                        width: expectedHeight * canvasRatio,
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
        case "fullDoc":
            cssPagedMedia.size('portrait', "1cm");
            hideSlides = true;
            slidesPerPage = 1;
            break;
        case "twoDoc":
            cssPagedMedia.size('landscape', "1cm");
            isLandscape = true;
            slidesPerPage = 2;
            hideSlides = true;
            elementClass = elementClass + " twoColumn";
            break;
        }
        let slideClass = slide ? (drawBorder ? "pwc_slide drawBorders" : "pwc_slide drawTransparentBorders") : (drawBorder ? "pwc_doc" : "pwc_doc");

        if (slidesPerPage !== 4 && optionName !== "fullSlideCustom") {
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

        // Asigno la anchura y altura del div dependiendo si es page o slide
        if (optionName === "fullSlideCustom") {
            pageContainer.style.width = viewport.width;
            pageContainer.style.height = viewport.height;

            if(canvasRatio === (4 / 3)) {
                elementClass = elementClass + " breakPage";
                pageContainer.style.height = viewport.height;

            }

        } else {
            pageContainer.style.width = DOC_BASE + 'px';
            pageContainer.style.height = (slide && !requiresFullPage) ? ((isSafari) ? SAFARI_HEIGHT / 2 + 'px' : CHROME_HEIGHT / 2 + 'px') : 'auto';
        }

        if ((slidesPerPage === 1 || optionName === "twoDoc") && (optionName !== "fullSlideCustom")) {
            pageContainer.style.height = '975px';
            if(isSafari) {
                pageContainer.style.height = '670px';
            }

            if(!slide) {
                pageContainer.style.height = 'auto';
            }
        } else if (slidesPerPage === 4) {
            pageContainer.style.height = '49%';
            pageContainer.style.width = '49%';
        }
        pageContainer.id = "pageContainer_" + i;

        if(currentView.substring(0, 2) === "cv" && isSlide(navItems[currentView].type)) {
            treatAsImportedDoc = true;
            miniViewport = viewport;
        }

        // Caso de que sea un documento importado
        if ((treatAsImportedDoc || navItems[currentView].customSize) && optionName !== "fullSlideCustom") {

            if(firstElementPage && forcePageBreak) {
                elementClass = elementClass + " upOnPage";
                firstElementPage = false;
                elemsUsed = 0;
            }
            viewport = treatAsImportedDoc ? viewport : navItems[currentView].customSize;

            customAspectRatio = viewport.width / viewport.height;

            if (customAspectRatio < A4_RATIO) {
                // pageContainer.style.height = '100%';

                elementClass = elementClass + " portraitDoc heightLimited upOnPage";

                if (isLandscape && ((optionName === "fullSlideDoc") || (optionName === "fullSlide") || (optionName === "fullSlideCustom"))) {
                    pageContainer.style.height = isSafari ? '670px' : '975px';
                    expectedHeight = isSafari ? 670 : 975;
                } else {
                    if (optionName === "slideComments") {
                        avoidComments = true;
                    }
                    if (optionName !== "fourSlide") {
                        pageContainer.style.height = isSafari ? SAFARI_HEIGHT + 'px' : CHROME_HEIGHT + 'px';
                        expectedHeight = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                    }

                }
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

                if (isLandscape && ((optionName === "fullSlideDoc") || (optionName === "fullSlide") || (optionName === "fullSlideCustom"))) {
                    pageContainer.style.height = isSafari ? '670px' : '975px';
                    expectedHeight = isSafari ? 670 : 975;
                } else {
                    if (optionName === "slideComments") {
                        avoidComments = true;
                    }
                    if (optionName !== "fourSlide") {
                        pageContainer.style.height = isSafari ? SAFARI_HEIGHT + 'px' : CHROME_HEIGHT + 'px';
                        expectedHeight = isSafari ? SAFARI_HEIGHT : CHROME_HEIGHT;
                    }
                }
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
                    if ((optionName === "twoSlideDoc") || (optionName === "twoSlide") || (optionName === "slideComments")) {
                        expectedHeight = isSafari ? SAFARI_HEIGHT / 2 * 0.95 : CHROME_HEIGHT / 2 * 0.95;
                        viewport.height = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight;
                        expectedWidth = expectedHeight * customAspectRatio;
                        viewport.width = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth;
                    }
                    else if ((optionName === "fullSlideDoc") || (optionName === "fullSlide")) {
                        expectedHeight = isSafari ? SAFARI_HEIGHT / 2 : CHROME_HEIGHT / 1.5;
                        viewport.height = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.height : expectedHeight;
                        expectedWidth = expectedHeight * customAspectRatio;
                        viewport.width = (slidesPerPage === 4 && treatAsImportedDoc) ? miniViewport.width : expectedWidth;

                    }

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

        // Añado clase según tipo de slide/documento

        switch (viewport.height) {
        case isSafari ? SAFARI_HEIGHT / 2 * 0.95 : CHROME_HEIGHT / 2 * 0.95:
            elementClass = elementClass + " pageContainer slide43";
            slideCounter++;
            break;
        case expectedWidth / customAspectRatio:
            elementClass = elementClass + " pageContainer slide169";
            slideCounter++;
            break;
        default: // Se trata de un documento importado o A4
            if (navItems[currentView].customSize || treatAsImportedDoc) {
                if (optionName !== "fullSlideCustom") {
                    elementClass = elementClass + " importedDoc";
                }
            } else {
                elementClass = elementClass + " otherDoc";
                if(hideDocs) {
                    elementClass = elementClass + " not_show";
                    assignUpDown = false;
                    elemsUsed--;
                }
                else{
                    elemsUsed = -1;
                }
            }
            slideCounter = 0;
            break;
        }
        let upOrDownSlide;
        if(!slidesWithComments && assignUpDown && optionName !== "fullSlideCustom") {
            upOrDownSlide = (elemsUsed % slidesPerPage === 0) ? (firstPage ? "" : (slide) ? "upOnPage" : "breakPage") : "breakPage";
        }

        if(assignUpDown && optionName !== "fullSlideCustom") {
            elementClass = elementClass + " " + upOrDownSlide;

        }
        elemsUsed++;

        pageContainer.className = elementClass;

        if(slidesPerPage === 1 && optionName !== "fullSlideDoc" && optionName !== "fullSlideCustom") {

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
            currentView, navItems, viewToolbars, styleConfig, pluginToolbars, title, triggeredMarks: [],
            showCanvas: (!isContainedView(currentView)), removeLastView: () => {
            }, richElementsState: {},
            viewsArray: [currentView], setAnswer: () => {
            }, submitPage: () => {
            }, exercises: exercises,
            marks: marksById,
            expectedWidth: ((slidesPerPage === 4) && treatAsImportedDoc) ? miniViewport.width : expectedWidth,
        };
        let visorContent = !isCV ? (<VisorCanvas {...props} show fromPDF />) : (<VisorContainedCanvas {...props} show fromPDF/>);
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
        if (slidesWithComments && slide && !avoidComments) {
            let pageContainerComments = document.createElement('div');
            let table = (<div width="100%" style={{ display: 'flex', justifyContent: 'center' }}><table width={expectedWidth}>
                <tr><td className= {customAspectRatio === (4 / 3) ? "commentLine" : "commentLine firstLine"} /></tr>
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
                    if (ended) {
                        deletePageContainers('pageToPrint');
                        document.body.removeEventListener('canceled', function() {
                            ended = false;
                        });
                        callback();
                        return;
                    }
                    if(last) {
                        numPages++;
                        let notToPrint = 0;

                        let firstPageFirefox = true;
                        for(let k = 0; k < numPages; k++) {
                            let doc = document.getElementById('pageContainer_' + k);

                            if (((doc && doc.firstChild && (doc.className.includes('importedDoc')) && (optionName !== "fullSlideDoc") && (optionName !== "fullSlide")) || (doc && doc.className.includes('otherDoc'))) && (slidesPerPage !== 4) && (optionName !== "twoDoc")) {
                                let actualHeight = doc.firstChild.clientHeight;
                                document.getElementById('pageContainer_' + k).style.height = actualHeight * 1.05 + 'px';

                                if (doc.className.includes('otherDoc') && isFirefox) {
                                    if (firstPageFirefox && hideSlides) {
                                        doc.className = doc.className.replace("otherDoc", "");
                                        doc.className = doc.className.replace("breakPage", "");
                                        firstPageFirefox = false;
                                    }
                                    try{
                                        let child = doc.childNodes.item('page-content-wrapper');
                                        child.style.width = doc.clientWidth + 'px';
                                        child.style.height = doc.clientHeight + 'px';
                                    } catch (error) {
                                    }
                                }
                            }
                            if(optionName === "twoDoc") {
                                if (doc.className.includes('otherDoc') && doc.firstChild) {
                                    let actualHeight = doc.firstChild.clientHeight;
                                    let calculatedHeight = Math.ceil((actualHeight * 0.72 / 960 / 2)) * 960;
                                    document.getElementById('pageContainer_' + k).style.height = calculatedHeight + 'px';
                                    document.getElementById('pageContainer_' + k).style.width = isSafari ? '800px' : '1400px';

                                    if (isSafari) {
                                        document.getElementById('pageContainer_' + k).style.marginLeft = '0px';

                                    }
                                }
                            }

                            if(doc.className.includes('not_show')) {
                                notToPrint++;
                            }
                        }
                        if (notToPrint === numPages) {
                            deletePageContainers('pageToPrint');
                            callback("nullPrint");
                            return;
                        }
                        let slideToFill = 0;
                        if (slidesPerPage === 4) {
                            let index = -1;
                            let containersArray = [];
                            let counter = 0;
                            for (let l = 0; l < numPages; l++) {
                                let doc = document.getElementById('pageContainer_' + l);
                                doc.id = 'pageContainer_' + counter;
                                if (!doc.className.includes('not_show')) {
                                    slideToFill = l;
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
                                    // relleno con containers para forzar alineamiento
                                }
                                if (l === (numPages - 1)) {
                                    let left = (4 - (counter % 4)) % 4;
                                    for (let f = left; f > 0; f--) {
                                        let clone = doc.cloneNode();
                                        clone.className = clone.className.replace("not_show", "");
                                        containersArray[index].appendChild(clone);
                                    }
                                }
                            }
                        }
                        if (isFirefox) {
                            deletePageContainers('not_show');
                        }
                        window.print();
                        if(!isSafari) {
                            deletePageContainers('pageToPrint');
                        }
                        callback();
                    } else {
                        addHTML(navs.slice(1), navs.length <= 2);
                        numPages++;
                    }
                }, 700);
        });
    };
    if(isSafari) {
        deletePageContainers('pageToPrint');
    }
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
