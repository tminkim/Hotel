import React from 'react';
import Modal from 'react-modal';
import PDFViewer from './PDFViewer';

const PDFModal = ({ isOpen, onRequestClose, file }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="PDF Viewer"
            className="pdf-fullscreen-modal"
            overlayClassName="overlay"
            style={{ content: { overflowY: 'auto' } }}
        >
            <button className="pdf-close-button" onClick={onRequestClose}>X</button>
            <PDFViewer file={file} />
        </Modal>
    );
};

export default PDFModal;
