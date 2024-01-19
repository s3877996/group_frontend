
import React from "react";
import AdminNavBar from "../components/Navigation/AdminNavBar";
import PackageTable from "../components/Table/PackageTable";
import Navbar from "../components/Navigation/Navbar";

const AdminPackagePage = ()  =>{
    return (
        <div className="flex flex-col h-screen">
            <div className="fixed top-0 left-0 w-screen z-50 bg-white shadow-md">
                <AdminNavBar />
            </div>

            <main className="flex-grow flex items-center justify-center bg-white-200 overflow-auto pt-2">
                <div className="mx-auto max-w-screen-xl h-full w-full px-4">
                    <div className="flex min-h-screen justify-center">
                        <PackageTable/>
                    </div>
                </div>
            </main>
        </div>

      );
}
export default AdminPackagePage;

