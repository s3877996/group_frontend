import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const DocumentHistoryTable = () => {
    const [documentData, setDocumentData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const fetchDocuments = (page) => {
        api.get(`document/user_documents?page=${page}`)
            .then(response => {
                setDocumentData(response.data);
            })
            .catch(err => {
                console.log('Error fetching document history for current user: ', err);
            });
    };

    useEffect(() => {
        fetchDocuments(currentPage);
    }, [currentPage]);

    // const fetchDocuments = (page) => {
    //     api.get(`document/user_documents?page=${page}`)
    //         .then(response => {
    //             setDocumentData(response.data);
    //             setTotalPages(response.headers['x-total-pages']);
    //         })
    //         .catch(err => {
    //             console.log('Error fetching document history for current user: ', err);
    //         });
    // };
    //
    // useEffect(() => {
    //     fetchDocuments(currentPage);
    // }, [currentPage]);
    //
    // const handlePageClick = (page) => {
    //     setCurrentPage(page);
    // };

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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="4" className="text-center">
                        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        <span className="mx-2">{currentPage}</span>
                        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={documentData.length < 5}>Next</button>
                    </td>
                </tr>
            </tfoot>
            </table>
        </div>
    )
};

export default DocumentHistoryTable;


        // <div className="mt-24 w-full min-w-max table-auto text-center">
        //     <table className="w-full text-sm text-left rtl:text-right text-lime-950">
        //         <thead className="text-xs text-gray-700 uppercase text-lime-950 bg-teal-600">
        //             <tr key="document_table">
        //                 <th scope="col" className="px-2 py-3">Document Name</th>
        //                 <th scope="col" className="px-2 py-3">Adjusted Time</th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //             </tr>
        //         </thead>
        //     <tbody>
        //         {documentData.map((doc) => (
        //             <tr className="bg-white border-b border-gray-700" key={doc.document_id}>
        //                 <td className="px-2 py-3">
        //                     {doc.document_name}
        //                 </td>
        //                 <td className="px-2 py-3">
        //                     {doc.adjusted_time}
        //                 </td>
        //                 <td className="px-2 py-3 text-wrap">
        //                     <button type="button" onClick={() => handleViewDocument(doc.document_id)}>
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        //                         </svg>
        //                     </button>
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        //     <tfoot>
        //         <tr>
        //             <td colSpan="4" className="text-center">
        //                 <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        //                 <span className="mx-2">{currentPage}</span>
        //                 <button onClick={() => setCurrentPage(currentPage + 1)} disabled={documentData.length < 5}>Next</button>
        //             </td>
        //         </tr>
        //     </tfoot>
        //     </table>
        // </div>



        // <div className="mt-24 w-full min-w-max table-auto text-center">
        //     <table className="w-full text-sm text-left rtl:text-right text-lime-950">
        //         <thead className="text-xs text-gray-700 uppercase text-lime-950 bg-teal-600">
        //             <tr key="document_table">
        //                 <th scope="col" className="px-2 py-3">Document Name</th>
        //                 <th scope="col" className="px-2 py-3">Adjusted Time</th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //         {documentData.map((doc) => (
        //             <tr className="bg-white border-b border-gray-700" key={doc.document_id}>
        //                 <td className="px-2 py-3">
        //                     {doc.document_name}
        //                 </td>
        //                 <td className="px-2 py-3">
        //                     {doc.adjusted_time}
        //                 </td>
        //                 <td className="px-2 py-3 text-wrap">
        //                     <button type="button" onClick={() => handleViewDocument(doc.document_id)}>
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        //                         </svg>
        //                     </button>
        //                 </td>
        //             </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>



        // <div className="mt-24 w-full min-w-max table-auto text-center">
        //     <table className="w-full text-sm text-left rtl:text-right text-lime-950">
        //         <thead className="text-xs text-gray-700 uppercase text-lime-950 bg-teal-600">
        //             <tr key="document_table">
        //                 <th scope="col" className="px-2 py-3">Document Name</th>
        //                 <th scope="col" className="px-2 py-3">Adjusted Time</th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //                 <th scope="col" className="px-2 py-3"></th>
        //             </tr>
        //         </thead>
        //     <tbody>
        //         {documentData.map((doc) => (
        //             <tr className="bg-white border-b border-gray-700" key={doc.document_id}>
        //                 <td className="px-2 py-3">
        //                     {doc.document_name}
        //                 </td>
        //                 <td className="px-2 py-3">
        //                     {doc.adjusted_time}
        //                 </td>
        //                 <td className="px-2 py-3 text-wrap">
        //                     <button type="button" onClick={() => handleViewDocument(doc.document_id)}>
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        //                         </svg>
        //                     </button>
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        //     <tfoot>
        //         <tr>
        //             <td colSpan="4" className="text-center">
        //                 {Array.from({ length: totalPages }, (_, index) => (
        //                     <button
        //                         key={index + 1}
        //                         onClick={() => handlePageClick(index + 1)}
        //                         className={`mx-1 px-2 py-1 ${currentPage === index + 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        //                     >
        //                         {index + 1}
        //                     </button>
        //                 ))}
        //             </td>
        //         </tr>
        //     </tfoot>
        //     </table>
        // </div>