import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const PDFViewer = ({ file }) => {
    const zoomPluginInstance = zoomPlugin();

    return (
        <div className="pdf-viewer-container">
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                    fileUrl={file}
                    initialPage={0}
                    defaultScale={1.5}  // 페이지가 가로 길이에 맞도록 설정
                    plugins={[zoomPluginInstance]}
                />
            </Worker>
        </div>
    );
};

export default PDFViewer;
