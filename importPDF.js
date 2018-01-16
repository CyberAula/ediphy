
// testing pdfs
import pdflib from 'pdfjs-dist';
pdflib.PDFJS.workerSrc = 'pdf.worker-bundle.js';
let pdfPath = 'images/sample.pdf';
// Setting worker path to worker bundle.
// pdfjsLib.PDFJS.workerSrc = '../../build/webpack/pdf.worker-bundle.js';

// Loading a document.
let loadingTask = pdflib.getDocument(pdfPath);
loadingTask.promise.then(function(pdfDocument) {
    // Request a first page
    return pdfDocument.getPage(1).then(function(pdfPage) {
        // Display page on the existing canvas with 100% scale.
        let viewport = pdfPage.getViewport(1.0);
        let canvas = document.getElementById('thecanvas');
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

