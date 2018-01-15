import React from 'react';
import ReactDOM from 'react-dom';

import sortable from 'jquery-ui/ui/widgets/sortable';
import ReduxProvider from './_editor/containers/ReduxProvider';
// It appears as unused, but it IS used.
// import i18n from './locales/i18n';

require('es6-promise').polyfill();
require('expose-loader?Ediphy!./core/editor/temp_hack');
require('./plugins/plugin_dependencies_loader').requireAll();

// Require CSS files
import './sass/style.scss';

// We make sure JQuery UI Sortable Widget is initialized
// eslint-disable-next-line
new sortable();

ReactDOM.render((<ReduxProvider />), document.getElementById('root'));

// testing pdfs
let pdfjsLib = require('pdfjs-dist');
let pdfPath = './dist/sample.pdf';
// Setting worker path to worker bundle.
pdfjsLib.PDFJS.workerSrc = '../../build/webpack/pdf.worker-bundle.js';

// Loading a document.
let loadingTask = pdfjsLib.getDocument(pdfPath);
loadingTask.promise.then(function(pdfDocument) {
    // Request a first page
    return pdfDocument.getPage(1).then(function(pdfPage) {
        // Display page on the existing canvas with 100% scale.
        let viewport = pdfPage.getViewport(1.0);
        let canvas = document.getElementById('maincontent');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        let ctx = canvas.getContext('2d');
        let renderTask = pdfPage.render({
            canvasContext: ctx,
            viewport: viewport,
        });
        return renderTask.promise;
    });
}).catch(function(reason) {
    console.error('Error: ' + reason);
});

