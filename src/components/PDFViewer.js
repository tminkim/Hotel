import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewer = ({ file }) => {
    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={file}
                    initialPage={1} // PDF 파일의 첫 번째 페이지로 초기화
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
