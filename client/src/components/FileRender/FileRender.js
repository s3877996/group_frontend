import React, {useState, useEffect} from "react";
import axios from 'axios';
import CorrectedFileRender from './CorrectedFileRender';

const FileRender = () => {
    const [wordFile, setWordFile] = useState(null);
    const [originalFileContent, setOriginalFileContent] = useState('');
    const [correctedFileName, setCorrectedFileName] = useState('');
    const [correctedFileContent, setCorrectedFileContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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
                const response = await axios.post('http://127.0.0.1:5000/document/upload',formData, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`  // Include the auth token in the request header
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                });

                console.log(response.data);
                setOriginalFileContent(response.data.original_content);
                setCorrectedFileName(response.data.corrected_file_name);
                setCorrectedFileContent(response.data.corrected_content);

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
                setIsLoading(false); // Stop loading on error
            }

            setIsLoading(false); // Stop loading when done
        }
    };

    const renderDocumentPreview = () => {
        if(!originalFileContent) return null;

        return (
            <div className="px-4 pt-40 bg-white shadow rounded-lg overflow-auto max-h-[120vh]">
                <h1 className="text-2xl font-semibold text-gray-700 mb-4 pb-2">Uploaded File Content</h1>
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
        );
    };
    
    return (
        <div className="flex flex-col">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <div className="flex min-h-screen justify-center">
                        {/*Insert file in the left-hand side container*/}
                        <div className="sm:w-1/2 bg-white-500 text-white flex items-center justify-center">
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

                        <div className="sm:w-1/2 bg-white flex items-center justify-center">
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