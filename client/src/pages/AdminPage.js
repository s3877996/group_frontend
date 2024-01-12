import React from "react";
import SubscriptionStatistics from "../components/Chart/SubscriptionsStatistics";
import AdminNavBar from "../components/Navigation/AdminNavBar";

const AdminPage = ()  =>{
    return (
        <div className="flex flex-col ">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <AdminNavBar/>
                    <SubscriptionStatistics/>
                </div>
            </main>
        </div>
      );
}
export default AdminPage;