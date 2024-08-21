import React, { useState } from 'react';
import PDFModal from './PDFModal';
import pdfStructure from '../assets/pdfStructure.json';

const Manual = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">매뉴얼</h3>
                <div className="flex space-x-2 mb-4">
                    {pdfStructure.folders.map(folder => (
                        <div key={folder.folderName} className="w-full mb-4">
                            <h4 className="text-md font-semibold mb-2">{folder.folderName}</h4>
                            <select
                                className="manual-dropdown w-full p-2 border rounded"
                                onChange={(e) => openModal(e.target.value)}
                                defaultValue=""
                            >
                                <option value="" disabled>PDF 파일을 선택하세요</option>
                                {folder.files.map(file => (
                                    <option
                                        key={file}
                                        value={require(`../assets/pdf/${folder.folderName}/${file}`)}
                                    >
                                        {file}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
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
