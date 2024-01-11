import React, {useState, useEffect} from "react";
import api from "../../api";

const UserTable = () => {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        api.get('/admin/get_all_users')
            .then(response => {
                console.log(response.data);
                setUserData(response.data);
            })
            .catch(err => {
                console.log('Error fetching user info for admin page: ', err);
            });
    }, []);

    return (
        <div class="mt-32 w-full min-w-max table-auto text-left">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-white-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            User Email
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Joined Date
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Active Status
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Stripe
                        </th>
                    </tr>
                </thead>
                <tbody>
                {userData.map((user) => (
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {user.username}
                        </th>
                        <td class="px-6 py-4">
                            {user.user_joined_date}
                        </td>
                        <td class="px-6 py-4">
                            {user.active}
                        </td>
                        <td class="px-6 py-4">
                            {user.stripe_id}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

            
    )
};

export default UserTable;