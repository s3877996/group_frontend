import React from "react";
import SubscriptionStatistics from "../components/Chart/SubscriptionsStatistics";
import RevenueChart from "../components/Chart/RevenueChart";
import AdminNavBar from "../components/Navigation/AdminNavBar";

const AdminPage = ()  =>{
    return (
        <div className="flex flex-col ">
            <main className="flex-grow bg-white-700 overflow-auto">
                <div className="mx-auto max-w-screen-xl h-full w-full">
                    <AdminNavBar/>

                    <div className="pt-48 flex flex-row items-center divide-x divide-teal-400 divide-dashed hover:divide-solid">
                        <SubscriptionStatistics/>
                        <RevenueChart/>
                    </div>

                </div>
            </main>
        </div>
      );
}
export default AdminPage;