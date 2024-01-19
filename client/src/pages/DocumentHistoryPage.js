import React from "react";
import Navbar from "../components/Navigation/Navbar"
import DocumentHistoryTable from "../components/Table/DocumentHistoryTable";

const DocumentHistoryPage = () => {
    return (
        <div className="flex flex-col ">
          <main className="flex-grow bg-white-700 overflow-auto">
              <div className="mx-auto max-w-screen-xl h-full w-full">
                <Navbar/>
  
                <div className="flex min-h-screen justify-center">
                    <DocumentHistoryTable/>
                </div>
              </div>
          </main>
        </div>
      );
}

export default DocumentHistoryPage;
