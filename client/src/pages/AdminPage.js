import React from "react";
import SubscriptionStatistics from "../components/Chart/SubscriptionsStatistics";
import RevenueChart from "../components/Chart/RevenueChart";
import AdminNavBar from "../components/Navigation/AdminNavBar";

const AdminPage = ()  =>{
    return (
        <div className="flex flex-col h-screen">
            <AdminNavBar className="fixed top-0 left-0 w-full z-50" />
            <main className="flex-grow bg-white-700 overflow-auto pt-4">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <div className="pt-20 flex flex-row items-center divide-x divide-teal-400 divide-dashed hover:divide-solid">
                        <SubscriptionStatistics/>
                        <RevenueChart/>
                    </div>
                </div>
            </main>
        </div>

      );
}
export default AdminPage;