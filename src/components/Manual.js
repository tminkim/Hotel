import React, { useState } from 'react';
import PDFModal from './PDFModal';
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">매뉴얼</h3>
                <div className="flex flex-wrap" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
                    {pdfStructure.folders.map(folder => (
                        <div key={folder.folderName} style={{ flex: '1 1 calc(33.333% - 1rem)', maxWidth: 'calc(33.333% - 1rem)', marginBottom: '1rem' }}>
                            <button
                                className={`w-full py-2 px-4 font-medium rounded ${
                                    selectedFolder === folder.folderName 
                                        ? 'bg-[#2566e8] text-white' // 클릭 시 색상
                                        : 'bg-[#3498db] text-white hover:bg-[#2566e8]' // 기본 및 호버 색상
                                }`}
                                onClick={() => handleFolderClick(folder.folderName)}
                                style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
                            >
                                {folder.folderName}
                            </button>
                        </div>
                    ))}
                </div>

                {selectedFolder && (
                    <div className="mt-4">
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

                <PDFModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    file={selectedFile}
                />
            </div>
        </div>
    );
};

export default Manual;
