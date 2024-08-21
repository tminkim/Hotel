import React, { useState } from 'react';
import PDFViewer from './PDFViewer';
import pdfStructure from '../assets/pdfStructure.json';

const Manual = () => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">매뉴얼</h3>
                <div className="flex space-x-2 mb-4">
                    {pdfStructure.folders.map(folder => (
                        <button
                            key={folder.folderName}
                            className={`flex-1 py-2 px-4 font-medium rounded ${selectedFolder === folder.folderName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setSelectedFolder(folder.folderName)}
                        >
                            {folder.folderName}
                        </button>
                    ))}
                </div>
                {selectedFolder && (
                    <div className="mb-4">
                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => setSelectedFile(e.target.value)}
                            defaultValue=""
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
                <div>
                    {selectedFile ? (
                        <PDFViewer file={selectedFile} />
                    ) : (
                        <p>PDF 파일을 선택하세요.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Manual;
