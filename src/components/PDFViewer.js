import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PDFViewer = ({ file }) => {
    return (
        <div style={{ height: '750px' }}>
            <Worker workerUrl={workerSrc}>
                <Viewer fileUrl={file} />
            </Worker>
        </div>
    );
};

export default PDFViewer;
