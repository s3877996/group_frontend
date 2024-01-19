import React from "react";
import SubscriptionStatistics from "../components/Chart/SubscriptionsStatistics";
import AdminNavBar from "../components/Navigation/AdminNavBar";
import UserTable from "../components/Table/UserTable";

const AdminUserPage = ()  =>{
    return (
        <div className="flex flex-col h-screen">
            <div className="fixed top-0 left-0 w-screen z-50 bg-white shadow-md">
                <AdminNavBar />
            </div>
            <main className="flex-grow bg-white-700 overflow-auto pt-4">
                <div className="mx-auto max-w-screen-xl h-full w-full px-4">
                    <div className="flex min-h-screen justify-center">
                        <UserTable/>
                    </div>
                </div>
            </main>
        </div>

      );
}
export default AdminUserPage;