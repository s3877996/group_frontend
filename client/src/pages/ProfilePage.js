import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api, { setAuthToken } from '../api.js';
import PaymentHistoryTable from './PaymentHistoryTable';
import { useNavigate } from 'react-router-dom';// Import useHistory from react-router-dom
import Navbar from "../components/Navigation/Navbar"
import SubscriptionModal from './SubscriptionModal';
const ProfilePage = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        user_email: '',
        package_id: '',
    });
    const storedToken = localStorage.getItem('token');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        // if (storedToken){
        // setAuthToken(storedToken);
        api.get('/api/users/me') // Assuming this is backend endpoint
            .then(response => {
                console.log(response.data)
                setUserData(response.data.data);
                setFullname(response.data.data.fullname)
                setPhone(response.data.data.phone)
                /*document.getElementById("username").innerHTML = `${userData.username}`;
                document.getElementById("email").innerHTML = `${userData.user_email}`;
                document.getElementById("packageId").innerHTML = `${userData.package_id}`;*/
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        // else{
        //     navigate('/login');
        // }
        // Fetch user data from the backend when the component mounts
        // Replace the URL with  actual backend endpoint

    }, [navigate]);

    const handleChangePassword = async () => {
        try {
            // Make API request to update password
            const response = await api.put('/api/users/me', {
                user_password: password,
                new_password: newPassword,
                fullname: fullname,
                phone:phone
            });

            // Handle success, show a success message
            console.log(response.data.message);
        } catch (error) {
            // Handle error, show an error message
            console.error('Error updating password:', error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col ">
        <div className="flex-grow bg-white-700 overflow-auto">
            <div className="mx-auto max-w-screen-xl h-full w-full">
              <Navbar/>
              </div>
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                <img
                    src="https://placekitten.com/150/150"
                    alt="Profile"
                    className="rounded-full w-20 h-20 mx-auto mb-4"
                />
                <p>
                    <strong>Username:</strong> {userData.username}
                </p>
                <p>
                    <strong>Email:</strong> {userData.user_email}
                </p>
                <p>
                    <strong>Package :</strong> {userData.package_name}
                </p>
                <p>
                    <strong>Limited Document :</strong> {userData.limited_docs}
                </p>
                <p>
                    <strong>Available Document :</strong> {userData.available_doc}
                </p>
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Change Information</h3>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Full Name:
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            className="mt-1 p-2 w-full border rounded-md"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Phone:
                        </label>

                        <input
                            type="phone"
                            id="phone"
                            className="mt-1 p-2 w-full border rounded-md"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
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
        </div>
        </div>


    );
};

export default ProfilePage;