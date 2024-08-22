import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles.css';
import pdfStructure from '../assets/pdfStructure.json';

const Manual = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null); // 모달을 닫을 때 파일 선택 초기화
    };

    const handleFolderClick = (folderName) => {
        setSelectedFolder(folderName);
        setSelectedFile(null); // 폴더를 선택할 때 파일 선택 초기화
    };

    return (
        <div className="manual-container bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">매뉴얼</h3>
                <div className="manual-folder-grid flex flex-wrap -mx-2">
                    {pdfStructure.folders.map(folder => (
                        <div key={folder.folderName} className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
                        <button
                            className={`manual-folder-button w-full py-2 px-4 font-medium rounded mb-2 ${
                            selectedFolder === folder.folderName 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                            onClick={() => handleFolderClick(folder.folderName)}
                        >
                            {folder.folderName}
                        </button>
                        </div>
                    ))}
                    </div>

                {selectedFolder && (
                    <div className="manual-dropdown-container mt-4">
                        <select
                            className="manual-dropdown w-full p-2 border rounded"
                            onChange={(e) => openModal(e.target.value)}
                            value={selectedFile || ""}
                        >
                            <option value="" disabled>PDF 파일을 선택하세요</option>
                            {pdfStructure.folders.find(folder => folder.folderName === selectedFolder).files.map(file => (
                                <option
                                    key={file}
                                    value={require(`../assets/pdf/${selectedFolder}/${file}`)}
                                >
                                    {file}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="PDF Viewer"
                    className="pdf-fullscreen-modal"
                    overlayClassName="overlay"
                >
                    <button onClick={closeModal} className="close-button">X</button>
                    <div className="pdf-viewer-container">
                        {selectedFile && (
                            <embed src={selectedFile} type="application/pdf" width="100%" height="100%" />
                        )}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Manual;
