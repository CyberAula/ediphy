import React from 'react';
import ReactDOM from 'react-dom';
import VisorCanvas from '../../_visor/components/canvas/VisorCanvas';
import VisorContainedCanvas from '../../_visor/components/canvas/VisorContainedCanvas';
import { isSection, isContainedView } from '../../common/utils';
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
    let ratio = globalConfig.canvasRatio;

    let notSections = state.navItemsIds.filter(nav=> {
        return !navItems[nav].hidden && (Ediphy.Config.sections_have_content || !isSection(nav));
    });

    let pdf;

    notSections.map((page, i) => {

        let currentView = page;
        let isSlide = isCV && containedViews[currentView] === "slide" ||
            !isCV && navItems[currentView] === "slide" ?
            "pcw_slide" : "pcw_doc";
        let viewport = isSlide ? { width: 1200, height: 675 } : { width: 848, height: 1200 };
        if (i === 0) {
            pdf = new jsPDF(isSlide ? 'l' : 'p', 'pt', [viewport.width, viewport.height]);

        } else {
            pdf.addPage(viewport.width, viewport.height);
        }

        let pageContainer = document.createElement('div');
        document.body.appendChild(pageContainer);
        pageContainer.id = "pageContainer_" + i;
        pageContainer.style.width = viewport.width + 'px';
        pageContainer.style.height = viewport.height + 'px';
        let isCV = isContainedView(currentView);
        let visorContent = !isContainedView(currentView) ? (
            <VisorCanvas
                boxes={boxes}
                changeCurrentView={(element) => {}}
                canvasRatio={ratio}
                containedViews={containedViews}
                currentView={currentView}
                fromScorm={false}
                navItems={navItems}
                removeLastView={()=>{}}
                richElementsState={ {}}
                showCanvas={currentView.indexOf("cv-") === -1}
                title={title}
                toolbars={toolbars}
                triggeredMarks={[]}
                viewsArray={[currentView]}
                setAnswer={()=>{}}
                submitPage={()=>{}}
                exercises={exercises[currentView]}
            />) :
            (<VisorContainedCanvas
                boxes={boxes}
                changeCurrentView={(element) => {}}
                canvasRatio={ratio}
                containedViews={containedViews}
                currentView={currentView}
                fromScorm={false}
                navItems={navItems}
                toolbars={toolbars}
                title={title}
                triggeredMarks={[]}
                showCanvas={currentView.indexOf("cv-") !== -1}
                removeLastView={()=>{}}
                richElementsState={{}}
                viewsArray={[currentView]}
                setAnswer={()=>{}}
                submitPage={()=>{}}
                exercises={exercises[currentView]}
            />);
        let app = (<div id="page-content-wrapper" className={isSlide + " page-content-wrapper printApp"} style={{ height: '100%', backgroundColor: 'white' }}>
            <Grid fluid id="visorAppContent" style={{ height: '100%' }}>
                <Row style={{ height: '100%' }}>
                    <Col lg={12} style={{ height: '100%' }}>
                        {visorContent}
                    </Col>
                </Row>
            </Grid>
        </div>);
        ReactDOM.render((app), pageContainer);

    });

    let addHTML = function(navs, last) {
        let pageContainer = document.getElementById('pageContainer_' + (notSections.length - navs.length));
        pdf.addHTML(pageContainer, { useCORS: true, pagesplit: true }, function() {
            console.log(pageContainer, navs, last);
            if(last) {
                pdf.save('web.pdf');
            } else {
                addHTML(navs.slice(1), navs.length < 1);
            }
            // document.body.removeChild(pageContainer);

        });
    };
    if(notSections.length > 0) {
        addHTML(notSections, notSections.length === 1);
    }
}
