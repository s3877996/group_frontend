import React from "react";
import AdminNavBar from "../components/Navigation/AdminNavBar";
import PackageTable from "../components/Table/PackageTable";

const AdminPackagePage = ()  =>{
    return (
        <div className="flex flex-col ">
          <main className="flex-grow bg-white-700 overflow-auto">
              <div className="mx-auto max-w-screen-xl h-full w-full">
                <AdminNavBar/>
  
                <div className="flex min-h-screen justify-center">
                    <PackageTable/>
                </div>
              </div>
          </main>
        </div>
      );
}
export default AdminPackagePage;