import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const DocumentHistoryTable = () => {
    const [documentData, setDocumentData] = useState([]);

    const navigate = useNavigate();

    const handleViewDocument = (documentId) => {
        navigate(`/document_history/document/${documentId}`);
    }

    useEffect(() => {
        api.get('document/user_documents')
            .then(response => {
                setDocumentData(response.data);
            })
            .catch(err => {
                console.log('Error fetching document history for current user: ', err);
            });
    }, []);

    return (
        <div className="mt-24 w-full min-w-max table-auto text-center">
            <table className="w-full text-sm text-left rtl:text-right text-lime-950">
                <thead className="text-xs text-gray-700 uppercase text-lime-950 bg-teal-600">
                    <tr key="document_table">
                        <th scope="col" className="px-2 py-3">Document Name</th>
                        <th scope="col" className="px-2 py-3">Adjusted Time</th>
                        <th scope="col" className="px-2 py-3"></th>
                        <th scope="col" className="px-2 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                {documentData.map((doc) => (
                    <tr className="bg-white border-b border-gray-700" key={doc.document_id}>
                        <td className="px-2 py-3">
                            {doc.document_name}
                        </td>
                        <td className="px-2 py-3">
                            {doc.adjusted_time}
                        </td>
                        <td className="px-2 py-3 text-wrap">
                            <button type="button" onClick={() => handleViewDocument(doc.document_id)}>
                                <svg className="h-6 w-6 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </button>
                        </td>
                        <td className="px-2 py-3">
                            Delete button
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div> 
    )
};

export default DocumentHistoryTable;