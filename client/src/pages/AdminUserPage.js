import React from "react";
import SubscriptionStatistics from "../components/Chart/SubscriptionsStatistics";
import AdminNavBar from "../components/Navigation/AdminNavBar";
import UserTable from "../components/Table/UserTable";

const AdminUserPage = ()  =>{
    return (
        <div className="flex flex-col ">
          <main className="flex-grow bg-white-700 overflow-auto">
              <div className="mx-auto max-w-screen-xl h-full w-full">
                <AdminNavBar/>
  
                <div className="flex min-h-screen justify-center">
                    <UserTable/>
                </div>
              </div>
          </main>
        </div>
      );
}
export default AdminUserPage;