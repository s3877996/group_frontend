import React from "react";
import Navbar from "../components/Navigation/Navbar"
import DocumentHistoryTable from "../components/Table/DocumentHistoryTable";

const DocumentHistoryPage = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar className="fixed top-0 left-0 w-full z-50" />
            <main className="flex-grow bg-white-700 overflow-auto pt-4">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <div className="flex min-h-screen justify-center p-4 pb-8">
                        <DocumentHistoryTable/>
                    </div>
                </div>
            </main>
        </div>

      );
}

export default DocumentHistoryPage;
