import React, { useState } from "react";
import axios from 'axios';
import CorrectedFileRender from './CorrectedFileRender';

const FileRender = () => {
    const [wordFile, setWordFile] = useState(null);
    const [originalFileContent, setOriginalFileContent] = useState('');
    const [correctedFileName, setCorrectedFileName] = useState('');
    const [correctedFileContent, setCorrectedFileContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');

    const checkProcessingStatus = async () => {
        try {
            const statusResponse = await axios.get('http://127.0.0.1:5000/document/processing-status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const { status, progress: processingProgress } = statusResponse.data;
            const totalProgress = 50 + (processingProgress / 2);
            setProgress(totalProgress);

            if (status !== 'completed') {
                setTimeout(checkProcessingStatus, 2000); // Poll every 2 seconds
            } else {
                setIsLoading(false); // Stop loading when processing is done
            }
        } catch (error) {
            console.error('Error checking processing status:', error);
            setIsLoading(false);
        }
    };
    

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setWordFile(file);
            setIsLoading(true); // Start loading

            const authToken = localStorage.getItem('token');

            //Create FormData and append the file
            const formData = new FormData();
            formData.append('file', file);

            //Upload file to the backend and process it
            try {
                const response = await axios.post('http://127.0.0.1:5000/document/upload', formData, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Include the auth token in the request header
                    },
                    onUploadProgress: (progressEvent) => {
                        const uploadProgress = Math.round((progressEvent.loaded * 50) / progressEvent.total);
                        setProgress(uploadProgress);
                    }
                });

                console.log(response.data);
                setOriginalFileContent(response.data.original_content);
                setCorrectedFileName(response.data.corrected_file_name);
                setCorrectedFileContent(response.data.corrected_content);
                checkProcessingStatus();

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
                setIsLoading(false);  // Stop loading on error

                // Check if the error is related to document limit or subscription
                if (error.response && error.response.status === 403) {
                    setAlertMessage(error.response.data.error);
                } else {
                    // Handle other types of errors
                    console.error('Error uploading file:', error);
                }
            }
        }
    };

    const renderDocumentPreview = () => {
        if (!originalFileContent) return null;

        return (
            <div className="px-4 pt-40 bg-white shadow rounded-lg overflow-auto max-h-[120vh]">
                <div className="flex flex-row">
                    <h1 className="w-full max-w-4 text-2xl font-semibold text-gray-700 mb-4 pb-2">Uploaded File Content</h1>

                    {/* Reload page button */}
                    <button type="button"
                        onClick={() => window.location.reload(false)}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md p-2.5 inline-flex items-center bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </div>

                <div className="text-container mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50"
                    style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>
                    <div className="text-gray-800">
                        {originalFileContent}
                    </div>
                </div>
            </div>
        );
    };

    const renderLoadingIndicator = () => {
        return isLoading && (
            <div className="h-full space-y-2">
                <div className="px-4 pt-24">
                    <h1 className="text-2xl font-semibold text-gray-700 mb-4 pb-2">Uploaded File Content</h1>
                </div>

                <div className="mx-4 relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Your file is being uploaded to our server and processed, please wait...
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                                {`${Math.round(progress)}%`}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                        <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAlertMessage = () => {
        if (!alertMessage) return null;
    
        return (
            <div className="fixed top-0 left-0 w-screen z-50">
                <div className="bg-white p-4 rounded-md shadow-md absolute top-10 left-1/2 transform -translate-x-1/2">
                    <p className="text-lg text-gray-700">{alertMessage}</p>
                    <button 
                        onClick={() => setAlertMessage('')} 
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
                        Close
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="flex flex-col">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <div className="flex flex-col md:flex-row min-h-screen justify-center">
                        {/*Insert file in the left-hand side container*/}
                        <div className="md:w-1/2 bg-white-500 text-white flex items-center justify-center border">
                            {!wordFile && (
                                <div className="w-full h-full px-4 pt-24 space-y-24 bg-white shadow rounded-lg overflow-hidden max-h-[120vh]">
                                    <h1 className="text-2xl font-semibold text-gray-700 mb-4 pb-2">Uploaded File Content</h1>
                                    <div className="h-full mx-8 align-center justify-items-center">
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

                            {renderLoadingIndicator()}

                            {/* After receiving file */}
                            {wordFile && (
                                <div className="flex items-stretch justify-center h-screen">
                                    <div className="self-center">
                                        {renderDocumentPreview()}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:w-1/2 bg-white flex items-center justify-center border">
                            {/* Render CorrectedFileRender if corrected file name is available */}
                            {!correctedFileName && (
                                <div className="w-full h-full px-4 pt-24 bg-white shadow rounded-lg overflow-auto max-h-[120vh]">
                                    <div className="flex flex-row">
                                        <h1 className="w-full max-w-4 text-2xl font-semibold text-gray-700 mb-4 pb-2">Corrected File Content</h1>
                                    </div>
                                </div>

                            )}

                            {/* Render CorrectedFileRender if corrected file name is available */}
                            {correctedFileName && (
                                <div className="flex items-stretch justify-center h-screen">
                                    <div className="self-center">
                                        <CorrectedFileRender
                                            correctedFileName={correctedFileName}
                                            correctedFileContent={correctedFileContent}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FileRender;