import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navigation/Navbar"
import CorrectedFileRender from "../components/FileRender/CorrectedFileRender";

const DocumentViewerPage = () => {
    const { documentId } = useParams();
    console.log("id", documentId);

    const [correctedFileName, setCorrectedFileName] = useState('');
    const [correctedFileContent, setCorrectedFileContent] = useState('');

    useEffect(() => {
        api.get(`document/user_documents/document/${documentId}`) // Assuming this is backend endpoint
            .then(response => {
                console.log(response.data)
                setCorrectedFileName(response.data.document_data)
                setCorrectedFileContent(response.data.corrected_content)
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

    }, [documentId]);

    return (
        <div className="flex flex-col ">
          <main className="flex-grow bg-white-700 overflow-auto">
              <div className="mx-auto max-w-screen-xl h-full w-full">
                <Navbar/>
  
                    <div className="flex items-stretch justify-center h-screen">
                        <div className="pt-24 self-center max-h-[120vh] md:max-h-[90vh] lg:max-h-[80vh] sm:w-3/4 lg:w-1/2">
                            <CorrectedFileRender 
                                correctedFileName={correctedFileName} 
                                correctedFileContent={correctedFileContent} 
                            />
                        </div>
                    </div>
              </div>
          </main>
        </div>
    );
}

export default DocumentViewerPage;
