import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {

    const [userData, setUserData] = useState({
        username: '',
        user_email: '',
        package_id: null,
    });

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        // Fetch user data from the backend when the component mounts
        // Replace the URL with  actual backend endpoint
        axios.get('/api/get_current_user') // Assuming this is  backend endpoint
          .then(response => {
            setUserData(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }, []);

    const handleChangePassword = async () => {
        try {
            // Make API request to update password
            const response = await axios.put('/users', {
                user_password: password,
                new_password: newPassword,
            });

            // Handle success, show a success message
            console.log(response.data.message);
        } catch (error) {
            // Handle error, show an error message
            console.error('Error updating password:', error.response.data.message);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <p>
                    <strong>Username:</strong> {userData.username}
                </p>
                <p>
                    <strong>Email:</strong> {userData.user_email}
                </p>
                <p>
                    <strong>Package ID:</strong> {userData.package_id}
                </p>
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Change Password</h3>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Old Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Enter your old password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                            New Password:
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="mt-1 p-2 w-full border rounded-md"
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;