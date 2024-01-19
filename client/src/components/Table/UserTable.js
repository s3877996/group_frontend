import React, {useState, useEffect} from "react";
import api from "../../api";
import Pagination from "./Pagination";

const UserTable = () => {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5; // Number of records per page


    useEffect(() => {
         setLoading(true); // Set loading to true when starting to fetch data

        api.get(`/admin/get_all_users?page=${currentPage}&pageSize=${pageSize}`)
            .then(response => {
                console.log("user data:", response.data);
                setUserData(response.data.data);
                setTotalPages(response.data.totalPages);
            })
            .catch(err => {
                console.log('Error fetching user info for admin page: ', err);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after data is fetched (regardless of success or failure)
            });
    }, [currentPage]);


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    return (
        <div className="mt-24 w-full min-w-max table-auto text-center">
            {loading ? (
                <div className="flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            ) : (
            <table className="w-full text-sm text-left rtl:text-right text-lime-950">
                <thead className="text-xs text-white uppercase text-lime-950 bg-teal-600">
                    <tr key="user_table">
                        <th scope="col" className="px-2 py-3">Username</th>
                        <th scope="col" className="px-2 py-3">Email</th>
                        <th scope="col" className="px-2 py-3">Joined Date</th>
                        <th scope="col" className="px-2 py-3">Active Status</th>
                        <th scope="col" className="px-2 py-3">Subscribed Package</th>
                        <th scope="col" className="px-2 py-3">Subscribed Time</th>
                    </tr>
                </thead>
                <tbody>
                {userData.map((user) => (
                    <tr className="bg-white border-b border-gray-700" key={user.subscription_id}>
                        <td className="px-2 py-3">
                            {user.username}
                        </td>
                        <td className="px-2 py-3">
                            {user.user_email}
                        </td>
                        <td className="px-2 py-3">
                            {user.user_joined_date}
                        </td>
                        <td className="px-2 py-3 text-center">
                            {user.user_active ? "Active" : "Deactivated"}
                        </td>
                        <td className="px-2 py-3 text-center">
                            {user.package_name}
                        </td>
                        <td className="px-2 py-3">
                            {user.start_time}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            )}

            {/*<Pagination itemsPerPage={itemsPerPage} totalItems={userData.length} paginate={paginate} currentPage={currentPage} />*/}
            <div className="mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 mx-1 bg-teal-500 text-white ${
                            currentPage === index + 1 ? "font-bold bg-teal-400" : ""
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>

    )
};

export default UserTable;