import React, {useState} from "react";
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileRender = () => {
    const [wordFile, setWordFile] = useState(null);
    const [uploadedFilePath, setUploadedFilePath] = useState(null);
    //const [fileType, setFileType] = useState('');
    const [docxHtmlContent, setDocxHtmlContent] = useState('');


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setWordFile(file);

        const authToken = localStorage.getItem('token');

        //Create FormData and append the file
        const formData = new FormData();
        formData.append('file', file);

        //upload file to the backend
        try {
            const response = await axios.post('http://127.0.0.1:5000/document/upload',formData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`  // Include the auth token in the request header
                },
            });

            console.log(response.data);

        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error:', error.message);
            }
            console.error('Error config:', error.config);
            console.log('Error uploading file:', error);
        }
    };

    const renderDocumentPreview = () => {
        // if (!uploadedFilePath) return null;
        // return <iframe src={`https://docs.google.com/gview?url=${uploadedFilePath}&embedded=true`} style={{ width: '100%', height: '500px' }} />;   
        

    };
    
    return (
        <div className="w-full py-36 space-y-5 border-2 border-gray-300 border-dashed">
            {/* Initial view */}
            {!wordFile && (
                <div className="flex items-stretch justify-center h-screen">
                    <div className="self-center w-2/3">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">DOCX or DOC files</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>
            )}
    
            {/* After receiving file */}
            {wordFile && (
                <div className="flex items-stretch justify-center h-screen">
                    <div className="self-center">
                        {renderDocumentPreview()}
                    </div>
                </div>
                
            )}
        </div>
    );
};

export default FileRender;