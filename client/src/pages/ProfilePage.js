import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import { toast, Toaster} from 'react-hot-toast';
import api, { setAuthToken } from '../api.js';
import PaymentHistoryTable from './PaymentHistoryTable';
import { useNavigate } from 'react-router-dom';// Import useHistory from react-router-dom
import Navbar from "../components/Navigation/Navbar"
import avatar from "../image/avatar.png"
import SubscriptionModal from './SubscriptionModal';


const validate = (data, regex) => {
  return Boolean(data.match(regex));
};

const validatePassword = (password) => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,20}$/;
  return validate(password, reg);
};


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
    const [error, setError] = useState('');


    // fetch user profile details
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


    //update profile
    const handleChangePassword = async () => {
        // Validate the new password
        if (!validatePassword(password)) {
            toast.error('Invalid password. It must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be between 8 to 20 characters long.', {
                duration: 5000,
            });
            return;
        }

        try {
            // Make API request to update password
            const response = await api.put('/api/users/me', {
                user_password: password,
                fullname: fullname,
                phone:phone
            });

            // Handle success, show a success message
            console.log(response.data.message);

            // Display a success toast, with a title
            toast.success("Update user details successful!", {
                duration: 3000,
            });
        } catch (error) {
            // Handle error, show an error message
            console.error('Error updating password:', error.response.data.message);
            // Display an error toast, with a title
            toast.error(`Updating failed: ${error.response.data.message || 'Unknown error'}`, {
                duration: 3000,
            });
        }
    };


return (
<div className="flex flex-col h-screen bg-gray-100">
    <Navbar className="fixed top-0 left-0 w-full z-50" />
    <main className="flex items-center justify-center h-full overflow-auto pt-12">
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">User Profile</h2>
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={avatar}
                        alt="Profile"
                        className="rounded-full w-20 h-20"
                    />
                </div>

                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Change Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-600">
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
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600">
                                Phone:
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="mt-1 p-2 w-full border rounded-md"
                                value={phone}
                                // onChange={(e) => setPhone(e.target.value)}
                                onChange={(e) => {
                                    // Ensure only digits are entered
                                    const enteredValue = e.target.value.replace(/\D/g, '');

                                    // Limit the input to 10 digits
                                    const limitedValue = enteredValue.slice(0, 10);

                                    // Update the state with the limited value
                                    setPhone(limitedValue);
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                                New Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 p-2 w-full border rounded-md"
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-4"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    </main>
</div>

);


};

export default ProfilePage;