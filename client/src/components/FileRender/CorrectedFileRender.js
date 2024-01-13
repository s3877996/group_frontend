import React from 'react';

const CorrectedFileRender = ({ correctedFileName, correctedFileContent }) => {
    return (
        <div className="mx-4 p-4 bg-white shadow rounded-lg overflow-auto max-h-[60vh]">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Corrected File Content</h1>
            <div className="text-container mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto max-h-[50vh]" 
                style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                <div className="text-gray-800"> 
                    {correctedFileContent}
                </div>
            </div>
            <a href={`http://127.0.0.1:5000/document/download/${correctedFileName}`} 
               download 
               className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Download
            </a>
        </div>
    );
};


export default CorrectedFileRender;
