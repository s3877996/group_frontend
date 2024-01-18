import React, {useState, useEffect} from "react";
import api from "../../api";

const UserTable = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        api.get('/admin/get_all_users')
            .then(response => {
                console.log("user data:", response.data);
                setUserData(response.data.data);
            })
            .catch(err => {
                console.log('Error fetching user info for admin page: ', err);
            });
    }, []);

    return (
        <div className="mt-24 w-full min-w-max table-auto text-center">
            <table className="w-full text-sm text-left rtl:text-right text-lime-950">
                <thead className="text-xs text-gray-700 uppercase text-lime-950 bg-teal-600">
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
        </div>  
    )
};

export default UserTable;