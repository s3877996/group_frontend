import React from 'react';

const CorrectedFileRender = ({ correctedFileName, correctedFileContent }) => {
    return (
        <div className="px-4 pt-40 pb-2 bg-white shadow rounded-lg overflow-auto max-h-[120vh] md:max-h-[90vh] lg:max-h-[80vh] mx-auto w-full sm:w-3/4 lg:w-1/2">
            <div className="flex flex-col md:flex-row pb-2">
                <h1 className="w-full max-w-4 text-2xl font-semibold text-gray-700 mb-4 md:mb-0">Corrected File Content</h1>

                {/*<div className="mt-4 md:mt-0 md:ml-auto">*/}
                {/*    <a href={`http://127.0.0.1:5000/document/download/${correctedFileName}`}*/}
                {/*    download*/}
                {/*    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">*/}
                {/*        Download*/}
                {/*    </a>*/}
                {/*</div>*/}

            </div>
            <div className="text-container mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto"
                style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                <div className="text-gray-800">
                    {correctedFileContent}
                </div>
            </div>
        </div>
    );
};

export default CorrectedFileRender;

