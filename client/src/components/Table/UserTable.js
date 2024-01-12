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
        <div class="mt-24 w-full min-w-max table-auto text-left">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-white-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">Username</th>
                        <th scope="col" class="px-6 py-3">Email</th>
                        <th scope="col" class="px-6 py-3">Joined Date</th>
                        <th scope="col" class="px-6 py-3">Active Status</th>
                        <th scope="col" class="px-6 py-3">Subscribed Package</th>
                        <th scope="col" class="px-6 py-3">Subscribed Time</th>
                    </tr>
                </thead>
                <tbody>
                {userData.map((user) => (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.user_id}>
                        <td class="px-6 py-4">
                            {user.username}
                        </td>
                        <td class="px-6 py-4">
                            {user.user_email}
                        </td>
                        <td class="px-6 py-4">
                            {user.user_joined_date}
                        </td>
                        <td class="px-6 py-4">
                            {user.user_active ? "Active" : "Deactivated"}
                        </td>
                        <td class="px-6 py-4">
                            {user.package_name}
                        </td>
                        <td class="px-6 py-4">
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