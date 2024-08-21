import React, { useState } from 'react';
import PDFViewer from './PDFViewer';
import pdfStructure from '../assets/pdfStructure.json';

const Manual = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
                <h3 className="text-lg font-semibold">매뉴얼</h3>
                <div className="flex">
                    <div className="w-1/3">
                        {pdfStructure.folders.map(folder => (
                            <div key={folder.folderName} className="mb-2">
                                <h4 className="text-md font-semibold">{folder.folderName}</h4>
                                <ul>
                                    {folder.files.map(file => (
                                        <li
                                            key={file}
                                            className="cursor-pointer text-blue-500 hover:underline"
                                            onClick={() => setSelectedFile(require(`../assets/pdf/${folder.folderName}/${file}`))}
                                        >
                                            {file}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="w-2/3">
                        {selectedFile ? (
                            <PDFViewer file={selectedFile} />
                        ) : (
                            <p>PDF 파일을 선택하세요.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manual;
