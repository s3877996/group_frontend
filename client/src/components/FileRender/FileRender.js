import React, {useState} from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const FileRender = () => {
    const [wordFile, setWordFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setWordFile(file);
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
                        <DocViewer
                            documents={[{ uri: URL.createObjectURL(wordFile), fileType: wordFile.type, fileName: wordFile.name }]}
                            pluginRenderers={DocViewerRenderers}
                        />
                    </div>
                </div>
                
            )}
        </div>
    );
}

export default FileRender;